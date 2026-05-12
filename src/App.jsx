import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu } from 'lucide-react'
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
        <Navbar onNavigate={(id) => {
          if (PAGES[id]) setActiveId(id)
          else if (id === 'home') setActiveId('home')
        }} />
        {!sidebarOpen && (
          <div className="flex items-center gap-3 px-4 py-2"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <button onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg"
              style={{ color: '#8888aa', background: 'rgba(255,255,255,0.04)' }}>
              <Menu size={16} />
            </button>
          </div>
        )}
        <main className="flex-1 overflow-y-auto">
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
