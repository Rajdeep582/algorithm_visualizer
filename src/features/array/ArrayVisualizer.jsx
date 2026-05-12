import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePlayback } from '../../engines/playback/usePlayback'
import PlaybackControls from '../../components/shared/PlaybackControls'
import { randomArray } from '../../lib/utils'

const OPS = ['Append', 'Insert', 'Delete', 'Search', 'Traverse']

function generateSteps(arr, op) {
  const steps = []
  const a = [...arr]

  if (op === 'Append') {
    const val = Math.floor(Math.random() * 80) + 10
    steps.push({ arr:[...a], hl:[], action:null, label:'Initial array' })
    steps.push({ arr:[...a], hl:[], action:'append', newVal:val, label:`Appending ${val}…` })
    const next = [...a, val]
    steps.push({ arr:next, hl:[next.length-1], action:'done', label:`${val} appended at index ${next.length-1}` })
  }

  if (op === 'Insert') {
    const idx = Math.max(1, Math.floor(a.length/2))
    const val = Math.floor(Math.random() * 80) + 10
    steps.push({ arr:[...a], hl:[], action:null, label:`Insert ${val} at index ${idx}` })
    for (let i = a.length-1; i >= idx; i--) {
      steps.push({ arr:[...a], hl:[i], shifting:i, action:'shift', label:`Shifting [${i}] → [${i+1}]` })
    }
    const next = [...a.slice(0,idx), val, ...a.slice(idx)]
    steps.push({ arr:next, hl:[idx], action:'done', label:`Inserted ${val} at index ${idx}` })
  }

  if (op === 'Delete') {
    const idx = Math.floor(a.length/2)
    steps.push({ arr:[...a], hl:[], action:null, label:`Delete at index ${idx}` })
    steps.push({ arr:[...a], hl:[idx], action:'delete', label:`Found ${a[idx]} at index ${idx}` })
    for (let i = idx; i < a.length-1; i++) {
      steps.push({ arr:[...a], hl:[i,i+1], action:'shift', label:`Shifting [${i+1}] → [${i}]` })
    }
    const next = [...a.slice(0,idx), ...a.slice(idx+1)]
    steps.push({ arr:next, hl:[], action:'done', label:`Deleted. Size now ${next.length}` })
  }

  if (op === 'Search') {
    const tgt = a[Math.floor(Math.random()*a.length)]
    steps.push({ arr:[...a], hl:[], action:null, label:`Search for ${tgt}` })
    for (let i = 0; i < a.length; i++) {
      const found = a[i]===tgt
      steps.push({ arr:[...a], hl:[i], action: found?'found':'check', label:`[${i}]=${a[i]} ${found?`== ${tgt} ✓`:`≠ ${tgt}`}` })
      if (found) break
    }
    const fi = a.indexOf(tgt)
    steps.push({ arr:[...a], hl:[fi], action:'done', label:`Found ${tgt} at index ${fi}` })
  }

  if (op === 'Traverse') {
    steps.push({ arr:[...a], hl:[], action:null, label:'Starting traversal…' })
    for (let i = 0; i < a.length; i++) {
      steps.push({ arr:[...a], hl:[i], action:'traverse', label:`[${i}] = ${a[i]}` })
    }
    steps.push({ arr:[...a], hl:[], action:'done', label:'Traversal complete' })
  }

  return steps
}

