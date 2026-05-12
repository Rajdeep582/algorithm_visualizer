import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePlayback } from '../../engines/playback/usePlayback'
import PlaybackControls from '../../components/shared/PlaybackControls'
import { randomArray } from '../../lib/utils'
import PageLayout from '../../components/layout/PageLayout'
import { ComplexityTable } from '../../components/shared/ComplexityBadge'

const COMPLEXITY = [
  { case: 'Linear Search',        time: 'O(n)',          space: 'O(1)' },
  { case: 'Binary Search',        time: 'O(log n)',      space: 'O(1)' },
  { case: 'Jump Search',          time: 'O(√n)',         space: 'O(1)' },
  { case: 'Interpolation Search', time: 'O(log log n)*', space: 'O(1)' },
  { case: 'Exponential Search',   time: 'O(log n)',      space: 'O(1)' },
]

function genLinearSteps(arr, target) {
  const s = [{ arr, hl:[], lo:null, hi:null, mid:null, label:`Linear: find ${target}`, found:false }]
  for (let i=0; i<arr.length; i++) {
    const found = arr[i]===target
    s.push({ arr, hl:[i], lo:null, hi:null, mid:null, label:`[${i}]=${arr[i]} ${found?`== ${target} ✓`:`≠ ${target}`}`, found })
    if (found) break
  }
  if (!s.some(x=>x.found)) s.push({ arr, hl:[], lo:null, hi:null, mid:null, label:`${target} not found`, notFound:true })
  return s
}

function genBinarySteps(arr, target) {
  const sorted = [...arr].sort((a,b)=>a-b)
  let lo=0, hi=sorted.length-1
  const s = [{ arr:sorted, hl:[], lo:0, hi:sorted.length-1, mid:null, label:`Binary: find ${target} (sorted)`, found:false }]
  while (lo<=hi) {
    const mid=Math.floor((lo+hi)/2), found=sorted[mid]===target
    s.push({ arr:sorted, hl:[mid], lo, hi, mid, label: found?`Found ${target} at [${mid}]!`:sorted[mid]<target?`[${mid}]=${sorted[mid]} < ${target} → right`:`[${mid}]=${sorted[mid]} > ${target} → left`, found })
    if (found) break
    if (sorted[mid]<target) lo=mid+1; else hi=mid-1
  }
  if (!s.some(x=>x.found)) s.push({ arr:sorted, hl:[], lo:null, hi:null, mid:null, label:`${target} not found`, notFound:true })
  return s
}

function genJumpSteps(arr, target) {
  const sorted = [...arr].sort((a,b)=>a-b)
  const n=sorted.length, step=Math.floor(Math.sqrt(n))
  let prev=0, s=[{ arr:sorted, hl:[], lo:null, hi:null, mid:null, label:`Jump: step size √${n}≈${step}` }]
  while (step<n && sorted[step]<target) {
    s.push({ arr:sorted, hl:[step], lo:prev, hi:step, mid:null, label:`[${step}]=${sorted[step]} < ${target}, jump` })
    prev=step; step+=Math.floor(Math.sqrt(n))
  }
  for (let i=prev; i<=Math.min(step,n)-1; i++) {
    const found=sorted[i]===target
    s.push({ arr:sorted, hl:[i], lo:prev, hi:Math.min(step,n)-1, mid:null, label:found?`Found ${target} at [${i}]!`:`[${i}]=${sorted[i]} ≠ ${target}`, found })
    if (found) break
  }
  if (!s.some(x=>x.found)) s.push({ arr:sorted, hl:[], lo:null, hi:null, mid:null, label:`${target} not found`, notFound:true })
  return s
}

