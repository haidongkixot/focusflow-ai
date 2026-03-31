export default function AdminCmsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Blog / CMS</h1>
        <p className="text-text-secondary text-sm mt-1">Manage published content and blog posts</p>
      </div>
      <div className="card text-center py-16">
        <div className="text-5xl mb-4">📝</div>
        <h2 className="text-xl font-bold mb-2">Content Management</h2>
        <p className="text-text-secondary mb-6 max-w-sm mx-auto">Blog CMS is being set up. Once the BlogPost model is added to the schema and migrated, you will be able to create and publish articles here.</p>
        <div className="bg-bg-elevated border border-gray-700 rounded-xl p-4 text-left max-w-sm mx-auto">
          <p className="text-xs text-text-muted font-mono">npx prisma migrate dev --name add-blog</p>
        </div>
      </div>
    </div>
  )
}
