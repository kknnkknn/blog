import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import Link from 'next/link'

/**
 * 型定義 – front‑matter に必須なのは title と date だけ
 */
interface PostMeta {
  title: string
  date: string // ISO 形式想定
}

/**
 * Markdown 記事をすべて読み込み、slug / meta 情報を返す
 */
async function getAllPosts() {
  const dir = path.join(process.cwd(), 'content', 'article')
  const files = await fs.readdir(dir)
  const posts = await Promise.all(
    files
      .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
      .map(async (filename) => {
        const filePath = path.join(dir, filename)
        const raw = await fs.readFile(filePath, 'utf8')
        const { data } = matter(raw)
        const meta = data as PostMeta
        return {
          slug: filename.replace(/\.(md|mdx)$/, ''),
          title: meta.title,
          date: meta.date,
        }
      })
  )
  // 日付降順
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1))
}

/**
 * /article/ – 記事一覧ページ
 * Hugo の minimal テーマと同じ「日付 + タイトル」1 行リスト
 */
export const metadata = {
  title: 'Articles',
}

export default async function ArticleIndex() {
  const posts = await getAllPosts()
  return (
    <main className="max-w-prose mx-auto px-4 py-10"> {/* ★ 中央寄せラッパー */}
      <ul className="list-none space-y-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <span className="mr-3 text-neutral-500">
              {new Date(post.date).toISOString().slice(0, 10)}
            </span>
            <Link href={`/article/${post.slug}/`} className="hover:underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
