import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import CodeBlock from '../../components/shared/CodeBlock'
import { ComplexityTable } from '../../components/shared/ComplexityBadge'

const COMPLEXITY = [
  { case: 'Enqueue', time: 'O(1)', space: 'O(1)' },
  { case: 'Dequeue', time: 'O(1)', space: 'O(1)' },
  { case: 'Peek (front)', time: 'O(1)', space: 'O(1)' },
  { case: 'Search', time: 'O(n)', space: 'O(1)' },
]

let _uid = 200

function QueueVisualizer() {
  const [queue, setQueue] = useState(() => [55, 23, 71, 9].map(v => ({ id: _uid++, val: v })))
  const [input, setInput] = useState('')
  const [highlight, setHighlight] = useState(null)
  const [label, setLabel] = useState('')

  const flash = (id, msg) => {
    setHighlight(id)
    setLabel(msg)
    setTimeout(() => { setHighlight(null); setLabel('') }, 900)
  }

  const enqueue = () => {
    const val = input ? parseInt(input) : Math.floor(Math.random() * 90) + 5
    setInput('')
    const id = _uid++
    setQueue(p => [...p, { id, val }])
    setTimeout(() => flash(id, `Enqueued ${val}`), 50)
  }

  const dequeue = () => {
    if (!queue.length) return
    const { id, val } = queue[0]
    flash(id, `Dequeued ${val}`)
    setTimeout(() => setQueue(p => p.slice(1)), 500)
  }

  const peek = () => {
    if (!queue.length) return
    flash(queue[0].id, `Front: ${queue[0].val}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Value…"
          className="px-3 py-1.5 rounded-lg text-sm w-24 outline-none"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f0f8' }} />
        {[{ label: 'Enqueue', fn: enqueue }, { label: 'Dequeue', fn: dequeue }, { label: 'Peek', fn: peek }].map(b => (
          <motion.button key={b.label} onClick={b.fn}
            whileHover={{ scale: 1.05, boxShadow: '0 0 14px rgba(139,92,246,0.3)' }}
            whileTap={{ scale: 0.93 }}
            className="px-3 py-1.5 rounded-lg text-sm"
            style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.25)' }}>{b.label}</motion.button>
        ))}
      </div>

      <div className="rounded-xl p-6" style={{ background: '#0d0d16', border: '1px solid rgba(255,255,255,0.06)', minHeight: '180px' }}>
        {label && (
          <motion.div key={label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center mb-4 text-sm font-medium" style={{ color: '#a78bfa' }}>{label}</motion.div>
        )}

        <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
          {/* ENQUEUE arrow */}
          <div className="flex flex-col items-center gap-1 mr-2">
            <span className="text-xs" style={{ color: '#3b82f6' }}>ENQUEUE →</span>
          </div>

          <AnimatePresence mode="popLayout">
            {queue.map((item, i) => {
              const isFirst = i === 0
              const isLast = i === queue.length - 1
              const isHighlighted = highlight === item.id

              return (
                <motion.div key={item.id} layout
                  initial={{ opacity: 0, x: 40, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -40, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="px-4 py-3 rounded-lg font-mono font-semibold text-sm"
                      style={{
                        background: isHighlighted ? 'rgba(139,92,246,0.3)' : isFirst ? 'rgba(16,185,129,0.12)' : isLast ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${isHighlighted ? 'rgba(139,92,246,0.7)' : isFirst ? 'rgba(16,185,129,0.3)' : isLast ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.08)'}`,
                        color: isHighlighted ? '#f0f0f8' : isFirst ? '#10b981' : isLast ? '#60a5fa' : '#8888aa',
                        boxShadow: isHighlighted ? '0 0 16px rgba(139,92,246,0.4)' : 'none',
                        minWidth: '52px',
                        textAlign: 'center',
                      }}
                    >{item.val}</div>
                    <span className="text-xs" style={{ color: isFirst ? '#10b981' : isLast ? '#3b82f6' : '#333350', fontSize: '10px' }}>
                      {isFirst ? 'front' : isLast ? 'rear' : i}
                    </span>
                  </div>
                  {i < queue.length - 1 && <ArrowRight size={13} style={{ color: '#333350', flexShrink: 0 }} />}
                </motion.div>
              )
            })}
          </AnimatePresence>

          {queue.length === 0 && (
            <span className="text-sm" style={{ color: '#333350' }}>Empty queue</span>
          )}

          {/* DEQUEUE arrow */}
          {queue.length > 0 && (
            <div className="flex flex-col items-center gap-1 ml-2">
              <span className="text-xs" style={{ color: '#10b981' }}>→ DEQUEUE</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-center gap-6 text-xs" style={{ color: '#333350' }}>
          <span>Size: {queue.length}</span>
          <span style={{ color: '#10b981' }}>Front: {queue[0]?.val ?? 'empty'}</span>
          <span style={{ color: '#3b82f6' }}>Rear: {queue[queue.length - 1]?.val ?? 'empty'}</span>
        </div>
      </div>
    </div>
  )
}

export default function QueuePage() {
  return (
    <PageLayout title="Queue" subtitle="FIFO — First In, First Out. Enqueue at rear, dequeue from front." tag="Data Structure">
      <Section title="What is a Queue?">
        <p className="text-sm leading-relaxed" style={{ color: '#8888aa' }}>
          A queue enforces <span style={{ color: '#a78bfa' }}>FIFO</span> (First In, First Out) ordering — like a checkout line. Elements are added at the rear (enqueue) and removed from the front (dequeue). Used in BFS, task scheduling, and streaming buffers.
        </p>
      </Section>
      <Section title="Complexity"><ComplexityTable data={COMPLEXITY} /></Section>
      <Section title="Interactive Visualizer"><QueueVisualizer /></Section>
      <Section title="Enqueue / Dequeue"><CodeBlock snippetKey="queue-enqueue-dequeue" /></Section>
    </PageLayout>
  )
}

function Section({ title, children }) {
  return (
    <motion.section initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
      viewport={{once:true,margin:'-50px'}} transition={{duration:0.4}} className="mb-10">
      <h2 className="text-lg font-semibold mb-4" style={{color:'#f0f0f8'}}>{title}</h2>
      {children}
    </motion.section>
  )
}
