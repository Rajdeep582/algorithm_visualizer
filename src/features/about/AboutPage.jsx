import { useRef, useMemo } from 'react'
import { motion, useAnimationFrame } from 'framer-motion'
import { Cpu, GitBranch, Zap, Brain } from 'lucide-react'

const FEATURES = [
  { icon: Zap,       title: 'Step-by-step',   desc: 'Every algorithm animated frame-by-frame with playback controls.' },
  { icon: GitBranch, title: 'Data Structures', desc: 'Arrays, linked lists, stacks, queues, trees, heaps, graphs.' },
  { icon: Cpu,       title: 'Algorithms',      desc: 'Sorting, searching, dynamic programming, backtracking and more.' },
  { icon: Brain,     title: 'AI & ML',         desc: 'Neural networks, gradient descent, CNN, RNN — visually explained.' },
]

// ---------------------------------------------------------------------------
// Gear math: meshed gears must have:
//   dist(A,B) = rA + rB
//   dirB = -dirA
//   speedB = speedA * rA / rB   (angular velocity ratio)
// ---------------------------------------------------------------------------
const P = Math.PI

const CLUSTER_DEFS = [
  // ── Top-left corner ──────────────────────────────────────────────────────
  { cx: 0, cy: 0, r: 60, teeth: 16, dir: 1, speed: 0.45, color: '#8b5cf6',
    children: [
      { angle: 0,       r: 36, teeth: 10, color: '#6366f1',
        children: [
          { angle: P*0.55,  r: 20, teeth: 6,  color: '#7c3aed', children: [] },
          { angle: -P*0.4,  r: 16, teeth: 5,  color: '#3b82f6', children: [] },
        ]
      },
      { angle: P*0.5,   r: 32, teeth: 9,  color: '#3b82f6',
        children: [
          { angle: 0,       r: 19, teeth: 6,  color: '#8b5cf6', children: [] },
          { angle: P*0.6,   r: 14, teeth: 4,  color: '#6366f1', children: [] },
        ]
      },
    ]
  },

  // ── Top-right corner ─────────────────────────────────────────────────────
  { cx: 800, cy: 0, r: 60, teeth: 16, dir: -1, speed: 0.45, color: '#7c3aed',
    children: [
      { angle: P,         r: 36, teeth: 10, color: '#8b5cf6',
        children: [
          { angle: P*0.45,  r: 20, teeth: 6,  color: '#6366f1', children: [] },
          { angle: P*1.4,   r: 16, teeth: 5,  color: '#3b82f6', children: [] },
        ]
      },
      { angle: P*0.5,     r: 32, teeth: 9,  color: '#6366f1',
        children: [
          { angle: P,       r: 19, teeth: 6,  color: '#7c3aed', children: [] },
          { angle: P*0.4,   r: 14, teeth: 4,  color: '#8b5cf6', children: [] },
        ]
      },
    ]
  },

  // ── Mid-left (children 110° apart — no overlap) ─────────────────────────
  { cx: 0, cy: 500, r: 52, teeth: 14, dir: 1, speed: 0.5, color: '#8b5cf6',
    children: [
      { angle: P*0.12,  r: 30, teeth: 8,  color: '#7c3aed',
        children: [
          { angle: P*0.55,  r: 18, teeth: 6,  color: '#6366f1', children: [] },
        ]
      },
      { angle: -P*0.5,  r: 26, teeth: 8,  color: '#3b82f6',
        children: [
          { angle: -P*0.15, r: 16, teeth: 5,  color: '#8b5cf6', children: [] },
        ]
      },
    ]
  },

  // ── Mid-right (children 110° apart — no overlap) ─────────────────────────
  { cx: 800, cy: 500, r: 52, teeth: 14, dir: -1, speed: 0.5, color: '#6366f1',
    children: [
      { angle: P*0.88,  r: 30, teeth: 8,  color: '#8b5cf6',
        children: [
          { angle: P*0.45,  r: 18, teeth: 6,  color: '#7c3aed', children: [] },
        ]
      },
      { angle: P*1.5,   r: 26, teeth: 8,  color: '#3b82f6',
        children: [
          { angle: P*1.85,  r: 16, teeth: 5,  color: '#6366f1', children: [] },
        ]
      },
    ]
  },

  // ── Top-center (two small chains along top edge) ─────────────────────────
  { cx: 180, cy: -8, r: 32, teeth: 9, dir: 1, speed: 0.65, color: '#8b5cf6',
    children: [
      { angle: P*0.5, r: 19, teeth: 6, color: '#6366f1',
        children: [
          { angle: 0, r: 11, teeth: 4, color: '#7c3aed', children: [] },
        ]
      },
    ]
  },
  { cx: 620, cy: -8, r: 32, teeth: 9, dir: -1, speed: 0.65, color: '#7c3aed',
    children: [
      { angle: P*0.5, r: 19, teeth: 6, color: '#8b5cf6',
        children: [
          { angle: P, r: 11, teeth: 4, color: '#6366f1', children: [] },
        ]
      },
    ]
  },

  // ── Bottom-center (two small chains along bottom edge) ──────────────────
  { cx: 180, cy: 1108, r: 32, teeth: 9, dir: -1, speed: 0.65, color: '#6366f1',
    children: [
      { angle: -P*0.5, r: 19, teeth: 6, color: '#8b5cf6',
        children: [
          { angle: 0, r: 11, teeth: 4, color: '#7c3aed', children: [] },
        ]
      },
    ]
  },
  { cx: 620, cy: 1108, r: 32, teeth: 9, dir: 1, speed: 0.65, color: '#8b5cf6',
    children: [
      { angle: -P*0.5, r: 19, teeth: 6, color: '#7c3aed',
        children: [
          { angle: P, r: 11, teeth: 4, color: '#6366f1', children: [] },
        ]
      },
    ]
  },

  // ── Bottom-left corner ───────────────────────────────────────────────────
  { cx: 0, cy: 1100, r: 60, teeth: 16, dir: -1, speed: 0.45, color: '#7c3aed',
    children: [
      { angle: 0,         r: 36, teeth: 10, color: '#6366f1',
        children: [
          { angle: -P*0.55, r: 20, teeth: 6,  color: '#8b5cf6', children: [] },
          { angle: P*0.4,   r: 16, teeth: 5,  color: '#3b82f6', children: [] },
        ]
      },
      { angle: -P*0.5,    r: 32, teeth: 9,  color: '#8b5cf6',
        children: [
          { angle: 0,       r: 19, teeth: 6,  color: '#7c3aed', children: [] },
          { angle: -P*0.6,  r: 14, teeth: 4,  color: '#6366f1', children: [] },
        ]
      },
    ]
  },

  // ── Bottom-right corner ──────────────────────────────────────────────────
  { cx: 800, cy: 1100, r: 60, teeth: 16, dir: 1, speed: 0.45, color: '#8b5cf6',
    children: [
      { angle: P,           r: 36, teeth: 10, color: '#7c3aed',
        children: [
          { angle: -P*0.45,  r: 20, teeth: 6,  color: '#6366f1', children: [] },
          { angle: P*0.6,    r: 16, teeth: 5,  color: '#3b82f6', children: [] },
        ]
      },
      { angle: -P*0.5,      r: 32, teeth: 9,  color: '#6366f1',
        children: [
          { angle: P,         r: 19, teeth: 6,  color: '#8b5cf6', children: [] },
          { angle: -P*0.4,    r: 14, teeth: 4,  color: '#7c3aed', children: [] },
        ]
      },
    ]
  },
]

