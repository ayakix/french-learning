# CLAUDE.md

このリポジトリは、ユーザーがフランス語をゼロから AI だけで学び DELF B2 を目指す実験の場である。
README.md も参照すること。

## 学習時間の記録

### 合言葉

| 合図 | 受け付ける入力 | Claude の動作 |
|---|---|---|
| 開始 | `Bonjour` / `bonjour` / `開始` | `date` で現在時刻を取得し、当日の journal に新しいセッションの start を記録する |
| 終了 | `À bientôt` / `a bientot` / `終了` | `date` で現在時刻を取得して end を記録し、journal を最終版に仕上げる |

- アクセント記号の有無・大文字小文字は問わない（ユーザーはまだフランス語の入力に慣れていないため）
- その日最初のセッションは、合言葉がなくても会話開始時点を学習開始として扱う
  - `.claude/hooks/session-start.sh`（SessionStart hook）が journal を作成し、開始時刻を記録する
- 時刻は必ず `date` コマンドで取得する。推測で書かない

### 記録の対象

- フランス語学習に使った時間はすべて含める（システム開発・設計の壁打ちも含む）
- Claude Code 以外での学習（Gemini での会話、アプリなど）はユーザーの自己申告で追記する

### journal の運用

- 場所：`journal/YYYY/MM/YYYY-MM-DD.md`（1 日 1 ファイル）
- セッション中も適宜上書きして最新の状態に保ち、「終了」の合図で最終版にする
- `total_minutes` は sessions の合計。end が未確定のセッションは集計に含めない
- 後でブログ（Learning in public）に使うため、「何を決めたか / どう進めたか」も残す

フォーマット：

```markdown
---
date: YYYY-MM-DD
sessions:
  - { start: "HH:MM", end: "HH:MM", source: claude-code }
  - { minutes: 15, source: gemini, note: 自己申告 }
total_minutes: 0
---

## やったこと
## 間違えたこと・気づき
## Claude との進め方メモ
```

間違えた内容は `mistakes/` にも転記し、後から振り返れるようにする。

## 教材

- 音声ファイルは git に入れない（.gitignore 済み）。テキストから再生成できる形で残す
- フランス語の再生は `scripts/say-fr "テキスト"` を使う（ElevenLabs・Nicolas・eleven_v4_turbo、`.cache/tts/` にキャッシュ）
  - Starter プラン（月約 30k クレジット）のため、不要な再生成は避ける
  - ボイスとモデルは `config/tts.json`。変えると音声のファイル名（ハッシュ）が変わり、全音声の再生成が必要になる
  - 会話の 2 人目（女性）の声は `config/tts.json` の `voices`（今は Lucie。Claire より聞き取りやすいため 2026-10-04 に変更）。YAML の項目に `voice: lucie` と書くとその声で読む
- Web アプリで使う教材は `materials/` に YAML で置き、`scripts/gen-audio <yaml>` で音声を生成する（詳細は `apps/web/README.md`）
  - まとめて生成する前に `scripts/gen-audio --dry-run <yaml>` で件数と消費クレジットを見積もる
  - 単元 01〜10 の単語・1 文リーディング・聞き取りと、`materials/a1/common/`（数字・動詞の活用）は 2026-10-04 にまとめて作成済み。形式は各 YAML の先頭のコメントを参照
  - 同日に、単語の例文（vocab の `ex`）、DELF 形式の読む文書（`*-document.yaml`、各単元 2 本）、DELF A1 の聞き取り模試 2 回分（`materials/a1/11-delf/`）も追加
  - A2 は単語（`materials/a2/<単元>/`、927 語・例文付き）だけ作り置き済み。単元の番号は A1 の続きの 12〜23（Web の URL が単元の番号だけで決まるため）。会話・リーディングなどは A1 で形式を確かめてから作る
- 聞き比べ（ミニマルペア）の練習は `*-contrast.yaml` を 1 つ追加するだけで、画面 `/contrast/<slug>` と CLI のクイズが増える（形式は `materials/a1/00-pronunciation/00-1-e-contrast.yaml` を参照）
- Web の画面を作ったり変えたりしたら、ユーザーに渡す前に headless Chrome でスクリーンショットを撮って見た目を確認する
  - `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --window-size=800,900 --screenshot=<scratchpad>/x.png <URL>`
- CLI で聞き取りクイズを出すときは、`say-fr` ではなく `scripts/quiz` を使う（`say-fr` だとコマンドに答えが表示されてしまう）
  - `scripts/quiz start alphabet:4 e:3` → `play` → ユーザーが回答 → `reveal`

### 画像

- 画像は Gemini で生成する：`scripts/gen-image <出力先.webp> "<プロンプト>"`（モデル・幅・品質は `config/image.json`）
  - 自動で WebP（幅 768px・品質 80、約 20〜40KB）に変換される。**WebP は git にコミットする**（音声と違い、同じプロンプトでも同じ画像は再生成できないため）
  - 生成には料金がかかるので、既存のファイルは上書きしない
- 置き場所：単元ごとに `materials/<レベル>/<単元>/images/<id>.webp`
  - 画像ごとのプロンプトと、答えてほしい語彙・表現は、同じ単元の YAML に書く（評価・添削に使う）
- Claude は生成した画像を Read で確認できる。プロンプトにない物が描かれることもあるので、評価の前に必ず画像を確認する

## 秘密情報

- API キーは `.env` に置き、絶対にコミットしない（公開リポジトリのため）
  - `ELEVENLABS_API_KEY`：TTS（権限：Text to Speech / Voices / Models / User）
  - `GEMINI_API_KEY`：画像生成（Google AI Studio で発行した Gemini API のキー）
- ユーザーにキーを入力してもらうときは、チャットに貼らず `.env` を直接編集してもらう（会話のログに残るため）
