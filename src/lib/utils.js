import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function randomArray(size = 20, min = 5, max = 95) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min)
}

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}
