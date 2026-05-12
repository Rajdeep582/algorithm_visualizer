import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

class BSTNode {
  constructor(val) {
    this.val = val
    this.left = null
    this.right = null
    this.id = `n${Math.random().toString(36).slice(2,8)}`
  }
}

function cloneTree(node) {
  if (!node) return null
  const n = new BSTNode(node.val)
  n.id = node.id
  n.left = cloneTree(node.left)
  n.right = cloneTree(node.right)
  return n
}

function insertBST(root, val) {
  if (!root) return new BSTNode(val)
  if (val < root.val) root.left = insertBST(root.left, val)
  else if (val > root.val) root.right = insertBST(root.right, val)
  return root
}

function deleteBST(root, val) {
  if (!root) return null
  if (val < root.val) { root.left = deleteBST(root.left, val); return root }
  if (val > root.val) { root.right = deleteBST(root.right, val); return root }
  if (!root.left) return root.right
  if (!root.right) return root.left
  let s = root.right
  while (s.left) s = s.left
  root.val = s.val
  root.right = deleteBST(root.right, s.val)
  return root
}

function buildFromArr(arr) {
  let r = null
  for (const v of arr) r = insertBST(r, v)
  return r
}

// Returns { nodeId: {x, y} } with x,y in grid units
function computeLayout(root) {
  const pos = {}
  let counter = 0
  function dfs(node, depth) {
    if (!node) return
    dfs(node.left, depth + 1)
    pos[node.id] = { x: counter++, y: depth }
    dfs(node.right, depth + 1)
  }
  dfs(root, 0)
  return pos
}

function collectNodes(root) {
  const nodes = []
  function dfs(n) { if (!n) return; dfs(n.left); nodes.push(n); dfs(n.right) }
  dfs(root)
  return nodes
}

function collectEdges(root, pos) {
  const edges = []
  function dfs(n) {
    if (!n) return
    if (n.left && pos[n.id] && pos[n.left.id])
      edges.push({ id:`${n.id}-L`, x1:pos[n.id].x, y1:pos[n.id].y, x2:pos[n.left.id].x, y2:pos[n.left.id].y })
    if (n.right && pos[n.id] && pos[n.right.id])
      edges.push({ id:`${n.id}-R`, x1:pos[n.id].x, y1:pos[n.id].y, x2:pos[n.right.id].x, y2:pos[n.right.id].y })
    dfs(n.left); dfs(n.right)
  }
  dfs(root)
  return edges
}

const HGAP = 52, VGAP = 60, R = 20, PAD = 28

