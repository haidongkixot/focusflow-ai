export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg-base">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-4xl font-bold text-text-primary tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-text-muted text-sm mb-12">Last updated: March 2026</p>

        <div className="prose-custom space-y-10">
          <section>
            <p className="text-text-secondary leading-relaxed">
              FocusFlow AI is operated by <strong className="text-text-primary">PeeTeeAI</strong>.
              This Privacy Policy explains how we collect, use, and protect your information when
              you use FocusFlow AI. Contact us at{' '}
              <a href="mailto:hai@eagodi.com" className="text-accent-400 hover:text-accent-300 transition">
                hai@eagodi.com
              </a>{' '}
              with any questions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">1. Information We Collect</h2>
            <p className="text-text-secondary leading-relaxed mb-3">We collect information you provide directly:</p>
            <ul className="list-disc list-inside text-text-secondary space-y-2 ml-2">
              <li>Account information (name, email address) when you create an account</li>
              <li>Task data, timer sessions, and productivity metrics you input</li>
              <li>AI coaching interactions and preferences</li>
              <li>Usage data and analytics to improve the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-text-secondary space-y-2 ml-2">
              <li>To provide and maintain FocusFlow AI services</li>
              <li>To personalize your AI coaching experience</li>
              <li>To generate productivity analytics and insights</li>
              <li>To improve our services and develop new features</li>
              <li>To communicate with you about your account and updates</li>
              <li>To ensure security and prevent abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">3. Data Storage and Security</h2>
            <p className="text-text-secondary leading-relaxed">
              Your data is stored securely using industry-standard encryption. We use secure cloud
              infrastructure to protect your information. We do not sell your personal data to third
              parties. Access to user data is restricted to authorized personnel only.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">4. Your Rights</h2>
            <p className="text-text-secondary leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc list-inside text-text-secondary space-y-2 ml-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of non-essential communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">5. Cookies and Tracking</h2>
            <p className="text-text-secondary leading-relaxed">
              FocusFlow AI uses essential cookies to maintain your session and preferences.
              We use analytics tools to understand usage patterns and improve the service.
              You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">6. Third-Party Services</h2>
            <p className="text-text-secondary leading-relaxed">
              FocusFlow AI integrates with third-party services for authentication, AI processing,
              and analytics. These services have their own privacy policies. We only share the
              minimum data necessary for these services to function.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">7. Changes to This Policy</h2>
            <p className="text-text-secondary leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any
              material changes by posting the new policy on this page and updating the
              &ldquo;Last updated&rdquo; date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">8. Contact</h2>
            <p className="text-text-secondary leading-relaxed">
              For any questions about this Privacy Policy or your data, contact us at{' '}
              <a href="mailto:hai@eagodi.com" className="text-accent-400 hover:text-accent-300 transition">
                hai@eagodi.com
              </a>.
            </p>
            <p className="text-text-secondary leading-relaxed mt-3">
              FocusFlow AI is a product of{' '}
              <a href="https://peeteeai-web.vercel.app" target="_blank" rel="noopener noreferrer" className="text-accent-400 hover:text-accent-300 transition">
                PeeTeeAI
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
