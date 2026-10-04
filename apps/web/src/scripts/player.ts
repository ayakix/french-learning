// 単元 01 以降の画面で共通に使う音声の再生。
// 音声を重ねて鳴らさないよう、Audio は 1 つだけ使い回す。
// 続けて再生（会話・活用表）中に別のボタンを押したら、続きは止める（session で判定）。

const audio = new Audio();
let session = 0;

function highlight(el?: Element | null) {
  document.querySelectorAll('.play').forEach((b) => b.classList.toggle('playing', b === el));
}

function playOnce(src: string, el?: Element | null): Promise<void> {
  highlight(el);
  audio.src = src;
  return new Promise((resolve) => {
    audio.onended = () => resolve();
    audio.onerror = () => resolve();
    audio.play().catch(() => resolve());
  });
}

export function play(src: string, el?: Element | null) {
  session++;
  playOnce(src, el).then(() => highlight(null));
}

// 項目を順番に再生する。gap は項目の間の無音（ミリ秒）
export async function playAll(items: { src: string; el?: Element | null }[], gap = 600) {
  const mine = ++session;
  for (const item of items) {
    if (mine !== session) return;
    await playOnce(item.src, item.el);
    await new Promise((r) => setTimeout(r, gap));
  }
  if (mine === session) highlight(null);
}

// data-src を持つ .play ボタンをクリックで再生できるようにする
export function bindPlayButtons(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('.play[data-src]').forEach((el) =>
    el.addEventListener('click', () => play(el.dataset.src!, el)),
  );
}
