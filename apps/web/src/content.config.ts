import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

// 教材の正本は materials/ にある（README の「リポジトリが source of truth」の方針）。
// Web アプリ側にコピーせず、直接読み込む。
const alphabet = defineCollection({
  loader: file('../../materials/a1/00-pronunciation/00-1-alphabet.yaml'),
  schema: z.object({
    ipa: z.string(),
    tts: z.string(),
    caution: z.boolean().default(false),
    note: z.string().optional(),
  }),
});

export const collections = { alphabet };
