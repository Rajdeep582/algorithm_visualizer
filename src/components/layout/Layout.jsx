import { useState } from 'react'
import Sidebar from '../sidebar/Sidebar'
import { motion } from 'framer-motion'

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0a0a0f' }}>
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(p => !p)} />
      <motion.main
        className="flex-1 overflow-y-auto"
        animate={{ marginLeft: 0 }}
        style={{ background: '#0a0a0f' }}
      >
        {children}
      </motion.main>
    </div>
  )
}
