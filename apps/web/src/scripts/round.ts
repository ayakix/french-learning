// クイズの 1 回分の問題数。終わりのない出題だと、どこでやめればいいかわからず続けにくかったため（2026-10-06）
export const ROUND_SIZE = 20;

// 問題を一通り出し切ってから、同じ問題に戻る。
// 毎回ランダムに選ぶと、同じ問題が何度も出る一方で、1 度も出ない問題が残るため
export function createDeck<T>(items: T[]) {
  let bag: T[] = [];
  let last: T | null = null;
  return () => {
    if (bag.length === 0) {
      bag = [...items].sort(() => Math.random() - 0.5);
      // 補充した直後に、直前と同じ問題が続かないようにする
      if (bag.length > 1 && bag[0] === last) bag.push(bag.shift()!);
    }
    last = bag.shift()!;
    return last;
  };
}
