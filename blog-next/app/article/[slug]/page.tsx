import { notFound } from 'next/navigation'
import 'katex/dist/katex.min.css'
import { parseMarkdown } from '@/lib/markdown'

type Params = Promise<{ slug: string }>

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params
  const post = await parseMarkdown(slug)
  if (!post) return notFound()

  return (
    <article className="prose prose-invert max-w-prose mx-auto px-4 py-10">
      <h1 className="mb-4">{post.title}</h1>
      <p className="text-sm text-neutral-500 mb-10">
        {new Date(post.date).toISOString().slice(0, 10)}
      </p>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  )
}
