// クイズの結果を開発サーバーの API（results-api.mjs）に送る・読み込む。
// 静的に書き出したサイトには API がないので、失敗しても画面の動きは止めない。

// 復習画面（/review）で出題し直すための問題の中身。
// 単語は全単元・全形式を合わせると数千問になり、復習画面に全部埋め込むと重いので、
// 答えた時点の問題を結果と一緒に保存しておき、復習画面はそれを使って出題する
export type ReviewItem = {
  title: string; // どの練習の問題か（選択肢の意味がわかるように表示する）
  href: string;
  fr: string;
  ipa: string;
  ja: string;
  src: string;
  prompt?: string; // 画面に出す問題文。ないときは音声だけで出題する
  answer: string; // 正解の選択肢の id
  choices: { id: string; name: string; hint: string }[];
};

export type Result = {
  type: 'contrast' | 'rules' | 'spelling' | 'vocab' | 'question' | 'dictation'; // どの形式のクイズか
  key: string; // 同じ問題かどうかの判定に使う（復習画面で問題を引き当てる）
  page: string; // 答えた画面
  word: string; // 問題の単語・質問（記録を人が読むため）
  chosen: string; // ユーザーの答え
  answer: string; // 正解
  ok: boolean;
  item?: ReviewItem; // 復習画面で出題し直すための中身（単語のクイズだけ）
};

export type SavedResult = Result & { date: string; time: string };

export function saveResult(r: Omit<Result, 'page'> & { page?: string }) {
  fetch('/api/results', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page: location.pathname, ...r }),
  }).catch(() => {});
}

export async function loadResults(): Promise<SavedResult[] | null> {
  try {
    const res = await fetch('/api/results');
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

// 問題の key。各画面と復習画面（/review）で同じ問題を同じ key にするため、ここで作り方をそろえる
export const contrastKey = (slug: string, fr: string) => `contrast:${slug}:${fr}`;
// 同じ単語でも判断する箇所が違えば別の問題（bell{e} と b{e}lle）なので、show（強調の位置）で区別する
export const rulesKey = (slug: string, show: string) => `rules:${slug}:${show}`;
export const questionKey = (page: string, index: number) => `question:${page}:${index}`;
export const spellingKey = (slug: string, fr: string) => `spelling:${slug}:${fr}`;
// 単語は形式（聞いて意味・見て意味・意味からフランス語）ごとに別の問題として扱う（必要な力が違うため）
export const vocabKey = (unit: string, mode: string, fr: string) => `vocab:${unit}:${mode}:${fr}`;
export const dictationKey = (slug: string, fr: string) => `dictation:${slug}:${fr}`;
