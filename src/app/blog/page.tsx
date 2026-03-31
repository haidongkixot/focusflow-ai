import Link from 'next/link'

const BLOG_POSTS = [
  { slug: 'pomodoro-technique', title: 'Mastering the Pomodoro Technique', excerpt: 'How 25-minute focus intervals can transform your productivity and help you achieve deep work states.', date: '2026-03-15', category: 'Productivity' },
  { slug: 'flow-state', title: 'Getting Into Flow State', excerpt: 'Scientific insights on achieving peak cognitive performance and maintaining it throughout your workday.', date: '2026-03-08', category: 'Science' },
  { slug: 'task-batching', title: 'Task Batching: Work Smarter', excerpt: 'Group similar tasks together to reduce context-switching costs and multiply your output.', date: '2026-03-01', category: 'Strategy' },
  { slug: 'digital-minimalism', title: 'Digital Minimalism for Focus', excerpt: 'Reducing notifications and digital clutter is the single most effective productivity change you can make.', date: '2026-02-22', category: 'Mindset' },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-bg-base">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">FocusFlow Blog</h1>
          <p className="text-text-secondary">Productivity science, focus strategies, and deep work insights</p>
        </div>
        <div className="grid gap-6">
          {BLOG_POSTS.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="card-hover block group">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-accent-400 uppercase tracking-wider">{post.category}</span>
                  <h2 className="text-xl font-bold mt-1 mb-2 group-hover:text-accent-400 transition-colors">{post.title}</h2>
                  <p className="text-text-secondary text-sm">{post.excerpt}</p>
                </div>
                <span className="text-xs text-text-muted whitespace-nowrap flex-shrink-0 mt-1">{post.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
