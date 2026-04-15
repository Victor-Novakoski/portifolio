import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import { type WorldRegion } from '@/data/world-map'

type RegionPanelProps = {
  region: WorldRegion | null
  onClose: () => void
  children: ReactNode
}

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
const PANEL_WIDTH_STORAGE_KEY = 'portfolio-region-panel-width'
const PANEL_MIN_WIDTH = 300
const PANEL_MAX_WIDTH = 760
const PANEL_DEFAULT_WIDTH = 340

export function RegionPanel({ region, onClose, children }: RegionPanelProps) {
  const reduceMotion = useReducedMotion()
  const panelRef = useRef<HTMLElement>(null)
  const resizeStateRef = useRef<{ startX: number; startWidth: number } | null>(null)
  const [panelWidth, setPanelWidth] = useState(PANEL_DEFAULT_WIDTH)
  const [isResizing, setIsResizing] = useState(false)

  const clampWidth = useCallback((width: number) => {
    const viewportMax = Math.max(PANEL_MIN_WIDTH, Math.min(PANEL_MAX_WIDTH, window.innerWidth - 96))
    return Math.min(Math.max(width, PANEL_MIN_WIDTH), viewportMax)
  }, [])

  useEffect(() => {
    const storedWidth = localStorage.getItem(PANEL_WIDTH_STORAGE_KEY)
    if (!storedWidth) return

    const parsedWidth = Number(storedWidth)
    if (!Number.isFinite(parsedWidth)) return
    setPanelWidth(clampWidth(parsedWidth))
  }, [clampWidth])

  useEffect(() => {
    localStorage.setItem(PANEL_WIDTH_STORAGE_KEY, String(panelWidth))
  }, [panelWidth])

  useEffect(() => {
    const onResize = () => {
      setPanelWidth(prev => clampWidth(prev))
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [clampWidth])

  useEffect(() => {
    if (!isResizing) return

    const onPointerMove = (event: PointerEvent) => {
      const resizeState = resizeStateRef.current
      if (!resizeState) return

      event.preventDefault()
      const delta = resizeState.startX - event.clientX
      const nextWidth = clampWidth(resizeState.startWidth + delta)
      setPanelWidth(nextWidth)
    }

    const onPointerUp = () => {
      resizeStateRef.current = null
      setIsResizing(false)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [clampWidth, isResizing])

  const handleResizeStart = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (window.matchMedia('(max-width: 767px)').matches) return

    event.preventDefault()
    resizeStateRef.current = {
      startX: event.clientX,
      startWidth: panelWidth,
    }
    setIsResizing(true)
  }

  useEffect(() => {
    if (!region || !panelRef.current) return

    const panel = panelRef.current
    const previousFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null

    const getFocusable = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        element =>
          !element.hasAttribute('disabled') &&
          element.tabIndex !== -1 &&
          element.getAttribute('aria-hidden') !== 'true'
      )

    const focusables = getFocusable()
    const firstFocusable = focusables[0]
    if (firstFocusable) {
      firstFocusable.focus()
    } else {
      panel.focus()
    }

    const onPanelKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const currentFocusables = getFocusable()
      if (currentFocusables.length === 0) {
        event.preventDefault()
        panel.focus()
        return
      }

      const currentIndex = currentFocusables.indexOf(document.activeElement as HTMLElement)
      const first = currentFocusables[0]
      const last = currentFocusables[currentFocusables.length - 1]

      if (event.shiftKey) {
        if (currentIndex <= 0) {
          event.preventDefault()
          last.focus()
        }
        return
      }

      if (currentIndex === -1 || currentIndex === currentFocusables.length - 1) {
        event.preventDefault()
        first.focus()
      }
    }

    panel.addEventListener('keydown', onPanelKeyDown)

    return () => {
      panel.removeEventListener('keydown', onPanelKeyDown)
      if (previousFocusedElement && document.contains(previousFocusedElement)) {
        previousFocusedElement.focus()
      }
    }
  }, [region, onClose])

  return (
    <AnimatePresence>
      {region ? (
        <>
          <motion.button
            type="button"
            className="absolute inset-0 z-20 bg-transparent backdrop-blur-[2px]"
            onClick={onClose}
            aria-label="Fechar detalhes da região"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
          />

          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Detalhes da região ${region.title}`}
            className={`absolute inset-x-3 bottom-3 z-30 max-h-[70vh] overflow-y-auto rounded-xl border border-slate-700 bg-slate-950/95 p-4 shadow-2xl backdrop-blur md:inset-x-auto md:bottom-6 md:right-6 md:top-6 md:w-[var(--panel-width)] md:max-h-none ${
              isResizing ? 'select-none' : ''
            }`}
            tabIndex={-1}
            style={{ ['--panel-width' as string]: `${panelWidth}px` } as CSSProperties}
            initial={reduceMotion ? false : { opacity: 0, x: 26, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 20, scale: 0.98 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.24, ease: 'easeOut' }}
          >
            <button
              type="button"
              onPointerDown={handleResizeStart}
              aria-label="Redimensionar painel"
              title="Arraste para redimensionar"
              tabIndex={-1}
              className={`absolute -left-2 top-1/2 z-40 hidden h-20 w-4 -translate-y-1/2 cursor-col-resize items-center justify-center rounded-full border border-slate-700 bg-slate-950/95 text-slate-400 transition hover:text-slate-200 md:flex ${
                isResizing ? 'ring-1 ring-souls-ember/70' : ''
              }`}
            >
              ⋮⋮
            </button>

            <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  Região selecionada
                </p>
                <h2 className="font-display text-3xl text-souls-ember">{region.title}</h2>
                <p className="mt-1 text-sm text-slate-300">{region.lore}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-200 transition hover:bg-slate-800"
              >
                Fechar
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={region.id}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}
