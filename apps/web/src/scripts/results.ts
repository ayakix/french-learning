// クイズの結果を開発サーバーの API（results-api.mjs）に送る・読み込む。
// 静的に書き出したサイトには API がないので、失敗しても画面の動きは止めない。

export type Result = {
  type: 'contrast' | 'rules' | 'spelling' | 'question' | 'dictation'; // どの形式のクイズか
  key: string; // 同じ問題かどうかの判定に使う（復習画面で問題を引き当てる）
  page: string; // 答えた画面
  word: string; // 問題の単語・質問（記録を人が読むため）
  chosen: string; // ユーザーの答え
  answer: string; // 正解
  ok: boolean;
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
export const dictationKey = (slug: string, fr: string) => `dictation:${slug}:${fr}`;
