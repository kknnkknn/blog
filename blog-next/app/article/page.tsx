// app/article/page.tsx
import { getAllPosts, type PostMeta } from '@/lib/markdown'   // ← 共通 util を呼ぶだけ
import Link from 'next/link'

export const metadata = {
  title: 'Articles',
}

export default async function ArticleIndex() {
  const posts: PostMeta[] = await getAllPosts()        // ← 型も util 側に揃える
  return (
    <main className="max-w-prose mx-auto px-4 py-10">
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
