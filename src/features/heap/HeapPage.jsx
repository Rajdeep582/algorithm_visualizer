import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageLayout from '../../components/layout/PageLayout'
import { ComplexityTable } from '../../components/shared/ComplexityBadge'

const COMPLEXITY = [
  { case: 'Insert',          time: 'O(log n)', space: 'O(1)' },
  { case: 'Extract Min/Max', time: 'O(log n)', space: 'O(1)' },
  { case: 'Peek',            time: 'O(1)',     space: 'O(1)' },
  { case: 'Build Heap',      time: 'O(n)',     space: 'O(1)' },
  { case: 'Heapify',         time: 'O(log n)', space: 'O(1)' },
]

function buildHeap(arr, type) {
  const data = [...arr]
  for (let i = Math.floor(data.length / 2) - 1; i >= 0; i--) heapifyDown(data, i, type)
  return data
}

function heapifyDown(data, i, type) {
  const n = data.length
  while (true) {
    let best = i, l = 2*i+1, r = 2*i+2
    if (l < n && (type==='min' ? data[l]<data[best] : data[l]>data[best])) best = l
    if (r < n && (type==='min' ? data[r]<data[best] : data[r]>data[best])) best = r
    if (best === i) break
    ;[data[i], data[best]] = [data[best], data[i]]
    i = best
  }
}

function bubbleUp(data, i, type) {
  while (i > 0) {
    const p = Math.floor((i-1)/2)
    if (type==='min' ? data[p]<=data[i] : data[p]>=data[i]) break
    ;[data[i], data[p]] = [data[p], data[i]]
    i = p
  }
}

const INIT = [40,20,60,10,30,50,70]

function nodePos(i, total) {
  const depth = Math.floor(Math.log2(i + 1))
  const nodesInLevel = Math.pow(2, depth)
  const posInLevel = i - (nodesInLevel - 1)
  const totalWidth = Math.pow(2, Math.floor(Math.log2(total))) * 60
  const xSpacing = totalWidth / nodesInLevel
  return { x: xSpacing * posInLevel + xSpacing / 2, y: depth * 70 + 30 }
}

