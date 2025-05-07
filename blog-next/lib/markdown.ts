// lib/markdown.ts
import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import rehypeAutolink from 'rehype-autolink-headings'
import rehypeExtLinks from 'rehype-external-links'
import rehypePrism from 'rehype-prism-plus'
import rehypeStringify from 'rehype-stringify'

/** Markdown 1 本を完全に読んだときの形（個別記事ページ用） */
export interface Post {
  slug: string
  title: string
  date: string           // ISO 形式
  html: string           // 個別ページでは必ず生成
}

/** 一覧に必要な最小限（html は要らない） */
export type PostMeta = Omit<Post, 'html'>

/** 内部: ファイルを文字列で読むだけ */
async function readSource(slug: string) {
  const dir = path.join(process.cwd(), 'content', 'article')
  for (const ext of ['md', 'mdx']) {
    try {
      return await fs.readFile(path.join(dir, `${slug}.${ext}`), 'utf8')
    } catch {}
  }
  return null
}

/** 外部公開: slug を渡すと Post | null を返す */
export async function parseMarkdown(slug: string): Promise<Post | null> {
  const src = await readSource(slug)
  if (!src) return null

  const { data, content } = matter(src)
  const html = String(
    await remark()
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkRehype)
      .use(rehypeKatex)
      .use(rehypeSlug)
      .use(rehypeAutolink, { behavior: 'wrap' })
      .use(rehypeExtLinks, { target: '_blank', rel: ['noopener'] })
      .use(rehypePrism)
      .use(rehypeStringify)
      .process(content),
  )

  return {
    slug,
    title: data.title as string,
    date:  data.date  as string,
    html,
  }
}

/** 一覧用: html を捨てて PostMeta[] を返す */
export async function getAllPosts(): Promise<PostMeta[]> {
  const dir   = path.join(process.cwd(), 'content', 'article')
  const files = (await fs.readdir(dir)).filter(f => /\.mdx?$/i.test(f))

  const posts = await Promise.all(
    files.map(f => parseMarkdown(f.replace(/\.(mdx?)$/i, '')))
  )

  return posts
    .filter((p): p is Post => p !== null)          // null を除外
    .sort((a, b) => (a.date > b.date ? -1 : 1))    // 日付降順
    .map(({ slug, title, date }) => ({ slug, title, date })) // html 捨てる
}
