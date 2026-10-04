import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// scripts/say-fr と同じ規則で音声ファイル名を計算する。
// 規則がずれると、生成済みの音声を見つけられなくなるので注意。
const config = JSON.parse(
  readFileSync(resolve(process.cwd(), '../../config/tts.json'), 'utf-8'),
) as {
  voice_id: string;
  model_id: string;
  voices: Record<string, { voice_id: string; voice_name: string }>;
};

// フェーズ 1 は public/audio（.cache/tts へのリンク）から配信する。
// フェーズ 2 で R2 に移すときは PUBLIC_AUDIO_BASE を R2 の URL にする。
const base = import.meta.env.PUBLIC_AUDIO_BASE ?? '/audio';

// voice は config/tts.json の voices の別名（会話の 2 人目など）。省略すると標準の声
export function audioUrl(text: string, voice?: string): string {
  const voiceId = voice ? config.voices[voice]?.voice_id : config.voice_id;
  if (!voiceId) throw new Error(`不明な声の別名: ${voice}（config/tts.json の voices）`);
  const key = createHash('sha256')
    .update(`${config.model_id}|${voiceId}|${text}`)
    .digest('hex')
    .slice(0, 16);
  return `${base}/${key}.mp3`;
}
