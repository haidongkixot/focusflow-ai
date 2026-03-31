import { Check, X, Zap, Crown } from 'lucide-react'
import Link from 'next/link'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started with the basics',
    icon: Zap,
    features: [
      { text: 'Up to 10 tasks', included: true },
      { text: '3 focus sessions per day', included: true },
      { text: 'Basic timer & task management', included: true },
      { text: 'Daily progress tracking', included: true },
      { text: 'AI Productivity Coach', included: false },
      { text: 'Unlimited tasks & sessions', included: false },
      { text: 'Advanced focus modes', included: false },
      { text: 'Detailed analytics', included: false },
    ],
    cta: 'Get Started Free',
    href: '/signup',
    accent: false,
  },
  {
    name: 'Pro',
    price: '$4.99',
    period: '/month',
    description: 'Unlock your full productivity potential',
    icon: Crown,
    features: [
      { text: 'Unlimited tasks', included: true },
      { text: 'Unlimited focus sessions', included: true },
      { text: 'AI Productivity Coach', included: true },
      { text: 'Advanced focus modes', included: true },
      { text: 'Detailed analytics & insights', included: true },
      { text: 'Priority support', included: true },
      { text: 'Custom categories & tags', included: true },
      { text: 'Team collaboration', included: true },
    ],
    cta: 'Start Pro Trial',
    href: '/signup?plan=pro',
    accent: true,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Start free and upgrade when you need more. No hidden fees, cancel anytime.
        </p>
      </div>

      {/* Plans */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 ${
                plan.accent
                  ? 'bg-bg-surface border-2 border-accent-400 shadow-glow'
                  : 'bg-bg-surface border border-gray-800'
              }`}
            >
              {plan.accent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-400 text-white text-xs font-bold rounded-full">
                  MOST POPULAR
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${plan.accent ? 'bg-accent-400/10' : 'bg-bg-elevated'}`}>
                  <plan.icon className={`w-5 h-5 ${plan.accent ? 'text-accent-400' : 'text-text-secondary'}`} />
                </div>
                <h2 className="text-xl font-bold text-text-primary">{plan.name}</h2>
              </div>

              <div className="mb-2">
                <span className="text-4xl font-bold text-text-primary">{plan.price}</span>
                <span className="text-text-muted ml-1">{plan.period}</span>
              </div>
              <p className="text-text-secondary text-sm mb-6">{plan.description}</p>

              <Link
                href={plan.href}
                className={`block w-full text-center py-3 rounded-xl font-semibold transition-all duration-200 mb-8 ${
                  plan.accent
                    ? 'bg-accent-400 text-white hover:bg-accent-500 shadow-glow'
                    : 'border border-gray-700 text-text-primary hover:bg-bg-elevated'
                }`}
              >
                {plan.cta}
              </Link>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="w-4 h-4 text-success flex-shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-text-muted flex-shrink-0" />
                    )}
                    <span className={feature.included ? 'text-text-primary text-sm' : 'text-text-muted text-sm'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
