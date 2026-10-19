// 選択肢のクイズをキーボードだけで解けるようにする（ユーザーの希望。2026-10-16）。
// マウスと行き来すると、聞くことへの集中が途切れるため。
// スペース：もう一度聞く、1〜9：その番号の選択肢で答える、Enter：次の問題へ
// 選択肢の番号の表示は styles/quiz-keys.css（ボタンの中身を変えずに済むよう CSS で付ける）

// canNext：Enter で次の問題へ進んでよいか。20 問終わったときに Enter で次の 20 問へ入ってしまわないよう、各画面で止める
export function bindQuizKeys({ canNext = () => true }: { canNext?: () => boolean } = {}) {
  const nextButton = document.querySelector<HTMLButtonElement>('#quiz-next');
  const replayButton = document.querySelector<HTMLButtonElement>('#quiz-replay');
  const usable = (b: HTMLButtonElement | null | undefined): b is HTMLButtonElement => !!b && !b.disabled && !b.hidden;

  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    // 書いて答える問題（/review の動詞の活用など）の入力中は、文字の入力を優先する
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement) return;
    const answers = [...document.querySelectorAll<HTMLButtonElement>('.answers .answer')];
    if (e.key === ' ') {
      if (usable(replayButton)) replayButton.click();
    } else if (/^[1-9]$/.test(e.key)) {
      const b = answers[Number(e.key) - 1];
      if (usable(b)) b.click();
    } else if (e.key === 'Enter') {
      // 答える前に Enter を押しても問題を飛ばさない（押せる選択肢が残っていたら、まだ答えていない）
      if (usable(nextButton) && !answers.some(usable) && canNext()) nextButton.click();
    } else return;
    // 既定の動作（ページのスクロール、フォーカス中のボタンを押す）と二重に動かないよう止める
    e.preventDefault();
  });
}
