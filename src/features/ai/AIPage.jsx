import { useState, useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { Brain, Layers, Eye, RotateCcw, Cpu, GitBranch, Network, Zap } from 'lucide-react'

function Section({ id, title, icon: Icon, children }) {
  return (
    <motion.section id={id}
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.45 }}
      className="mb-14">
      <div className="flex items-center gap-3 mb-5">
        {Icon && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>
            <Icon size={15} style={{ color: '#a78bfa' }} />
          </div>
        )}
        <h2 className="text-xl font-bold" style={{ color: '#f0f0f8' }}>{title}</h2>
      </div>
      {children}
    </motion.section>
  )
}

function SubHead({ children }) {
  return <div className="text-xs font-semibold uppercase tracking-widest mb-3 mt-6" style={{ color: '#555570' }}>{children}</div>
}

function Hi({ c = '#a78bfa', children }) {
  return <span style={{ color: c }}>{children}</span>
}

function InfoCard({ title, desc, accent = '#8b5cf6', icon: Icon, delay = 0, points }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay, duration: 0.35 }}
      whileHover={{ y: -3 }}
      className="rounded-xl p-5"
      style={{ background: '#0d0d16', border: `1px solid ${accent}28`, cursor: 'default', transition: 'box-shadow 0.12s ease' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 8px 28px ${accent}18`}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {Icon && <Icon size={16} style={{ color: accent, marginBottom: 10 }} />}
      <div className="font-semibold text-sm mb-2" style={{ color: '#f0f0f8' }}>{title}</div>
      <div className="text-xs leading-relaxed" style={{ color: '#8888aa' }}>{desc}</div>
      {points && (
        <ul className="mt-3 space-y-1">
          {points.map((p, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs" style={{ color: '#8888aa' }}>
              <span style={{ color: accent, marginTop: 1 }}>▸</span>{p}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  )
}

/* ─── AI Hierarchy ─── */
function AIHierarchy() {
  const rings = [
    { label: 'Artificial Intelligence', r: 118, color: '#8b5cf6' },
    { label: 'Machine Learning', r: 80, color: '#3b82f6' },
    { label: 'Deep Learning', r: 42, color: '#10b981' },
  ]
  return (
    <div className="rounded-xl flex items-center justify-center py-6"
      style={{ background: '#070710', border: '1px solid rgba(255,255,255,0.06)' }}>
      <svg width={260} height={260}>
        {rings.map((ring, i) => (
          <g key={i}>
            <motion.circle cx={130} cy={130} r={ring.r}
              fill={`${ring.color}08`} stroke={ring.color} strokeWidth="1"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.9 }}
            />
            <text x={130} y={130 - ring.r + 14} textAnchor="middle"
              fontSize="11" fill={ring.color} fontFamily="system-ui" fontWeight="600">
              {ring.label}
            </text>
          </g>
        ))}
        <motion.circle cx={130} cy={130} r={7} fill="#10b981"
          animate={{ r: [5, 8, 5], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>
    </div>
  )
}

/* ─── Neural Network Diagram ─── */
function NNDiagram() {
  const svgW = 500, Y_TOP = 16, Y_BOT = 238
  const LAYERS = [
    { label: 'Input (3)', n: 3, x: 60, color: '#3b82f6' },
    { label: 'Hidden 1 (5)', n: 5, x: 193, color: '#8b5cf6' },
    { label: 'Hidden 2 (5)', n: 5, x: 337, color: '#8b5cf6' },
    { label: 'Output (2)', n: 2, x: 460, color: '#10b981' },
  ]
  const nodeY = (n, i) => Y_TOP + ((Y_BOT - Y_TOP) / (n + 1)) * (i + 1)
  const edges = []
  for (let li = 0; li < LAYERS.length - 1; li++) {
    const A = LAYERS[li], B = LAYERS[li + 1]
    for (let i = 0; i < A.n; i++)
      for (let j = 0; j < B.n; j++)
        edges.push({ x1: A.x, y1: nodeY(A.n, i), x2: B.x, y2: nodeY(B.n, j), k: `${li}${i}${j}` })
  }
  return (
    <div className="rounded-xl overflow-x-auto"
      style={{ background: '#070710', border: '1px solid rgba(255,255,255,0.06)', padding: '20px 16px 8px' }}>
      <svg width={svgW} height={270} style={{ display: 'block', margin: '0 auto' }}>
        {edges.map(e => (
          <line key={e.k} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke="rgba(139,92,246,0.1)" strokeWidth="1" />
        ))}
        {LAYERS.map((L, li) => (
          <g key={li}>
            {Array.from({ length: L.n }, (_, i) => (
              <motion.circle key={i}
                cx={L.x} cy={nodeY(L.n, i)} r={12}
                fill={L.color + '1e'} stroke={L.color} strokeWidth="1.5"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: li * 0.3 + i * 0.11 }}
              />
            ))}
            <text x={L.x} y={258} textAnchor="middle" fontSize="10"
              fill="#444460" fontFamily="system-ui">{L.label}</text>
          </g>
        ))}
        <text x={126} y={12} textAnchor="middle" fontSize="9" fill="#6b5ca8" fontFamily="system-ui">ReLU</text>
        <text x={265} y={12} textAnchor="middle" fontSize="9" fill="#6b5ca8" fontFamily="system-ui">ReLU</text>
        <text x={398} y={12} textAnchor="middle" fontSize="9" fill="#2d6b4a" fontFamily="system-ui">Softmax</text>
      </svg>
    </div>
  )
}

/* ─── CNN Diagram ─── */
function CNNDiagram() {
  const layers = [
    { label: 'Input', sub: '32×32×3', h: 88, w: 40, color: '#3b82f6' },
    { label: 'Conv', sub: '5×5 filter', h: 72, w: 28, color: '#8b5cf6' },
    { label: 'Pool', sub: 'MaxPool 2×2', h: 52, w: 22, color: '#6366f1' },
    { label: 'Conv', sub: '3×3 filter', h: 44, w: 20, color: '#8b5cf6' },
    { label: 'Pool', sub: 'MaxPool 2×2', h: 32, w: 16, color: '#6366f1' },
    { label: 'Flatten', sub: 'vector', h: 60, w: 12, color: '#ec4899' },
    { label: 'Dense', sub: 'FC layer', h: 48, w: 16, color: '#f59e0b' },
    { label: 'Output', sub: 'Softmax', h: 32, w: 16, color: '#10b981' },
  ]
  return (
    <div className="rounded-xl overflow-x-auto"
      style={{ background: '#070710', border: '1px solid rgba(255,255,255,0.06)', padding: '24px 20px' }}>
      <div className="flex items-center gap-2" style={{ minWidth: 'max-content', margin: '0 auto', width: 'fit-content' }}>
        {layers.map((layer, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-2">
              <motion.div whileHover={{ boxShadow: `0 0 16px ${layer.color}50` }}
                style={{ width: `${layer.w}px`, height: `${layer.h}px`, background: `${layer.color}18`, border: `1.5px solid ${layer.color}50`, borderRadius: '4px' }} />
              <div style={{ width: `${Math.max(layer.w + 16, 52)}px`, textAlign: 'center' }}>
                <div style={{ color: '#f0f0f8', fontSize: '11px', fontWeight: 600 }}>{layer.label}</div>
                <div style={{ color: '#444460', fontSize: '9px', lineHeight: 1.3 }}>{layer.sub}</div>
              </div>
            </div>
            {i < layers.length - 1 && (
              <span style={{ color: '#333350', fontSize: '14px', paddingBottom: '28px', flexShrink: 0 }}>→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── RNN Diagram ─── */
function RNNDiagram() {
  const steps = [
    { label: 'x₁', hLabel: 'h₁', out: 'y₁', x: 80 },
    { label: 'x₂', hLabel: 'h₂', out: 'y₂', x: 240 },
    { label: 'x₃', hLabel: 'h₃', out: 'y₃', x: 400 },
  ]
  return (
    <div className="rounded-xl overflow-x-auto"
      style={{ background: '#070710', border: '1px solid rgba(255,255,255,0.06)', padding: '16px' }}>
      <svg width={480} height={200} style={{ display: 'block', margin: '0 auto' }}>
        <defs>
          <marker id="arr-pu" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="rgba(139,92,246,0.7)" />
          </marker>
          <marker id="arr-gr" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="rgba(16,185,129,0.7)" />
          </marker>
          <marker id="arr-bl" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="rgba(59,130,246,0.7)" />
          </marker>
        </defs>
        {steps.map((s, i) => (
          <g key={i}>
            <circle cx={s.x} cy={160} r={18} fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="1.5" />
            <text x={s.x} y={164} textAnchor="middle" fontSize="12" fill="#60a5fa" fontFamily="monospace" fontWeight="700">{s.label}</text>
            <line x1={s.x} y1={140} x2={s.x} y2={100} stroke="rgba(59,130,246,0.5)" strokeWidth="1.5" markerEnd="url(#arr-bl)" />
            <motion.circle cx={s.x} cy={76} r={22}
              fill="rgba(139,92,246,0.22)" stroke="#8b5cf6" strokeWidth="1.5"
              animate={{ opacity: [0.65, 1, 0.65] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.45 }}
            />
            <text x={s.x} y={80} textAnchor="middle" fontSize="12" fill="#c4b5fd" fontFamily="monospace" fontWeight="700">{s.hLabel}</text>
            <line x1={s.x} y1={54} x2={s.x} y2={28} stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" markerEnd="url(#arr-gr)" />
            <text x={s.x} y={20} textAnchor="middle" fontSize="12" fill="#10b981" fontFamily="monospace" fontWeight="600">{s.out}</text>
            <text x={s.x} y={188} textAnchor="middle" fontSize="10" fill="#333350" fontFamily="system-ui">t={i + 1}</text>
          </g>
        ))}
        {steps.slice(0, -1).map((s, i) => {
          const nx = steps[i + 1].x
          return (
            <motion.path key={`rec-${i}`}
              d={`M ${s.x + 22},76 C ${(s.x + nx) / 2},76 ${(s.x + nx) / 2},76 ${nx - 22},76`}
              fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="5 3"
              markerEnd="url(#arr-pu)"
              animate={{ opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.6 }}
            />
          )
        })}
      </svg>
    </div>
  )
}

/* ─── 3D Rotating Data Cloud (canvas) ─── */
function DataCloud3D() {
  const canvasRef = useRef(null)
  const thetaRef = useRef(25)
  const rafRef = useRef(null)

  const POINTS = useMemo(() => {
    const rand = (n) => Math.abs(Math.sin(n * 127.1 + 311.7) * 43758.5453) % 1
    const pts = []
    for (let i = 0; i < 28; i++)
      pts.push({ x: -0.55 + rand(i) * 0.5, y: -0.35 + rand(i + 100) * 0.5, z: -0.45 + rand(i + 200) * 0.5, cls: 0 })
    for (let i = 0; i < 28; i++)
      pts.push({ x: 0.08 + rand(i + 300) * 0.5, y: 0.08 + rand(i + 400) * 0.5, z: 0.08 + rand(i + 500) * 0.5, cls: 1 })
    for (let i = 0; i < 20; i++)
      pts.push({ x: -0.25 + rand(i + 600) * 0.4, y: 0.28 + rand(i + 700) * 0.38, z: -0.1 + rand(i + 800) * 0.35, cls: 2 })
    return pts
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = 420, H = 250, CX = 210, CY = 128, SC = 96
    const COLORS = ['#a78bfa', '#34d399', '#60a5fa']

    const project = (x, y, z) => {
      const th = thetaRef.current * Math.PI / 180
      const rx = x * Math.cos(th) - z * Math.sin(th)
      const ry = y
      const rz = x * Math.sin(th) + z * Math.cos(th)
      return {
        sx: CX + SC * (rx - rz * 0.38),
        sy: CY - SC * (ry - rz * 0.22),
        depth: rz,
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Grid lines (floor)
      ctx.strokeStyle = 'rgba(255,255,255,0.04)'
      ctx.lineWidth = 1
      for (let g = -1; g <= 1; g += 0.5) {
        const a = project(g, -0.5, -1), b = project(g, -0.5, 1)
        const c = project(-1, -0.5, g), d = project(1, -0.5, g)
        ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(c.sx, c.sy); ctx.lineTo(d.sx, d.sy); ctx.stroke()
      }

      // Axes
      const axDefs = [
        { end: [0.85, 0, 0], label: 'x₁', color: '#f87171' },
        { end: [0, 0.85, 0], label: 'x₂', color: '#34d399' },
        { end: [0, 0, 0.85], label: 'x₃', color: '#60a5fa' },
      ]
      const orig = project(0, 0, 0)
      axDefs.forEach(ax => {
        const ep = project(...ax.end)
        const lp = project(ax.end[0] * 1.15, ax.end[1] * 1.15, ax.end[2] * 1.15)
        ctx.strokeStyle = ax.color
        ctx.globalAlpha = 0.6
        ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.moveTo(orig.sx, orig.sy); ctx.lineTo(ep.sx, ep.sy); ctx.stroke()
        ctx.globalAlpha = 0.85
        ctx.fillStyle = ax.color
        ctx.font = '700 11px monospace'
        ctx.fillText(ax.label, lp.sx - 5, lp.sy + 4)
      })

      // Points sorted by depth
      const proj = POINTS.map(p => ({ ...p, ...project(p.x, p.y, p.z) }))
        .sort((a, b) => a.depth - b.depth)

      proj.forEach(p => {
        const col = COLORS[p.cls]
        ctx.globalAlpha = 0.88
        ctx.fillStyle = col
        ctx.shadowColor = col
        ctx.shadowBlur = 7
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, 3.8, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })
      ctx.globalAlpha = 1

      thetaRef.current = (thetaRef.current + 0.18) % 360
      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [POINTS])

  return (
    <div className="rounded-xl" style={{ background: '#070710', border: '1px solid rgba(255,255,255,0.06)' }}>
      <canvas ref={canvasRef} width={420} height={250} style={{ display: 'block', margin: '0 auto' }} />
      <div className="flex justify-center gap-5 pb-3 text-xs" style={{ marginTop: '-4px' }}>
        {[['#a78bfa', 'Class A'], ['#34d399', 'Class B'], ['#60a5fa', 'Class C']].map(([c, l]) => (
          <span key={l} className="flex items-center gap-1.5">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }} />
            <span style={{ color: '#555570' }}>{l}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─── Loss Landscape / Gradient Descent ─── */
function LossBowl() {
  const W = 400, H = 260, CX = 205, CY = 138, SC = 108
  const OPT = [0.52, 0.48]

  const path = useMemo(() => {
    const opt = [0.52, 0.48]
    const pts = [[-0.62, 0.82]]
    for (let i = 0; i < 28; i++) {
      const [w1, w2] = pts[pts.length - 1]
      const lr = 0.13
      const g1 = 2 * (w1 - opt[0]) + Math.sin(w1 * 4.2) * 0.04
      const g2 = 2 * (w2 - opt[1]) + Math.cos(w2 * 3.8) * 0.04
      pts.push([w1 - lr * g1, w2 - lr * g2])
    }
    return pts
  }, [])

  const s = ([w1, w2]) => ({ x: CX + w1 * SC, y: CY - w2 * SC })
  const contours = [0.12, 0.26, 0.42, 0.6, 0.8]

  return (
    <div className="rounded-xl overflow-x-auto"
      style={{ background: '#070710', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 16px' }}>
      <svg width={W} height={H} style={{ display: 'block', margin: '0 auto' }}>
        {/* Axis lines */}
        <line x1={CX - SC} y1={CY} x2={CX + SC} y2={CY} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1={CX} y1={CY - SC} x2={CX} y2={CY + SC} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

        {/* Contour ellipses */}
        {contours.map((r, i) => {
          const center = s(OPT)
          return (
            <motion.ellipse key={i}
              cx={center.x} cy={center.y}
              rx={r * SC} ry={r * SC * 0.68}
              fill={`rgba(139,92,246,${0.03 + i * 0.025})`}
              stroke={`rgba(139,92,246,${0.12 + i * 0.07})`}
              strokeWidth="1"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}
            />
          )
        })}

        {/* Loss value labels on contours */}
        {contours.map((r, i) => {
          const center = s(OPT)
          const val = (r * r).toFixed(2)
          return (
            <text key={i} x={center.x + r * SC + 4} y={center.y + 4}
              fontSize="8" fill={`rgba(139,92,246,${0.3 + i * 0.1})`} fontFamily="monospace">
              {val}
            </text>
          )
        })}

        {/* Gradient descent path */}
        {path.slice(0, -1).map((pt, i) => {
          const from = s(pt), to = s(path[i + 1])
          return (
            <motion.line key={i}
              x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke="#f59e0b" strokeWidth="1.8"
              initial={{ opacity: 0 }} animate={{ opacity: 0.55 + i * 0.015 }}
              transition={{ delay: 0.3 + i * 0.04 }}
            />
          )
        })}

        {/* Path dots (every 4th) */}
        {path.filter((_, i) => i % 4 === 0).map((pt, i) => {
          const p = s(pt)
          return <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="#f59e0b" opacity="0.8" />
        })}

        {/* Start */}
        {(() => {
          const p = s(path[0])
          return (
            <g>
              <circle cx={p.x} cy={p.y} r={6} fill="#ef4444" />
              <text x={p.x - 10} y={p.y - 10} fontSize="10" fill="#ef4444" fontFamily="system-ui">start</text>
            </g>
          )
        })()}

        {/* Optimal (minimum) */}
        {(() => {
          const p = s(OPT)
          return (
            <g>
              <motion.circle cx={p.x} cy={p.y} r={12} fill="none" stroke="#10b981" strokeWidth="1"
                animate={{ r: [10, 14, 10], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <circle cx={p.x} cy={p.y} r={4} fill="#10b981" />
              <text x={p.x + 14} y={p.y + 4} fontSize="10" fill="#10b981" fontFamily="system-ui">minimum</text>
            </g>
          )
        })()}

        {/* Axis labels */}
        <text x={CX + SC * 0.92} y={CY + 14} fontSize="11" fill="#555570" fontFamily="monospace">w₁</text>
        <text x={CX + 6} y={CY - SC * 0.9} fontSize="11" fill="#555570" fontFamily="monospace">w₂</text>
        <text x={20} y={20} fontSize="10" fill="#555570" fontFamily="system-ui">Loss L(w₁, w₂)</text>
      </svg>
    </div>
  )
}

/* ─── Pixel → Feature Vector ─── */
function FeatureVec() {
  const pixels = [
    0, 0, 1, 1, 1, 0, 0, 0,
    0, 1, 1, 0, 1, 1, 0, 0,
    0, 1, 1, 0, 1, 1, 0, 0,
    0, 1, 1, 1, 1, 1, 0, 0,
    0, 1, 1, 0, 1, 1, 0, 0,
    0, 1, 1, 0, 1, 1, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
  ]
  const CELL = 13, GX = 14, GY = 14, GS = 8

  return (
    <div className="rounded-xl overflow-x-auto"
      style={{ background: '#070710', border: '1px solid rgba(255,255,255,0.06)', padding: '16px 20px' }}>
      <svg width={500} height={130} style={{ display: 'block', margin: '0 auto' }}>
        {/* Label above grid */}
        <text x={GX + GS * CELL / 2} y={10} textAnchor="middle" fontSize="10" fill="#555570" fontFamily="system-ui">8×8 input image</text>

        {/* Pixel grid */}
        {pixels.map((v, i) => {
          const col = i % GS, row = Math.floor(i / GS)
          return (
            <rect key={i}
              x={GX + col * CELL} y={GY + 4 + row * CELL}
              width={CELL - 1} height={CELL - 1} rx="2"
              fill={v ? 'rgba(167,139,250,0.85)' : 'rgba(255,255,255,0.04)'}
              stroke={v ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.05)'}
              strokeWidth="0.5"
            />
          )
        })}

        {/* Arrow */}
        <defs>
          <marker id="arw-w" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="rgba(255,255,255,0.25)" />
          </marker>
        </defs>
        <line x1={GX + GS * CELL + 10} y1={65} x2={GX + GS * CELL + 44} y2={65}
          stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" markerEnd="url(#arw-w)" />
        <text x={GX + GS * CELL + 27} y={58} textAnchor="middle" fontSize="9" fill="#555570" fontFamily="system-ui">flatten</text>

        {/* Feature vector boxes */}
        {Array.from({ length: 14 }, (_, i) => {
          const val = pixels[i]
          const VX = GX + GS * CELL + 58 + i * 22
          return (
            <g key={i}>
              <rect x={VX - 9} y={52} width={18} height={26} rx="3"
                fill={val ? 'rgba(167,139,250,0.25)' : 'rgba(255,255,255,0.04)'}
                stroke={val ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.07)'}
              />
              <text x={VX} y={70} textAnchor="middle" fontSize="9"
                fill={val ? '#a78bfa' : '#444460'} fontFamily="monospace">{val ? '1' : '0'}</text>
            </g>
          )
        })}
        <text x={GX + GS * CELL + 60 + 14 * 22 - 2} y={70} fontSize="14" fill="#444460">…</text>
        <text x={GX + GS * CELL + 58 + 6 * 22} y={96} textAnchor="middle" fontSize="9" fill="#444460" fontFamily="system-ui">first 14 of 64 values</text>
        <text x={GX + GS * CELL + 58 + 6 * 22} y={108} textAnchor="middle" fontSize="9" fill="#555570" fontFamily="system-ui">64-dimensional vector</text>
      </svg>
    </div>
  )
}

/* ─── Dimensionality Reduction Visual ─── */
function DimReduction() {
  return (
    <div className="rounded-xl p-5"
      style={{ background: '#070710', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="text-xs font-semibold mb-4" style={{ color: '#555570' }}>Dimensionality Reduction: n-D → 2D</div>
      <div className="flex items-center gap-3 flex-wrap">
        {[
          { dims: '784D', sub: '28×28 image', color: '#8b5cf6' },
          { dims: '→', sub: '', color: '#444460' },
          { dims: '128D', sub: 'encoder layer', color: '#6366f1' },
          { dims: '→', sub: '', color: '#444460' },
          { dims: '32D', sub: 'bottleneck', color: '#3b82f6' },
          { dims: '→', sub: '', color: '#444460' },
          { dims: '2D', sub: 't-SNE / PCA', color: '#10b981' },
          { dims: '→', sub: '', color: '#444460' },
          { dims: '📊', sub: 'visualize!', color: '#f59e0b' },
        ].map((item, i) => (
          item.dims === '→'
            ? <span key={i} style={{ color: '#333350', fontSize: '18px' }}>→</span>
            : (
              <motion.div key={i} whileHover={{ y: -2 }}
                className="flex flex-col items-center px-3 py-2 rounded-lg"
                style={{ background: `${item.color}12`, border: `1px solid ${item.color}28`, minWidth: '60px' }}>
                <span className="font-bold text-sm" style={{ color: item.color }}>{item.dims}</span>
                <span className="text-xs mt-0.5" style={{ color: '#444460' }}>{item.sub}</span>
              </motion.div>
            )
        ))}
      </div>
      <p className="text-xs mt-4 leading-relaxed" style={{ color: '#8888aa' }}>
        t-SNE and PCA project high-dimensional embeddings into 2D so humans can see cluster structure.
        The model operates in 784D — we collapse it to see what it learned.
      </p>
    </div>
  )
}

/* ─── Weight Matrix Visual ─── */
function WeightHeatmap() {
  const rand = (n) => Math.abs(Math.sin(n * 91.3 + 14.7) * 10000) % 1
  const rows = 6, cols = 8
  const weights = Array.from({ length: rows * cols }, (_, i) => rand(i) * 2 - 1)
  const max = Math.max(...weights.map(Math.abs))

  return (
    <div className="rounded-xl p-5"
      style={{ background: '#070710', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="text-xs font-semibold mb-3" style={{ color: '#555570' }}>Weight Matrix W (6×8) — learned connection strengths</div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '2px', maxWidth: '240px' }}>
        {weights.map((w, i) => {
          const norm = w / max
          const bg = norm > 0
            ? `rgba(139,92,246,${Math.abs(norm) * 0.85})`
            : `rgba(239,68,68,${Math.abs(norm) * 0.85})`
          return (
            <motion.div key={i}
              whileHover={{ scale: 1.3, zIndex: 10 }}
              title={w.toFixed(2)}
              style={{ width: '100%', paddingBottom: '100%', background: bg, borderRadius: '2px', cursor: 'default', position: 'relative' }}
            />
          )
        })}
      </div>
      <div className="flex items-center gap-3 mt-3">
        <div className="flex items-center gap-1.5">
          <div style={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(139,92,246,0.8)' }} />
          <span className="text-xs" style={{ color: '#555570' }}>positive (excitatory)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div style={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(239,68,68,0.8)' }} />
          <span className="text-xs" style={{ color: '#555570' }}>negative (inhibitory)</span>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Page ─── */
const TOPICS = ['AI Basics', 'Types', 'ML', 'Feature Space', 'Neural Nets', 'Deep Learning', 'CNN', 'RNN']
const IDS    = ['basics',   'types', 'ml', 'dimensions',   'neural',     'deep',          'cnn', 'rnn']

export default function AIPage() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-8 sm:py-12">

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs"
          style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#8b5cf6' }}>
          <Brain size={11} /><span>Artificial Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4" style={{ color: '#f0f0f8', lineHeight: 1.15 }}>
          From Neurons to{' '}
          <span style={{ background: 'linear-gradient(135deg,#8b5cf6,#3b82f6,#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Intelligence.
          </span>
        </h1>
        <p className="text-base max-w-lg mx-auto" style={{ color: '#8888aa' }}>
          A visual journey through AI — from the basics of machine learning to deep neural architectures.
        </p>
      </motion.div>

      {/* Topic pills */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2 mb-12 justify-center">
        {TOPICS.map((t, i) => (
          <motion.button key={t} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => scrollTo(IDS[i])}
            className="px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)', cursor: 'pointer' }}>
            {t}
          </motion.button>
        ))}
      </motion.div>

      {/* ── What is AI ── */}
      <Section id="basics" title="What is Artificial Intelligence?" icon={Brain}>
        <p className="text-sm leading-7 mb-6" style={{ color: '#8888aa' }}>
          <Hi>Artificial Intelligence</Hi> is the simulation of human intelligence in machines — enabling them to learn, reason, perceive,
          and solve problems. The term was coined by <Hi c="#c4b5fd">John McCarthy in 1956</Hi>. Modern AI spans rule-based expert systems,
          statistical learning, and self-learning <Hi c="#60a5fa">deep neural networks</Hi>.
        </p>
        <AIHierarchy />
        <p className="text-xs mt-3 text-center mb-5" style={{ color: '#444460' }}>
          Deep Learning ⊂ Machine Learning ⊂ Artificial Intelligence
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <InfoCard accent="#555570" delay={0} title="1950s–80s" desc="Turing Test, Logic Theorist, Lisp. Rule-based expert systems. AI winters from unmet expectations." />
          <InfoCard accent="#6366f1" delay={0.05} title="1990s–2010s" desc="Statistical ML, SVMs, Random Forests. IBM Deep Blue beats Kasparov. Internet = data." />
          <InfoCard accent="#8b5cf6" delay={0.1} title="2012–Now" desc="AlexNet ignites deep learning. GPT, DALL-E, AlphaFold. Generative AI era." />
        </div>
      </Section>

      {/* ── Types of AI ── */}
      <Section id="types" title="Types of AI" icon={Layers}>
        <div className="space-y-3 mb-6">
          <InfoCard icon={Zap} accent="#3b82f6" delay={0}
            title="Narrow AI (ANI) — Current Reality"
            desc="Designed for one specific task. Extremely capable within scope but cannot generalize."
            points={['Chess engines, facial recognition', 'Spam filters, recommendation systems', 'LLMs: ChatGPT, Claude, Gemini', 'Image generators: DALL-E, Midjourney']}
          />
          <InfoCard icon={GitBranch} accent="#8b5cf6" delay={0.05}
            title="General AI (AGI) — The Goal"
            desc="Human-level reasoning across any cognitive domain. Can transfer knowledge, reason abstractly, learn novel tasks. Not yet achieved."
            points={['Passes the Turing Test in all domains', 'Active research: OpenAI, DeepMind, Anthropic', 'Timeline: highly debated (5–50+ years)']}
          />
          <InfoCard icon={Network} accent="#ec4899" delay={0.1}
            title="Super AI (ASI) — Hypothetical"
            desc="Surpasses human intelligence in every domain. Core focus of AI safety research."
            points={['Far beyond human cognitive limits', 'Alignment problem: how to make it safe', 'Purely theoretical at this stage']}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoCard accent="#10b981" title="Reactive Machines" desc="No memory. Reacts to current input only. Example: Deep Blue chess engine." />
          <InfoCard accent="#f59e0b" title="Limited Memory" desc="Uses recent past. Self-driving cars, most LLMs fall here." />
          <InfoCard accent="#6366f1" title="Theory of Mind" desc="Understands emotions and social dynamics. Active research frontier." />
          <InfoCard accent="#ec4899" title="Self-Awareness" desc="Conscious self-model. Deepest theoretical level. Purely hypothetical." />
        </div>
      </Section>

      {/* ── Machine Learning ── */}
      <Section id="ml" title="Machine Learning" icon={Cpu}>
        <p className="text-sm leading-7 mb-5" style={{ color: '#8888aa' }}>
          <Hi>Machine Learning</Hi> is a subset of AI where systems <Hi c="#60a5fa">learn from data</Hi> rather than
          following explicitly programmed rules. Core idea: find patterns in training data → build statistical model → predict on new data.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <InfoCard icon={Eye} accent="#3b82f6" delay={0}
            title="Supervised Learning"
            desc="Learn from labeled input-output pairs."
            points={['Classification: spam / not spam', 'Regression: predict house price', 'Algorithms: SVM, XGBoost, Neural Nets']}
          />
          <InfoCard icon={Network} accent="#8b5cf6" delay={0.06}
            title="Unsupervised Learning"
            desc="Find hidden structure in unlabeled data."
            points={['Clustering: k-means, DBSCAN', 'Dimensionality reduction: PCA, t-SNE', 'Autoencoders, anomaly detection']}
          />
          <InfoCard icon={RotateCcw} accent="#10b981" delay={0.12}
            title="Reinforcement Learning"
            desc="Agent learns via reward signals from environment."
            points={['State → Action → Reward loop', 'AlphaGo, robotics, game AI', 'Algorithms: Q-learning, PPO, SAC']}
          />
        </div>
        <div className="rounded-xl p-5 mb-6" style={{ background: '#0d0d16', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-xs font-semibold mb-3" style={{ color: '#555570' }}>ML Pipeline</div>
          <div className="flex items-center gap-2 flex-wrap">
            {['Data Collection', 'Preprocessing', 'Feature Eng.', 'Model Training', 'Evaluation', 'Deployment'].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-2">
                <motion.div whileHover={{ borderColor: '#8b5cf6', color: '#a78bfa' }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ background: 'rgba(139,92,246,0.07)', color: '#8888aa', border: '1px solid rgba(139,92,246,0.15)', transition: 'all 0.12s' }}>
                  {step}
                </motion.div>
                {i < arr.length - 1 && <span style={{ color: '#333350' }}>→</span>}
              </div>
            ))}
          </div>
        </div>

        <SubHead>Overfitting vs Underfitting</SubHead>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
          <InfoCard accent="#ef4444" title="Underfitting" desc="Model too simple. High bias. Fails to capture patterns even in training data. Fix: more complexity, more features." />
          <InfoCard accent="#10b981" title="Good Fit" desc="Model generalizes. Low bias, low variance. Performs well on both training and unseen test data." />
          <InfoCard accent="#f59e0b" title="Overfitting" desc="Model memorizes training data. High variance. Fails on new data. Fix: regularization (L1/L2), dropout, more data." />
        </div>
      </Section>

      {/* ── Feature Space & Dimensions ── */}
      <Section id="dimensions" title="How AI Models See Data" icon={Network}>
        <p className="text-sm leading-7 mb-5" style={{ color: '#8888aa' }}>
          Computers can't see images — they see <Hi>arrays of numbers</Hi>. A 28×28 grayscale image = 784 pixel values.
          A model works in <Hi c="#60a5fa">784-dimensional space</Hi>. Each dimension is one feature.
          The model learns to find patterns (decision boundaries) in this high-dimensional space.
        </p>

        <SubHead>Raw Data → Feature Vector</SubHead>
        <FeatureVec />

        <p className="text-sm leading-7 mt-5 mb-5" style={{ color: '#8888aa' }}>
          In <Hi c="#60a5fa">3D space</Hi>, imagine every data point as a dot in x₁–x₂–x₃ coordinates.
          Clusters of similar data form groups. A model's job: find the <Hi>decision boundary</Hi> that separates them.
          In 784D, you can't visualize it — but the math is the same.
        </p>

        <SubHead>3D Feature Space — 3 Classes, Rotating</SubHead>
        <DataCloud3D />

        <p className="text-xs mt-3 mb-5 text-center" style={{ color: '#444460' }}>
          Each axis = one feature dimension. Real models work in 784D, 2048D, or millions of dimensions.
        </p>

        <SubHead>Dimensionality Reduction</SubHead>
        <DimReduction />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
          <InfoCard accent="#3b82f6" title="Curse of Dimensionality"
            desc="In high dimensions, data becomes sparse. Distance metrics break down. Every point is 'far' from every other. More dimensions ≠ always better."
            points={['Volume grows exponentially with dims', 'Need exponentially more data', 'Feature selection / PCA helps']}
          />
          <InfoCard accent="#10b981" title="Embeddings"
            desc="Dense low-dimensional representations learned by the model. Word2Vec maps words to 300D vectors where similar words cluster together."
            points={['king − man + woman ≈ queen', 'Sentence embeddings for search', 'Image embeddings for similarity']}
          />
        </div>
      </Section>

      {/* ── Neural Networks ── */}
      <Section id="neural" title="Neural Networks" icon={Network}>
        <p className="text-sm leading-7 mb-5" style={{ color: '#8888aa' }}>
          Inspired by the brain. A network of <Hi>artificial neurons</Hi> in layers. Each neuron computes a
          <Hi c="#60a5fa"> weighted sum</Hi> of inputs, applies an <Hi c="#10b981">activation function</Hi>, and passes output forward.
          Learning = adjusting weights via <Hi c="#c4b5fd">backpropagation</Hi> to minimize a loss function.
        </p>
        <NNDiagram />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
          <InfoCard accent="#3b82f6" title="Activation Functions"
            desc="Introduce non-linearity so networks learn complex patterns."
            points={['ReLU: max(0,x) — fast, sparse activations', 'Sigmoid: maps to (0,1) — binary output', 'Softmax: probability distribution — multi-class', 'GELU, Swish: used in modern transformers']}
          />
          <InfoCard accent="#8b5cf6" title="Backpropagation"
            desc="Computes gradient of loss w.r.t. every weight via chain rule, then updates via gradient descent."
            points={['Loss: MSE (regression), CrossEntropy (classification)', 'Optimizer: SGD, Adam, AdamW', 'Learning rate controls update step size']}
          />
        </div>

        <SubHead>Weight Matrix — What the Network Learns</SubHead>
        <WeightHeatmap />
        <p className="text-xs mt-3 mb-5" style={{ color: '#8888aa' }}>
          Each weight encodes how strongly one neuron influences another.
          <Hi c="#a78bfa"> Purple</Hi> = excitatory (positive), <Hi c="#f87171">Red</Hi> = inhibitory (negative).
          The pattern of weights IS the learned knowledge.
        </p>

        <SubHead>Loss Landscape — Gradient Descent Finds the Valley</SubHead>
        <LossBowl />
        <p className="text-xs mt-3" style={{ color: '#8888aa' }}>
          Each point on the surface = one configuration of weights (w₁, w₂). Height = loss.
          Training navigates this landscape downhill. Contours = equal-loss regions.
          <Hi c="#f59e0b"> Yellow path</Hi> = gradient descent steps. <Hi c="#10b981">Green dot</Hi> = minimum (optimal weights).
        </p>
      </Section>

      {/* ── Deep Learning ── */}
      <Section id="deep" title="Deep Learning" icon={Layers}>
        <p className="text-sm leading-7 mb-5" style={{ color: '#8888aa' }}>
          <Hi>Deep Learning</Hi> = neural networks with <Hi c="#60a5fa">many hidden layers</Hi>. Each layer learns
          progressively abstract representations: pixels → edges → shapes → objects → concepts.
          Enabled by <Hi c="#10b981">GPU compute</Hi>, massive datasets, and improved optimizers.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <InfoCard accent="#8b5cf6" title="Automatic Feature Learning"
            desc="No manual feature engineering. The network discovers representations directly from raw data." delay={0} />
          <InfoCard accent="#3b82f6" title="Hierarchical Representations"
            desc="Layer 1: edges. Layer 2: shapes. Layer 3: objects. Deeper = richer abstractions." delay={0.06} />
          <InfoCard accent="#10b981" title="Transfer Learning"
            desc="Pre-trained weights (ImageNet, GPT) fine-tuned on new tasks with minimal data." delay={0.12} />
        </div>

        <SubHead>What Each Layer Sees (CNN Example)</SubHead>
        <div className="rounded-xl p-5 mb-5" style={{ background: '#0d0d16', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="space-y-2">
            {[
              { layer: 'Layer 1', desc: 'Edges, gradients, simple lines', color: '#3b82f6', w: '25%' },
              { layer: 'Layer 2', desc: 'Corners, curves, textures', color: '#6366f1', w: '45%' },
              { layer: 'Layer 3', desc: 'Object parts: eyes, wheels, handles', color: '#8b5cf6', w: '65%' },
              { layer: 'Layer 4', desc: 'Whole objects, semantic concepts', color: '#a78bfa', w: '85%' },
              { layer: 'Output', desc: 'Class prediction with confidence', color: '#10b981', w: '100%' },
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-mono w-16 flex-shrink-0" style={{ color: row.color }}>{row.layer}</span>
                <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <motion.div
                    initial={{ width: 0 }} whileInView={{ width: row.w }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${row.color}50, ${row.color}20)`, border: `1px solid ${row.color}30` }}
                  />
                </div>
                <span className="text-xs flex-shrink-0" style={{ color: '#555570', minWidth: '200px' }}>{row.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-5" style={{ background: '#0d0d16', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-xs font-semibold mb-3" style={{ color: '#555570' }}>Key Deep Learning Architectures</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: 'CNN', color: '#3b82f6', use: 'Images, video, spatial data' },
              { name: 'RNN / LSTM', color: '#8b5cf6', use: 'Sequences, time series, language' },
              { name: 'Transformer', color: '#10b981', use: 'NLP, vision — GPT, BERT, ViT' },
              { name: 'GAN', color: '#f59e0b', use: 'Image synthesis, style transfer' },
              { name: 'Autoencoder', color: '#ec4899', use: 'Compression, anomaly detection' },
              { name: 'Diffusion Models', color: '#a78bfa', use: 'Image/audio gen — DALL-E, Sora' },
            ].map(a => (
              <div key={a.name} className="flex items-center gap-2 p-2 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <span className="text-xs font-semibold w-24 flex-shrink-0" style={{ color: a.color }}>{a.name}</span>
                <span className="text-xs" style={{ color: '#555570' }}>{a.use}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── CNN ── */}
      <Section id="cnn" title="Convolutional Neural Network (CNN)" icon={Eye}>
        <p className="text-sm leading-7 mb-5" style={{ color: '#8888aa' }}>
          CNNs revolutionized <Hi>computer vision</Hi>. Key insight: use small learnable
          <Hi c="#60a5fa"> filters (kernels)</Hi> that slide over input to detect local features.
          <Hi c="#10b981"> Pooling</Hi> downsamples feature maps, giving spatial invariance.
          Stack multiple Conv+Pool blocks, then flatten into fully-connected layers for classification.
        </p>
        <CNNDiagram />
        <div className="grid grid-cols-3 gap-3 mt-5">
          <InfoCard accent="#3b82f6" title="Convolution Layer"
            desc="Learnable filters detect features: edges, textures, patterns. Output = feature maps. Key params: kernel size, stride, padding." />
          <InfoCard accent="#6366f1" title="Pooling Layer"
            desc="Reduces spatial dims. MaxPool takes the max in each window. Reduces computation + adds translation invariance." />
          <InfoCard accent="#10b981" title="Fully Connected"
            desc="Flattened features → dense layers → softmax output. Combines all detected features for final class prediction." />
        </div>
        <div className="rounded-xl p-4 mt-4" style={{ background: '#0d0d16', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-xs font-semibold mb-2" style={{ color: '#555570' }}>Famous CNN Architectures</div>
          <div className="flex flex-wrap gap-2">
            {['LeNet-5 (1998)', 'AlexNet (2012)', 'VGG-16', 'ResNet-50', 'Inception', 'EfficientNet', 'YOLO (detection)', 'U-Net (segmentation)'].map(a => (
              <span key={a} className="text-xs px-2.5 py-1 rounded-lg"
                style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>{a}</span>
            ))}
          </div>
        </div>
      </Section>

      {/* ── RNN ── */}
      <Section id="rnn" title="Recurrent Neural Network (RNN)" icon={RotateCcw}>
        <p className="text-sm leading-7 mb-5" style={{ color: '#8888aa' }}>
          RNNs handle <Hi>sequential data</Hi>. Unlike feedforward networks, they maintain a
          <Hi c="#60a5fa"> hidden state</Hi> that carries information across time steps — acting as memory.
          The same weights are reused at each step (parameter sharing). Used for text, speech, time series.
        </p>
        <RNNDiagram />
        <p className="text-xs mt-3 mb-5 text-center" style={{ color: '#444460' }}>
          Dashed arrows = recurrent connections carrying h across time steps
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoCard accent="#8b5cf6" title="Vanishing Gradient Problem"
            desc="Gradients shrink exponentially over many time steps, preventing learning of long-range dependencies."
            points={['Gradient → 0 for early timesteps', 'Network forgets distant context', 'Solved by LSTM and GRU gates']}
          />
          <InfoCard accent="#10b981" title="LSTM & GRU"
            desc="Gated architectures that selectively remember/forget, preserving long-term dependencies."
            points={['LSTM: 3 gates — input, forget, output', 'GRU: 2 gates — reset, update (simpler)', 'Remember context over 100s of steps']}
          />
          <InfoCard accent="#3b82f6" title="Bidirectional RNN"
            desc="Processes sequence forward and backward. Useful when full context is available — NER, translation." />
          <InfoCard accent="#f59e0b" title="Transformers Replaced RNNs"
            desc="Self-attention (2017) processes all tokens in parallel. No sequential bottleneck. Powers GPT, BERT, and modern LLMs." />
        </div>
      </Section>

    </div>
  )
}
