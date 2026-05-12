import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Cpu, GitBranch, Zap } from 'lucide-react'
import { NAVIGATION } from '../../data/navigation'
import { cn } from '../../lib/utils'

const categoryIcons = {
  'data-structures': GitBranch,
  'algorithms': Zap,
}

export default function Sidebar({ open, onToggle, activeId, onSelect }) {
  const [expanded, setExpanded] = useState({ 'data-structures': true, 'algorithms': true })
  const ref = useRef(null)

  // Click outside → collapse
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onToggle()
      }
    }
    // small delay so the toggle-open click doesn't immediately close
    const timer = setTimeout(() => document.addEventListener('mousedown', handler), 50)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handler)
    }
  }, [open, onToggle])

  const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }))

  return (
    <motion.aside
      ref={ref}
      initial={false}
      animate={{ width: open ? 240 : 0, opacity: open ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex-shrink-0 overflow-hidden"
      style={{
        background: '#0d0d16',
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div className="w-60 h-full flex flex-col">
        {/* Logo — no X button */}
        <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}>
            <Cpu size={14} color="white" />
          </div>
          <span className="font-semibold text-sm tracking-tight" style={{ color: '#f0f0f8' }}>AlgoViz</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {NAVIGATION.map(section => {
            const Icon = categoryIcons[section.id]
            const isExpanded = expanded[section.id]

            return (
              <div key={section.id} className="mb-1">
                <button
                  onClick={() => toggle(section.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium uppercase tracking-widest transition-colors"
                  style={{ color: '#555570' }}
                >
                  {Icon && <Icon size={11} />}
                  <span>{section.label}</span>
                  <motion.div
                    className="ml-auto"
                    animate={{ rotate: isExpanded ? 0 : -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={11} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="ml-1 mt-0.5 space-y-0.5">
                        {section.items.map(item => {
                          const isActive = activeId === item.id
                          const isComingSoon = item.status === 'coming-soon'

                          return (
                            <motion.button
                              key={item.id}
                              onClick={() => !isComingSoon && onSelect?.(item.id)}
                              whileHover={{ x: isComingSoon ? 0 : 2 }}
                              className={cn(
                                'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all text-left',
                                isActive
                                  ? 'text-white'
                                  : isComingSoon
                                  ? 'cursor-default'
                                  : 'hover:text-white cursor-pointer'
                              )}
                              style={{
                                color: isActive ? '#f0f0f8' : isComingSoon ? '#333350' : '#8888aa',
                                background: isActive ? 'rgba(139,92,246,0.15)' : 'transparent',
                                border: isActive ? '1px solid rgba(139,92,246,0.25)' : '1px solid transparent',
                              }}
                            >
                              <span className="flex-1">{item.label}</span>
                              {isComingSoon && (
                                <span className="text-xs rounded px-1.5 py-0.5" style={{ background: 'rgba(255,255,255,0.04)', color: '#444460', fontSize: '10px' }}>
                                  soon
                                </span>
                              )}
                              {isActive && (
                                <motion.div
                                  layoutId="active-dot"
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ background: '#8b5cf6' }}
                                />
                              )}
                            </motion.button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-xs" style={{ color: '#333350' }}>Algorithm Visualizer v1.0</p>
        </div>
      </div>
    </motion.aside>
  )
}
