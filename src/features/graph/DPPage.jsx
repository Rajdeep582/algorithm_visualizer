import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePlayback } from '../../engines/playback/usePlayback'
import PlaybackControls from '../../components/shared/PlaybackControls'
import PageLayout from '../../components/layout/PageLayout'
import { ComplexityTable } from '../../components/shared/ComplexityBadge'

const COMPLEXITY = [
  { case: 'Fibonacci (DP)',    time: 'O(n)',   space: 'O(n)' },
  { case: 'Fibonacci (naive)', time: 'O(2ⁿ)',  space: 'O(n)' },
  { case: 'LCS',               time: 'O(m×n)', space: 'O(m×n)' },
  { case: 'Coin Change',       time: 'O(n×k)', space: 'O(n)' },
]

// ---------- Fibonacci steps ----------
function fibSteps(n=12) {
  const steps = []
  const dp = new Array(n+1).fill(null)
  dp[0]=0; dp[1]=1
  steps.push({ dp:[...dp], active:-1, label:`Init: dp[0]=0, dp[1]=1` })
  for (let i=2;i<=n;i++) {
    steps.push({ dp:[...dp], active:i, label:`dp[${i}] = dp[${i-1}](${dp[i-1]}) + dp[${i-2}](${dp[i-2]})` })
    dp[i]=dp[i-1]+dp[i-2]
    steps.push({ dp:[...dp], active:i, label:`dp[${i}] = ${dp[i]}` })
  }
  steps.push({ dp:[...dp], active:n, label:`F(${n}) = ${dp[n]}` })
  return steps
}

// ---------- LCS steps ----------
function lcsSteps(a='ABCBDAB', b='BDCABA') {
  const m=a.length, n=b.length
  const dp = Array.from({length:m+1},()=>new Array(n+1).fill(0))
  const steps = []
  steps.push({ dp: dp.map(r=>[...r]), row:-1, col:-1, label:`LCS("${a}", "${b}")` })
  for (let i=1;i<=m;i++) {
    for (let j=1;j<=n;j++) {
      if (a[i-1]===b[j-1]) {
        dp[i][j]=dp[i-1][j-1]+1
        steps.push({ dp:dp.map(r=>[...r]), row:i, col:j, label:`Match: ${a[i-1]} → dp[${i}][${j}]=${dp[i][j]}` })
      } else {
        dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1])
        steps.push({ dp:dp.map(r=>[...r]), row:i, col:j, label:`No match: max(dp[${i-1}][${j}],dp[${i}][${j-1}])=${dp[i][j]}` })
      }
    }
  }
  steps.push({ dp:dp.map(r=>[...r]), row:m, col:n, label:`LCS length = ${dp[m][n]}` })
  return steps
}

// ---------- Coin Change steps ----------
function coinChangeSteps(coins=[1,3,5], amount=11) {
  const dp = new Array(amount+1).fill(Infinity)
  dp[0]=0
  const steps = []
  steps.push({ dp:[...dp], active:-1, coin:-1, label:`Init: dp[0]=0, rest=∞` })
  for (const coin of coins) {
    for (let i=coin;i<=amount;i++) {
      steps.push({ dp:[...dp], active:i, coin, label:`coin=${coin}: dp[${i}] = min(dp[${i}]=${dp[i]===Infinity?'∞':dp[i]}, dp[${i-coin}]+1=${dp[i-coin]===Infinity?'∞':dp[i-coin]+1})` })
      if (dp[i-coin]+1 < dp[i]) {
        dp[i]=dp[i-coin]+1
        steps.push({ dp:[...dp], active:i, coin, label:`Updated dp[${i}]=${dp[i]}` })
      }
    }
  }
  steps.push({ dp:[...dp], active:amount, coin:-1, label:`Min coins for ${amount} = ${dp[amount]===Infinity?'impossible':dp[amount]}` })
  return steps
}

const TABS = [
  { key:'fib', label:'Fibonacci' },
  { key:'lcs', label:'LCS' },
  { key:'coin', label:'Coin Change' },
]

export default function DPPage() {
  const [tab, setTab] = useState('fib')
  const [fibN] = useState(12)
  const [steps, setSteps] = useState(() => fibSteps(12))
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

  const changeTab = (key) => {
    stop()
    setTab(key)
    const s = key==='fib' ? fibSteps(12) : key==='lcs' ? lcsSteps() : coinChangeSteps()
    setSteps(s)
    setDisp(s[0])
  }

  return (
    <PageLayout title="Dynamic Programming" subtitle="Break problem into subproblems. Memoize. Never recompute." tag="Algorithms">
      <Section title="Concept">
        <p className="text-sm leading-relaxed" style={{color:'#8888aa'}}>
          DP solves problems by combining solutions to <span style={{color:'#a78bfa'}}>overlapping subproblems</span>. Key insight: store results in a table — memoization (top-down) or tabulation (bottom-up) — to avoid exponential recomputation. Two conditions: <span style={{color:'#a78bfa'}}>optimal substructure</span> and <span style={{color:'#a78bfa'}}>overlapping subproblems</span>.
        </p>
      </Section>

      <Section title="Complexity"><ComplexityTable data={COMPLEXITY} /></Section>

      <Section title="Interactive Visualizer">
        <div className="flex gap-2 mb-4 flex-wrap">
          {TABS.map(t=>(
            <motion.button key={t.key} onClick={()=>changeTab(t.key)}
              whileHover={{ scale: 1.05, boxShadow: '0 0 12px rgba(139,92,246,0.25)' }}
              whileTap={{ scale: 0.93 }}
              className="px-3 py-1.5 rounded-lg text-sm"
              style={{ background:tab===t.key?'rgba(139,92,246,0.18)':'rgba(255,255,255,0.04)', color:tab===t.key?'#a78bfa':'#8888aa', border:tab===t.key?'1px solid rgba(139,92,246,0.35)':'1px solid rgba(255,255,255,0.06)', fontWeight:tab===t.key?600:400 }}>{t.label}</motion.button>
          ))}
        </div>

        {tab==='fib' && <FibViz disp={disp} n={fibN} />}
        {tab==='lcs' && <LCSViz disp={disp} />}
        {tab==='coin' && <CoinViz disp={disp} />}

        <div className="mt-3">
          <PlaybackControls isPlaying={isPlaying} onPlay={play} onPause={stop}
            onReset={reset} onStepForward={stepForward} onStepBack={stepBack}
            speed={speed} onSpeedChange={setSpeed} progress={progress} />
        </div>
      </Section>
    </PageLayout>
  )
}

