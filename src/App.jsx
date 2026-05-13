import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './components/sidebar/Sidebar'
import Navbar from './components/layout/Navbar'
import HomePage from './features/home/HomePage'
import ArrayPage from './features/array/ArrayPage'
import SortingPage from './features/sorting/SortingPage'
import LinkedListPage from './features/linked-list/LinkedListPage'
import BSTPage from './features/tree/BSTPage'
import StackPage from './features/stack/StackPage'
import QueuePage from './features/queue/QueuePage'
import HeapPage from './features/heap/HeapPage'
import SearchingPage from './features/searching/SearchingPage'
import GraphPage from './features/graph/GraphPage'
import DPPage from './features/graph/DPPage'
import BacktrackingPage from './features/graph/BacktrackingPage'
import AboutPage from './features/about/AboutPage'
import ContactPage from './features/contact/ContactPage'
import AIPage from './features/ai/AIPage'

const PAGES = {
  home: HomePage,
  array: ArrayPage,
  sorting: SortingPage,
  'linked-list': LinkedListPage,
  bst: BSTPage,
  stack: StackPage,
  queue: QueuePage,
  heap: HeapPage,
  searching: SearchingPage,
  graph: GraphPage,
  dp: DPPage,
  backtracking: BacktrackingPage,
  about: AboutPage,
  contact: ContactPage,
  ai: AIPage,
  'ai-ml': AIPage,
  'ai-neural': AIPage,
  'ai-deep': AIPage,
  'ai-cnn': AIPage,
  'ai-rnn': AIPage,
}

export default function App() {
  const [activeId, setActiveId] = useState('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [navHidden, setNavHidden] = useState(false)
  const mainRef = useRef(null)
  const lastScrollRef = useRef(0)

  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    const onScroll = () => {
      const cur = el.scrollTop
      const last = lastScrollRef.current
      if (cur > last + 8 && cur > 60) setNavHidden(true)
      else if (cur < last - 5) setNavHidden(false)
      lastScrollRef.current = cur
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const Page = PAGES[activeId] || HomePage

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0a0a0f' }}>
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(p => !p)}
        activeId={activeId}
        onSelect={setActiveId}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <motion.div
          animate={{ y: navHidden ? -64 : 0, opacity: navHidden ? 0 : 1 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{ flexShrink: 0 }}
        >
          <Navbar
            onNavigate={(id) => {
              if (PAGES[id]) setActiveId(id)
              else if (id === 'home') setActiveId('home')
            }}
            sidebarOpen={sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(p => !p)}
          />
        </motion.div>
        <main ref={mainRef} className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="h-full"
            >
              {Page === HomePage
                ? <Page onSelect={setActiveId} />
                : <Page />
              }
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
