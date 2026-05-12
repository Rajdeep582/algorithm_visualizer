import { motion } from 'framer-motion'
import { Mail, Linkedin, Github, ExternalLink } from 'lucide-react'

const LINKS = [
  {
    icon: Mail,
    label: 'Email',
    value: 'rajdeepbiswas272@gmail.com',
    href: 'mailto:rajdeepbiswas272@gmail.com',
    color: '#f87171',
    bg: 'rgba(248,113,113,0.08)',
    border: 'rgba(248,113,113,0.2)',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'linkedin.com/in/rajdeep-biswas-',
    href: 'https://www.linkedin.com/in/rajdeep-biswas-',
    color: '#60a5fa',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.2)',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'github.com/Rajdeep582',
    href: 'https://github.com/Rajdeep582',
    color: '#a78bfa',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.2)',
  },
]

export default function ContactPage() {
  return (
    <div className="max-w-xl mx-auto px-8 py-16">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs"
          style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#8b5cf6' }}>
          <Mail size={11} /><span>Contact</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3" style={{ color: '#f0f0f8' }}>
          Get in touch
        </h1>
        <p className="text-sm mb-10" style={{ color: '#8888aa' }}>
          Have feedback, found a bug, or just want to say hi? Reach out on any of these.
        </p>

        <div className="space-y-3">
          {LINKS.map((l, i) => (
            <motion.a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              whileHover={{ scale: 1.02, boxShadow: `0 8px 30px ${l.bg}` }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-4 rounded-xl px-5 py-4 group"
              style={{
                background: '#0d0d16',
                border: `1px solid rgba(255,255,255,0.06)`,
                textDecoration: 'none',
                transition: 'border-color 0.12s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = l.border }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: l.bg, border: `1px solid ${l.border}` }}>
                <l.icon size={18} style={{ color: l.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs mb-0.5" style={{ color: '#555570' }}>{l.label}</div>
                <div className="text-sm font-medium truncate" style={{ color: '#f0f0f8' }}>{l.value}</div>
              </div>
              <ExternalLink size={14} style={{ color: '#333350', flexShrink: 0 }} />
            </motion.a>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
