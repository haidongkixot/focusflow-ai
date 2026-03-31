import { Mail, Clock, ArrowRight, ExternalLink } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bg-base">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-4xl font-bold text-text-primary tracking-tight mb-3">Contact Us</h1>
        <p className="text-text-secondary text-lg mb-12">
          FocusFlow AI is developed by{' '}
          <a
            href="https://peeteeai-web.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-400 hover:text-accent-300 transition"
          >
            PeeTeeAI
          </a>
          . We are here to help.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {/* Email */}
          <div className="card">
            <Mail className="w-6 h-6 text-accent-400 mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">Email</h3>
            <a
              href="mailto:hai@eagodi.com"
              className="text-accent-400 hover:text-accent-300 transition text-sm"
            >
              hai@eagodi.com
            </a>
            <p className="text-text-muted text-xs mt-2">
              For support, feedback, and general inquiries
            </p>
          </div>

          {/* Response Time */}
          <div className="card">
            <Clock className="w-6 h-6 text-accent-400 mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">Response Time</h3>
            <p className="text-text-secondary text-sm">Within 24 hours</p>
            <p className="text-text-muted text-xs mt-2">
              Monday through Friday, 9 AM - 6 PM (GMT+7)
            </p>
          </div>
        </div>

        {/* What to include */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-text-primary mb-4">When Reaching Out</h2>
          <div className="card bg-bg-elevated/30">
            <ul className="space-y-3 text-text-secondary text-sm">
              <li className="flex items-start gap-2">
                <span className="text-accent-400 mt-0.5">--</span>
                Include your account email if reporting a bug
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400 mt-0.5">--</span>
                Describe the issue or question in detail
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400 mt-0.5">--</span>
                Attach screenshots if relevant
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400 mt-0.5">--</span>
                For feature requests, describe your use case
              </li>
            </ul>
          </div>
        </section>

        {/* PeeTeeAI link */}
        <section className="card border-accent-400/20">
          <h2 className="text-lg font-semibold text-text-primary mb-2">PeeTeeAI Headquarters</h2>
          <p className="text-text-secondary text-sm mb-4">
            For company-level inquiries, partnerships, or press, visit the PeeTeeAI contact page.
          </p>
          <a
            href="https://peeteeai-web.vercel.app/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent-400 hover:text-accent-300 font-medium text-sm transition"
          >
            PeeTeeAI Contact <ExternalLink className="w-4 h-4" />
          </a>
        </section>
      </div>
    </div>
  )
}
