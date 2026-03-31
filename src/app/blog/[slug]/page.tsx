import { notFound } from 'next/navigation'
import Link from 'next/link'

const BLOG_POSTS: Record<string, { title: string; date: string; category: string; content: string }> = {
  'pomodoro-technique': {
    title: 'Mastering the Pomodoro Technique',
    date: 'March 15, 2026',
    category: 'Productivity',
    content: `The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. The technique uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.

Each interval is known as a pomodoro, from the Italian word for tomato, after the tomato-shaped kitchen timer Cirillo used as a university student.

**How It Works**

1. Choose a task to work on
2. Set a timer for 25 minutes
3. Work on the task until the timer rings
4. Take a 5-minute break
5. Every 4 pomodoros, take a longer break (15-30 minutes)

**Why It Works**

The technique works because it creates artificial urgency. When you know you only have 25 minutes, your brain focuses intensely to complete as much as possible before the timer rings.

Additionally, the regular breaks prevent mental fatigue and maintain your cognitive performance throughout the day.

**Using FocusFlow**

FocusFlow's timer is designed around the Pomodoro Technique. Track your sessions, see your productivity trends, and let AI coach you to optimize your focus cycles.`,
  },
  'flow-state': {
    title: 'Getting Into Flow State',
    date: 'March 8, 2026',
    category: 'Science',
    content: `Flow state, also known as being "in the zone," is a mental state of complete immersion in an activity. First described by psychologist Mihaly Csikszentmihalyi, flow is characterized by energized focus, full involvement, and enjoyment in the process of the activity.

**Conditions for Flow**

- **Clear goals**: You know exactly what you need to accomplish
- **Immediate feedback**: You can see your progress in real time
- **Challenge-skill balance**: The task is challenging but achievable

**Achieving Flow**

1. Eliminate distractions (phone, notifications, social media)
2. Work in focused blocks of 90-120 minutes
3. Choose tasks at the edge of your ability
4. Create environmental cues that signal "focus time"

**FocusFlow and Flow States**

Our analytics track when you have your most productive sessions, helping you identify your optimal focus windows and replicate the conditions for flow.`,
  },
  'task-batching': {
    title: 'Task Batching: Work Smarter',
    date: 'March 1, 2026',
    category: 'Strategy',
    content: `Task batching is the practice of grouping similar tasks together and completing them in dedicated time blocks. Instead of switching between different types of work throughout the day, you tackle similar tasks consecutively.

**Why Context Switching Kills Productivity**

Every time you switch between different types of tasks, your brain needs time to reconfigure. Research suggests this "switching cost" can consume up to 40% of your productive time.

**How to Batch Tasks**

- Emails and communications: 2-3 times per day
- Creative work: Morning when willpower is highest
- Administrative tasks: Afternoon energy dips
- Meetings: Consecutive blocks to preserve focus time

**Implementation with FocusFlow**

Use FocusFlow's task categories to group similar work. Set up dedicated focus sessions for each category and watch your productivity multiply.`,
  },
  'digital-minimalism': {
    title: 'Digital Minimalism for Focus',
    date: 'February 22, 2026',
    category: 'Mindset',
    content: `Digital minimalism is a philosophy of technology use where you focus your online time on a small number of carefully selected activities that strongly support things you value, and happily miss out on everything else.

**The Cost of Digital Noise**

The average person checks their phone 96 times per day. Each check is a potential focus-breaker that can derail deep work and leave you feeling scattered and unproductive.

**Practical Steps**

1. **Audit your apps**: Delete anything that doesn't serve your goals
2. **Disable push notifications**: Check on your schedule, not theirs
3. **Use website blockers**: During focus sessions, block distracting sites
4. **Phone-free morning**: First hour of the day is for your goals, not others'

**The FocusFlow Approach**

Our AI coach monitors your focus patterns and can identify when digital distractions are impacting your sessions. Build streaks of distraction-free work and watch your output transform.`,
  },
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS[params.slug]
  if (!post) notFound()

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/blog" className="text-accent-400 hover:text-accent-300 text-sm mb-8 block">← Back to Blog</Link>
        <span className="text-xs font-semibold text-accent-400 uppercase tracking-wider">{post.category}</span>
        <h1 className="text-4xl font-bold mt-2 mb-3">{post.title}</h1>
        <p className="text-text-muted text-sm mb-10">{post.date}</p>
        <div className="text-text-secondary leading-relaxed space-y-4 whitespace-pre-wrap">{post.content}</div>
      </div>
    </div>
  )
}
