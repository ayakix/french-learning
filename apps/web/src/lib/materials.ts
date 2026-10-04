import type { CollectionEntry } from 'astro:content';

// 聞き取りの URL に使う id。ファイル名（例：01-1-listening.yaml）から「01-1」を取り出す。
// YAML に slug を書かずに済むよう、ファイル名を正とする
export function listeningId(entry: CollectionEntry<'listening'>): string {
  return entry.id.split('/').pop()!.replace(/-listening$/, '');
}

// 読む文書の URL に使う id。ファイル名（例：01-1-document.yaml）から「01-1」を取り出す
export function documentId(entry: CollectionEntry<'documents'>): string {
  return entry.id.split('/').pop()!.replace(/-document$/, '');
}
