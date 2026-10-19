// 入力した答えの判定。動詞の活用クイズ（/verbs/quiz）と復習画面（/review）で同じ基準にするため、ここにまとめる。
// ディクテーション（/dictation）にも同じ処理があるが、今回の変更の範囲外なのでそのままにしている。

// 大文字・小文字、句読点、空白の違いは綴りの理解と関係ないので無視する。
// アポストロフィは入力方法で ' と ’ が混ざるのでそろえる。
// 全角数字は半角にそろえる（数字のクイズで、日本語入力のまま打つことがあるため）
export function normalize(s: string) {
  return s
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/[.,!?;:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// アクセント記号（ç のセディーユを含む）を外した形。「アクセント記号だけの違い」を見分けるため
function stripAccents(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// near（アクセント記号だけ違う）は不正解として記録する。書くときはアクセント記号も綴りの一部なので
export function judge(input: string, answer: string): 'ok' | 'near' | 'ng' {
  const a = normalize(input);
  const b = normalize(answer);
  if (a === b) return 'ok';
  if (stripAccents(a) === stripAccents(b)) return 'near';
  return 'ng';
}

export const verdictLabel = { ok: '⭕ 正解', near: '△ 惜しい（アクセント記号だけ違う）', ng: '❌' } as const;
