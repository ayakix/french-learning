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
- APIキーなどの秘密情報は `.env` に置き、絶対にコミットしない（公開リポジトリのため）
