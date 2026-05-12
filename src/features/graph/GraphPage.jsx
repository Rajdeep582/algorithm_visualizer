import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePlayback } from '../../engines/playback/usePlayback'
import PlaybackControls from '../../components/shared/PlaybackControls'
import PageLayout from '../../components/layout/PageLayout'
import { ComplexityTable } from '../../components/shared/ComplexityBadge'

const COMPLEXITY = [
  { case: 'BFS (adjacency list)',  time: 'O(V + E)', space: 'O(V)' },
  { case: 'DFS (adjacency list)',  time: 'O(V + E)', space: 'O(V)' },
  { case: 'BFS (adjacency matrix)',time: 'O(V²)',    space: 'O(V²)' },
]

// Fixed demo graph: nodes with positions, edges
const NODES = [
  { id:0, label:'A', x:200, y:60 },
  { id:1, label:'B', x:80,  y:160 },
  { id:2, label:'C', x:320, y:160 },
  { id:3, label:'D', x:40,  y:280 },
  { id:4, label:'E', x:160, y:280 },
  { id:5, label:'F', x:280, y:280 },
  { id:6, label:'G', x:360, y:280 },
]
const EDGES = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6],[4,5]]
const ADJ = NODES.map((_,i) => EDGES.filter(([a,b])=>a===i||b===i).map(([a,b])=>a===i?b:a))

function bfsSteps(start=0) {
  const steps = []
  const visited = new Set(), queue = [start], order = []
  visited.add(start)
  steps.push({ visited:[...visited], current:null, queue:[...queue], label:`BFS from ${NODES[start].label}. Enqueue start.` })
  while (queue.length) {
    const node = queue.shift()
    order.push(node)
    steps.push({ visited:[...visited], current:node, queue:[...queue], label:`Visit ${NODES[node].label}. Explore neighbors.` })
    for (const neighbor of ADJ[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push(neighbor)
        steps.push({ visited:[...visited], current:node, queue:[...queue], label:`Enqueue ${NODES[neighbor].label}` })
      }
    }
  }
  steps.push({ visited:[...visited], current:null, queue:[], label:`BFS order: ${order.map(i=>NODES[i].label).join(' → ')}` })
  return steps
}

function dfsSteps(start=0) {
  const steps = []
  const visited = new Set(), order = []
  steps.push({ visited:[], current:null, stack:[start], label:`DFS from ${NODES[start].label}` })
  function dfs(node) {
    visited.add(node)
    order.push(node)
    steps.push({ visited:[...visited], current:node, stack:[], label:`Visit ${NODES[node].label}` })
    for (const nb of ADJ[node]) {
      if (!visited.has(nb)) {
        steps.push({ visited:[...visited], current:node, stack:[nb], label:`Explore ${NODES[node].label} → ${NODES[nb].label}` })
        dfs(nb)
      }
    }
    steps.push({ visited:[...visited], current:node, stack:[], label:`Backtrack from ${NODES[node].label}` })
  }
  dfs(start)
  steps.push({ visited:[...visited], current:null, stack:[], label:`DFS order: ${order.map(i=>NODES[i].label).join(' → ')}` })
  return steps
}

