import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePlayback } from '../../engines/playback/usePlayback'
import PlaybackControls from '../../components/shared/PlaybackControls'
import PageLayout from '../../components/layout/PageLayout'

function nQueensSteps(n=6) {
  const steps = []
  const board = Array.from({length:n},()=>new Array(n).fill(0))

  function isSafe(board,row,col) {
    for (let i=0;i<row;i++) if (board[i][col]) return false
    for (let i=row-1,j=col-1;i>=0&&j>=0;i--,j--) if (board[i][j]) return false
    for (let i=row-1,j=col+1;i>=0&&j<n;i--,j++) if (board[i][j]) return false
    return true
  }

  let solved = false
  function solve(row) {
    if (solved) return
    if (row===n) { steps.push({ board:board.map(r=>[...r]), label:`Solution found!`, trying:-1, tryCol:-1, state:'solved' }); solved=true; return }
    for (let col=0;col<n;col++) {
      steps.push({ board:board.map(r=>[...r]), label:`Try row ${row}, col ${col}`, trying:row, tryCol:col, state:'try' })
      if (isSafe(board,row,col)) {
        board[row][col]=1
        steps.push({ board:board.map(r=>[...r]), label:`Placed queen at (${row},${col})`, trying:row, tryCol:col, state:'place' })
        solve(row+1)
        if (solved) return
        board[row][col]=0
        steps.push({ board:board.map(r=>[...r]), label:`Backtrack: remove (${row},${col})`, trying:row, tryCol:col, state:'backtrack' })
      } else {
        steps.push({ board:board.map(r=>[...r]), label:`Unsafe at (${row},${col}), skip`, trying:row, tryCol:col, state:'unsafe' })
      }
    }
  }
  solve(0)
  return steps
}

export default function BacktrackingPage() {
  const [n] = useState(6)
  const [steps] = useState(() => nQueensSteps(6))
  const [disp, setDisp] = useState(() => steps[0])

  const handleStep = useCallback((idx) => {
    if (idx<0) { setDisp(steps[0]); return }  // steps is stable (never changes)
    if (steps[idx]) setDisp(steps[idx])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const { isPlaying, speed, setSpeed, play, stop, reset, stepForward, stepBack, progress } =
    usePlayback({ steps, onStep: handleStep })

  const { board=[], label='', trying=-1, tryCol=-1, state='' } = disp||{}

  const stateColors = {
    try:       { bg:'rgba(251,191,36,0.2)',  border:'#fbbf24' },
    place:     { bg:'rgba(16,185,129,0.3)',  border:'#10b981' },
    backtrack: { bg:'rgba(239,68,68,0.25)',  border:'#ef4444' },
    unsafe:    { bg:'rgba(239,68,68,0.1)',   border:'rgba(239,68,68,0.3)' },
    solved:    { bg:'rgba(16,185,129,0.35)', border:'#10b981' },
  }

  const labelColor = {
    try:'#fbbf24', place:'#10b981', backtrack:'#ef4444', unsafe:'#f87171', solved:'#10b981'
  }

  return (
    <PageLayout title="Backtracking" subtitle="Place, check constraints, backtrack on failure. N-Queens visualized." tag="Algorithms">
      <Section title="Concept">
        <p className="text-sm leading-relaxed" style={{color:'#8888aa'}}>
          Backtracking incrementally builds candidates and <span style={{color:'#a78bfa'}}>abandons a candidate</span> (backtracks) as soon as it determines the candidate cannot lead to a valid solution. Used in constraint satisfaction: N-Queens, Sudoku, graph coloring, permutation generation.
        </p>
      </Section>

      <Section title={`N-Queens (n=${n})`}>
        <p className="text-sm mb-4" style={{color:'#8888aa'}}>
          Place {n} queens on a {n}×{n} board so no two queens attack each other (same row, column, or diagonal).
        </p>

        <div className="rounded-xl p-5" style={{ background:'#0d0d16', border:'1px solid rgba(255,255,255,0.06)' }}>
          <AnimatePresence mode="wait">
            <motion.p key={label} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="text-center text-sm font-semibold mb-4"
              style={{color: labelColor[state]||'#a78bfa'}}>{label}</motion.p>
          </AnimatePresence>

          {/* Board */}
          <div className="flex justify-center mb-4">
            <div style={{ display:'grid', gridTemplateColumns:`repeat(${n},44px)`, gap:'2px' }}>
              {board.map((row,r) => row.map((cell,c) => {
                const isTrying = r===trying && c===tryCol
                const isLight = (r+c)%2===0
                const colors = stateColors[state]||{}
                const hasQueen = cell===1

                return (
                  <motion.div key={`${r}-${c}`}
                    animate={{
                      background: hasQueen ? colors.bg||'rgba(139,92,246,0.3)' : isTrying ? 'rgba(251,191,36,0.15)' : isLight ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                      borderColor: hasQueen ? colors.border||'#8b5cf6' : isTrying ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.06)',
                      boxShadow: hasQueen ? `0 0 12px ${colors.border||'#8b5cf6'}60` : 'none',
                    }}
                    className="flex items-center justify-center rounded"
                    style={{ width:'44px', height:'44px', border:'1px solid', fontSize:'20px' }}>
                    {hasQueen && (
                      <motion.span initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:400,damping:15}}>
                        ♛
                      </motion.span>
                    )}
                  </motion.div>
                )
              }))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-4 text-xs flex-wrap">
            {[
              {color:'#10b981',label:'Placed'},
              {color:'#fbbf24',label:'Trying'},
              {color:'#ef4444',label:'Backtrack'},
            ].map(l=>(
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{background:l.color}} />
                <span style={{color:'#555570'}}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3">
          <PlaybackControls isPlaying={isPlaying} onPlay={play} onPause={stop}
            onReset={reset} onStepForward={stepForward} onStepBack={stepBack}
            speed={speed} onSpeedChange={setSpeed} progress={progress} />
        </div>
      </Section>

      <Section title="Algorithm Skeleton">
        <div className="rounded-xl p-4 text-xs font-mono leading-relaxed overflow-x-auto"
          style={{ background:'#0d0d16', border:'1px solid rgba(255,255,255,0.06)', color:'#c9d1d9' }}>
          <pre>{`def backtrack(state):
    if is_solution(state):
        record(state)
        return
    
    for choice in choices(state):
        if is_valid(state, choice):
            apply(state, choice)     # place
            backtrack(state)         # recurse
            undo(state, choice)      # backtrack`}</pre>
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
