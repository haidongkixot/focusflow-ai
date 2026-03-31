export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg-base">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-4xl font-bold text-text-primary tracking-tight mb-2">Terms of Service</h1>
        <p className="text-text-muted text-sm mb-12">Last updated: March 2026</p>

        <div className="prose-custom space-y-10">
          <section>
            <p className="text-text-secondary leading-relaxed">
              FocusFlow AI is a product of <strong className="text-text-primary">PeeTeeAI</strong>.
              By accessing or using FocusFlow AI, you agree to be bound by these Terms of Service.
              If you do not agree, please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">1. Acceptance of Terms</h2>
            <p className="text-text-secondary leading-relaxed">
              By creating an account or using FocusFlow AI, you acknowledge that you have read,
              understood, and agree to be bound by these Terms of Service and our Privacy Policy.
              You must be at least 13 years of age to use this service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">2. Description of Service</h2>
            <p className="text-text-secondary leading-relaxed">
              FocusFlow AI provides AI-powered productivity tools including a Pomodoro timer,
              task management, productivity analytics, and AI coaching. The service is provided
              &ldquo;as is&rdquo; and may be updated, modified, or discontinued at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">3. User Accounts</h2>
            <ul className="list-disc list-inside text-text-secondary space-y-2 ml-2">
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must provide accurate and complete information</li>
              <li>You may not share your account credentials with others</li>
              <li>You are responsible for all activity under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">4. Acceptable Use</h2>
            <p className="text-text-secondary leading-relaxed mb-3">You agree not to:</p>
            <ul className="list-disc list-inside text-text-secondary space-y-2 ml-2">
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any part of the service</li>
              <li>Interfere with or disrupt the service or its infrastructure</li>
              <li>Reverse engineer, decompile, or disassemble the service</li>
              <li>Use the service to harass, abuse, or harm others</li>
              <li>Scrape or collect data from the service without authorization</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">5. Intellectual Property</h2>
            <p className="text-text-secondary leading-relaxed">
              FocusFlow AI, its logo, design, and all related content are the intellectual property
              of PeeTeeAI. You retain ownership of any data you input into the service. By using
              the service, you grant us a limited license to process your data as needed to provide
              the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">6. AI-Generated Content</h2>
            <p className="text-text-secondary leading-relaxed">
              FocusFlow AI uses artificial intelligence to generate coaching advice, analytics,
              and recommendations. AI-generated content is for informational purposes only and
              should not be considered professional advice. We do not guarantee the accuracy or
              completeness of AI-generated content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">7. Limitation of Liability</h2>
            <p className="text-text-secondary leading-relaxed">
              To the maximum extent permitted by law, PeeTeeAI shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages arising from
              your use of FocusFlow AI. Our total liability shall not exceed the amount you
              paid for the service in the preceding twelve months.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">8. Termination</h2>
            <p className="text-text-secondary leading-relaxed">
              We reserve the right to suspend or terminate your account at our discretion if
              you violate these Terms. You may delete your account at any time. Upon termination,
              your right to use the service ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">9. Changes to Terms</h2>
            <p className="text-text-secondary leading-relaxed">
              We may modify these Terms at any time. Continued use of the service after changes
              constitutes acceptance of the updated Terms. Material changes will be communicated
              via email or in-app notification.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">10. Contact</h2>
            <p className="text-text-secondary leading-relaxed">
              For questions about these Terms, contact us at{' '}
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