function buildCluster(def, parent = null) {
  let gear
  if (!parent) {
    gear = { cx: def.cx, cy: def.cy, r: def.r, teeth: def.teeth, dir: def.dir, speed: def.speed, color: def.color }
  } else {
    gear = {
      cx: parent.cx + Math.cos(def.angle) * (parent.r + def.r),
      cy: parent.cy + Math.sin(def.angle) * (parent.r + def.r),
      r: def.r,
      teeth: def.teeth,
      dir: -parent.dir,
      speed: parent.speed * parent.r / def.r,
      color: def.color,
    }
  }
  return [gear, ...(def.children || []).flatMap(c => buildCluster(c, gear))]
}

const ALL_GEARS = CLUSTER_DEFS.flatMap(def => buildCluster(def))

// ---------------------------------------------------------------------------
// Single Gear SVG element
// ---------------------------------------------------------------------------
function Gear({ cx, cy, r, teeth, dir, speed, color }) {
  const ref = useRef(null)
  const angleRef = useRef(0)

  useAnimationFrame((_, delta) => {
    // deg/ms × delta → degrees
    angleRef.current += dir * speed * delta * 0.022
    if (ref.current) {
      ref.current.setAttribute('transform', `rotate(${angleRef.current}, ${cx}, ${cy})`)
    }
  })

  // Build tooth polygon
  const toothH = r * 0.28
  const innerR = r - toothH
  const pts = []
  for (let i = 0; i < teeth; i++) {
    const base = (i / teeth) * P * 2
    const t1 = base + (0.28 / teeth) * P * 2
    const t2 = base + (0.72 / teeth) * P * 2
    const t3 = base + (1.00 / teeth) * P * 2
    pts.push(
      `${cx + Math.cos(base) * innerR},${cy + Math.sin(base) * innerR}`,
      `${cx + Math.cos(t1)   * r},      ${cy + Math.sin(t1)   * r}`,
      `${cx + Math.cos(t2)   * r},      ${cy + Math.sin(t2)   * r}`,
      `${cx + Math.cos(t3)   * innerR},${cy + Math.sin(t3)   * innerR}`,
    )
  }

  return (
    <g ref={ref}>
      {/* Outer gear body */}
      <polygon
        points={pts.join(' ')}
        fill={color}
        fillOpacity="0.22"
        stroke={color}
        strokeOpacity="0.75"
        strokeWidth="1.2"
      />
      {/* Hub ring */}
      <circle cx={cx} cy={cy} r={innerR * 0.42} fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.65" />
      {/* Center dot */}
      <circle cx={cx} cy={cy} r={innerR * 0.13} fill={color} fillOpacity="0.9" />
      {/* Spokes */}
      {[0, P*2/3, P*4/3].map((a, i) => (
        <line key={i}
          x1={cx + Math.cos(a) * innerR * 0.14}
          y1={cy + Math.sin(a) * innerR * 0.14}
          x2={cx + Math.cos(a) * innerR * 0.39}
          y2={cy + Math.sin(a) * innerR * 0.39}
          stroke={color} strokeWidth="1.2" strokeOpacity="0.55"
        />
      ))}
    </g>
  )
}