export default function GraphPage() {
  const [algo, setAlgo] = useState('bfs')
  const [steps, setSteps] = useState(() => bfsSteps(0))
  const [disp, setDisp] = useState(() => ({ visited:[], current:null, queue:[], stack:[], label:'Press play' }))
  const stepsRef = useRef(steps)
  useEffect(() => { stepsRef.current = steps }, [steps])

  const handleStep = useCallback((idx) => {
    if (idx < 0) { setDisp({ visited:[], current:null, queue:[], stack:[], label:'Press play' }); return }
    const s = stepsRef.current[idx]
    if (s) setDisp(s)
  }, [])

  const { isPlaying, speed, setSpeed, play, stop, reset, stepForward, stepBack, progress } =
    usePlayback({ steps, onStep: handleStep })

  const changeAlgo = (key) => {
    stop()
    setAlgo(key)
    const s = key==='bfs' ? bfsSteps(0) : dfsSteps(0)
    setSteps(s)
    setDisp({ visited:[], current:null, queue:[], stack:[], label:'Press play' })
  }

  const { visited=[], current=null, queue=[], stack=[], label='' } = disp

  const getNodeStyle = (id) => {
    if (id===current) return { fill:'rgba(139,92,246,0.5)', stroke:'#8b5cf6', color:'#f0f0f8', glow:'0 0 16px rgba(139,92,246,0.6)' }
    if (visited.includes(id)) return { fill:'rgba(16,185,129,0.2)', stroke:'#10b981', color:'#10b981', glow:'none' }
    return { fill:'rgba(255,255,255,0.04)', stroke:'rgba(255,255,255,0.12)', color:'#8888aa', glow:'none' }
  }

  const getEdgeColor = (a,b) => {
    if (visited.includes(a) && visited.includes(b)) return 'rgba(16,185,129,0.3)'
    return 'rgba(255,255,255,0.08)'
  }

  return (
    <PageLayout title="Graph Traversal" subtitle="BFS explores level by level. DFS dives deep first." tag="Algorithms">
      <Section title="Complexity"><ComplexityTable data={COMPLEXITY} /></Section>

      <Section title="Interactive Visualizer">
        <div className="flex gap-2 mb-4">
          {[{key:'bfs',label:'BFS'},{key:'dfs',label:'DFS'}].map(a=>(
            <motion.button key={a.key} onClick={()=>changeAlgo(a.key)}
              whileHover={{ scale: 1.05, boxShadow: '0 0 12px rgba(139,92,246,0.25)' }}
              whileTap={{ scale: 0.93 }}
              className="px-3 py-1.5 rounded-lg text-sm"
              style={{ background:algo===a.key?'rgba(139,92,246,0.18)':'rgba(255,255,255,0.04)', color:algo===a.key?'#a78bfa':'#8888aa', border:algo===a.key?'1px solid rgba(139,92,246,0.35)':'1px solid rgba(255,255,255,0.06)', fontWeight:algo===a.key?600:400 }}>{a.label}</motion.button>
          ))}
        </div>

        <div className="rounded-xl" style={{ background:'#0d0d16', border:'1px solid rgba(255,255,255,0.06)' }}>
          <AnimatePresence mode="wait">
            <motion.p key={label} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="text-center py-3 text-sm font-medium" style={{color:'#a78bfa'}}>{label}</motion.p>
          </AnimatePresence>

          <svg width="420" height="360" style={{display:'block',margin:'0 auto'}}>
            {EDGES.map(([a,b],i) => (
              <motion.line key={i}
                x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
                animate={{stroke: getEdgeColor(a,b)}}
                strokeWidth="2" />
            ))}
            {NODES.map(node => {
              const s = getNodeStyle(node.id)
              return (
                <g key={node.id}>
                  <motion.circle cx={node.x} cy={node.y} r={24}
                    animate={{ fill:s.fill, stroke:s.stroke, filter:`drop-shadow(${s.glow})` }}
                    transition={{duration:0.3}}
                    strokeWidth="2" />
                  <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="central"
                    fontSize="13" fontWeight="700" fontFamily="system-ui" fill={s.color}>{node.label}</text>
                </g>
              )
            })}
          </svg>

          {/* Queue/Stack display */}
          <div className="px-4 pb-4 flex gap-4 text-xs">
            <div>
              <span style={{color:'#555570'}}>{algo==='bfs'?'Queue':'Stack'}: </span>
              <span style={{color:'#a78bfa',fontFamily:'monospace'}}>
                [{(algo==='bfs'?queue:stack).map(i=>NODES[i]?.label).join(', ')}]
              </span>
            </div>
            <div>
              <span style={{color:'#555570'}}>Visited: </span>
              <span style={{color:'#10b981',fontFamily:'monospace'}}>
                [{visited.map(i=>NODES[i]?.label).join(', ')}]
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <PlaybackControls isPlaying={isPlaying} onPlay={play} onPause={stop}
            onReset={reset} onStepForward={stepForward} onStepBack={stepBack}
            speed={speed} onSpeedChange={setSpeed} progress={progress} />
        </div>
      </Section>

      <Section title="BFS vs DFS">
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { name:'BFS', color:'#3b82f6', points:['Queue-based (FIFO)','Level-by-level','Shortest path (unweighted)','Higher memory: O(width)'] },
            { name:'DFS', color:'#8b5cf6', points:['Stack-based (LIFO)','Deep dive first','Cycle detection, topo sort','Lower memory: O(depth)'] },
          ].map(t=>(
            <div key={t.name} className="rounded-xl p-4" style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${t.color}30` }}>
              <div className="font-semibold mb-2" style={{color:t.color}}>{t.name}</div>
              <ul className="space-y-1">
                {t.points.map((p,i)=>(
                  <li key={i} style={{color:'#8888aa'}} className="flex items-start gap-1">
                    <span style={{color:t.color,marginTop:2}}>▸</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
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
