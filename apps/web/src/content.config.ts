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

const accents = defineCollection({
  loader: file('../../materials/a1/00-pronunciation/00-1-accents.yaml'),
  schema: z.object({
    marks: z.string(),
    fr: z.string(),
    role: z.string(),
    words: z.array(
      z.object({
        fr: z.string(),
        ja: z.string(),
        ipa: z.string(),
        note: z.string().optional(),
      }),
    ),
  }),
});

const word = z.object({ fr: z.string(), ipa: z.string(), ja: z.string() });

const eSounds = defineCollection({
  loader: file('../../materials/a1/00-pronunciation/00-1-e-sounds.yaml'),
  schema: z.object({ close: word, open: word }),
});

const eLadder = defineCollection({
  loader: file('../../materials/a1/00-pronunciation/00-1-e-ladder.yaml'),
  schema: z.object({
    fr: z.string(),
    steps: z.array(z.object({ mark: z.string(), ipa: z.string(), mouth: z.string() })),
  }),
});

export const collections = { alphabet, accents, eSounds, eLadder };
