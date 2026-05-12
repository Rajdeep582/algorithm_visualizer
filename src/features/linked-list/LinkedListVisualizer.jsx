import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const MAX_NODES = 15
const randomVal = () => Math.floor(Math.random() * 90) + 5

function makeList(vals) {
  return vals.map((v, i) => ({ id: i, val: v }))
}

export default function LinkedListVisualizer() {
  const [nodes, setNodes] = useState(() => makeList([12, 37, 58, 81, 24]))
  const [highlight, setHighlight] = useState([])
  const [label, setLabel] = useState('')
  const [input, setInput] = useState('')
  const [nextId, setNextId] = useState(100)

  const flash = (ids, msg, ms = 1200) => {
    setHighlight(ids)
    setLabel(msg)
    setTimeout(() => { setHighlight([]); setLabel('') }, ms)
  }

  const insertHead = () => {
    if (nodes.length >= MAX_NODES) return
    const val = input ? parseInt(input) : randomVal()
    setInput('')
    setNextId(p => {
      const id = p
      setNodes(prev => [{ id, val }, ...prev])
      setTimeout(() => flash([id], `Inserted ${val} at head`), 100)
      return p + 1
    })
  }

  const insertTail = () => {
    if (nodes.length >= MAX_NODES) return
    const val = input ? parseInt(input) : randomVal()
    setInput('')
    setNextId(p => {
      const id = p
      setNodes(prev => [...prev, { id, val }])
      setTimeout(() => flash([id], `Inserted ${val} at tail`), 100)
      return p + 1
    })
  }

  const deleteHead = () => {
    if (!nodes.length) return
    const id = nodes[0].id
    flash([id], `Deleting head: ${nodes[0].val}`, 400)
    setTimeout(() => setNodes(p => p.slice(1)), 450)
  }

  const deleteTail = () => {
    if (!nodes.length) return
    const id = nodes[nodes.length - 1].id
    flash([id], `Deleting tail: ${nodes[nodes.length - 1].val}`, 400)
    setTimeout(() => setNodes(p => p.slice(0, -1)), 450)
  }

  const reverse = async () => {
    const snap = [...nodes]
    const reversed = [...snap].reverse()
    for (let i = 0; i < snap.length; i++) {
      setHighlight([snap[i].id])
      setLabel(`Reversing pointer at index ${i}`)
      await new Promise(r => setTimeout(r, 220))
    }
    setNodes(reversed)
    setHighlight([])
    setLabel('List reversed!')
    setTimeout(() => setLabel(''), 1000)
  }

  const traverse = async () => {
    const snap = [...nodes]
    for (const node of snap) {
      setHighlight([node.id])
      setLabel(`Visiting node ${node.val}`)
      await new Promise(r => setTimeout(r, 480))
    }
    setHighlight([])
    setLabel('Traversal complete')
    setTimeout(() => setLabel(''), 900)
  }

  const atLimit = nodes.length >= MAX_NODES

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex gap-2 flex-wrap items-center">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Value…"
          className="px-3 py-1.5 rounded-lg text-sm w-24 outline-none"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f0f8' }}
        />
        {[
          { label: 'Insert Head', fn: insertHead, disabled: atLimit },
          { label: 'Insert Tail', fn: insertTail, disabled: atLimit },
          { label: 'Delete Head', fn: deleteHead, disabled: nodes.length === 0 },
          { label: 'Delete Tail', fn: deleteTail, disabled: nodes.length === 0 },
          { label: 'Reverse',     fn: reverse,     disabled: nodes.length < 2 },
          { label: 'Traverse',    fn: traverse,    disabled: nodes.length === 0 },
        ].map(btn => (
          <motion.button
            key={btn.label}
            onClick={btn.disabled ? undefined : btn.fn}
            whileHover={btn.disabled ? {} : { scale: 1.05, boxShadow: '0 0 14px rgba(139,92,246,0.3)' }}
            whileTap={btn.disabled ? {} : { scale: 0.93 }}
            className="px-3 py-1.5 rounded-lg text-sm"
            style={{
              background: btn.disabled ? 'rgba(255,255,255,0.03)' : 'rgba(139,92,246,0.12)',
              color: btn.disabled ? '#333350' : '#a78bfa',
              border: `1px solid ${btn.disabled ? 'rgba(255,255,255,0.04)' : 'rgba(139,92,246,0.25)'}`,
              cursor: btn.disabled ? 'not-allowed' : 'pointer',
            }}
          >
            {btn.label}
          </motion.button>
        ))}
        {atLimit && (
          <span className="text-xs" style={{ color: '#555570' }}>Max {MAX_NODES} nodes</span>
        )}
      </div>

      {/* Visualization */}
      <div
        className="rounded-xl p-6 overflow-x-auto"
        style={{ background: '#0d0d16', border: '1px solid rgba(255,255,255,0.06)', minHeight: '160px' }}
      >
        {/* Fixed-height label row */}
        <div className="h-6 flex items-center justify-center mb-4">
          <AnimatePresence mode="wait">
            {label && (
              <motion.span key={label}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-sm font-medium" style={{ color: '#a78bfa' }}>
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nodes row — pointer badge sits INSIDE each node's column */}
        <div className="flex items-end justify-center gap-0">
          <AnimatePresence mode="popLayout">
            {nodes.map((node, i) => {
              const isHighlighted = highlight.includes(node.id)
              const isFirst = i === 0
              const isLast = i === nodes.length - 1
              const showPointer = isFirst || isLast

              return (
                <motion.div
                  key={node.id}
                  layout
                  initial={{ opacity: 0, scale: 0.6, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: -20 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="flex items-end"
                >
                  {/* Node column: pointer badge + node box */}
                  <div className="flex flex-col items-center">
                    {/* Pointer badge — fixed height slot so all nodes align at bottom */}
                    <div className="flex flex-col items-center" style={{ height: '38px', justifyContent: 'flex-end' }}>
                      {showPointer && (
                        <>
                          <span className="text-xs px-2 py-0.5 rounded font-semibold"
                            style={{
                              background: isFirst ? 'rgba(16,185,129,0.12)' : 'rgba(59,130,246,0.12)',
                              color: isFirst ? '#10b981' : '#60a5fa',
                              border: `1px solid ${isFirst ? 'rgba(16,185,129,0.25)' : 'rgba(59,130,246,0.25)'}`,
                              lineHeight: '1.4',
                            }}>
                            {isFirst ? 'HEAD' : 'TAIL'}
                          </span>
                          <div className="w-px" style={{ height: '6px', background: isFirst ? '#10b981' : '#60a5fa' }} />
                          <div style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: `5px solid ${isFirst ? '#10b981' : '#60a5fa'}` }} />
                        </>
                      )}
                    </div>

                    {/* Node box */}
                    <motion.div
                      className="flex rounded-lg overflow-hidden"
                      animate={{ boxShadow: isHighlighted ? '0 0 20px rgba(139,92,246,0.5)' : '0 0 0px transparent' }}
                      style={{ border: `1px solid ${isHighlighted ? 'rgba(139,92,246,0.7)' : 'rgba(255,255,255,0.1)'}` }}
                    >
                      <div className="px-4 py-3 flex items-center justify-center font-mono text-sm font-semibold"
                        style={{ background: isHighlighted ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.04)', color: isHighlighted ? '#f0f0f8' : '#8888aa', minWidth: '44px' }}>
                        {node.val}
                      </div>
                      <div className="px-2 py-3 flex items-center justify-center text-xs"
                        style={{ background: 'rgba(255,255,255,0.02)', color: '#333350', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                        {i < nodes.length - 1 ? '→' : 'null'}
                      </div>
                    </motion.div>
                  </div>

                  {/* Arrow between nodes */}
                  {i < nodes.length - 1 && (
                    <div className="flex items-center pb-0" style={{ paddingBottom: '11px' }}>
                      <ArrowRight size={14} style={{ color: '#333350', flexShrink: 0, margin: '0 4px' }} />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* NULL terminator */}
          {nodes.length > 0 && (
            <div className="flex items-center" style={{ paddingBottom: '11px' }}>
              <ArrowRight size={12} style={{ color: '#333350', margin: '0 4px' }} />
              <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.03)', color: '#333350', border: '1px solid rgba(255,255,255,0.06)' }}>NULL</span>
            </div>
          )}

          {nodes.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-sm" style={{ color: '#333350' }}>
              Empty list — insert a node
            </motion.div>
          )}
        </div>

        <div className="mt-3 text-center text-xs" style={{ color: '#333350' }}>
          Size: {nodes.length} / {MAX_NODES}
        </div>
      </div>
    </div>
  )
}
