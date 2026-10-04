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
// 選択肢は 2 つとは限らない（鼻母音は vin / vent / vont の 3 択）ため、labels と pairs のキー（a, b, c…）は自由にしている。
// 選択肢の並び順は labels に書いた順。
const contrasts = defineCollection({
  loader: glob({ pattern: '**/*-contrast.yaml', base: '../../materials' }),
  schema: z.object({
    title: z.string(),
    lead: z.string(),
    labels: z.record(z.string(), label),
    ladder: z.object({
      title: z.string(),
      fr: z.string(),
      steps: z.array(z.object({ mark: z.string(), ipa: z.string(), mouth: z.string() })),
      tip: z.string(),
    }),
    pairs: z.array(z.record(z.string(), word)),
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

// 単元 01〜10 の教材（ElevenLabs v4 Turbo のキャンペーン中にまとめて作ったもの）。形式は単元をまたいで共通
const unitMaterial = { unit: z.string(), title: z.string() };

// 単語。名詞は un / une 付きで読ませる（性を音で覚えるため）。形容詞は女性形も持つ
const vocab = defineCollection({
  loader: glob({ pattern: '**/*-vocab.yaml', base: '../../materials' }),
  schema: z.object({
    ...unitMaterial,
    groups: z.array(
      z.object({
        name: z.string(),
        words: z.array(
          z.object({
            fr: z.string(),
            ipa: z.string(),
            ja: z.string(),
            pos: z.string(),
            g: z.enum(['m', 'f']).optional(),
            f: z.string().optional(),
            f_ipa: z.string().optional(),
            pl: z.string().optional(),
            tts: z.string().optional(),
            note: z.string().optional(),
            // 例文。単語だけでは使い方が分からないため、その単元までの文法で作った 1 文を添える
            ex: z.object({ fr: z.string(), ja: z.string() }).optional(),
          }),
        ),
      }),
    ),
  }),
});

// 1 文だけのリーディング
const reading = defineCollection({
  loader: glob({ pattern: '**/*-reading.yaml', base: '../../materials' }),
  schema: z.object({
    ...unitMaterial,
    sentences: z.array(
      z.object({
        fr: z.string(),
        ja: z.string(),
        grammar: z.string().optional(),
        words: z.array(z.object({ w: z.string(), ja: z.string() })).default([]),
      }),
    ),
  }),
});

// 3 択の質問（聞き取りと読む文書で共通）。answer は 0 始まり
const question = z.object({ q: z.string(), q_ja: z.string(), choices: z.array(z.string()), answer: z.number() });

// 会話・DELF 形式の聞き取り。行ごとに音声を作り、画面で続けて再生する
const listening = defineCollection({
  loader: glob({ pattern: '**/*-listening.yaml', base: '../../materials' }),
  schema: z.object({
    ...unitMaterial,
    type: z.string(),
    situation: z.string(),
    speakers: z.record(z.string(), z.object({ name: z.string(), voice: z.string().optional() })),
    lines: z.array(
      z.object({ speaker: z.string(), voice: z.string().optional(), fr: z.string(), ja: z.string() }),
    ),
    questions: z.array(question),
  }),
});

// DELF 形式の読む文書（メール・掲示・広告など）。1 文リーディングでは練習できない「文書から情報を探す」練習用。
// header（差出人・件名など）は音声にしないので、fr ではなく文字列の配列にしている
const documents = defineCollection({
  loader: glob({ pattern: '**/*-document.yaml', base: '../../materials' }),
  schema: z.object({
    ...unitMaterial,
    type: z.string(),
    situation: z.string(),
    header: z.array(z.string()).default([]),
    // 文書は数字で書く（12 €、14 h 30）が、数字のままだと TTS が読み間違えることがあるので、読ませる文は tts に綴りで書く
    lines: z.array(z.object({ voice: z.string().optional(), fr: z.string(), tts: z.string().optional(), ja: z.string() })),
    questions: z.array(question),
  }),
});

// 数字・日付・時刻・値段。show は画面の表記（数字）、fr は読ませる綴り
const numbers = defineCollection({
  loader: glob({ pattern: 'a1/common/numbers.yaml', base: '../../materials' }),
  schema: z.object({
    title: z.string(),
    groups: z.array(
      z.object({
        slug: z.string(),
        name: z.string(),
        unit: z.string().optional(),
        items: z.array(
          z.object({
            show: z.string(),
            fr: z.string(),
            ipa: z.string(),
            ja: z.string().optional(),
            note: z.string().optional(),
          }),
        ),
      }),
    ),
  }),
});

const form = z.object({ fr: z.string(), ipa: z.string(), tts: z.string().optional(), note: z.string().optional() });

// 動詞の現在形の活用と、複合過去の例
const verbs = defineCollection({
  loader: glob({ pattern: 'a1/common/verbs.yaml', base: '../../materials' }),
  schema: z.object({
    title: z.string(),
    verbs: z.array(
      z.object({
        slug: z.string(),
        inf: z.string(),
        ipa: z.string(),
        ja: z.string(),
        unit: z.string().optional(),
        type: z.string(),
        infinitive: form,
        present: z.array(form),
        past: form.optional(),
      }),
    ),
  }),
});

export const collections = { alphabet, accents, contrasts, rules, vocab, reading, listening, documents, numbers, verbs };
