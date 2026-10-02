import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
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
const label = z.object({ name: z.string(), hint: z.string() });

// 聞き比べ（ミニマルペア）の練習。1 つの練習 = 1 ファイル（*-contrast.yaml）にして、
// 練習を増やすときは YAML を追加するだけで画面（/contrast/<slug>）とクイズが増えるようにしている。
const contrasts = defineCollection({
  loader: glob({ pattern: '**/*-contrast.yaml', base: '../../materials' }),
  schema: z.object({
    title: z.string(),
    lead: z.string(),
    labels: z.object({ a: label, b: label }),
    ladder: z.object({
      title: z.string(),
      fr: z.string(),
      steps: z.array(z.object({ mark: z.string(), ipa: z.string(), mouth: z.string() })),
      tip: z.string(),
    }),
    pairs: z.array(z.object({ a: word, b: word })),
  }),
});

// 綴りを見て読み方を判断する練習（例：e を読むか、鼻母音になるか）。1 つの練習 = 1 ファイル（*-rules.yaml）
const choice = z.object({ id: z.string(), name: z.string(), hint: z.string() });

const rules = defineCollection({
  loader: glob({ pattern: '**/*-rules.yaml', base: '../../materials' }),
  schema: z.object({
    title: z.string(),
    lead: z.string(),
    choices: z.array(choice),
    rules: z.array(
      z.object({
        where: z.string(),
        answer: z.string(),
        note: z.string().optional(),
        examples: z.array(word),
      }),
    ),
    quiz: z.array(word.extend({ show: z.string(), answer: z.string() })),
  }),
});

export const collections = { alphabet, accents, contrasts, rules };
