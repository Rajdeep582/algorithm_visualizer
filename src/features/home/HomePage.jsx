import { motion } from 'framer-motion'
import { Cpu, Zap, GitBranch, ChevronRight, ArrowUpDown, LayoutList, Network, Grid3X3, Undo2, Triangle, Search, ListTree } from 'lucide-react'

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
    <div className="max-w-3xl mx-auto px-8 py-16">
      <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs"
          style={{ background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.2)', color:'#8b5cf6' }}>
          <Cpu size={11} /><span>Algorithm Visualizer</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4" style={{color:'#f0f0f8',lineHeight:1.15}}>
          Understand algorithms<br />
          <span style={{background:'linear-gradient(135deg,#8b5cf6,#3b82f6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            through motion.
          </span>
        </h1>
        <p className="text-base max-w-lg mx-auto" style={{color:'#8888aa'}}>
          Animated, interactive visualizations for every major algorithm and data structure. Step-by-step, educational, premium-quality.
        </p>
      </motion.div>

      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}}
        className="grid grid-cols-3 gap-3 mb-10">
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
        <div className="grid grid-cols-2 gap-3">
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
  )
}
