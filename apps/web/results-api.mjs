// クイズの結果を保存・取得する API（開発サーバーでだけ動く Vite のプラグイン）
//
// Web のクイズの結果はブラウザの中にしか残らず、Claude が journal や mistakes/ に記録できなかった。
// そこで答えるたびに results/YYYY/MM/YYYY-MM-DD.jsonl へ 1 行ずつ追記し、Claude と復習画面（/review）から読めるようにする。
// サイトは静的に書き出す（将来は Cloudflare に置く）ので、Astro の API ルートではなく開発サーバーにだけ受け口を足している。
// 公開後の保存先は D1 などで別に考える（apps/web/README.md の「今後」）。
import { appendFile, mkdir, readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../results/', import.meta.url));

// ファイルの日付は、journal と同じくローカル時刻で区切る
function localDate(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return {
    day: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
  };
}

async function readBody(req) {
  let body = '';
  for await (const chunk of req) body += chunk;
  return JSON.parse(body);
}

async function readAll() {
  const files = (await readdir(root, { recursive: true }).catch(() => [])).filter((f) => f.endsWith('.jsonl')).sort();
  const records = [];
  for (const f of files) {
    const text = await readFile(join(root, f), 'utf8');
    for (const line of text.split('\n')) if (line.trim()) records.push(JSON.parse(line));
  }
  return records;
}

export function resultsApi() {
  return {
    name: 'results-api',
    configureServer(server) {
      server.middlewares.use('/api/results', async (req, res) => {
        try {
          if (req.method === 'POST') {
            const { day, time } = localDate(new Date());
            const record = { date: day, time, ...(await readBody(req)) };
            const dir = join(root, day.slice(0, 4), day.slice(5, 7));
            await mkdir(dir, { recursive: true });
            await appendFile(join(dir, `${day}.jsonl`), JSON.stringify(record) + '\n');
            res.statusCode = 204;
            res.end();
          } else {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(await readAll()));
          }
        } catch (e) {
          res.statusCode = 500;
          res.end(String(e));
        }
      });
    },
  };
}
