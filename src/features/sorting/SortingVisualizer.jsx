import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePlayback } from '../../engines/playback/usePlayback'
import PlaybackControls from '../../components/shared/PlaybackControls'
import { randomArray } from '../../lib/utils'
import { ALGO_META } from './sortingAlgorithms'

export default function SortingVisualizer() {
  const [algoKey, setAlgoKey] = useState('bubble')
  const [baseArr, setBaseArr] = useState(() => randomArray(22, 5, 95))
  const [steps, setSteps] = useState([])
  const [disp, setDisp] = useState({ arr:[], comparing:[], swapping:[], sorted:[], label:'', pivot:null })

  const buildSteps = useCallback((arr, key) => {
    const s = ALGO_META[key].fn([...arr])
    setSteps(s)
    setDisp({ arr:[...arr], comparing:[], swapping:[], sorted:[], label:'Press play to start', pivot:null })
    return s
  }, [])

  useEffect(() => { buildSteps(baseArr, algoKey) }, [])

  const handleStep = useCallback((idx) => {
    setSteps(prev => {
      if (idx < 0) {
        setDisp(d => ({ ...d, comparing:[], swapping:[], sorted:[], label:'Press play to start', pivot:null }))
        return prev
      }
      if (prev[idx]) setDisp(prev[idx])
      return prev
    })
  }, [])

  const { isPlaying, speed, setSpeed, play, stop, reset, stepForward, stepBack, progress } =
    usePlayback({ steps, onStep: handleStep })

  const handleAlgoChange = (key) => { stop(); setAlgoKey(key); buildSteps(baseArr, key) }
  const handleRandomize = () => {
    stop()
    const arr = randomArray(22, 5, 95)
    setBaseArr(arr); buildSteps(arr, algoKey)
  }

  const { arr, comparing=[], swapping=[], sorted=[], label='', pivot } = disp
  const maxVal = Math.max(...(arr.length ? arr : [1]))

  const getStyle = (i) => {
    if (sorted.includes(i))    return { bg:'rgba(16,185,129,0.5)',  b:'#10b981', g:'0 0 8px rgba(16,185,129,0.35)' }
    if (swapping.includes(i))  return { bg:'rgba(239,68,68,0.65)',  b:'#ef4444', g:'0 0 12px rgba(239,68,68,0.5)' }
    if (i === pivot)           return { bg:'rgba(251,191,36,0.6)',  b:'#fbbf24', g:'0 0 12px rgba(251,191,36,0.5)' }
    if (comparing.includes(i)) return { bg:'rgba(251,191,36,0.45)', b:'#fbbf24', g:'0 0 10px rgba(251,191,36,0.4)' }
    return { bg:'rgba(139,92,246,0.2)', b:'rgba(139,92,246,0.35)', g:'none' }
  }

  const meta = ALGO_META[algoKey]

  return (
    <div className="space-y-4">
      {/* Algorithm selector — two rows */}
      <div className="flex gap-1.5 flex-wrap">
        {Object.entries(ALGO_META).map(([key, m]) => (
          <motion.button key={key} onClick={() => handleAlgoChange(key)}
            whileHover={{scale:1.04}} whileTap={{scale:0.95}}
            className="px-2.5 py-1.5 rounded-lg text-xs transition-all"
            style={{
              background: algoKey===key?'rgba(139,92,246,0.18)':'rgba(255,255,255,0.04)',
              color: algoKey===key?'#c4b5fd':'#8888aa',
              border: algoKey===key?'1px solid rgba(139,92,246,0.35)':'1px solid rgba(255,255,255,0.06)',
              fontWeight: algoKey===key?600:400,
            }}>{m.name}</motion.button>
        ))}
      </div>

      {/* Complexity strip */}
      <div className="flex gap-2 flex-wrap">
        {[
          {label:'Best',  val:meta.best},
          {label:'Avg',   val:meta.avg},
          {label:'Worst', val:meta.worst},
          {label:'Space', val:meta.space},
        ].map(c => (
          <div key={c.label} className="px-3 py-1 rounded-lg flex gap-1.5 items-center"
            style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
            <span className="text-xs" style={{color:'#444460'}}>{c.label}</span>
            <span className="text-xs font-mono font-semibold" style={{color:'#a78bfa'}}>{c.val}</span>
          </div>
        ))}
      </div>

      {/* Bars */}
      <div className="rounded-xl px-4 pt-4 pb-2" style={{background:'#0d0d16',border:'1px solid rgba(255,255,255,0.06)',minHeight:'200px'}}>
        {/* Status + legend */}
        <div className="flex items-center justify-between mb-3">
          <AnimatePresence mode="wait">
            <motion.span key={label}
              initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="text-xs font-medium"
              style={{color:swapping.length?'#f87171':comparing.length?'#fbbf24':sorted.length===arr.length&&arr.length>0?'#10b981':'#8888aa'}}>
              {label}
            </motion.span>
          </AnimatePresence>
          <div className="flex gap-3">
            {[{c:'#fbbf24',l:'Comparing'},{c:'#ef4444',l:'Swapping'},{c:'#10b981',l:'Sorted'}].map(x=>(
              <div key={x.l} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-sm" style={{background:x.c}} />
                <span className="text-xs" style={{color:'#444460'}}>{x.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-px" style={{height:'130px'}}>
          {arr.map((val,i) => {
            const s = getStyle(i)
            return (
              <motion.div key={i}
                className="flex-1 rounded-t-sm min-w-0"
                animate={{
                  height: `${Math.max((val/maxVal)*100,2)}%`,
                  background: s.bg,
                  borderColor: s.b,
                  boxShadow: s.g,
                }}
                transition={{type:'spring', stiffness:500, damping:32, mass:0.6}}
                style={{border:`1px solid ${s.b}`,borderBottom:'none'}}
              />
            )
          })}
        </div>
      </div>

      <PlaybackControls
        isPlaying={isPlaying} onPlay={play} onPause={stop}
        onReset={reset} onStepForward={stepForward} onStepBack={stepBack}
        onRandomize={handleRandomize} speed={speed} onSpeedChange={setSpeed} progress={progress}
      />
    </div>
  )
}
