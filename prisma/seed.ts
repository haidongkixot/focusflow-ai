import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

function daysAgo(n: number) { const d = new Date(); d.setDate(d.getDate() - n); return d }
function todayDate() { const d = new Date(); d.setHours(0,0,0,0); return d }

async function main() {
  console.log('🎯 Seeding FocusFlow AI...')

  // Plans
  await prisma.plan.upsert({ where: { slug: 'free' }, update: {}, create: { slug: 'free', name: 'Starter', priceMonthly: 0, maxTasks: 10, maxSessions: 3, features: { tasks: 10, sessions_per_day: 3, ai_coach: '3 messages/day', analytics: 'basic' } } })
  await prisma.plan.upsert({ where: { slug: 'pro' }, update: {}, create: { slug: 'pro', name: 'Flow', priceMonthly: 999, maxTasks: 9999, maxSessions: 9999, features: { tasks: 'unlimited', sessions_per_day: 'unlimited', ai_coach: 'unlimited', analytics: 'advanced', team_mode: true } } })
  await prisma.plan.upsert({ where: { slug: 'team' }, update: {}, create: { slug: 'team', name: 'Team Flow', priceMonthly: 2499, maxTasks: 9999, maxSessions: 9999, features: { tasks: 'unlimited', sessions_per_day: 'unlimited', ai_coach: 'unlimited', analytics: 'advanced', team_mode: true, admin_dashboard: true } } })
  console.log('  ✓ Plans')

  // Badges (standalone Badge table)
  const badgeDefs = [
    { slug: 'first-focus', name: 'First Focus Session', description: 'Complete your first focus session', icon: '🎯', category: 'milestone', requirement: { sessions: 1 } },
    { slug: 'pomodoro-master', name: 'Pomodoro Master', description: 'Complete 4 focus sessions in a single day', icon: '🍅', category: 'daily', requirement: { sessions_per_day: 4 } },
    { slug: 'deep-worker', name: 'Deep Worker', description: 'Complete 5 sessions of 50+ minutes', icon: '🧠', category: 'intensity', requirement: { sessions_90min_plus: 5 } },
    { slug: 'task-crusher', name: 'Task Crusher', description: 'Complete 50 tasks total', icon: '⚡', category: 'productivity', requirement: { tasks_completed: 50 } },
    { slug: 'streak-7', name: '7-Day Streak', description: 'Focus every day for 7 consecutive days', icon: '🔥', category: 'streak', requirement: { streak_days: 7 } },
    { slug: 'century-focus', name: 'Century Focus', description: 'Accumulate 100 hours of total focus time', icon: '💯', category: 'milestone', requirement: { total_focus_mins: 6000 } },
  ]
  for (const b of badgeDefs) {
    await prisma.badge.upsert({ where: { slug: b.slug }, update: {}, create: b })
  }
  console.log('  ✓ Badge Definitions')

  // Users
  const adminHash = await bcrypt.hash('admin123!', 12)
  const demoHash = await bcrypt.hash('demo1234', 12)

  const admin = await prisma.user.upsert({ where: { email: 'admin@focusflow.ai' }, update: {}, create: { email: 'admin@focusflow.ai', name: 'Admin', passwordHash: adminHash, role: 'admin' } })
  const sarah = await prisma.user.upsert({ where: { email: 'sarah.chen@example.com' }, update: {}, create: { email: 'sarah.chen@example.com', name: 'Sarah Chen', passwordHash: demoHash } })
  const marcus = await prisma.user.upsert({ where: { email: 'marcus.johnson@example.com' }, update: {}, create: { email: 'marcus.johnson@example.com', name: 'Marcus Johnson', passwordHash: demoHash } })
  const emma = await prisma.user.upsert({ where: { email: 'emma.wilson@example.com' }, update: {}, create: { email: 'emma.wilson@example.com', name: 'Emma Wilson', passwordHash: demoHash } })
  const alex = await prisma.user.upsert({ where: { email: 'alex.rivera@example.com' }, update: {}, create: { email: 'alex.rivera@example.com', name: 'Alex Rivera', passwordHash: demoHash } })
  console.log('  ✓ Users')

  // User Settings
  await prisma.userSettings.upsert({ where: { userId: sarah.id }, update: {}, create: { userId: sarah.id, focusDurationMins: 25, shortBreakMins: 5, longBreakMins: 15, cyclesBeforeLong: 4, dailyGoalMins: 150, soundEnabled: true, notificationsOn: true, theme: 'dark', timezone: 'America/Los_Angeles' } })
  await prisma.userSettings.upsert({ where: { userId: marcus.id }, update: {}, create: { userId: marcus.id, focusDurationMins: 50, shortBreakMins: 10, longBreakMins: 20, cyclesBeforeLong: 2, dailyGoalMins: 120 } })
  await prisma.userSettings.upsert({ where: { userId: emma.id }, update: {}, create: { userId: emma.id, focusDurationMins: 25, shortBreakMins: 5, longBreakMins: 15, cyclesBeforeLong: 4, dailyGoalMins: 60 } })
  console.log('  ✓ User Settings')

  // Categories for Sarah
  await prisma.category.upsert({ where: { userId_name: { userId: sarah.id, name: 'Work' } }, update: {}, create: { userId: sarah.id, name: 'Work', color: '#f43f5e', icon: 'briefcase', sortOrder: 0 } })
  await prisma.category.upsert({ where: { userId_name: { userId: sarah.id, name: 'Learning' } }, update: {}, create: { userId: sarah.id, name: 'Learning', color: '#6366f1', icon: 'book', sortOrder: 1 } })
  await prisma.category.upsert({ where: { userId_name: { userId: sarah.id, name: 'Personal' } }, update: {}, create: { userId: sarah.id, name: 'Personal', color: '#10b981', icon: 'user', sortOrder: 2 } })
  console.log('  ✓ Categories')

  // Tags for Sarah
  for (const [name, color] of [['urgent','#ef4444'],['deep-work','#8b5cf6'],['quick-win','#22c55e'],['waiting','#f59e0b'],['recurring','#3b82f6']]) {
    await prisma.tag.upsert({ where: { userId_name: { userId: sarah.id, name } }, update: {}, create: { userId: sarah.id, name, color } })
  }
  console.log('  ✓ Tags')

  // Tasks for Sarah
  const sarahTasks = [
    { id: 'task-s-1', title: 'Refactor authentication module', priority: 'high', status: 'todo', category: 'Work', estimatedMins: 120, description: 'Clean up the auth flow and add OAuth support for Google and GitHub.', focusSessionCount: 0 },
    { id: 'task-s-2', title: 'Write Q1 engineering report', priority: 'high', status: 'in_progress', category: 'Work', estimatedMins: 90, description: 'Summarize team achievements, metrics, and blockers for Q1.', focusSessionCount: 2 },
    { id: 'task-s-3', title: "Read 'Deep Work' by Cal Newport", priority: 'medium', status: 'in_progress', category: 'Learning', estimatedMins: 60, focusSessionCount: 3 },
    { id: 'task-s-4', title: 'Review pull requests', priority: 'medium', status: 'completed', category: 'Work', estimatedMins: 30, completedAt: daysAgo(2), focusSessionCount: 1 },
    { id: 'task-s-5', title: 'Plan team offsite agenda', priority: 'low', status: 'todo', category: 'Work', estimatedMins: 45, focusSessionCount: 0 },
    { id: 'task-s-6', title: 'Complete Python course — Module 5', priority: 'medium', status: 'todo', category: 'Learning', estimatedMins: 90, focusSessionCount: 0 },
    { id: 'task-s-7', title: 'Organize home office', priority: 'low', status: 'completed', category: 'Personal', estimatedMins: 60, completedAt: daysAgo(5), focusSessionCount: 1 },
    { id: 'task-s-8', title: "Draft blog post: 'How I use the Pomodoro Technique'", priority: 'medium', status: 'todo', category: 'Personal', estimatedMins: 75, focusSessionCount: 0 },
  ]
  for (const t of sarahTasks) {
    await prisma.task.upsert({ where: { id: t.id }, update: {}, create: { ...t, userId: sarah.id } })
  }

  // Tasks for Marcus
  const marcusTasks = [
    { id: 'task-m-1', title: 'Design new landing page mockups', priority: 'high', status: 'in_progress', category: 'Work', estimatedMins: 180, focusSessionCount: 3 },
    { id: 'task-m-2', title: 'Client presentation prep', priority: 'high', status: 'todo', category: 'Work', estimatedMins: 120, focusSessionCount: 0 },
    { id: 'task-m-3', title: 'Learn Figma advanced features', priority: 'medium', status: 'in_progress', category: 'Learning', estimatedMins: 60, focusSessionCount: 2 },
    { id: 'task-m-4', title: 'Update portfolio website', priority: 'medium', status: 'todo', category: 'Personal', estimatedMins: 90, focusSessionCount: 0 },
    { id: 'task-m-5', title: 'Review design system docs', priority: 'low', status: 'completed', completedAt: daysAgo(3), focusSessionCount: 1 },
  ]
  for (const t of marcusTasks) {
    await prisma.task.upsert({ where: { id: t.id }, update: {}, create: { ...t, userId: marcus.id } })
  }

  // Tasks for Emma
  const emmaTasks = [
    { id: 'task-e-1', title: 'Complete onboarding checklist', priority: 'high', status: 'in_progress', estimatedMins: 30, focusSessionCount: 1 },
    { id: 'task-e-2', title: 'Read product documentation', priority: 'medium', status: 'todo', estimatedMins: 60, focusSessionCount: 0 },
    { id: 'task-e-3', title: 'Set up development environment', priority: 'high', status: 'completed', completedAt: daysAgo(1), focusSessionCount: 1 },
  ]
  for (const t of emmaTasks) {
    await prisma.task.upsert({ where: { id: t.id }, update: {}, create: { ...t, userId: emma.id } })
  }
  console.log('  ✓ Tasks')

  // Focus Sessions
  const aiFeedbacks = [
    "Great focus block! Your consistency between 9-11am shows this is your peak productivity window.",
    "You completed 4 Pomodoros today — consider a longer 90-min deep work session tomorrow for your auth refactor.",
    "Strong session. Your task completion rate is highest when you start with a clear next action. Keep defining them before each session.",
    "Excellent deep work session. Your 50-min blocks show better retention than your 25-min blocks for complex coding tasks.",
    null, null, null,
  ]

  const sessionConfigs = [
    { user: sarah, taskId: 'task-s-2', days: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], durations: [25,25,50,25,25,50,25,25,90,25,25,50,25,25,50,25,25,50,25,25] },
    { user: marcus, taskId: 'task-m-1', days: [1,2,3,4,5,6,7,8,9,10,11,12], durations: [25,50,25,25,50,25,50,25,25,50,25,50] },
    { user: emma, taskId: 'task-e-1', days: [1,2,3], durations: [25,25,25] },
    { user: alex, taskId: null, days: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,16], durations: [50,90,50,25,50,90,50,50,90,25,50,50,90,50,50] },
  ]

  for (const { user, taskId, days, durations } of sessionConfigs) {
    for (let i = 0; i < days.length; i++) {
      const dur = durations[i]
      const startTime = daysAgo(days[i])
      startTime.setHours(9 + Math.floor(i / 4) * 2, 0, 0, 0)
      const endTime = new Date(startTime.getTime() + dur * 60000)
      await prisma.focusSession.create({
        data: {
          userId: user.id,
          taskId: taskId || null,
          type: dur >= 90 ? 'deep_work' : 'focus',
          durationMins: dur,
          actualMins: dur - Math.floor(Math.random() * 2),
          completed: true,
          aiFeedback: aiFeedbacks[i % aiFeedbacks.length],
          startedAt: startTime,
          endedAt: endTime,
        },
      })
    }
    console.log(`  ✓ Focus sessions: ${user.name}`)
  }

  // XP Events
  for (let i = 0; i < 16; i++) {
    await prisma.xpEvent.create({ data: { userId: sarah.id, source: i % 4 === 0 ? 'complete_task' : i % 3 === 0 ? 'pomodoro_cycle' : 'complete_session', amount: i % 4 === 0 ? 15 : i % 3 === 0 ? 50 : 20, createdAt: daysAgo(i) } })
  }
  for (let i = 0; i < 8; i++) {
    await prisma.xpEvent.create({ data: { userId: marcus.id, source: 'complete_session', amount: 20, createdAt: daysAgo(i) } })
  }
  console.log('  ✓ XP Events')

  // Streaks
  await prisma.streak.upsert({ where: { userId_type: { userId: sarah.id, type: 'daily_focus' } }, update: {}, create: { userId: sarah.id, type: 'daily_focus', current: 16, longest: 21, lastActiveAt: daysAgo(0) } })
  await prisma.streak.upsert({ where: { userId_type: { userId: marcus.id, type: 'daily_focus' } }, update: {}, create: { userId: marcus.id, type: 'daily_focus', current: 8, longest: 14, lastActiveAt: daysAgo(0) } })
  await prisma.streak.upsert({ where: { userId_type: { userId: emma.id, type: 'daily_focus' } }, update: {}, create: { userId: emma.id, type: 'daily_focus', current: 3, longest: 3, lastActiveAt: daysAgo(0) } })
  await prisma.streak.upsert({ where: { userId_type: { userId: alex.id, type: 'daily_focus' } }, update: {}, create: { userId: alex.id, type: 'daily_focus', current: 12, longest: 16, lastActiveAt: daysAgo(0) } })
  console.log('  ✓ Streaks')

  // UserBadges (badge is a plain String here, no FK)
  const userBadgeRows = [
    { user: sarah, badges: ['first-focus', 'pomodoro-master', 'streak-7'] },
    { user: marcus, badges: ['first-focus', 'streak-7'] },
    { user: emma, badges: ['first-focus'] },
    { user: alex, badges: ['first-focus', 'pomodoro-master', 'deep-worker', 'streak-7'] },
  ]
  for (const { user, badges } of userBadgeRows) {
    for (const badge of badges) {
      await prisma.userBadge.upsert({ where: { userId_badge: { userId: user.id, badge } }, update: {}, create: { userId: user.id, badge, tier: badge.includes('streak') ? 'silver' : 'bronze', earnedAt: daysAgo(10) } })
    }
  }
  console.log('  ✓ User Badges')

  // Goals for Sarah
  await prisma.goal.createMany({ data: [
    { userId: sarah.id, title: 'Complete 200 focus sessions this quarter', status: 'active', progress: 47 },
    { userId: sarah.id, title: 'Finish authentication refactor', targetDate: daysAgo(-14), status: 'active', progress: 30, description: 'Complete OAuth integration and clean up legacy auth middleware.' },
    { userId: sarah.id, title: 'Read 6 productivity books this year', targetDate: daysAgo(-270), status: 'active', progress: 2 },
  ]})
  console.log('  ✓ Goals')

  // Daily Logs for Sarah (last 14 days)
  for (let i = 1; i <= 14; i++) {
    const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0,0,0,0)
    try {
      await prisma.dailyLog.upsert({
        where: { userId_date: { userId: sarah.id, date: d } },
        update: {},
        create: { userId: sarah.id, date: d, focusMins: 100 + Math.floor(Math.random() * 80), tasksCompleted: 1 + Math.floor(Math.random() * 3), sessionsCount: 4 + Math.floor(Math.random() * 3), xpEarned: 80 + Math.floor(Math.random() * 95), mood: Math.random() > 0.3 ? 'great' : 'good' },
      })
    } catch { /* skip */ }
  }
  console.log('  ✓ Daily Logs')

  // User Achievements
  const achRows = [
    { user: sarah, items: [['badge','first_focus_session'],['streak','seven_day_streak'],['milestone','50_sessions']] },
    { user: marcus, items: [['badge','first_focus_session']] },
    { user: emma, items: [['badge','first_focus_session']] },
  ]
  for (const { user, items } of achRows) {
    for (const [type, name] of items) {
      await prisma.userAchievement.upsert({ where: { userId_type_name: { userId: user.id, type, name } }, update: {}, create: { userId: user.id, type, name } })
    }
  }
  console.log('  ✓ Achievements')

  // Coach Messages for Sarah
  const coachMsgs = [
    { role: 'user', content: 'I always feel most productive in the morning but afternoon is a real struggle. Any advice?' },
    { role: 'assistant', content: "Your session data confirms this! You've completed 73% of your focus sessions between 8am-12pm. For afternoons, try a 10-minute 'activation ritual' — a short walk, then start with your smallest, clearest task. The hardest part of an afternoon session is starting. Your overall completion rate is 87%, which is excellent — you just need a bridge into the afternoon." },
    { role: 'user', content: 'I keep getting distracted during longer sessions. My 90-minute blocks rarely finish.' },
    { role: 'assistant', content: "Your data shows 90-minute sessions at 62% completion vs 94% for 25-minute Pomodoros. This is extremely common — 90 minutes is at the edge of most people's ultradian rhythm peak. Try 50-minute deep work blocks with 10-minute breaks. Also: phone in another room, not face-down on your desk. The mere presence of a smartphone reduces cognitive capacity even when it's off." },
    { role: 'user', content: "What should I focus on today?" },
    { role: 'assistant', content: "Based on your task list and energy patterns: the authentication refactor has been in queue 5 days and is high priority. You have 3 good morning hours. My recommendation: 2 Pomodoros on auth refactor (the hardest thing first), then Q1 report drafting before lunch. Your Friday afternoons historically show low completion — save the PR review for then. You're at 47/200 sessions for the quarter — today could push you to 51 if you hit your daily goal." },
  ]
  for (const msg of coachMsgs) {
    await prisma.coachMessage.create({ data: { userId: sarah.id, ...msg } })
  }
  console.log('  ✓ Coach Messages')

  // Quests for Sarah (today)
  const today = todayDate()
  const questRows = [
    { slug: 'daily-focus', title: 'Complete 3 focus sessions', target: 3, progress: 2, completed: false, xpReward: 45, type: 'daily' },
    { slug: 'deep-work', title: 'Complete a 50+ minute session', target: 1, progress: 1, completed: true, xpReward: 30, type: 'daily', completedAt: daysAgo(0) },
    { slug: 'task-complete', title: 'Complete 1 task today', target: 1, progress: 0, completed: false, xpReward: 25, type: 'daily' },
  ]
  for (const q of questRows) {
    try {
      await prisma.quest.upsert({
        where: { userId_slug_date: { userId: sarah.id, slug: q.slug, date: today } },
        update: {},
        create: { userId: sarah.id, ...q, date: today, completedAt: q.completedAt ?? null },
      })
    } catch { /* skip */ }
  }
  console.log('  ✓ Quests')

  // Team
  const team = await prisma.team.create({ data: { name: 'Engineering Team', description: "Sarah's development team" } })
  await prisma.teamMember.upsert({ where: { userId_teamId: { userId: sarah.id, teamId: team.id } }, update: {}, create: { userId: sarah.id, teamId: team.id, role: 'admin' } })
  await prisma.teamMember.upsert({ where: { userId_teamId: { userId: marcus.id, teamId: team.id } }, update: {}, create: { userId: marcus.id, teamId: team.id, role: 'member' } })
  console.log('  ✓ Team')

  // Notifications
  await prisma.notification.createMany({ data: [
    { userId: sarah.id, type: 'achievement', title: 'Badge Earned: Pomodoro Master 🍅', body: "You completed 4 focus sessions in a single day. Your consistency is building real momentum.", read: false, createdAt: daysAgo(2) },
    { userId: sarah.id, type: 'coach', title: 'AI Insight Ready', body: "Your peak focus hours analysis is ready. You're most productive between 9-11am.", read: false, createdAt: daysAgo(1) },
    { userId: sarah.id, type: 'streak', title: 'Streak Milestone: 14 Days! 🔥', body: "Two weeks of consistent daily focus. You're in the top 10% of FocusFlow users.", read: true, createdAt: daysAgo(2) },
    { userId: sarah.id, type: 'reminder', title: 'Time to Focus', body: "You haven't started a session today. Your best focus window starts in 30 minutes.", read: true, createdAt: daysAgo(0) },
    { userId: marcus.id, type: 'achievement', title: 'Badge Earned: 7-Day Streak 🔥', body: "You've focused every day for a week. Consistency is the compound interest of productivity.", read: true, createdAt: daysAgo(4) },
    { userId: emma.id, type: 'welcome', title: 'Welcome to FocusFlow! 🎯', body: "Start your first focus session to begin building your productivity streak.", read: true, createdAt: daysAgo(3) },
  ]})
  console.log('  ✓ Notifications')

  // Audit Logs
  await prisma.auditLog.createMany({ data: [
    { userId: sarah.id, action: 'task_created', entity: 'task', entityId: 'task-s-1', details: { title: 'Refactor authentication module' } },
    { userId: sarah.id, action: 'session_completed', entity: 'focus_session', details: { durationMins: 50, taskId: 'task-s-2' } },
    { userId: admin.id, action: 'user_viewed', entity: 'user', entityId: sarah.id },
    { userId: admin.id, action: 'plan_updated', entity: 'plan', details: { slug: 'pro', field: 'priceMonthly', value: 999 } },
  ]})
  console.log('  ✓ Audit Logs')

  // Analytics Events
  await prisma.analyticsEvent.createMany({ data: [
    { userId: sarah.id, event: 'session_completed', properties: { durationMins: 25, completed: true }, createdAt: daysAgo(0) },
    { userId: sarah.id, event: 'task_completed', properties: { taskId: 'task-s-4', estimatedMins: 30 }, createdAt: daysAgo(2) },
    { userId: sarah.id, event: 'badge_earned', properties: { badge: 'pomodoro-master' }, createdAt: daysAgo(2) },
    { userId: marcus.id, event: 'session_completed', properties: { durationMins: 50 }, createdAt: daysAgo(1) },
  ]})
  console.log('  ✓ Analytics Events')

  // Focus Techniques
  const defaultTechniques = [
    {
      name: 'Classic Pomodoro',
      slug: 'classic-pomodoro',
      category: 'deep_work',
      description: 'The original Pomodoro Technique. Work in focused 25-minute intervals with short breaks to maintain consistent productivity throughout the day.',
      instructions: ['Choose a task to focus on', 'Set the timer for 25 minutes and commit to focused work', 'Work until the timer rings — avoid all distractions', 'Take a 5-minute break: stretch, hydrate, rest your eyes', 'After 4 cycles, take a longer 15-20 minute break'],
      durationMins: 25, breakMins: 5, cycles: 4, difficulty: 'beginner',
      benefits: ['Builds consistent focus habits', 'Reduces decision fatigue', 'Easy to track progress'],
      ambientSound: null, sortOrder: 0,
    },
    {
      name: 'Deep Work Sprint',
      slug: 'deep-work-sprint',
      category: 'deep_work',
      description: 'Extended focus sessions for complex, cognitively demanding work. Best for tasks that require sustained concentration like writing, coding, or analysis.',
      instructions: ['Eliminate all distractions — close notifications, put phone away', 'Define a clear outcome for this sprint', 'Set the timer for 90 minutes of uninterrupted deep work', 'If your mind wanders, note the thought and return to the task', 'Take a full 15-minute recovery break between sprints'],
      durationMins: 90, breakMins: 15, cycles: 2, difficulty: 'advanced',
      benefits: ['Maximum cognitive output', 'Ideal for complex problems', 'Builds deep focus endurance'],
      ambientSound: 'white_noise', sortOrder: 1,
    },
    {
      name: 'Creative Flow',
      slug: 'creative-flow',
      category: 'creative',
      description: 'Designed for creative work like design, writing, or brainstorming. Longer sessions allow you to enter a flow state with moderate breaks to refresh perspective.',
      instructions: ['Set your creative intention — what are you creating?', 'Spend the first 5 minutes brainstorming freely without judgment', 'Transition into focused creation for the remaining time', 'During breaks, step away completely — walk, look at nature', 'Return with fresh eyes for the next cycle'],
      durationMins: 45, breakMins: 10, cycles: 3, difficulty: 'intermediate',
      benefits: ['Encourages flow states', 'Balances structure with freedom', 'Refreshes creative perspective'],
      ambientSound: 'cafe', sortOrder: 2,
    },
    {
      name: 'Learning Block',
      slug: 'learning-block',
      category: 'learning',
      description: 'Optimized for studying, reading, or learning new skills. Uses spaced intervals that align with how your brain consolidates new information.',
      instructions: ['Gather your learning materials before starting', 'Spend 30 minutes actively engaging with the material', 'Take notes, summarize key concepts, or practice skills', 'During breaks, try to recall what you just learned', 'Each new cycle, briefly review previous material before continuing'],
      durationMins: 30, breakMins: 5, cycles: 4, difficulty: 'beginner',
      benefits: ['Optimized for memory retention', 'Active recall during breaks', 'Prevents cognitive overload'],
      ambientSound: 'nature', sortOrder: 3,
    },
    {
      name: 'Energy Burst',
      slug: 'energy-burst',
      category: 'energy',
      description: 'Short, high-intensity focus sprints for when your energy is low or for quick tasks. Get through small items rapidly with frequent micro-breaks.',
      instructions: ['List 2-3 small tasks you want to complete', 'Set the timer for 15 minutes and work with high intensity', 'Focus on completing tasks — speed over perfection', 'Take a 3-minute active break: stand, stretch, move', 'Repeat for remaining cycles — celebrate each completion'],
      durationMins: 15, breakMins: 3, cycles: 6, difficulty: 'beginner',
      benefits: ['Fights procrastination', 'Builds momentum quickly', 'Great for low-energy periods'],
      ambientSound: 'rain', sortOrder: 4,
    },
    {
      name: 'Mindful Focus',
      slug: 'mindful-focus',
      category: 'mindfulness',
      description: 'Combines focused work with mindfulness practices. Begin each session with a brief centering exercise to work with calm, intentional awareness.',
      instructions: ['Start with 2 minutes of deep breathing to center yourself', 'Set a clear intention for this work session', 'Work mindfully for 20 minutes — notice when you drift and gently return', 'During breaks, practice a brief body scan or gratitude reflection', 'Approach the next cycle with renewed calm awareness'],
      durationMins: 20, breakMins: 5, cycles: 3, difficulty: 'beginner',
      benefits: ['Reduces work-related stress', 'Builds mindful awareness', 'Improves focus quality over quantity'],
      ambientSound: 'nature', sortOrder: 5,
    },
  ]
  const additionalTechniques = [
    {
      name: 'Pomodoro Plus',
      slug: 'pomodoro-plus',
      category: 'deep_work',
      description: 'Classic Pomodoro with 3-min movement break every 2 cycles. Combines the proven 25-minute focus interval with active recovery to sustain energy and reduce sedentary fatigue throughout long work sessions.',
      instructions: ['Set your timer for 25 minutes and begin focused work', 'Take a 5-minute rest break after each cycle', 'After every 2 cycles, add a 3-minute movement break (stretching, walking)', 'Complete 4 total cycles for a full session', 'Track how movement breaks affect your afternoon energy levels'],
      durationMins: 25, breakMins: 5, cycles: 4, difficulty: 'beginner',
      benefits: ['Combines proven Pomodoro with active recovery', 'Reduces sedentary fatigue', 'Maintains energy across long sessions'],
      ambientSound: null, sortOrder: 6,
    },
    {
      name: 'DeskTime Method',
      slug: 'desktime-method',
      category: 'deep_work',
      description: 'Based on Draugiem Group research — the most productive workers work for 52 minutes then break for 17. This rhythm maximizes sustained output while preventing burnout.',
      instructions: ['Set timer for 52 minutes of uninterrupted work', 'Work with full intensity — treat it as a sprint', 'When the timer rings, step away completely for 17 minutes', 'During breaks, avoid screens — walk, stretch, or chat', 'Repeat for up to 3 cycles per session'],
      durationMins: 52, breakMins: 17, cycles: 3, difficulty: 'intermediate',
      benefits: ['Research-backed optimal work rhythm', 'Higher sustained output than shorter intervals', 'Prevents cognitive depletion'],
      ambientSound: 'cafe', sortOrder: 7,
    },
    {
      name: 'Ultradian Sprint',
      slug: 'ultradian-sprint',
      category: 'energy',
      description: 'Aligned with Kleitman\'s 90-minute biological cycles (BRAC). Works with your body\'s natural Basic Rest-Activity Cycle for maximum cognitive output during each ultradian peak.',
      instructions: ['Begin at the start of an energy peak — use your chronotype data', 'Set the timer for 90 minutes of deep, unbroken focus', 'Work through natural micro-dips — they pass within minutes', 'Take a full 20-minute recovery break between sprints', 'Limit to 2 sprints per day for sustainable performance'],
      durationMins: 90, breakMins: 20, cycles: 2, difficulty: 'advanced',
      benefits: ['Aligns with your biological rhythms', 'Maximum depth per session', 'Builds elite-level focus endurance'],
      ambientSound: 'white_noise', sortOrder: 8,
    },
    {
      name: 'Creative Incubation',
      slug: 'creative-incubation',
      category: 'creative',
      description: 'Focused work + walking break for subconscious incubation. Leverages the Zeigarnik effect — your brain continues processing unsolved problems during breaks, often producing breakthrough insights.',
      instructions: ['Define a creative challenge or problem to solve', 'Work intensely for 30 minutes — brainstorm, draft, explore', 'Take a 15-minute walking break — no phone, let your mind wander', 'Return and capture any new ideas that surfaced', 'Repeat for 3 cycles, noticing how insights deepen each round'],
      durationMins: 30, breakMins: 15, cycles: 3, difficulty: 'intermediate',
      benefits: ['Harnesses subconscious problem-solving', 'Walking boosts creative output by 60%', 'Alternates divergent and convergent thinking'],
      ambientSound: 'nature', sortOrder: 9,
    },
    {
      name: 'Meeting Recovery',
      slug: 'meeting-recovery',
      category: 'mindfulness',
      description: 'Micro-sessions to recover focus after meetings. Meetings drain attention through context-switching. These short blocks help you re-center and transition back to productive deep work.',
      instructions: ['After a meeting, take 2 minutes of silence to decompress', 'Write down 1-3 action items from the meeting', 'Set timer for 10 minutes and tackle one small task', 'Take a 2-minute breath break between micro-sessions', 'After 3 cycles (36 min), you are fully re-engaged'],
      durationMins: 10, breakMins: 2, cycles: 3, difficulty: 'beginner',
      benefits: ['Recovers focus after context-switching', 'Captures meeting action items immediately', 'Smooth transition back to deep work'],
      ambientSound: null, sortOrder: 10,
    },
    {
      name: 'Evening Wind-Down',
      slug: 'evening-wind-down',
      category: 'mindfulness',
      description: 'Gentle review session — reflect on the day, plan tomorrow. This single-cycle ritual closes open loops, reduces evening anxiety, and sets clear intentions for the next day.',
      instructions: ['Review what you accomplished today — celebrate wins', 'Note any unfinished tasks and decide: defer, delegate, or drop', 'Write your top 3 priorities for tomorrow', 'Set out your workspace so it is ready for morning focus', 'End with 2 minutes of gratitude or calm breathing'],
      durationMins: 20, breakMins: 0, cycles: 1, difficulty: 'beginner',
      benefits: ['Closes open loops to reduce evening anxiety', 'Next-day planning reduces morning decision fatigue', 'Builds a sustainable daily rhythm'],
      ambientSound: 'nature', sortOrder: 11,
    },
  ]

  const allTechniques = [...defaultTechniques, ...additionalTechniques]
  for (const t of allTechniques) {
    await prisma.focusTechnique.upsert({ where: { slug: t.slug }, update: t, create: t })
    console.log(`  ✓ Technique: ${t.name}`)
  }
  console.log(`  ✓ ${allTechniques.length} Focus Techniques`)

  // AI Configs
  const aiConfigs = [
    {
      contentType: 'focus_technique',
      model: 'gpt-4o-mini',
      temperature: 0.9,
      maxTokens: 800,
      systemPrompt: 'You are a productivity and focus expert. Return valid JSON only, no markdown fences.',
      isActive: true,
    },
    {
      contentType: 'blog_post',
      model: 'gpt-4o-mini',
      temperature: 0.8,
      maxTokens: 1500,
      systemPrompt: 'You are an expert content writer specializing in productivity, focus, and deep work. Return ONLY valid JSON, no markdown fences.',
      isActive: true,
    },
  ]
  for (const cfg of aiConfigs) {
    await prisma.aIConfig.upsert({
      where: { contentType: cfg.contentType },
      update: {},
      create: cfg,
    })
  }
  console.log('  ✓ AI Configs')

  console.log('\n🎉 FocusFlow seed complete!')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1) })
