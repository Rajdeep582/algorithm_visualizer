import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Cpu, GitBranch, Zap, Brain } from 'lucide-react'
import { NAVIGATION } from '../../data/navigation'
import { cn } from '../../lib/utils'

const categoryIcons = {
  'data-structures': GitBranch,
  'algorithms': Zap,
  'artificial-intelligence': Brain,
}

export default function Sidebar({ open, onToggle, activeId, onSelect }) {
  const [expanded, setExpanded] = useState({ 'data-structures': true, 'algorithms': true })
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)
  const ref = useRef(null)

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  // Click outside → collapse
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onToggle()
      }
    }
    const timer = setTimeout(() => document.addEventListener('mousedown', handler), 50)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handler)
    }
  }, [open, onToggle])

  const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }))

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {open && isMobile && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

    <motion.aside
      ref={ref}
      initial={false}
      animate={
        isMobile
          ? { x: open ? 0 : -244 }
          : { width: open ? 240 : 0, opacity: open ? 1 : 0 }
      }
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      className={isMobile ? '' : 'flex-shrink-0 overflow-hidden'}
      style={{
        background: '#0d0d16',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        ...(isMobile ? {
          position: 'fixed',
          left: 0, top: 0,
          height: '100vh',
          width: 244,
          zIndex: 50,
          overflowX: 'hidden',
          overflowY: 'auto',
        } : {}),
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
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {NAVIGATION.map(section => {
            const Icon = categoryIcons[section.id]
            const isExpanded = expanded[section.id]
            const hasActive = section.items.some(it => it.id === activeId)

            return (
              <div key={section.id} className="mb-3">
                {/* Section header */}
                <button
                  onClick={() => toggle(section.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all"
                  style={{
                    color: hasActive ? '#a78bfa' : '#555570',
                    background: hasActive ? 'rgba(139,92,246,0.07)' : 'transparent',
                    letterSpacing: '0.08em',
                  }}
                  onMouseEnter={e => { if (!hasActive) e.currentTarget.style.color = '#8888aa' }}
                  onMouseLeave={e => { if (!hasActive) e.currentTarget.style.color = '#555570' }}
                >
                  {Icon && (
                    <span style={{
                      color: hasActive ? '#a78bfa' : '#555570',
                      display: 'flex', alignItems: 'center',
                    }}>
                      <Icon size={12} />
                    </span>
                  )}
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
                      <div className="mt-1 space-y-0.5 pl-1">
                        {section.items.map(item => {
                          const isActive = activeId === item.id
                          const isComingSoon = item.status === 'coming-soon'

                          return (
                            <motion.button
                              key={item.id}
                              onClick={() => !isComingSoon && onSelect?.(item.id)}
                              whileHover={!isComingSoon && !isActive ? { x: 3, transition: { duration: 0.12 } } : {}}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left relative overflow-hidden"
                              style={{
                                color: isActive ? '#e2d9ff' : isComingSoon ? '#333350' : '#8888aa',
                                background: isActive
                                  ? 'linear-gradient(90deg, rgba(139,92,246,0.22), rgba(139,92,246,0.08))'
                                  : 'transparent',
                                border: isActive
                                  ? '1px solid rgba(139,92,246,0.35)'
                                  : '1px solid transparent',
                                boxShadow: isActive
                                  ? '0 0 16px rgba(139,92,246,0.25), inset 0 1px 0 rgba(255,255,255,0.05)'
                                  : 'none',
                                cursor: isComingSoon ? 'default' : 'pointer',
                                transition: 'color 0.12s, background 0.12s, box-shadow 0.12s',
                                fontWeight: isActive ? 500 : 400,
                              }}
                              onMouseEnter={e => {
                                if (!isActive && !isComingSoon) {
                                  e.currentTarget.style.color = '#c4b5fd'
                                  e.currentTarget.style.background = 'rgba(139,92,246,0.07)'
                                }
                              }}
                              onMouseLeave={e => {
                                if (!isActive && !isComingSoon) {
                                  e.currentTarget.style.color = '#8888aa'
                                  e.currentTarget.style.background = 'transparent'
                                }
                              }}
                            >
                              {/* Active left accent bar */}
                              {isActive && (
                                <motion.div
                                  layoutId="active-bar"
                                  className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full"
                                  style={{ background: 'linear-gradient(180deg, #a78bfa, #6d28d9)' }}
                                />
                              )}
                              <span className="flex-1 pl-1">{item.label}</span>
                              {isComingSoon && (
                                <span className="rounded px-1.5 py-0.5"
                                  style={{ background: 'rgba(255,255,255,0.04)', color: '#444460', fontSize: '10px' }}>
                                  soon
                                </span>
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
    </>
  )
}
