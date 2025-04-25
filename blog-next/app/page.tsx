// app/page.tsx  ← /blog/ に相当する
export const metadata = {
  title: 'nkʼs Blog',
}

export default function Index() {
  return (
    <main className="max-w-prose mx-auto px-4 py-10">
      <ul className="space-y-4 text-lg">
        <li>
          <a href="/blog/about/" className="hover:underline">About</a>
        </li>
        <li>
          <a href="/blog/article/" className="hover:underline">Articles</a>
        </li>
      </ul>
    </main>
  )
}
