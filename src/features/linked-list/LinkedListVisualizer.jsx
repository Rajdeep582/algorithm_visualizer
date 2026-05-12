import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

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
    const val = input ? parseInt(input) : randomVal()
    setInput('')
    setNextId(p => {
      const id = p
      const node = { id, val }
      setNodes(prev => [node, ...prev])
      setTimeout(() => flash([id], `Inserted ${val} at head`), 100)
      return p + 1
    })
  }

  const insertTail = () => {
    const val = input ? parseInt(input) : randomVal()
    setInput('')
    setNextId(p => {
      const id = p
      const node = { id, val }
      setNodes(prev => [...prev, node])
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
          { label: 'Insert Head', fn: insertHead },
          { label: 'Insert Tail', fn: insertTail },
          { label: 'Delete Head', fn: deleteHead },
          { label: 'Delete Tail', fn: deleteTail },
          { label: 'Reverse', fn: reverse },
          { label: 'Traverse', fn: traverse },
        ].map(btn => (
          <motion.button
            key={btn.label}
            onClick={btn.fn}
            whileHover={{ scale: 1.05, boxShadow: '0 0 14px rgba(139,92,246,0.3)' }}
            whileTap={{ scale: 0.93 }}
            className="px-3 py-1.5 rounded-lg text-sm"
            style={{
              background: 'rgba(139,92,246,0.12)',
              color: '#a78bfa',
              border: '1px solid rgba(139,92,246,0.25)',
            }}
          >
            {btn.label}
          </motion.button>
        ))}
      </div>

      {/* Visualization */}
      <div
        className="rounded-xl p-6 overflow-x-auto"
        style={{ background: '#0d0d16', border: '1px solid rgba(255,255,255,0.06)', minHeight: '140px' }}
      >
        {label && (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4 text-sm font-medium"
            style={{ color: '#a78bfa' }}
          >
            {label}
          </motion.div>
        )}

        <div className="flex items-center gap-2 justify-center flex-wrap">
          {/* HEAD label */}
          {nodes.length > 0 && (
            <div className="flex flex-col items-center gap-1 mr-2">
              <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>HEAD</span>
              <div className="w-0.5 h-3" style={{ background: '#10b981' }} />
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {nodes.map((node, i) => {
              const isHighlighted = highlight.includes(node.id)
              return (
                <motion.div
                  key={node.id}
                  layout
                  initial={{ opacity: 0, scale: 0.6, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: -20 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="flex items-center gap-2"
                >
                  {/* Node box */}
                  <motion.div
                    className="flex rounded-lg overflow-hidden"
                    animate={{
                      boxShadow: isHighlighted ? '0 0 20px rgba(139,92,246,0.5)' : '0 0 0px transparent',
                    }}
                    style={{
                      border: `1px solid ${isHighlighted ? 'rgba(139,92,246,0.7)' : 'rgba(255,255,255,0.1)'}`,
                    }}
                  >
                    {/* Data cell */}
                    <div
                      className="px-4 py-3 flex items-center justify-center font-mono text-sm font-semibold"
                      style={{
                        background: isHighlighted ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.04)',
                        color: isHighlighted ? '#f0f0f8' : '#8888aa',
                        minWidth: '48px',
                      }}
                    >
                      {node.val}
                    </div>
                    {/* Next pointer cell */}
                    <div
                      className="px-2 py-3 flex items-center justify-center text-xs"
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        color: '#333350',
                        borderLeft: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      {i < nodes.length - 1 ? '→' : 'null'}
                    </div>
                  </motion.div>

                  {/* Arrow between nodes */}
                  {i < nodes.length - 1 && (
                    <ArrowRight size={14} style={{ color: '#333350', flexShrink: 0 }} />
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>

          {nodes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm"
              style={{ color: '#333350' }}
            >
              Empty list — insert a node
            </motion.div>
          )}

          {/* NULL terminator */}
          {nodes.length > 0 && (
            <div className="flex flex-col items-center gap-1 ml-1">
              <div className="w-0.5 h-3" style={{ background: '#333350' }} />
              <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.03)', color: '#333350', border: '1px solid rgba(255,255,255,0.06)' }}>NULL</span>
            </div>
          )}
        </div>

        {/* Size counter */}
        <div className="mt-4 text-center text-xs" style={{ color: '#333350' }}>
          Size: {nodes.length}
        </div>
      </div>
    </div>
  )
}
