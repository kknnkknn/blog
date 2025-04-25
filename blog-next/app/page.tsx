import Link from "next/link"

// app/page.tsx  ← /blog/ に相当する
export const metadata = {
  title: 'Blog',
}

export default function Index() {
  return (
    <main className="max-w-prose mx-auto px-4 py-10">
      <ul className="space-y-4 text-lg">
        <li>
          <Link href="/about/" className="hover:underline">About</Link>
        </li>
        <li>
          <Link href="/article/" className="hover:underline">Articles</Link>
        </li>
      </ul>
    </main>
  )
}
