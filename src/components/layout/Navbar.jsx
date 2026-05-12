import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check, Heart } from 'lucide-react'

const UPI_ID = 'brajdeep029-1@oksbi'
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&bgcolor=0d0d16&color=a78bfa&data=${encodeURIComponent(`upi://pay?pa=${UPI_ID}&pn=Brajdeep&cu=INR`)}`

const NAV_LINKS = ['Home', 'AI', 'About', 'Contact']

export default function Navbar({ onNavigate }) {
  const [donateOpen, setDonateOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(UPI_ID)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {/* Navbar */}
      <nav
        className="w-full flex items-center justify-between px-6 py-3 relative z-50"
        style={{
          background: 'rgba(10,10,15,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 1px 32px rgba(0,0,0,0.4)',
        }}
      >
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => onNavigate?.('home')}
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#8b5cf6,#3b82f6)', boxShadow: '0 0 14px rgba(139,92,246,0.4)' }}>
            <span className="text-white font-bold text-xs">AV</span>
          </div>
          <span className="font-semibold text-sm hidden sm:block" style={{ color: '#f0f0f8', letterSpacing: '0.02em' }}>
            AlgoViz
          </span>
        </motion.div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <NavLink key={link} label={link} onClick={() => onNavigate?.(link.toLowerCase())} />
          ))}
        </div>

        {/* Right: Donate + mobile toggle */}
        <div className="flex items-center gap-3">
          <DonateButton onClick={() => setDonateOpen(true)} />

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 rounded-lg"
            style={{ color: '#8888aa', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            onClick={() => setMobileOpen(p => !p)}
          >
            <div className="flex flex-col gap-1 w-4">
              <span className="block h-px w-full" style={{ background: '#8888aa' }} />
              <span className="block h-px w-full" style={{ background: '#8888aa' }} />
              <span className="block h-px w-3/4" style={{ background: '#8888aa' }} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden flex flex-col px-4 pb-3 gap-1 relative z-40"
            style={{ background: 'rgba(10,10,15,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            {NAV_LINKS.map(link => (
              <button key={link}
                onClick={() => { onNavigate?.(link.toLowerCase()); setMobileOpen(false) }}
                className="text-left px-3 py-2 rounded-lg text-sm"
                style={{ color: '#8888aa' }}>
                {link}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Donate modal */}
      <AnimatePresence>
        {donateOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={e => e.target === e.currentTarget && setDonateOpen(false)}
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 16 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="relative w-full max-w-sm rounded-2xl p-6"
              style={{
                background: '#0d0d18',
                border: '1px solid rgba(139,92,246,0.25)',
                boxShadow: '0 0 60px rgba(139,92,246,0.15), 0 24px 48px rgba(0,0,0,0.6)',
              }}
            >
              {/* Close */}
              <motion.button
                whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.08)' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setDonateOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ color: '#555570', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <X size={13} />
              </motion.button>

              {/* Header */}
              <div className="text-center mb-5">
                <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.3),rgba(59,130,246,0.3))', border: '1px solid rgba(139,92,246,0.35)' }}>
                  <Heart size={18} style={{ color: '#a78bfa' }} />
                </div>
                <h2 className="font-semibold text-base" style={{ color: '#f0f0f8' }}>Support AlgoViz</h2>
                <p className="text-xs mt-1" style={{ color: '#555570' }}>Scan QR or use UPI ID below</p>
              </div>

              {/* QR */}
              <div className="flex justify-center mb-5">
                <div className="rounded-xl p-3"
                  style={{ background: '#0d0d16', border: '1px solid rgba(139,92,246,0.2)', boxShadow: '0 0 24px rgba(139,92,246,0.08)' }}>
                  <img
                    src={QR_URL}
                    alt="UPI QR"
                    width={180}
                    height={180}
                    style={{ borderRadius: '8px', display: 'block' }}
                    onError={e => { e.target.style.display='none' }}
                  />
                </div>
              </div>

              {/* UPI ID + copy */}
              <div className="rounded-xl px-4 py-3 flex items-center justify-between gap-3"
                style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.18)' }}>
                <div>
                  <div className="text-xs mb-0.5" style={{ color: '#555570' }}>UPI ID</div>
                  <div className="font-mono text-sm font-semibold" style={{ color: '#c4b5fd' }}>{UPI_ID}</div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.06, boxShadow: '0 0 14px rgba(139,92,246,0.35)' }}
                  whileTap={{ scale: 0.92 }}
                  onClick={copy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0"
                  style={{
                    background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(139,92,246,0.15)',
                    color: copied ? '#10b981' : '#a78bfa',
                    border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(139,92,246,0.3)'}`,
                    transition: 'all 0.2s',
                  }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy'}
                </motion.button>
              </div>

              {/* Footer note */}
              <p className="text-center text-xs mt-4" style={{ color: '#333350' }}>
                Every contribution keeps this project alive ✨
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function NavLink({ label, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ color: '#c4b5fd', background: 'rgba(139,92,246,0.08)' }}
      whileTap={{ scale: 0.96 }}
      className="px-3 py-1.5 rounded-lg text-sm transition-colors"
      style={{ color: '#8888aa', background: 'transparent' }}
    >
      {label}
    </motion.button>
  )
}

function DonateButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, boxShadow: '0 0 22px rgba(139,92,246,0.55)' }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold"
      style={{
        background: 'linear-gradient(135deg,rgba(139,92,246,0.22),rgba(59,130,246,0.18))',
        color: '#c4b5fd',
        border: '1px solid rgba(139,92,246,0.4)',
        boxShadow: '0 0 12px rgba(139,92,246,0.2)',
      }}
    >
      <Heart size={13} style={{ color: '#a78bfa' }} />
      Donate
    </motion.button>
  )
}