// ---------------------------------------------------------------------------
// Full-page gear canvas — positioned absolute, clipped, pointer-events none
// ---------------------------------------------------------------------------
function GearCanvas() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 800 1100"
      preserveAspectRatio="xMidYMid slice"
      style={{ overflow: 'visible', pointerEvents: 'none' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {ALL_GEARS.map((g, i) => <Gear key={i} {...g} />)}
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function AboutPage() {
  return (
    <div className="relative min-h-screen" style={{ overflow: 'hidden' }}>
      {/* Gear layer — absolute behind content */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, overflow: 'hidden' }}>
        <GearCanvas />
      </div>

      {/* Content */}
      <div className="relative max-w-2xl mx-auto px-4 py-8 sm:px-8 sm:py-16" style={{ zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#8b5cf6' }}>
            <Cpu size={11} /><span>About AlgoViz</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight mb-4" style={{ color: '#f0f0f8', lineHeight: 1.2 }}>
            Built to make algorithms{' '}
            <span style={{ background: 'linear-gradient(135deg,#8b5cf6,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              visual.
            </span>
          </h1>

          <p className="text-base mb-8 leading-relaxed" style={{ color: '#8888aa' }}>
            AlgoViz is an interactive platform for learning data structures and algorithms through
            animation. Every operation is broken into individual steps so you can see exactly
            what's happening under the hood.
          </p>

          {/* Quote card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="rounded-2xl p-6 mb-10"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.07))',
              border: '1px solid rgba(139,92,246,0.25)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <p className="text-sm leading-7" style={{ color: '#c4b5fd', fontStyle: 'italic' }}>
              When I learned data structures and algorithms, I always struggled to visualize them
              in an interactive and animated way. That's why I built this web application.
            </p>
            <p className="text-sm mt-3" style={{ color: '#a78bfa' }}>~ Developer</p>
          </motion.div>

          {/* Feature cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                className="rounded-xl p-5"
                style={{
                  background: 'rgba(13,13,22,0.9)',
                  border: '1px solid rgba(139,92,246,0.28)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 0 22px rgba(139,92,246,0.18), inset 0 1px 0 rgba(255,255,255,0.04)',
                }}>
                <f.icon size={18} style={{ color: f.title === 'AI & ML' ? '#a78bfa' : '#8b5cf6', marginBottom: '10px' }} />
                <div className="font-semibold text-sm mb-1" style={{ color: '#f0f0f8' }}>{f.title}</div>
                <div className="text-xs leading-relaxed" style={{ color: '#555570' }}>{f.desc}</div>
              </motion.div>
            ))}
          </div>

          {/* Tech stack */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
            className="rounded-xl p-6"
            style={{
              background: 'rgba(13,13,22,0.9)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
            }}>
            <h2 className="font-semibold text-sm mb-3" style={{ color: '#f0f0f8' }}>Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {['React 18', 'Framer Motion', 'Tailwind CSS', 'Vite', 'Lucide Icons'].map(t => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-lg"
                  style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}>
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  )
}
