# Movie Log

個人映画鑑賞記録サイト。Svelte 5 + SvelteKit + Tailwind CSS v4 + TMDB API。

## セットアップ

```bash
pnpm install
cp .env.example .env       # .env を編集して TMDB_API_KEY を設定
```

TMDB API キーは [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) で無料取得 (個人利用)。
キーが未設定でもサイトは動きますが、ポスター画像など TMDB 由来のメタデータは表示されません。

## 起動

```bash
pnpm dev          # 開発サーバー (http://localhost:5173/)
pnpm check        # 型チェック
pnpm build        # Vercel 用ビルド → .vercel/output/ (build 時に TMDB を fetch)
pnpm preview      # ビルド成果物のプレビュー
```

## 映画の追加

`src/lib/data/movies.ts` の `movies` 配列に追記:

```ts
{ slug: 'my-movie', tmdb_id: 123, title: '…', year: 0, director: '…', status: 'watched', watched_on: '2026-04-29', rating: 4 }
```

`tmdb_id` を入れておくと build 時に TMDB から poster / 監督 / 年 / ジャンル / あらすじを取得して上書き補完。
TMDB ID は [themoviedb.org](https://www.themoviedb.org/) で映画を開いた時の URL (`/movie/{id}-{slug}`) で確認できます。
