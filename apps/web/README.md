# apps/web

学習用 Web アプリ（Astro + TypeScript）。

## 起動

```sh
# 教材の音声を生成する（初回・教材を追加したとき。生成済みのものはクレジットを消費しない）
../../scripts/gen-audio ../../materials/a1/00-pronunciation/00-1-alphabet.yaml

npm install
npm run dev -- --background   # http://localhost:4321
npx astro dev stop            # 停止
```

## 構成

- 教材データは `materials/` の YAML を直接読み込む（`src/content.config.ts`）
- 音声は `.cache/tts/` にあり、`public/audio` からシンボリックリンクで配信する（`npm run link-audio`。`npm run dev` の前に自動実行される）
- 音声のファイル名は `hash(モデル|ボイス|テキスト)`。`scripts/say-fr` と `src/lib/audio.ts` で同じ規則を使う。設定は `config/tts.json`
- 画面と教材の対応（教材の YAML を追加すると、画面とホームのリンクが自動で増える）

| 画面 | 教材 |
|---|---|
| `/contrast/<slug>` | `*-contrast.yaml`（聞き比べ） |
| `/rules/<slug>` | `*-rules.yaml`（読み方ルール） |
| `/vocab/<単元>` | `*-vocab.yaml`（単語） |
| `/vocab/<単元>/quiz` | `*-vocab.yaml`（単語クイズ：聞いて意味・見て意味・意味からフランス語の 3 形式、4 択） |
| `/reading/<単元>` | `*-reading.yaml`（1 文リーディング） |
| `/listening/<単元>-<番号>` | `*-listening.yaml`（会話・DELF 形式の聞き取り） |
| `/document/<単元>-<番号>` | `*-document.yaml`（DELF 形式の読む文書：メール・掲示・広告など） |
| `/numbers` | `a1/common/numbers.yaml` |
| `/verbs` | `a1/common/verbs.yaml` |
| `/voices` | `config/tts.json` の声の聞き比べ |
| `/spelling/<slug>` | `*-spelling.yaml`（聞いて綴りを 3 択で選ぶ） |
| `/dictation/<slug>` | `*-dictation.yaml`（聞いて綴りを書き取る。アクセント記号の入力ボタン付き） |
| `/review` | `results/` のクイズの結果から、克服していない問題を出題する |

## クイズの結果

- クイズに答えるたびに、`results/YYYY/MM/YYYY-MM-DD.jsonl` に 1 行追記する（`results-api.mjs`：開発サーバーにだけある `/api/results`。POST で追記、GET で全件）
- 静的に書き出したサイトには API がないので、保存に失敗しても画面は普通に動く
- 問題の key の作り方は `src/scripts/results.ts` にまとめている（各画面と `/review` で同じ問題を引き当てるため）
- `scripts/results [日付]` で、画面ごとの正解数と間違えた問題を表示する

## 今後（フェーズ 2）

- Cloudflare Pages にデプロイし、音声は R2 から配信する（`PUBLIC_AUDIO_BASE` を R2 の URL にする）
