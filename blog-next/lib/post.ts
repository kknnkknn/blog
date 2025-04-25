import fs from 'node:fs/promises'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'

export async function getPost(slug: string) {
  const src = await fs.readFile(`content/article/${slug}.md`, 'utf8')
  const { data, content } = matter(src)
  const html = await remark()
    .use(remarkGfm)
    .use(remarkMath)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .process(content)
  return { ...data, html: String(html) }
}