export default function ArrayVisualizer() {
  const initArr = useRef(randomArray(14, 5, 95)).current
  const [currentArr, setCurrentArr] = useState(initArr)
  const [op, setOp] = useState('Search')
  const [steps, setSteps] = useState([])
  const [disp, setDisp] = useState({ arr: initArr, hl:[], action:null, label:'' })

  // build steps on mount + when op/arr changes
  const buildSteps = useCallback((arr, operation) => {
    const s = generateSteps(arr, operation)
    setSteps(s)
    setDisp({ arr:[...arr], hl:[], action:null, label:'' })
    return s
  }, [])

  useEffect(() => { buildSteps(currentArr, op) }, [])

  const handleStep = useCallback((idx) => {
    setSteps(prev => {
      if (idx < 0) { setDisp({ arr:[...currentArr], hl:[], action:null, label:'' }); return prev }
      if (prev[idx]) setDisp(prev[idx])
      return prev
    })
  }, [currentArr])

  const { isPlaying, speed, setSpeed, play, stop, reset, stepForward, stepBack, progress } =
    usePlayback({ steps, onStep: handleStep })

  const handleOpChange = (newOp) => {
    stop()
    setOp(newOp)
    buildSteps(currentArr, newOp)
  }

  const handleRandomize = () => {
    stop()
    const arr = randomArray(14, 5, 95)
    setCurrentArr(arr)
    buildSteps(arr, op)
  }

  const { arr, hl=[], action, label } = disp
  const maxVal = Math.max(...(arr||[currentArr]), 1)

  const barColor = (i) => {
    if (!hl.includes(i)) return { bg:'rgba(139,92,246,0.18)', border:'rgba(139,92,246,0.28)', glow:'none' }
    if (action==='found'||action==='done') return { bg:'rgba(16,185,129,0.35)', border:'#10b981', glow:'0 0 14px rgba(16,185,129,0.4)' }
    if (action==='delete') return { bg:'rgba(239,68,68,0.35)', border:'#ef4444', glow:'0 0 14px rgba(239,68,68,0.4)' }
    if (action==='shift') return { bg:'rgba(251,191,36,0.3)', border:'#fbbf24', glow:'0 0 10px rgba(251,191,36,0.35)' }
    return { bg:'rgba(139,92,246,0.45)', border:'#8b5cf6', glow:'0 0 16px rgba(139,92,246,0.5)' }
  }

  return (
    <div className="space-y-4">
      {/* Op tabs */}
      <div className="flex gap-2 flex-wrap">
        {OPS.map(o => (
          <motion.button key={o} onClick={() => handleOpChange(o)}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            className="px-3 py-1.5 rounded-lg text-sm transition-all"
            style={{
              background: op===o?'rgba(139,92,246,0.15)':'rgba(255,255,255,0.04)',
              color: op===o?'#a78bfa':'#8888aa',
              border: op===o?'1px solid rgba(139,92,246,0.3)':'1px solid rgba(255,255,255,0.06)',
            }}>{o}</motion.button>
        ))}
      </div>

      {/* Canvas */}
      <div className="rounded-xl p-6" style={{ background:'#0d0d16', border:'1px solid rgba(255,255,255,0.06)', minHeight:'200px' }}>
        <AnimatePresence mode="wait">
          {label && (
            <motion.div key={label}
              initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              className="text-center mb-4 text-sm font-medium"
              style={{ color: action==='done'||action==='found'?'#10b981':action==='delete'?'#ef4444':action==='shift'?'#fbbf24':'#a78bfa' }}>
              {label}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bars */}
        <div className="flex items-end justify-center gap-1" style={{height:'110px'}}>
          <AnimatePresence initial={false}>
            {(arr||currentArr).map((val, i) => {
              const c = barColor(i)
              const h = Math.max((val/maxVal)*100, 8)
              return (
                <motion.div key={i}
                  layout
                  initial={{opacity:0,scaleY:0}}
                  animate={{
                    opacity:1, scaleY:1,
                    background: c.bg,
                    boxShadow: c.glow,
                    height: `${h}%`,
                  }}
                  exit={{opacity:0,scaleY:0}}
                  transition={{ type:'spring', stiffness:380, damping:28 }}
                  style={{
                    transformOrigin:'bottom',
                    width:'36px',
                    border:`1px solid ${c.border}`,
                    borderBottom:'none',
                    borderRadius:'4px 4px 0 0',
                    display:'flex', alignItems:'flex-end', justifyContent:'center', paddingBottom:'2px',
                  }}
                >
                  <span style={{color: hl.includes(i)?'#f0f0f8':'#555570', fontSize:'10px', fontFamily:'monospace', fontWeight:600}}>{val}</span>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Index row */}
        <div className="flex justify-center gap-1 mt-1">
          {(arr||currentArr).map((_,i) => (
            <div key={i} style={{width:'36px', textAlign:'center', color: hl.includes(i)?'#8b5cf6':'#333350', fontSize:'10px'}}>{i}</div>
          ))}
        </div>
      </div>

      <PlaybackControls
        isPlaying={isPlaying} onPlay={play} onPause={stop}
        onReset={() => { reset(); setDisp({arr:[...currentArr],hl:[],action:null,label:''}) }}
        onStepForward={stepForward} onStepBack={stepBack}
        onRandomize={handleRandomize}
        speed={speed} onSpeedChange={setSpeed} progress={progress}
      />
    </div>
  )
}
