const fs = require('fs/promises')
const path = require('path')

;(async () => {
  const blogDir = path.join('out', 'blog')
  await fs.mkdir(blogDir, { recursive: true })

  // ① トップページ
  await fs.copyFile(path.join('out', 'index.html'),
                    path.join(blogDir, 'index.html'))

  // ② _next（JS/CSS）
  await fs.cp(path.join('out', '_next'),
              path.join(blogDir, '_next'),
              { recursive: true })

  // ③ article セクション
  await fs.cp(path.join('out', 'article'),
              path.join(blogDir, 'article'),
              { recursive: true })

  // 追加セクションがあれば同様にコピー
  await fs.cp(path.join('out', 'about'),
              path.join(blogDir, 'about'), { recursive: true })

  console.log('✓ copied index.html, _next/, article/ → /blog/')
})()