function genExponentialSteps(arr, target) {
  const sorted = [...arr].sort((a,b)=>a-b)
  const n=sorted.length
  const s = [{ arr:sorted, hl:[], lo:null, hi:null, mid:null, label:`Exponential: double bound until >${target}`, found:false }]
  if (sorted[0]===target) { s.push({ arr:sorted, hl:[0], lo:null, hi:null, mid:null, label:`Found at [0]!`, found:true }); return s }
  let i=1
  while (i<n && sorted[i]<=target) {
    s.push({ arr:sorted, hl:[i], lo:null, hi:null, mid:null, label:`[${i}]=${sorted[i]} ≤ ${target}, double i` })
    i*=2
  }
  let lo=Math.floor(i/2), hi=Math.min(i,n-1)
  s.push({ arr:sorted, hl:[], lo, hi, mid:null, label:`Binary search in [${lo}..${hi}]` })
  let lo2=lo, hi2=hi
  while (lo2<=hi2) {
    const mid=Math.floor((lo2+hi2)/2), found=sorted[mid]===target
    s.push({ arr:sorted, hl:[mid], lo:lo2, hi:hi2, mid, label:found?`Found ${target} at [${mid}]!`:`[${mid}]=${sorted[mid]} ${sorted[mid]<target?'< → right':'> → left'}`, found })
    if (found) break
    if (sorted[mid]<target) lo2=mid+1; else hi2=mid-1
  }
  if (!s.some(x=>x.found)) s.push({ arr:sorted, hl:[], lo:null, hi:null, mid:null, label:`${target} not found`, notFound:true })
  return s
}

const ALGOS = [
  { key:'linear',      label:'Linear',      gen: genLinearSteps },
  { key:'binary',      label:'Binary',      gen: genBinarySteps },
  { key:'jump',        label:'Jump',        gen: genJumpSteps },
  { key:'exponential', label:'Exponential', gen: genExponentialSteps },
]

