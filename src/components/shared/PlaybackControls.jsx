import { Play, Pause, RotateCcw, SkipForward, SkipBack, Shuffle } from 'lucide-react'
import { motion } from 'framer-motion'

const SPEEDS = [0.5, 1, 2, 4]

export default function PlaybackControls({
  isPlaying, onPlay, onPause, onReset,
  onStepForward, onStepBack, onRandomize,
  speed, onSpeedChange, progress = 0,
  disabled = false,
}) {
  return (
    <div className="rounded-xl p-4 space-y-3"
      style={{ background: '#0d0d16', border: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Progress bar */}
      <div className="h-1 rounded-full overflow-hidden cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #8b5cf6, #3b82f6)' }}
          animate={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }}
          transition={{ duration: 0.15, ease: 'linear' }}
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        {/* Transport */}
        <div className="flex items-center gap-1">
          <CtrlBtn onClick={onStepBack} disabled={disabled} title="Step back">
            <SkipBack size={13} />
          </CtrlBtn>

          <motion.button
            onClick={isPlaying ? onPause : onPlay}
            disabled={disabled}
            whileHover={{ scale: 1.06, boxShadow: '0 0 24px rgba(139,92,246,0.5)' }}
            whileTap={{ scale: 0.92 }}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-opacity"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              boxShadow: '0 0 16px rgba(139,92,246,0.3)',
              opacity: disabled ? 0.4 : 1,
            }}
          >
            {isPlaying
              ? <Pause size={13} color="white" />
              : <Play size={13} color="white" style={{ marginLeft: 1 }} />
            }
          </motion.button>

          <CtrlBtn onClick={onStepForward} disabled={disabled} title="Step forward">
            <SkipForward size={13} />
          </CtrlBtn>
          <CtrlBtn onClick={onReset} disabled={disabled} title="Reset">
            <RotateCcw size={13} />
          </CtrlBtn>
          {onRandomize && (
            <CtrlBtn onClick={onRandomize} title="Randomize">
              <Shuffle size={13} />
            </CtrlBtn>
          )}
        </div>

        {/* Speed */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: '#444460' }}>Speed</span>
          <div className="flex gap-0.5">
            {SPEEDS.map(s => (
              <motion.button
                key={s}
                onClick={() => onSpeedChange(s)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="px-1.5 py-0.5 rounded text-xs transition-all"
                style={{
                  background: speed === s ? 'rgba(139,92,246,0.2)' : 'transparent',
                  color: speed === s ? '#a78bfa' : '#444460',
                  border: speed === s ? '1px solid rgba(139,92,246,0.35)' : '1px solid transparent',
                  fontWeight: speed === s ? 600 : 400,
                }}
              >
                {s}×
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CtrlBtn({ onClick, disabled, title, children }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      title={title}
      whileHover={!disabled ? { scale: 1.1, background: 'rgba(139,92,246,0.12)', color: '#c4b5fd' } : {}}
      whileTap={!disabled ? { scale: 0.88 } : {}}
      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
      style={{
        color: disabled ? '#333350' : '#666688',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.05)',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </motion.button>
  )
}
