import { useMemo, useState, useRef, useEffect, useCallback } from 'react'
import { Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

// ─── Layout constants ────────────────────────────────────────────────────────
const ROW_H   = 27    // vertical space per leaf
const COL_W   = 200   // horizontal spacing per depth level
const NODE_W  = 132   // node rect width
const NODE_H  = 22    // node rect height
const ML      = 60    // left margin
const MT      = 24    // top margin

// ─── Tree data ───────────────────────────────────────────────────────────────
const TREE = {
  id:'ai', label:'Artificial Intelligence', color:'#a78bfa',
  children:[
    // ── MACHINE LEARNING ────────────────────────────────────────────────────
    { id:'ml', label:'Machine Learning', color:'#60a5fa',
      children:[
        { id:'sup', label:'Supervised', color:'#38bdf8',
          children:[
            { id:'lin',  label:'Linear Regression',   color:'#7dd3fc' },
            { id:'log',  label:'Logistic Regression',  color:'#7dd3fc' },
            { id:'svm',  label:'SVM',                  color:'#7dd3fc' },
            { id:'knn',  label:'KNN',                  color:'#7dd3fc' },
            { id:'nb',   label:'Naive Bayes',          color:'#7dd3fc' },
            { id:'dt',   label:'Decision Tree',        color:'#7dd3fc' },
            { id:'rf',   label:'Random Forest',        color:'#7dd3fc' },
            { id:'gbm',  label:'Gradient Boosting',    color:'#7dd3fc' },
            { id:'xgb',  label:'XGBoost / LightGBM',   color:'#7dd3fc' },
            { id:'lasso',label:'Lasso / Ridge',        color:'#7dd3fc' },
          ]
        },
        { id:'unsup', label:'Unsupervised', color:'#34d399',
          children:[
            { id:'km',   label:'K-Means',              color:'#6ee7b7' },
            { id:'db',   label:'DBSCAN',               color:'#6ee7b7' },
            { id:'hier', label:'Hierarchical',         color:'#6ee7b7' },
            { id:'gmm',  label:'GMM',                  color:'#6ee7b7' },
            { id:'pca',  label:'PCA',                  color:'#6ee7b7' },
            { id:'tsne', label:'t-SNE',                color:'#6ee7b7' },
            { id:'umap', label:'UMAP',                 color:'#6ee7b7' },
            { id:'iso',  label:'Isolation Forest',     color:'#6ee7b7' },
            { id:'apr',  label:'Apriori / FP-Growth',  color:'#6ee7b7' },
          ]
        },
        { id:'rl', label:'Reinforcement', color:'#fbbf24',
          children:[
            { id:'qlearn', label:'Q-Learning',   color:'#fcd34d' },
            { id:'sarsa',  label:'SARSA',         color:'#fcd34d' },
            { id:'dqn',    label:'DQN',           color:'#fcd34d' },
            { id:'ppo',    label:'PPO',           color:'#fcd34d' },
            { id:'a3c',    label:'A3C / A2C',     color:'#fcd34d' },
            { id:'sac',    label:'SAC',           color:'#fcd34d' },
            { id:'ddpg',   label:'DDPG',          color:'#fcd34d' },
            { id:'mcts',   label:'MCTS',          color:'#fcd34d' },
            { id:'rlagents', label:'RL Agents', color:'#f97316',
              children:[
                { id:'alphago', label:'AlphaGo / Zero', color:'#fb923c' },
                { id:'rlhf',    label:'RLHF',            color:'#fb923c' },
              ]
            },
          ]
        },
      ]
    },
    // ── DEEP LEARNING ────────────────────────────────────────────────────────
    { id:'dl', label:'Deep Learning', color:'#c084fc',
      children:[
        { id:'cnn', label:'CNN', color:'#e879f9',
          children:[
            { id:'alexnet',     label:'AlexNet',      color:'#f0abfc' },
            { id:'vgg',         label:'VGGNet',        color:'#f0abfc' },
            { id:'resnet',      label:'ResNet',        color:'#f0abfc' },
            { id:'efficientnet',label:'EfficientNet',  color:'#f0abfc' },
            { id:'yolo',        label:'YOLO',          color:'#f0abfc' },
            { id:'mobilenet',   label:'MobileNet',     color:'#f0abfc' },
            { id:'unet',        label:'U-Net',         color:'#f0abfc' },
          ]
        },
        { id:'rnn', label:'RNN', color:'#818cf8',
          children:[
            { id:'lstm',      label:'LSTM',            color:'#a5b4fc' },
            { id:'gru',       label:'GRU',             color:'#a5b4fc' },
            { id:'seq2seq',   label:'Seq2Seq',         color:'#a5b4fc' },
            { id:'attn',      label:'Attention',       color:'#a5b4fc' },
          ]
        },
        { id:'transformer', label:'Transformer', color:'#a78bfa',
          children:[
            { id:'bert',    label:'BERT',      color:'#c4b5fd' },
            { id:'t5bart',  label:'T5 / BART', color:'#c4b5fd' },
            { id:'vit',     label:'ViT',       color:'#c4b5fd' },
            { id:'llm', label:'LLM', color:'#9f67e0',
              children:[
                { id:'gpt4',    label:'GPT-4 / ChatGPT',  color:'#d8b4fe' },
                { id:'claude',  label:'Claude',            color:'#d8b4fe' },
                { id:'gemini',  label:'Gemini',            color:'#d8b4fe' },
                { id:'llama',   label:'LLaMA / Mistral',   color:'#d8b4fe' },
                { id:'rag',     label:'RAG',               color:'#d8b4fe' },
                { id:'llmagent',label:'LLM Agents',        color:'#d8b4fe' },
                { id:'lchain',  label:'LangChain',         color:'#d8b4fe' },
                { id:'vecdb',   label:'Vector DB',         color:'#d8b4fe' },
                { id:'lora',    label:'Fine-tuning / LoRA',color:'#d8b4fe' },
                { id:'prompt',  label:'Prompt Engineering',color:'#d8b4fe' },
              ]
            },
            { id:'genai', label:'Generative AI', color:'#c4b5fd',
              children:[
                { id:'multimod', label:'Multimodal',      color:'#ddd6fe' },
                { id:'codegen',  label:'Code Generation', color:'#ddd6fe' },
              ]
            },
          ]
        },
        { id:'gan', label:'GAN', color:'#f472b6',
          children:[
            { id:'dcgan',    label:'DCGAN',     color:'#f9a8d4' },
            { id:'stylegan', label:'StyleGAN',  color:'#f9a8d4' },
            { id:'cyclegan', label:'CycleGAN',  color:'#f9a8d4' },
            { id:'diff', label:'Diffusion Models', color:'#ec4899',
              children:[
                { id:'ddpm',    label:'DDPM / DDIM',       color:'#fbcfe8' },
                { id:'sdiff',   label:'Stable Diffusion',  color:'#fbcfe8' },
                { id:'dalle',   label:'DALL-E',            color:'#fbcfe8' },
                { id:'imagen',  label:'Imagen',            color:'#fbcfe8' },
              ]
            },
          ]
        },
        { id:'gnn', label:'Graph NN (GNN)', color:'#2dd4bf',
          children:[
            { id:'gcn',       label:'GCN',       color:'#5eead4' },
            { id:'gat',       label:'GAT',       color:'#5eead4' },
            { id:'graphsage', label:'GraphSAGE', color:'#5eead4' },
          ]
        },
        { id:'ae', label:'Autoencoder', color:'#fb923c',
          children:[
            { id:'vae',    label:'VAE',         color:'#fdba74' },
            { id:'sparse', label:'Sparse AE',   color:'#fdba74' },
            { id:'denoise',label:'Denoising AE',color:'#fdba74' },
          ]
        },
      ]
    },
    // ── CLASSICAL AI ─────────────────────────────────────────────────────────
    { id:'classical', label:'Classical AI', color:'#94a3b8',
      children:[
        { id:'expert',   label:'Expert Systems',    color:'#cbd5e1' },
        { id:'fuzzy',    label:'Fuzzy Logic',        color:'#cbd5e1' },
        { id:'bayes-net',label:'Bayesian Networks',  color:'#cbd5e1' },
        { id:'genetic',  label:'Genetic Algorithms', color:'#cbd5e1' },
        { id:'search', label:'Search & Planning', color:'#b0bec5',
          children:[
            { id:'bfsdfs',  label:'BFS / DFS',       color:'#cfd8dc' },
            { id:'astar',   label:'A* / Dijkstra',   color:'#cfd8dc' },
            { id:'minimax', label:'Minimax / MCTS',  color:'#cfd8dc' },
          ]
        },
      ]
    },
    // ── NLP ──────────────────────────────────────────────────────────────────
    { id:'nlp', label:'NLP', color:'#4ade80',
      children:[
        { id:'tokenize', label:'Tokenization',       color:'#86efac' },
        { id:'pos',      label:'POS Tagging',        color:'#86efac' },
        { id:'ner',      label:'NER',                color:'#86efac' },
        { id:'tfidf',    label:'TF-IDF',             color:'#86efac' },
        { id:'w2v',      label:'Word2Vec',           color:'#86efac' },
        { id:'glove',    label:'GloVe',              color:'#86efac' },
        { id:'fasttext', label:'FastText',           color:'#86efac' },
        { id:'sentiment',label:'Sentiment Analysis', color:'#86efac' },
      ]
    },
  ]
}

// ─── Layout algorithm ────────────────────────────────────────────────────────
function assignPos(node, depth, yStart) {
  node.depth = depth
  node.x = ML + depth * COL_W
  if (!node.children || !node.children.length) {
    node.y = yStart + ROW_H / 2
    return yStart + ROW_H
  }
  let y = yStart
  for (const c of node.children) y = assignPos(c, depth + 1, y)
  node.y = (node.children[0].y + node.children[node.children.length - 1].y) / 2
  return y
}

function flatten(node, nodes, edges) {
  nodes.push(node)
  if (node.children) {
    for (const c of node.children) {
      edges.push({ x1: node.x + NODE_W, y1: node.y, x2: c.x, y2: c.y, color: c.color })
      flatten(c, nodes, edges)
    }
  }
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function AITreeVisual() {
  const { nodes, edges, svgW, svgH } = useMemo(() => {
    const root = JSON.parse(JSON.stringify(TREE))
    const totalH = assignPos(root, 0, MT)
    const svgH = totalH + MT
    const maxDepth = nodes2depth(root, 0)
    const svgW = ML + (maxDepth + 1) * COL_W + NODE_W + 40
    const nodes = [], edges = []
    flatten(root, nodes, edges)
    return { nodes, edges, svgW, svgH }
  }, [])

  const [fitZoom, setFitZoom] = useState(1)
  const [zoom, setZoom]   = useState(1)
  const [isFs, setIsFs]   = useState(false)
  const fsRef  = useRef(null)
  const scrollRef = useRef(null)
  const lastDistRef = useRef(null)

  // ── Compute fit-to-card zoom on mount ─────────────────────────────────────
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const w = el.clientWidth   || 700
    const h = el.clientHeight  || 480
    const fz = Math.min(w / svgW, h / svgH, 1)   // never scale UP, only down
    const clamped = Math.max(0.18, +fz.toFixed(3))
    setFitZoom(clamped)
    setZoom(clamped)
  }, [svgW, svgH])

  // ── Fullscreen API ─────────────────────────────────────────────────────────
  const toggleFs = () => {
    if (!document.fullscreenElement) {
      fsRef.current?.requestFullscreen()
      setZoom(1)   // reset to 100% when entering fullscreen
    } else {
      document.exitFullscreen()
    }
  }
  useEffect(() => {
    const fn = () => {
      const entering = !!document.fullscreenElement
      setIsFs(entering)
      if (!entering) setZoom(fitZoom)   // restore fit-zoom on exit
    }
    document.addEventListener('fullscreenchange', fn)
    return () => document.removeEventListener('fullscreenchange', fn)
  }, [fitZoom])

  // ── Wheel zoom — throttled to ~1 step/sec ────────────────────────────────
  const lastWheelRef = useRef(0)
  const onWheel = useCallback((e) => {
    if (!e.ctrlKey && !isFs) return
    e.preventDefault()
    const now = Date.now()
    if (now - lastWheelRef.current < 700) return   // throttle
    lastWheelRef.current = now
    const delta = e.deltaY < 0 ? 0.2 : -0.2
    setZoom(z => Math.max(0.25, Math.min(4, +(z + delta).toFixed(2))))
  }, [isFs])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [onWheel])

  // ── Mouse drag pan ────────────────────────────────────────────────────────
  const isDragging   = useRef(false)
  const dragOrigin   = useRef({ x: 0, y: 0, sl: 0, st: 0 })

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const onDown = (e) => {
      if (e.button !== 0) return
      isDragging.current = true
      dragOrigin.current = { x: e.clientX, y: e.clientY, sl: el.scrollLeft, st: el.scrollTop }
      el.style.cursor = 'grabbing'
      el.style.userSelect = 'none'
    }
    const onMove = (e) => {
      if (!isDragging.current) return
      el.scrollLeft = dragOrigin.current.sl - (e.clientX - dragOrigin.current.x)
      el.scrollTop  = dragOrigin.current.st - (e.clientY - dragOrigin.current.y)
    }
    const onUp = () => {
      isDragging.current = false
      el.style.cursor = 'grab'
      el.style.userSelect = ''
    }

    el.addEventListener('mousedown', onDown)
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    el.style.cursor = 'grab'
    return () => {
      el.removeEventListener('mousedown', onDown)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
  }, [])

  // ── Pinch zoom (touch) ─────────────────────────────────────────────────────
  const lastPinchRef = useRef(0)
  const onTouchMove = (e) => {
    if (e.touches.length !== 2) return
    e.preventDefault()
    const dx = e.touches[0].clientX - e.touches[1].clientX
    const dy = e.touches[0].clientY - e.touches[1].clientY
    const dist = Math.sqrt(dx*dx + dy*dy)
    if (lastDistRef.current !== null) {
      const now = Date.now()
      if (now - lastPinchRef.current > 400) {
        lastPinchRef.current = now
        const delta = (dist - lastDistRef.current) * 0.004
        setZoom(z => Math.max(0.25, Math.min(4, +(z + delta).toFixed(2))))
      }
    }
    lastDistRef.current = dist
  }
  const onTouchEnd = () => { lastDistRef.current = null }

  const btnStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 28, height: 28, borderRadius: 6, cursor: 'pointer',
    background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
    color: '#a78bfa', flexShrink: 0,
  }

  return (
    <div ref={fsRef} style={{
      position: 'relative',
      background: 'linear-gradient(160deg,#08080f 0%,#0c0a1a 50%,#08080f 100%)',
      borderRadius: isFs ? 0 : 16,
      border: isFs ? 'none' : '1px solid rgba(139,92,246,0.18)',
      boxShadow: isFs ? 'none' : '0 0 60px rgba(139,92,246,0.08)',
      width: isFs ? '100vw' : undefined,
      height: isFs ? '100vh' : undefined,
    }}>
      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 10, right: 10, zIndex: 20,
        display: 'flex', gap: 5, alignItems: 'center',
        background: 'rgba(8,8,15,0.8)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(139,92,246,0.2)', borderRadius: 8, padding: '4px 6px',
      }}>
        <button style={btnStyle} onClick={() => setZoom(z => Math.min(4, +(z+0.2).toFixed(2)))}>
          <ZoomIn size={13} />
        </button>
        <span style={{ color: '#555570', fontSize: 11, fontFamily: 'monospace', minWidth: 36, textAlign: 'center' }}>
          {Math.round(zoom * 100)}%
        </span>
        <button style={btnStyle} onClick={() => setZoom(z => Math.max(0.25, +(z-0.2).toFixed(2)))}>
          <ZoomOut size={13} />
        </button>
        <button style={{ ...btnStyle, marginLeft: 2 }} onClick={() => setZoom(isFs ? 1 : fitZoom)}>
          <RotateCcw size={12} />
        </button>
        <button style={{ ...btnStyle, marginLeft: 2 }} onClick={toggleFs}>
          {isFs ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
        </button>
      </div>

      {/* ── Scrollable zoom container ────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          overflowX: 'auto',
          overflowY: 'auto',
          maxHeight: isFs ? '100vh' : '85vh',
          height: isFs ? '100vh' : undefined,
        }}
      >
        {/* Zoom wrapper — sized to scaled dimensions to maintain scroll range */}
        <div style={{ width: svgW * zoom, height: svgH * zoom, position: 'relative' }}>
          <div style={{ transform: `scale(${zoom})`, transformOrigin: '0 0', position: 'absolute', top: 0, left: 0, transition: 'transform 0.8s cubic-bezier(0.4,0,0.2,1)' }}>
      <svg
        width={svgW}
        height={svgH}
        style={{ display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow-sm">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-md">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-lg">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Edges ───────────────────────────────────────────────────────── */}
        {edges.map((e, i) => {
          const mx = (e.x1 + e.x2) / 2
          return (
            <path key={i}
              d={`M${e.x1},${e.y1} C${mx},${e.y1} ${mx},${e.y2} ${e.x2},${e.y2}`}
              fill="none"
              stroke={e.color}
              strokeWidth="1.2"
              strokeOpacity="0.35"
              filter="url(#glow-sm)"
            />
          )
        })}

        {/* ── Nodes ───────────────────────────────────────────────────────── */}
        {nodes.map(n => {
          const isRoot = n.depth === 0
          const isL1   = n.depth === 1
          const filter = isRoot ? 'url(#glow-lg)' : isL1 ? 'url(#glow-md)' : 'url(#glow-sm)'
          const rx = isRoot ? 10 : isL1 ? 8 : 6
          const fy = n.y - NODE_H / 2

          return (
            <g key={n.id} filter={filter}>
              {/* Outer glow rect */}
              <rect
                x={n.x - 1} y={fy - 1}
                width={NODE_W + 2} height={NODE_H + 2}
                rx={rx + 1}
                fill="none"
                stroke={n.color}
                strokeOpacity={isRoot ? 0.6 : isL1 ? 0.4 : 0.2}
                strokeWidth={isRoot ? 2 : 1}
              />
              {/* Fill rect */}
              <rect
                x={n.x} y={fy}
                width={NODE_W} height={NODE_H}
                rx={rx}
                fill={n.color}
                fillOpacity={isRoot ? 0.22 : isL1 ? 0.14 : 0.09}
                stroke={n.color}
                strokeOpacity={isRoot ? 0.75 : isL1 ? 0.55 : 0.35}
                strokeWidth={isRoot ? 1.5 : 1}
              />
              {/* Label */}
              <text
                x={n.x + NODE_W / 2}
                y={n.y + 0.5}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={isRoot ? 11 : isL1 ? 10 : 9.5}
                fontWeight={isRoot ? 700 : isL1 ? 600 : 400}
                fontFamily="system-ui, -apple-system, sans-serif"
                fill={n.color}
                fillOpacity={isRoot ? 1 : isL1 ? 0.95 : 0.85}
                style={{ userSelect: 'none' }}
              >
                {n.label}
              </text>
            </g>
          )
        })}
      </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

function nodes2depth(node, d) {
  if (!node.children || !node.children.length) return d
  return Math.max(...node.children.map(c => nodes2depth(c, d + 1)))
}