function FibViz({ disp, n }) {
  const { dp=[], active=-1, label='' } = disp||{}
  return (
    <div className="rounded-xl p-5 space-y-4" style={{ background:'#0d0d16', border:'1px solid rgba(255,255,255,0.06)' }}>
      <div className="h-6 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {label && <motion.p key={label} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            transition={{duration:0.15}}
            className="text-sm font-medium" style={{color:'#a78bfa'}}>{label}</motion.p>}
        </AnimatePresence>
      </div>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {dp.slice(0,n+1).map((v,i) => (
          <motion.div key={i}
            animate={{
              background: i===active ? 'rgba(139,92,246,0.4)' : v!==null ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.03)',
              borderColor: i===active ? '#8b5cf6' : v!==null ? '#10b981' : 'rgba(255,255,255,0.06)',
              boxShadow: i===active ? '0 0 14px rgba(139,92,246,0.4)' : 'none',
            }}
            className="flex flex-col items-center rounded-lg px-2 py-2"
            style={{ border:'1px solid', minWidth:'44px' }}>
            <span className="font-mono text-sm font-semibold" style={{color: i===active?'#f0f0f8':v!==null?'#10b981':'#333350'}}>
              {v!==null ? v : '?'}
            </span>
            <span style={{color:'#333350',fontSize:'10px'}}>F({i})</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function LCSViz({ disp }) {
  const s1='ABCBDAB', s2='BDCABA'
  const { dp=[], row=-1, col=-1, label='' } = disp||{}
  if (!dp.length) return null
  return (
    <div className="rounded-xl p-4 overflow-auto" style={{ background:'#0d0d16', border:'1px solid rgba(255,255,255,0.06)' }}>
      <p className="text-center text-sm font-medium mb-3" style={{color:'#a78bfa'}}>{label}</p>
      <table className="text-xs font-mono mx-auto">
        <thead>
          <tr>
            <td className="w-8 h-8" />
            <td className="w-8 h-8 text-center" style={{color:'#555570'}}>ε</td>
            {s2.split('').map((c,i)=>(<td key={i} className="w-8 h-8 text-center font-bold" style={{color:'#a78bfa'}}>{c}</td>))}
          </tr>
        </thead>
        <tbody>
          {dp.map((r,i)=>(
            <tr key={i}>
              <td className="w-8 h-8 text-center font-bold" style={{color:'#a78bfa'}}>{i===0?'ε':s1[i-1]}</td>
              {r.map((v,j)=>{
                const isActive = i===row && j===col
                return (
                  <td key={j}>
                    <motion.div
                      animate={{ background: isActive?'rgba(139,92,246,0.4)':v>0?'rgba(16,185,129,0.15)':'transparent', borderColor: isActive?'#8b5cf6':'transparent' }}
                      className="w-7 h-7 flex items-center justify-center rounded text-xs font-semibold"
                      style={{ border:'1px solid', color: isActive?'#f0f0f8':v>0?'#10b981':'#555570' }}>
                      {v}
                    </motion.div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CoinViz({ disp }) {
  const { dp=[], active=-1, coin=-1, label='' } = disp||{}
  return (
    <div className="rounded-xl p-5 space-y-4" style={{ background:'#0d0d16', border:'1px solid rgba(255,255,255,0.06)' }}>
      <p className="text-center text-sm font-medium" style={{color:'#a78bfa'}}>{label||'Coins: [1,3,5] → Amount: 11'}</p>
      {coin>0 && <p className="text-center text-xs" style={{color:'#fbbf24'}}>Current coin: {coin}</p>}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {dp.map((v,i) => (
          <motion.div key={i}
            animate={{
              background: i===active?'rgba(139,92,246,0.4)':v!==Infinity&&v>0?'rgba(16,185,129,0.15)':i===0?'rgba(59,130,246,0.15)':'rgba(255,255,255,0.03)',
              borderColor: i===active?'#8b5cf6':v!==Infinity&&v>0?'#10b981':i===0?'#3b82f6':'rgba(255,255,255,0.06)',
              boxShadow: i===active?'0 0 14px rgba(139,92,246,0.4)':'none',
            }}
            className="flex flex-col items-center rounded-lg px-2 py-2"
            style={{ border:'1px solid', minWidth:'40px' }}>
            <span className="font-mono text-sm font-semibold" style={{color:i===active?'#f0f0f8':v===Infinity?'#333350':i===0?'#60a5fa':'#10b981'}}>
              {v===Infinity ? '∞' : v}
            </span>
            <span style={{color:'#333350',fontSize:'10px'}}>{i}</span>
          </motion.div>
        ))}
      </div>
    </div>
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
