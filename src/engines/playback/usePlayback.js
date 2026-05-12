import { useState, useRef, useCallback, useEffect } from 'react'

export function usePlayback({ steps = [], onStep }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [speed, setSpeed] = useState(1)
  const timerRef = useRef(null)
  const speedRef = useRef(1)
  const stepsRef = useRef(steps)
  const onStepRef = useRef(onStep)

  // keep refs current
  useEffect(() => { speedRef.current = speed }, [speed])
  useEffect(() => { stepsRef.current = steps }, [steps])
  useEffect(() => { onStepRef.current = onStep }, [onStep])

  const clearTimer = () => { if (timerRef.current) clearTimeout(timerRef.current) }

  const stop = useCallback(() => { setIsPlaying(false); clearTimer() }, [])

  const reset = useCallback(() => {
    stop()
    setCurrentStep(-1)
    onStepRef.current?.(-1)
  }, [stop])

  const stepForward = useCallback(() => {
    setCurrentStep(prev => {
      const next = Math.min(prev + 1, stepsRef.current.length - 1)
      onStepRef.current?.(next)
      return next
    })
  }, [])

  const stepBack = useCallback(() => {
    setCurrentStep(prev => {
      const next = Math.max(prev - 1, -1)
      onStepRef.current?.(next)
      return next
    })
  }, [])

  const play = useCallback(() => {
    setCurrentStep(prev => {
      if (prev >= stepsRef.current.length - 1) {
        onStepRef.current?.(-1)
        return -1
      }
      return prev
    })
    setIsPlaying(true)
  }, [])

  useEffect(() => {
    if (!isPlaying) return
    const tick = () => {
      setCurrentStep(prev => {
        if (prev >= stepsRef.current.length - 1) {
          setIsPlaying(false)
          return prev
        }
        const next = prev + 1
        onStepRef.current?.(next)
        timerRef.current = setTimeout(tick, 800 / speedRef.current)
        return next
      })
    }
    timerRef.current = setTimeout(tick, 800 / speedRef.current)
    return clearTimer
  }, [isPlaying])

  return {
    isPlaying,
    currentStep,
    speed,
    setSpeed,
    play,
    stop,
    reset,
    stepForward,
    stepBack,
    progress: steps.length > 0 ? (currentStep + 1) / steps.length : 0,
  }
}
