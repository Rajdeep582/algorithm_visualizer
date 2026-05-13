import { motion } from 'framer-motion'

export default function PageLayout({ title, subtitle, tag, children }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:px-8 sm:py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        {tag && (
          <span
            className="inline-block px-2.5 py-1 rounded-md text-xs font-medium mb-3 uppercase tracking-wider"
            style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)' }}
          >
            {tag}
          </span>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2" style={{ color: '#f0f0f8' }}>{title}</h1>
        {subtitle && <p className="text-base" style={{ color: '#8888aa' }}>{subtitle}</p>}
        <div className="mt-4 h-px" style={{ background: 'linear-gradient(90deg, rgba(139,92,246,0.4), transparent)' }} />
      </motion.div>

      {children}
    </div>
  )
}
