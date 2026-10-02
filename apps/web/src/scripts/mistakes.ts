// クイズで間違えた問題を、MistakeList.astro の一覧に追加する。
// 同じ問題を何度も間違えたら行を増やさず回数を表示する（苦手な問題が一目でわかるように）。

export type Mistake = {
  key: string; // 同じ問題かどうかの判定に使う
  word: Node; // 単語の表示（強調表示を含められるよう Node で受け取る）
  detail: string; // 発音記号と意味
  chosen: string; // ユーザーの答え
  correct: string; // 正解
  src: string; // 音声
};

export function createMistakeList(play: (src: string, button: Element) => void) {
  const root = document.querySelector<HTMLElement>('#mistakes')!;
  const list = root.querySelector('ul')!;
  const count = root.querySelector<HTMLElement>('.count')!;
  const rows = new Map<string, { times: number; label: HTMLElement }>();

  function add(m: Mistake) {
    const row = rows.get(m.key);
    if (row) {
      row.times++;
      row.label.textContent = `×${row.times}`;
    } else {
      const button = document.createElement('button');
      button.type = 'button';
      const word = Object.assign(document.createElement('span'), { className: 'm-word' });
      word.append('🔊 ', m.word);
      const detail = Object.assign(document.createElement('span'), { className: 'm-detail', textContent: m.detail });
      const answer = Object.assign(document.createElement('span'), {
        className: 'm-answer',
        textContent: `あなた：${m.chosen} → 正解：${m.correct}`,
      });
      const times = Object.assign(document.createElement('span'), { className: 'm-times' });
      button.append(word, detail, answer, times);
      button.addEventListener('click', () => play(m.src, button));
      const li = document.createElement('li');
      li.append(button);
      list.append(li);
      rows.set(m.key, { times: 1, label: times });
    }
    count.textContent = `（${rows.size}）`;
    root.hidden = false;
  }

  return { add };
}