function HeapVisualizer() {
  const [type, setType] = useState('min')
  const [data, setData] = useState(() => buildHeap(INIT, 'min'))
  const [highlighted, setHighlighted] = useState([])
  const [label, setLabel] = useState('')
  const [input, setInput] = useState('')

  const flash = (ids, msg, ms=1000) => {
    setHighlighted(ids); setLabel(msg)
    setTimeout(() => { setHighlighted([]); setLabel('') }, ms)
  }

  const switchType = (t) => {
    setType(t)
    setData(buildHeap(INIT, t))
    flash([], `Switched to ${t}-heap`)
  }

  const insert = () => {
    const val = input ? parseInt(input) : Math.floor(Math.random()*90)+5
    setInput('')
    const newData = [...data, val]
    bubbleUp(newData, newData.length-1, type)
    setData(newData)
    flash([0], `Inserted ${val}`)
  }

  const extract = () => {
    if (!data.length) return
    const root = data[0]
    const newData = [...data]
    const last = newData.pop()
    if (newData.length) { newData[0] = last; heapifyDown(newData, 0, type) }
    setData(newData)
    flash([], `Extracted ${type==='min'?'min':'max'}: ${root}`)
  }

  const n = data.length
  const maxDepth = n ? Math.floor(Math.log2(n)) : 0
  const svgW = Math.max(400, Math.pow(2, maxDepth) * 60 + 60)
  const svgH = (maxDepth + 1) * 70 + 50

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['min','max'].map(t => (
          <motion.button key={t} onClick={() => switchType(t)}
            whileHover={{ scale:1.05, boxShadow:'0 0 12px rgba(139,92,246,0.25)' }}
            whileTap={{ scale:0.93 }}
            className="px-3 py-1.5 rounded-lg text-sm capitalize"
            style={{
              background: type===t?'rgba(139,92,246,0.18)':'rgba(255,255,255,0.04)',
              color: type===t?'#a78bfa':'#8888aa',
              border: type===t?'1px solid rgba(139,92,246,0.35)':'1px solid rgba(255,255,255,0.06)',
              fontWeight: type===t?600:400,
            }}>
            {t} Heap
          </motion.button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Value…"
          className="px-3 py-1.5 rounded-lg text-sm w-24 outline-none"
          style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'#f0f0f8' }} />
        {[
          { label:'Insert', fn: insert },
          { label:`Extract ${type==='min'?'Min':'Max'}`, fn: extract },
        ].map(b => (
          <motion.button key={b.label} onClick={b.fn}
            whileHover={{ scale:1.05, boxShadow:'0 0 14px rgba(139,92,246,0.3)' }}
            whileTap={{ scale:0.93 }}
            className="px-3 py-1.5 rounded-lg text-sm"
            style={{ background:'rgba(139,92,246,0.12)', color:'#a78bfa', border:'1px solid rgba(139,92,246,0.25)' }}>
            {b.label}
          </motion.button>
        ))}
      </div>

      <div className="rounded-xl overflow-auto" style={{ background:'#0d0d16', border:'1px solid rgba(255,255,255,0.06)', minHeight:'240px' }}>
        <div className="h-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {label && (
              <motion.div key={label} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                transition={{duration:0.15}}
                className="text-sm font-medium" style={{color:'#a78bfa'}}>{label}</motion.div>
            )}
          </AnimatePresence>
        </div>
        <svg width={svgW} height={svgH} style={{ display:'block', margin:'0 auto' }}>
          {data.map((_,i) => {
            const l=2*i+1, r=2*i+2
            const p = nodePos(i, n)
            return [l,r].filter(c=>c<n).map(c => {
              const cp = nodePos(c, n)
              return <line key={`${i}-${c}`} x1={p.x} y1={p.y} x2={cp.x} y2={cp.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
            })
          })}
          {data.map((val,i) => {
            const {x,y} = nodePos(i,n)
            const isHL = highlighted.includes(i)
            const isRoot = i===0
            return (
              <g key={i}>
                <motion.circle cx={x} cy={y} r={22}
                  initial={{ scale:0, opacity:0 }}
                  animate={{
                    scale:1, opacity:1,
                    fill: isHL?'rgba(139,92,246,0.45)':isRoot?'rgba(139,92,246,0.18)':'rgba(255,255,255,0.04)',
                    stroke: isHL?'#8b5cf6':isRoot?'rgba(139,92,246,0.55)':'rgba(255,255,255,0.12)',
                    filter: isHL?'drop-shadow(0 0 8px rgba(139,92,246,0.7))':'none',
                  }}
                  strokeWidth={isRoot?2:1.5}
                  transition={{type:'spring',stiffness:380,damping:22}} />
                <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
                  fontSize="12" fontWeight="600" fontFamily="ui-monospace,monospace"
                  fill={isHL||isRoot?'#f0f0f8':'#8888aa'}>{val}</text>
                <text x={x} y={y+30} textAnchor="middle" fontSize="9" fill="#333350">[{i}]</text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="flex gap-1 flex-wrap">
        {data.map((v,i) => (
          <div key={i} className="flex flex-col items-center rounded px-2 py-1"
            style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
            <span className="font-mono text-xs" style={{color:'#a78bfa'}}>{v}</span>
            <span style={{color:'#333350',fontSize:'9px'}}>{i}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HeapPage() {
  return (
    <PageLayout title="Heap" subtitle="Complete binary tree with heap property. O(log n) insert/extract." tag="Data Structure">
      <Section title="What is a Heap?">
        <p className="text-sm leading-relaxed" style={{color:'#8888aa'}}>
          A heap is a <span style={{color:'#a78bfa'}}>complete binary tree</span> satisfying the heap property:
          in a <span style={{color:'#a78bfa'}}>min-heap</span>, every parent ≤ its children (root = minimum).
          In a <span style={{color:'#a78bfa'}}>max-heap</span>, every parent ≥ its children (root = maximum).
          Stored as flat array: parent of node i at ⌊(i-1)/2⌋, children at 2i+1 and 2i+2.
        </p>
      </Section>
      <Section title="Complexity"><ComplexityTable data={COMPLEXITY} /></Section>
      <Section title="Interactive Visualizer"><HeapVisualizer /></Section>
      <Section title="Use Cases">
        <ul className="space-y-2 text-sm" style={{color:'#8888aa'}}>
          {['Priority Queue implementation','Heap Sort (in-place O(n log n))','Dijkstra / Prim algorithms','Median maintenance (min+max heap pair)','Top-k elements in stream'].map((e,i)=>(
            <li key={i} className="flex items-start gap-2"><span style={{color:'#8b5cf6',marginTop:2}}>▸</span>{e}</li>
          ))}
        </ul>
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
