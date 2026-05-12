import { motion } from 'framer-motion'
import { Cpu, GitBranch, Zap } from 'lucide-react'

const FEATURES = [
  { icon: Zap,       title: 'Step-by-step',   desc: 'Every algorithm animated frame-by-frame with playback controls.' },
  { icon: GitBranch, title: 'Data Structures', desc: 'Arrays, linked lists, stacks, queues, trees, heaps, graphs.' },
  { icon: Cpu,       title: 'Algorithms',      desc: 'Sorting, searching, dynamic programming, backtracking and more.' },
]

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-8 py-16">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs"
          style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#8b5cf6' }}>
          <Cpu size={11} /><span>About AlgoViz</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-4" style={{ color: '#f0f0f8', lineHeight: 1.2 }}>
          Built to make algorithms{' '}
          <span style={{ background: 'linear-gradient(135deg,#8b5cf6,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            visual.
          </span>
        </h1>

        <p className="text-base mb-8 leading-relaxed" style={{ color: '#8888aa' }}>
          AlgoViz is an interactive platform for learning data structures and algorithms through
          animation. Every operation is broken into individual steps so you can see exactly
          what's happening under the hood.
        </p>

        {/* Personal story */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-2xl p-6 mb-10"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.06))',
            border: '1px solid rgba(139,92,246,0.2)',
          }}
        >
          <p className="text-sm leading-7" style={{ color: '#c4b5fd', fontStyle: 'italic' }}>
            When I learned data structures and algorithms, I always struggled to visualize them
            in an interactive and animated way. That's why I built this web application.
          </p>
          <p className="text-sm mt-3" style={{ color: '#a78bfa' }}>~ Rajdeep Biswas 😊</p>
        </motion.div>

        {/* Feature cards — 3 cards, single row */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="rounded-xl p-5"
              style={{ background: '#0d0d16', border: '1px solid rgba(255,255,255,0.06)' }}>
              <f.icon size={18} style={{ color: '#8b5cf6', marginBottom: '10px' }} />
              <div className="font-semibold text-sm mb-1" style={{ color: '#f0f0f8' }}>{f.title}</div>
              <div className="text-xs leading-relaxed" style={{ color: '#555570' }}>{f.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Tech stack */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          className="rounded-xl p-6" style={{ background: '#0d0d16', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="font-semibold text-sm mb-3" style={{ color: '#f0f0f8' }}>Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {['React 18', 'Framer Motion', 'Tailwind CSS', 'Vite', 'Lucide Icons'].map(t => (
              <span key={t} className="text-xs px-2.5 py-1 rounded-lg"
                style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}>
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
