import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Zap, GitBranch, ChevronRight, ArrowUpDown, LayoutList, Network, Grid3X3, Undo2, Triangle, Search, ListTree } from 'lucide-react'

function GridFabric() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf

    // Glowing pulse nodes — pick random grid intersections to light up
    const SPACING = 44
    const PULSE_COUNT = 14
    let w, h, cols, rows, pulses

    function resize() {
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w
      canvas.height = h
      cols = Math.ceil(w / SPACING) + 1
      rows = Math.ceil(h / SPACING) + 1
      // init pulses at random grid nodes
      pulses = Array.from({ length: PULSE_COUNT }, () => spawnPulse())
    }

    function spawnPulse() {
      return {
        col: Math.floor(Math.random() * (cols - 1)),
        row: Math.floor(Math.random() * (rows - 1)),
        phase: Math.random() * Math.PI * 2,
        speed: 0.004 + Math.random() * 0.006,
        // colour: alternate purple / blue
        hue: Math.random() < 0.6 ? 265 : 220,
        size: 18 + Math.random() * 28,
      }
    }

    let t = 0
    function draw() {
      t += 1
      ctx.clearRect(0, 0, w, h)

      // ── 1. Dot grid ──────────────────────────────────────────────────────
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = c * SPACING
          const y = r * SPACING
          ctx.beginPath()
          ctx.arc(x, y, 1, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(139,92,246,0.18)'
          ctx.fill()
        }
      }

      // ── 2. Glowing pulse nodes ────────────────────────────────────────────
      pulses.forEach(p => {
        p.phase += p.speed
        const alpha = (Math.sin(p.phase) * 0.5 + 0.5)   // 0..1
        const x = p.col * SPACING
        const y = p.row * SPACING

        // Dot brightens
        ctx.beginPath()
        ctx.arc(x, y, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue},80%,70%,${alpha * 0.9})`
        ctx.fill()

        // Radial glow halo
        const grad = ctx.createRadialGradient(x, y, 0, x, y, p.size)
        grad.addColorStop(0, `hsla(${p.hue},80%,65%,${alpha * 0.22})`)
        grad.addColorStop(1, `hsla(${p.hue},60%,50%,0)`)
        ctx.beginPath()
        ctx.arc(x, y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        // Respawn elsewhere when faded out after a full cycle
        if (p.phase > Math.PI * 2 * (2 + Math.floor(p.phase / (Math.PI * 2)))) {
          p.col = Math.floor(Math.random() * (cols - 1))
          p.row = Math.floor(Math.random() * (rows - 1))
          p.phase = 0
          p.hue = Math.random() < 0.6 ? 265 : 220
          p.size = 18 + Math.random() * 28
        }
      })

      // ── 3. Large drifting depth orbs ─────────────────────────────────────
      const orbs = [
        { x: 0.25, y: 0.2,  hue: 265, r: 0.28, spd: 0.00018 },
        { x: 0.75, y: 0.65, hue: 220, r: 0.30, spd: 0.00012 },
        { x: 0.55, y: 0.1,  hue: 240, r: 0.20, spd: 0.00022 },
      ]
      orbs.forEach((o, i) => {
        const phase = t * o.spd * Math.PI * 2 + i * 2.1
        const ox = (o.x + Math.sin(phase * 0.7) * 0.08) * w
        const oy = (o.y + Math.cos(phase * 0.5) * 0.1) * h
        const pulse = Math.sin(phase * 1.3) * 0.5 + 0.5
        const radius = o.r * Math.min(w, h) * (0.85 + pulse * 0.15)
        const alpha = 0.04 + pulse * 0.05

        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, radius)
        grad.addColorStop(0, `hsla(${o.hue},75%,60%,${alpha})`)
        grad.addColorStop(0.5, `hsla(${o.hue},60%,45%,${alpha * 0.4})`)
        grad.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(ox, oy, radius, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      })

      // ── 4. Vignette — darker edges, lighter centre ────────────────────────
      const vg = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h) * 0.7)
      vg.addColorStop(0, 'transparent')
      vg.addColorStop(1, 'rgba(0,0,0,0.45)')
      ctx.fillStyle = vg
      ctx.fillRect(0, 0, w, h)

      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

const FEATURED = [
  { id:'sorting',       title:'Sorting',         desc:'8 algorithms animated',             Icon: ArrowUpDown,  tag:'Algorithm' },
  { id:'array',         title:'Array',           desc:'Insert, delete, search live',        Icon: LayoutList,   tag:'Data Structure' },
  { id:'bst',           title:'BST',             desc:'Insert, traverse, search',           Icon: ListTree,     tag:'Data Structure' },
  { id:'graph',         title:'Graph BFS/DFS',   desc:'Visual node traversal',              Icon: Network,      tag:'Algorithm' },
  { id:'dp',            title:'Dynamic Prog.',   desc:'Fibonacci, LCS, Coin Change',        Icon: Grid3X3,      tag:'Algorithm' },
  { id:'backtracking',  title:'Backtracking',    desc:'N-Queens step-by-step',              Icon: Undo2,        tag:'Algorithm' },
  { id:'heap',          title:'Heap',            desc:'Min/Max heap insert & extract',      Icon: Triangle,     tag:'Data Structure' },
  { id:'searching',     title:'Searching',       desc:'Linear, Binary, Jump, Exponential',  Icon: Search,       tag:'Algorithm' },
]

export default function HomePage({ onSelect }) {
  return (
    <div className="relative min-h-full" style={{ overflow: 'hidden' }}>
      <GridFabric />
    <div className="relative max-w-3xl mx-auto px-4 py-8 sm:px-8 sm:py-16" style={{ zIndex: 1 }}>
      <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs"
          style={{ background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.2)', color:'#8b5cf6' }}>
          <Cpu size={11} /><span>Algorithm Visualizer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{color:'#f0f0f8',lineHeight:1.15}}>
          Understand algorithms<br />
          <span style={{background:'linear-gradient(135deg,#8b5cf6,#3b82f6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            through motion.
          </span>
        </h1>
        <p className="text-sm sm:text-base max-w-lg mx-auto" style={{color:'#8888aa'}}>
          Animated, interactive visualizations for every major algorithm and data structure. Step-by-step, educational, premium-quality.
        </p>
      </motion.div>

      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}}
        className="grid grid-cols-3 gap-2 sm:gap-3 mb-8">
        {[
          {label:'Visualizers',value:'12+',icon:Zap},
          {label:'Data Structures',value:'7',icon:GitBranch},
          {label:'Algorithms',value:'15+',icon:Cpu},
        ].map((s,i) => (
          <motion.div key={s.label} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
            transition={{delay:0.2+i*0.05}}
            className="rounded-xl p-4 text-center"
            style={{background:'#0d0d16',border:'1px solid rgba(255,255,255,0.06)'}}>
            <div className="text-2xl font-bold mb-1" style={{color:'#f0f0f8'}}>{s.value}</div>
            <div className="text-xs" style={{color:'#555570'}}>{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}}>
        <h2 className="text-sm font-medium mb-4 uppercase tracking-widest" style={{color:'#555570'}}>Get Started</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURED.map((f,i) => (
            <motion.button key={f.id} onClick={()=>onSelect(f.id)}
              initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.3+i*0.04}}
              whileHover={{y:-2}} whileTap={{scale:0.98}}
              className="text-left rounded-xl p-4 group"
              style={{
                background:'#0d0d16',
                border:'1px solid rgba(255,255,255,0.06)',
                transition:'box-shadow 0.08s ease, border-color 0.08s ease',
              }}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 8px 30px rgba(139,92,246,0.2)';e.currentTarget.style.borderColor='rgba(139,92,246,0.3)'}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow='';e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'}}
            >
              <div className="flex items-start justify-between mb-2">
                <f.Icon size={20} style={{color:'#8b5cf6'}} />
                <ChevronRight size={14} style={{color:'#333350',marginTop:2}} />
              </div>
              <div className="font-semibold text-sm mb-1" style={{color:'#f0f0f8'}}>{f.title}</div>
              <div className="text-xs" style={{color:'#555570'}}>{f.desc}</div>
              <div className="mt-2">
                <span className="text-xs px-2 py-0.5 rounded"
                  style={{background:'rgba(139,92,246,0.08)',color:'#6b5ca8',fontSize:'10px'}}>{f.tag}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
    </div>
  )
}
