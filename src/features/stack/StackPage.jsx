import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageLayout from '../../components/layout/PageLayout'
import CodeBlock from '../../components/shared/CodeBlock'
import { ComplexityTable } from '../../components/shared/ComplexityBadge'

const COMPLEXITY = [
  { case: 'Push', time: 'O(1)', space: 'O(1)' },
  { case: 'Pop', time: 'O(1)', space: 'O(1)' },
  { case: 'Peek', time: 'O(1)', space: 'O(1)' },
  { case: 'Search', time: 'O(n)', space: 'O(1)' },
]

function StackVisualizer() {
  const [stack, setStack] = useState([42, 17, 88, 5])
  const [input, setInput] = useState('')
  const [highlight, setHighlight] = useState(null)
  const [label, setLabel] = useState('')

  const flash = (idx, msg) => {
    setHighlight(idx)
    setLabel(msg)
    setTimeout(() => { setHighlight(null); setLabel('') }, 1000)
  }

  const push = () => {
    const val = input ? parseInt(input) : Math.floor(Math.random() * 90) + 5
    setInput('')
    setStack(p => {
      setTimeout(() => flash(p.length, `Pushed ${val}`), 50)
      return [...p, val]
    })
  }

  const pop = () => {
    if (!stack.length) return
    const val = stack[stack.length - 1]
    flash(stack.length - 1, `Popped ${val}`)
    setTimeout(() => setStack(p => p.slice(0, -1)), 500)
  }

  const peek = () => {
    if (!stack.length) return
    flash(stack.length - 1, `Peek: ${stack[stack.length - 1]}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Value…"
          className="px-3 py-1.5 rounded-lg text-sm w-24 outline-none"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f0f8' }}
        />
        {[
          { label: 'Push', fn: push },
          { label: 'Pop', fn: pop },
          { label: 'Peek', fn: peek },
        ].map(b => (
          <motion.button key={b.label} onClick={b.fn}
            whileHover={{ scale: 1.05, boxShadow: '0 0 14px rgba(139,92,246,0.3)' }}
            whileTap={{ scale: 0.93 }}
            className="px-3 py-1.5 rounded-lg text-sm"
            style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.25)' }}
          >{b.label}</motion.button>
        ))}
      </div>

      <div className="rounded-xl p-6 flex gap-8 items-end justify-center"
        style={{ background: '#0d0d16', border: '1px solid rgba(255,255,255,0.06)', minHeight: '260px' }}>

        {/* Stack tower */}
        <div className="flex flex-col items-center gap-0">
          {/* TOP label */}
          <div className="mb-2 text-xs" style={{ color: '#10b981' }}>▼ TOP</div>

          {/* Stack container outline */}
          <div className="relative" style={{ width: '120px' }}>
            <AnimatePresence mode="popLayout">
              {[...stack].reverse().map((val, i) => {
                const realIdx = stack.length - 1 - i
                const isTop = realIdx === stack.length - 1
                const isHighlighted = highlight === realIdx

                return (
                  <motion.div
                    key={`${realIdx}-${val}`}
                    layout
                    initial={{ opacity: 0, scaleY: 0, y: -30 }}
                    animate={{ opacity: 1, scaleY: 1, y: 0 }}
                    exit={{ opacity: 0, scaleY: 0, x: 30 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-mono font-semibold"
                    style={{
                      background: isHighlighted
                        ? 'rgba(139,92,246,0.35)'
                        : isTop
                        ? 'rgba(139,92,246,0.15)'
                        : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isHighlighted ? 'rgba(139,92,246,0.7)' : isTop ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}`,
                      borderBottom: i < stack.length - 1 ? 'none' : undefined,
                      color: isHighlighted ? '#f0f0f8' : isTop ? '#a78bfa' : '#8888aa',
                      boxShadow: isHighlighted ? '0 0 16px rgba(139,92,246,0.4)' : 'none',
                    }}
                  >
                    <span>{val}</span>
                    {isTop && <span style={{ color: '#555570', fontSize: '10px' }}>top</span>}
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {/* Bottom wall */}
            <div className="w-full h-1 rounded-b" style={{ background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* BOTTOM label */}
          <div className="mt-2 text-xs" style={{ color: '#333350' }}>▲ BOTTOM</div>
        </div>

        {/* Info panel */}
        <div className="space-y-3">
          <div className="rounded-lg px-4 py-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-xs mb-1" style={{ color: '#555570' }}>Size</div>
            <div className="font-mono font-semibold" style={{ color: '#f0f0f8' }}>{stack.length}</div>
          </div>
          <div className="rounded-lg px-4 py-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-xs mb-1" style={{ color: '#555570' }}>Top</div>
            <div className="font-mono font-semibold" style={{ color: '#a78bfa' }}>{stack.length ? stack[stack.length - 1] : 'empty'}</div>
          </div>
          <AnimatePresence mode="wait">
            {label && (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-lg px-4 py-2.5 text-sm"
                style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#a78bfa' }}
              >
                {label}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default function StackPage() {
  return (
    <PageLayout title="Stack" subtitle="LIFO — Last In, First Out. O(1) push and pop." tag="Data Structure">
      <Section title="What is a Stack?">
        <p className="text-sm leading-relaxed" style={{ color: '#8888aa' }}>
          A stack enforces <span style={{ color: '#a78bfa' }}>LIFO</span> (Last In, First Out) ordering. Only the top element is accessible.
          Think of a stack of plates — you always add/remove from the top. Used in function call stacks, undo systems, expression parsing, and DFS.
        </p>
      </Section>
      <Section title="Complexity"><ComplexityTable data={COMPLEXITY} /></Section>
      <Section title="Interactive Visualizer"><StackVisualizer /></Section>
      <Section title="Push / Pop">
        <CodeBlock snippetKey="stack-push-pop" />
      </Section>
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