export default function SearchingPage() {
  const [baseArr] = useState(() => randomArray(16, 5, 95))
  const [algo, setAlgo] = useState('linear')
  const [target, setTarget] = useState(() => baseArr[Math.floor(baseArr.length/3)])
  const [targetInput, setTargetInput] = useState(() => String(baseArr[Math.floor(baseArr.length/3)]))

  const makeSteps = (key, tgt) => {
    const a = ALGOS.find(x=>x.key===key)
    return a.gen(baseArr, tgt)
  }

  const [steps, setSteps] = useState(() => makeSteps('linear', baseArr[Math.floor(baseArr.length/3)]))
  const [disp, setDisp] = useState(() => steps[0])
  const stepsRef = useRef(steps)
  useEffect(() => { stepsRef.current = steps }, [steps])

  const handleStep = useCallback((idx) => {
    const s = stepsRef.current
    if (idx < 0) { setDisp(s[0]); return }
    if (s[idx]) setDisp(s[idx])
  }, [])

  const { isPlaying, speed, setSpeed, play, stop, reset, stepForward, stepBack, progress } =
    usePlayback({ steps, onStep: handleStep })

  const applyTarget = (val) => {
    const n = parseInt(val)
    if (isNaN(n)) return
    stop()
    setTarget(n)
    const s = makeSteps(algo, n)
    setSteps(s)
    setDisp(s[0])
  }

  const changeAlgo = (key) => {
    stop()
    setAlgo(key)
    const s = makeSteps(key, target)
    setSteps(s)
    setDisp(s[0])
  }

  const { arr=baseArr, hl=[], lo, hi, mid, label='', found, notFound } = disp||{}

  const getStyle = (i) => {
    if (found && hl.includes(i)) return { bg:'rgba(16,185,129,0.4)', border:'#10b981', glow:'0 0 12px rgba(16,185,129,0.4)' }
    if (notFound) return { bg:'rgba(239,68,68,0.08)', border:'rgba(239,68,68,0.2)', glow:'none' }
    if (hl.includes(i)) return { bg:'rgba(251,191,36,0.3)', border:'#fbbf24', glow:'0 0 12px rgba(251,191,36,0.4)' }
    if (lo!==null && hi!==null && i>=lo && i<=hi) return { bg:'rgba(59,130,246,0.1)', border:'rgba(59,130,246,0.2)', glow:'none' }
    return { bg:'rgba(255,255,255,0.03)', border:'rgba(255,255,255,0.06)', glow:'none' }
  }

  return (
    <PageLayout title="Searching" subtitle="Linear O(n), Binary O(log n), Jump O(√n), Exponential O(log n)" tag="Algorithms">

      <Section title="Complexity">
        <ComplexityTable data={COMPLEXITY} />
      </Section>

      <Section title="Interactive Visualizer">
        <div className="flex gap-2 mb-4 flex-wrap">
          {ALGOS.map(a => (
            <motion.button key={a.key} onClick={()=>changeAlgo(a.key)}
              whileHover={{ scale: 1.05, boxShadow: '0 0 12px rgba(139,92,246,0.25)' }}
              whileTap={{ scale: 0.93 }}
              className="px-3 py-1.5 rounded-lg text-sm"
              style={{ background: algo===a.key?'rgba(139,92,246,0.18)':'rgba(255,255,255,0.04)', color: algo===a.key?'#a78bfa':'#8888aa', border: algo===a.key?'1px solid rgba(139,92,246,0.35)':'1px solid rgba(255,255,255,0.06)', fontWeight: algo===a.key?600:400 }}
            >{a.label}</motion.button>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs" style={{color:'#555570'}}>Search for:</span>
          <input
            value={targetInput}
            onChange={e => setTargetInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && applyTarget(targetInput)}
            onBlur={() => applyTarget(targetInput)}
            placeholder="value"
            className="px-3 py-1.5 rounded-lg text-sm w-20 outline-none font-mono"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(139,92,246,0.25)', color: '#a78bfa' }}
          />
          <span className="text-xs" style={{color:'#333350'}}>Enter to apply</span>
        </div>

        <div className="rounded-xl p-6 space-y-4" style={{ background:'#0d0d16', border:'1px solid rgba(255,255,255,0.06)' }}>
          <div className="h-6 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {label && <motion.p key={label} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                transition={{duration:0.15}}
                className="text-sm font-medium"
                style={{ color: found?'#10b981':notFound?'#ef4444':hl.length?'#fbbf24':'#a78bfa' }}>
                {label}
              </motion.p>}
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap justify-center gap-1.5">
            {arr.map((val,i) => {
              const s = getStyle(i)
              return (
                <motion.div key={i}
                  animate={{ background:s.bg, borderColor:s.border, boxShadow:s.glow }}
                  transition={{ duration:0.25 }}
                  className="flex flex-col items-center justify-center rounded-lg"
                  style={{ width:'44px', height:'44px', border:`1px solid ${s.border}` }}>
                  <span className="font-mono font-semibold text-sm" style={{ color: hl.includes(i)?'#f0f0f8':'#8888aa' }}>{val}</span>
                  <span style={{ color:'#333350', fontSize:'10px' }}>{i}</span>
                </motion.div>
              )
            })}
          </div>

          {lo!==null && (
            <div className="flex justify-center gap-4 text-xs">
              {[{label:'lo',val:lo,color:'#3b82f6'},{label:'mid',val:mid,color:'#fbbf24'},{label:'hi',val:hi,color:'#ef4444'}].map(p=>(
                <span key={p.label} style={{color:p.color}}>{p.label}={p.val??'—'}</span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3">
          <PlaybackControls isPlaying={isPlaying} onPlay={play} onPause={stop}
            onReset={reset} onStepForward={stepForward} onStepBack={stepBack}
            speed={speed} onSpeedChange={setSpeed} progress={progress} />
        </div>
      </Section>

      <Section title="How They Work">
        <div className="space-y-4 text-sm" style={{color:'#8888aa'}}>
          {[
            { name:'Linear Search', desc:'Scan each element left to right. Works on unsorted arrays. O(n) worst case.' },
            { name:'Binary Search', desc:'Requires sorted array. Halve search space each step — O(log n). Classic divide and conquer.' },
            { name:'Jump Search', desc:'Jump √n steps forward until overshoot, then linear scan back. Sorted required. O(√n).' },
            { name:'Exponential Search', desc:'Double index (1,2,4,8…) to find upper bound, then binary search in range. Good for unbounded arrays. O(log n).' },
          ].map(a=>(
            <div key={a.name}>
              <span style={{color:'#f0f0f8',fontWeight:600}}>{a.name}: </span>
              {a.desc}
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