export default function BSTVisualizer() {
  const [root, setRoot] = useState(() => buildFromArr([50,30,70,20,40,60,80,10,35]))
  const [highlighted, setHighlighted] = useState([])
  const [label, setLabel] = useState('')
  const [input, setInput] = useState('')
  const animRef = useRef(null)

  const cancelAnim = () => { if (animRef.current) clearTimeout(animRef.current); animRef.current = null }

  const flash = (ids, msg, ms=1100) => {
    setHighlighted(ids); setLabel(msg)
    animRef.current = setTimeout(() => { setHighlighted([]); setLabel('') }, ms)
  }

  const handleInsert = () => {
    const val = parseInt(input) || Math.floor(Math.random()*70)+10
    setInput('')
    cancelAnim()
    setRoot(r => insertBST(cloneTree(r), val))
    setTimeout(() => flash([], `Inserted ${val}`), 60)
  }

  const handleDelete = () => {
    const val = parseInt(input)
    setInput('')
    if (!val) return
    cancelAnim()
    setRoot(r => deleteBST(cloneTree(r), val))
    flash([], `Deleted ${val}`)
  }

  const handleSearch = async () => {
    const val = parseInt(input)
    setInput('')
    if (!val || !root) return
    cancelAnim()
    const path = []
    let cur = root
    while (cur) {
      path.push(cur.id)
      if (cur.val === val) break
      cur = val < cur.val ? cur.left : cur.right
    }
    for (let i = 0; i < path.length; i++) {
      setHighlighted(path.slice(0, i+1))
      setLabel(i === path.length-1 && root && findVal(root,val) ? `Found ${val}!` : `Searching…`)
      await delay(380)
    }
    const found = findVal(root, val)
    setLabel(found ? `Found ${val} ✓` : `${val} not found`)
    animRef.current = setTimeout(() => { setHighlighted([]); setLabel('') }, 1200)
  }

  const handleTraverse = async (type) => {
    cancelAnim()
    const order = []
    const inorder  = n => { if (!n) return; inorder(n.left); order.push(n); inorder(n.right) }
    const preorder = n => { if (!n) return; order.push(n); preorder(n.left); preorder(n.right) }
    const postorder= n => { if (!n) return; postorder(n.left); postorder(n.right); order.push(n) }
    if (type==='inorder')   inorder(root)
    if (type==='preorder')  preorder(root)
    if (type==='postorder') postorder(root)
    for (const node of order) {
      setHighlighted([node.id]); setLabel(`${type}: ${node.val}`)
      await delay(280)
    }
    setHighlighted([])
    setLabel(`${type}: [${order.map(n=>n.val).join(', ')}]`)
    animRef.current = setTimeout(() => setLabel(''), 2000)
  }

  const handleReset = () => {
    cancelAnim()
    setRoot(buildFromArr([50,30,70,20,40,60,80,10,35]))
    setHighlighted([]); setLabel('')
  }

  if (!root) return (
    <div className="rounded-xl p-10 text-center" style={{background:'#0d0d16',border:'1px solid rgba(255,255,255,0.06)',color:'#333350'}}>
      Empty — insert a value
    </div>
  )

  const pos = computeLayout(root)
  const nodes = collectNodes(root)
  const edges = collectEdges(root, pos)

  const xs = Object.values(pos).map(p=>p.x)
  const ys = Object.values(pos).map(p=>p.y)
  const minX = Math.min(...xs), maxX = Math.max(...xs)
  const maxY = Math.max(...ys)

  const svgW = (maxX - minX + 1) * HGAP + PAD*2
  const svgH = (maxY + 1) * VGAP + PAD*2

  const cx = id => (pos[id].x - minX) * HGAP + PAD + R
  const cy = id => pos[id].y * VGAP + PAD + R

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex gap-2 flex-wrap items-center">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleInsert()}
          placeholder="Value…" className="px-3 py-1.5 rounded-lg text-sm w-24 outline-none"
          style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',color:'#f0f0f8'}} />
        {[
          {label:'Insert', fn:handleInsert, accent:true},
          {label:'Delete', fn:handleDelete, accent:true},
          {label:'Search', fn:handleSearch, accent:true},
        ].map(b=>(
          <motion.button key={b.label} onClick={b.fn}
            whileHover={{scale:1.04,boxShadow:'0 0 14px rgba(139,92,246,0.25)'}}
            whileTap={{scale:0.95}}
            className="px-3 py-1.5 rounded-lg text-sm"
            style={{background:'rgba(139,92,246,0.12)',color:'#a78bfa',border:'1px solid rgba(139,92,246,0.25)'}}>
            {b.label}
          </motion.button>
        ))}
        <div className="w-px h-5" style={{background:'rgba(255,255,255,0.07)'}} />
        {[
          {label:'Inorder', fn:()=>handleTraverse('inorder')},
          {label:'Preorder', fn:()=>handleTraverse('preorder')},
          {label:'Postorder', fn:()=>handleTraverse('postorder')},
          {label:'Reset', fn:handleReset},
        ].map(b=>(
          <motion.button key={b.label} onClick={b.fn}
            whileHover={{scale:1.04}} whileTap={{scale:0.95}}
            className="px-3 py-1.5 rounded-lg text-sm"
            style={{background:'rgba(255,255,255,0.04)',color:'#8888aa',border:'1px solid rgba(255,255,255,0.06)'}}>
            {b.label}
          </motion.button>
        ))}
      </div>

      {/* SVG canvas */}
      <div className="rounded-xl overflow-auto" style={{background:'#0d0d16',border:'1px solid rgba(255,255,255,0.06)',minHeight:'280px'}}>
        <AnimatePresence mode="wait">
          {label && (
            <motion.p key={label} initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              className="text-center pt-3 text-sm font-medium" style={{color:'#a78bfa'}}>{label}</motion.p>
          )}
        </AnimatePresence>

        <svg width={Math.max(svgW, 360)} height={svgH} style={{display:'block',margin:'0 auto'}}>
          {/* Edges */}
          <AnimatePresence>
            {edges.map(e => (
              <motion.line key={e.id}
                x1={cx(nodes.find(n=>n.id===e.id.split('-')[0]+(e.id.endsWith('-L')||e.id.endsWith('-R')?'':'')).id)||cx(e.id.replace(/-[LR]$/,''))}
                y1={0} x2={0} y2={0}
                // direct coordinate approach:
                {...{
                  x1: (e.x1-minX)*HGAP+PAD+R,
                  y1: e.y1*VGAP+PAD+R,
                  x2: (e.x2-minX)*HGAP+PAD+R,
                  y2: e.y2*VGAP+PAD+R,
                }}
                stroke="rgba(255,255,255,0.09)"
                strokeWidth="1.5"
                initial={{opacity:0}}
                animate={{opacity:1}}
                exit={{opacity:0}}
                transition={{duration:0.25}}
              />
            ))}
          </AnimatePresence>

          {/* Nodes */}
          <AnimatePresence>
            {nodes.map(node => {
              const x = cx(node.id), y = cy(node.id)
              const isHL = highlighted.includes(node.id)
              return (
                <g key={node.id}>
                  <motion.circle cx={x} cy={y} r={R}
                    initial={{scale:0,opacity:0}}
                    animate={{
                      scale:1, opacity:1,
                      fill: isHL?'rgba(139,92,246,0.45)':'rgba(255,255,255,0.04)',
                      stroke: isHL?'#8b5cf6':'rgba(255,255,255,0.14)',
                    }}
                    exit={{scale:0,opacity:0}}
                    transition={{type:'spring',stiffness:380,damping:22}}
                    strokeWidth={isHL?2.5:1.5}
                    style={{filter: isHL?'drop-shadow(0 0 8px rgba(139,92,246,0.6))':'none'}}
                  />
                  <motion.text x={x} y={y}
                    textAnchor="middle" dominantBaseline="central"
                    fontSize="11" fontWeight="700" fontFamily="ui-monospace,monospace"
                    initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                    fill={isHL?'#f0f0f8':'#8888aa'}>
                    {node.val}
                  </motion.text>
                </g>
              )
            })}
          </AnimatePresence>
        </svg>
      </div>
    </div>
  )
}

function findVal(root, val) {
  if (!root) return false
  if (root.val===val) return true
  return val < root.val ? findVal(root.left,val) : findVal(root.right,val)
}

function delay(ms) { return new Promise(r=>setTimeout(r,ms)) }
