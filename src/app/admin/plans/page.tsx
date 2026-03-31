import prisma from '@/lib/prisma'

export default async function AdminPlansPage() {
  const plans = await prisma.plan.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Plans</h1>
        <p className="text-text-secondary text-sm mt-1">Subscription plans and pricing configuration</p>
      </div>

      {plans.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-3">💳</div>
          <p className="text-text-secondary">No plans configured yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.id} className={`card ${plan.isActive ? 'border-accent-400/30' : 'opacity-60'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${plan.isActive ? 'bg-accent-400/20 text-accent-400' : 'bg-bg-elevated text-text-muted'}`}>
                  {plan.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
              <h3 className="text-lg font-bold capitalize">{plan.name}</h3>
              <p className="text-3xl font-bold text-accent-400 mt-2">
                ${plan.price}<span className="text-sm text-text-muted">/{plan.interval}</span>
              </p>
              <div className="mt-4 space-y-1">
                {Array.isArray(plan.features) && (plan.features as string[]).slice(0, 4).map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                    <span className="text-accent-400">✓</span> {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
