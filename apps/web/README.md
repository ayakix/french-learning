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

## 今後（フェーズ 2）

- Cloudflare Pages にデプロイし、音声は R2 から配信する（`PUBLIC_AUDIO_BASE` を R2 の URL にする）
