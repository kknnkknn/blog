import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import { notFound } from 'next/navigation'
import 'katex/dist/katex.min.css'

/**
 * Markdown -> HTML 変換し、メタ情報を返す
 */
async function loadPost(slug: string) {
  const dir = path.join(process.cwd(), 'app', 'article')
  const tryRead = async (ext: string) => {
    try {
      return await fs.readFile(path.join(dir, `${slug}.${ext}`), 'utf8')
    } catch {
      return undefined
    }
  }
  const src = (await tryRead('md')) ?? (await tryRead('mdx'))
  if (!src) return null

  const { data, content } = matter(src)
  const html = await remark()
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .process(content)

  return {
    title: data.title as string,
    date: data.date as string,
    html: String(html),
  }
}

/**
 * 記事 slug を静的パラメータで列挙
 */
export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'content', 'article')
  const files = await fs.readdir(dir)
  return files
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => ({ slug: f.replace(/\.(md|mdx)$/, '') }))
}

type Params = Promise<{ slug: string }>

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params
  const post = await loadPost(slug)
  if (!post) return notFound()

  return (
    <article>
      <h1 className="text-3xl font-semibold mb-4">{post.title}</h1>
      <p className="text-sm text-neutral-500 mb-10">
        {new Date(post.date).toISOString().slice(0, 10)}
      </p>
      <div
        className="prose prose-neutral max-w-none"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </article>
  )
}
