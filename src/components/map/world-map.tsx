import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'

import { useProgress } from '@/app/providers/progress-provider'
import { worldConnections, worldRegions, type WorldRegion } from '@/data/world-map'
import worldMapBg from '@/assets/images/world-map-bg.png'
import { RegionDetails } from '@/components/map/region-details'
import { RegionPanel } from '@/components/map/region-panel'

const MAP_MODE_STORAGE_KEY = 'portfolio-map-mode'
const LOW_POWER_CPU_THRESHOLD = 4

export function WorldMap() {
  const reduceMotion = useReducedMotion()
  const { visitedAreas, visitArea } = useProgress()

  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const [isQuickMode, setIsQuickMode] = useState(false)
  const [keyboardIndex, setKeyboardIndex] = useState(0)
  const [parallaxEnabled, setParallaxEnabled] = useState(true)

  const containerRef = useRef<HTMLDivElement>(null)
  const mapSurfaceRef = useRef<SVGSVGElement>(null)
  const bgLayerRef = useRef<SVGGElement>(null)
  const overlayLayerRef = useRef<SVGGElement>(null)

  const keyboardRegion = worldRegions[keyboardIndex] ?? worldRegions[0]
  const activeRegionId = selectedRegionId ?? hoveredId ?? keyboardRegion.id
  const activeRegion = useMemo(
    () => worldRegions.find(region => region.id === activeRegionId) ?? worldRegions[0],
    [activeRegionId]
  )
  const selectedRegion = worldRegions.find(region => region.id === selectedRegionId) ?? null

  useEffect(() => {
    const storedMode = localStorage.getItem(MAP_MODE_STORAGE_KEY)
    if (storedMode === 'rapido') {
      setIsQuickMode(true)
    }
  }, [])

  useEffect(() => {
    const cpuCount = navigator.hardwareConcurrency
    if (typeof cpuCount === 'number' && cpuCount > 0 && cpuCount <= LOW_POWER_CPU_THRESHOLD) {
      setParallaxEnabled(false)
    }
  }, [])

  useEffect(() => {
    const preloadedMapImage = new Image()
    preloadedMapImage.decoding = 'async'
    preloadedMapImage.src = worldMapBg
  }, [])

  useEffect(() => {
    localStorage.setItem(MAP_MODE_STORAGE_KEY, isQuickMode ? 'rapido' : 'imersivo')
  }, [isQuickMode])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const targetTag = target?.tagName
      const isTypingContext =
        targetTag === 'INPUT' || targetTag === 'TEXTAREA' || targetTag === 'SELECT'
      const isInsideMap = target ? Boolean(containerRef.current?.contains(target)) : false
      const isBody = targetTag === 'BODY'

      if (isTypingContext) return

      if (event.key === 'Escape') {
        setSelectedRegionId(null)
        return
      }

      // Arrow/confirm navigation should only run when map has focus context.
      if (!isInsideMap && !isBody) return

      if (selectedRegionId) return

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault()
        setKeyboardIndex(prev => (prev + 1) % worldRegions.length)
        return
      }

      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault()
        setKeyboardIndex(prev => (prev - 1 + worldRegions.length) % worldRegions.length)
        return
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        handleOpenRegion(keyboardRegion)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [keyboardRegion, selectedRegionId])

  useEffect(() => {
    if (!keyboardRegion) return
    setHoveredId(keyboardRegion.id)
  }, [keyboardRegion])

  useLayoutEffect(() => {
    if (!containerRef.current || !mapSurfaceRef.current || !bgLayerRef.current || !overlayLayerRef.current)
      return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-map-layer]',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.08 }
      )
      gsap.set(bgLayerRef.current, { scale: 1.1, transformOrigin: '50% 50%' })
      gsap.set(overlayLayerRef.current, { transformOrigin: '50% 50%' })

      if (reduceMotion || !parallaxEnabled) {
        return
      }

      const quickSvgX = gsap.quickTo(mapSurfaceRef.current, 'x', {
        duration: 0.5,
        ease: 'power3.out',
      })
      const quickSvgY = gsap.quickTo(mapSurfaceRef.current, 'y', {
        duration: 0.5,
        ease: 'power3.out',
      })
      const quickSvgScale = gsap.quickTo(mapSurfaceRef.current, 'scale', {
        duration: 0.6,
        ease: 'power3.out',
      })
      const quickBgX = gsap.quickTo(bgLayerRef.current, 'x', {
        duration: 0.6,
        ease: 'power3.out',
      })
      const quickBgY = gsap.quickTo(bgLayerRef.current, 'y', {
        duration: 0.6,
        ease: 'power3.out',
      })
      const quickBgScale = gsap.quickTo(bgLayerRef.current, 'scale', {
        duration: 0.7,
        ease: 'power3.out',
      })
      const quickOverlayX = gsap.quickTo(overlayLayerRef.current, 'x', {
        duration: 0.45,
        ease: 'power3.out',
      })
      const quickOverlayY = gsap.quickTo(overlayLayerRef.current, 'y', {
        duration: 0.45,
        ease: 'power3.out',
      })

      let rafId: number | null = null
      let latestNx = 0
      let latestNy = 0

      const applyParallax = () => {
        rafId = null
        quickSvgX(latestNx * -8)
        quickSvgY(latestNy * -6)
        quickSvgScale(1.015)
        quickBgX(latestNx * -6)
        quickBgY(latestNy * -4)
        quickBgScale(1.12)
        quickOverlayX(latestNx * -10)
        quickOverlayY(latestNy * -7)
      }

      const onMove = (event: MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return

        latestNx = (event.clientX - rect.left) / rect.width - 0.5
        latestNy = (event.clientY - rect.top) / rect.height - 0.5

        if (rafId) return
        rafId = window.requestAnimationFrame(applyParallax)
      }

      const onLeave = () => {
        if (rafId) {
          window.cancelAnimationFrame(rafId)
          rafId = null
        }
        quickSvgX(0)
        quickSvgY(0)
        quickSvgScale(1)
        quickBgX(0)
        quickBgY(0)
        quickBgScale(1.1)
        quickOverlayX(0)
        quickOverlayY(0)
      }

      const el = containerRef.current
      el?.addEventListener('mousemove', onMove)
      el?.addEventListener('mouseleave', onLeave)

      return () => {
        if (rafId) {
          window.cancelAnimationFrame(rafId)
        }
        el?.removeEventListener('mousemove', onMove)
        el?.removeEventListener('mouseleave', onLeave)
      }
    }, containerRef)

    return () => ctx.revert()
  }, [reduceMotion, parallaxEnabled])

  const handleOpenRegion = (target: WorldRegion) => {
    setSelectedRegionId(target.id)
    setHoveredId(target.id)
    visitArea(target.id)
  }

  const toggleQuickMode = () => {
    setIsQuickMode(prev => !prev)
  }
  const handleClosePanel = useCallback(() => {
    setSelectedRegionId(null)
  }, [])

  const focusRegion = (regionId: string) => {
    setHoveredId(regionId)
    const regionIndex = worldRegions.findIndex(region => region.id === regionId)
    if (regionIndex >= 0) {
      setKeyboardIndex(regionIndex)
    }
  }

  const getRegion = (id: string) => worldRegions.find(region => region.id === id)

  return (
    <div
      ref={containerRef}
      className="relative mx-auto h-[calc(100vh-2.5rem)] w-[min(99vw,1800px)]"
      data-map-layer
    >
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70 p-2 md:p-3">
        <svg
          ref={mapSurfaceRef}
          viewBox="0 0 1000 640"
          className="h-[calc(100vh-3.8rem)] w-full origin-center"
          role="img"
          aria-label="Mapa do mundo"
        >
          <defs>
            <filter id="map-bleed-blur">
              <feGaussianBlur stdDeviation="26" />
            </filter>
            <filter id="label-shadow">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2.2" floodColor="#020617" floodOpacity="0.92" />
            </filter>
          </defs>

          <g ref={bgLayerRef}>
            <image
              href={worldMapBg}
              x="-220"
              y="-150"
              width="1440"
              height="940"
              preserveAspectRatio="xMidYMid slice"
              opacity="0.5"
              filter="url(#map-bleed-blur)"
            />
            <image
              href={worldMapBg}
              x="-100"
              y="-70"
              width="1200"
              height="780"
              preserveAspectRatio="xMidYMid slice"
              opacity="1"
            />
          </g>

          <g ref={overlayLayerRef}>
            {worldConnections.map(([fromId, toId]) => {
              const from = getRegion(fromId)
              const to = getRegion(toId)
              if (!from || !to) return null

              return (
                <line
                  key={`${fromId}-${toId}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="#94a3b8"
                  strokeOpacity="0.55"
                  strokeWidth="1.8"
                  strokeDasharray="6 8"
                />
              )
            })}

            {worldRegions.map(region => {
              const isVisited = visitedAreas.includes(region.id)
              const isActive = region.id === activeRegion.id

              return (
                <g
                  key={region.id}
                  className="cursor-pointer"
                  onMouseEnter={() => focusRegion(region.id)}
                  onClick={() => handleOpenRegion(region)}
                >
                  {isActive ? (
                    <motion.circle
                      cx={region.x}
                      cy={region.y}
                      r={24}
                      fill="transparent"
                      stroke={region.accent}
                      strokeWidth="2"
                      initial={reduceMotion ? false : { scale: 0.9, opacity: 0.35 }}
                      animate={
                        reduceMotion
                          ? { scale: 1, opacity: 0.7 }
                          : { scale: [0.95, 1.06, 0.95], opacity: [0.35, 0.78, 0.35] }
                      }
                      transition={reduceMotion ? { duration: 0 } : { duration: 1.25, repeat: Infinity }}
                      style={{ pointerEvents: 'none' }}
                    />
                  ) : null}
                  <motion.circle
                    cx={region.x}
                    cy={region.y}
                    r={isVisited ? 19 : 16}
                    fill={region.accent}
                    initial={reduceMotion ? false : { scale: 0.9, opacity: 0.7 }}
                    animate={
                      reduceMotion
                        ? { scale: 1, opacity: isActive ? 1 : 0.92 }
                        : isActive
                          ? { scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }
                          : { scale: 1, opacity: isVisited ? 0.95 : 0.88 }
                    }
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : isActive
                          ? { duration: 1.8, repeat: Infinity }
                          : { duration: 0.25 }
                    }
                  />
                  <circle
                    cx={region.x}
                    cy={region.y}
                    r={isVisited ? 8 : 7}
                    fill="#0b0f16"
                    stroke="#f1f5f9"
                    strokeWidth="1.2"
                  />
                  <circle
                    cx={region.x}
                    cy={region.y}
                    r={26}
                    fill="transparent"
                    pointerEvents="all"
                    style={{ outline: 'none' }}
                  />
                  <text
                    x={region.x}
                    y={region.y + 28}
                    textAnchor="middle"
                    className="pointer-events-none select-none text-[11px]"
                    filter="url(#label-shadow)"
                    style={{
                      paintOrder: 'stroke',
                      stroke: isActive ? 'rgba(2,6,23,0.9)' : 'rgba(2,6,23,0.82)',
                      strokeWidth: 3,
                      fontWeight: isActive ? 700 : 600,
                      letterSpacing: '0.01em',
                      fill: isActive ? region.accent : '#f1f5f9',
                    }}
                  >
                    {region.title}
                  </text>
                </g>
              )
            })}
          </g>

        </svg>

        <p className="sr-only">
          Navegação por teclado disponível: use setas para alternar região, Enter ou espaço para
          abrir detalhes e Escape para fechar.
        </p>

        {isQuickMode ? (
          <aside className="absolute right-3 top-3 z-20 w-[min(360px,calc(100%-1.5rem))] rounded-xl border border-slate-700/80 bg-slate-950/88 p-3 backdrop-blur">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Modo rápido</p>
            <p className="mt-1 text-sm text-slate-300">
              Acesso direto por lista para leitura rápida de recrutador.
            </p>
            <div className="mt-3 grid gap-2">
              {worldRegions.map(region => (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => handleOpenRegion(region)}
                  className="rounded-md border border-slate-700 bg-slate-900/70 px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-slate-800"
                >
                  <span className="font-medium" style={{ color: region.accent }}>
                    {region.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-400">{region.lore}</span>
                </button>
              ))}
            </div>
          </aside>
        ) : null}

        <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 flex flex-col gap-2 md:inset-x-4 md:bottom-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl rounded-xl border border-slate-700/70 bg-slate-950/78 px-4 py-3 backdrop-blur">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Região em foco</p>
            <p className="font-display text-2xl text-souls-ember">{activeRegion.title}</p>
            <p className="mt-1 text-sm text-slate-200">{activeRegion.lore}</p>
          </div>

          <button
            type="button"
            onClick={() => handleOpenRegion(activeRegion)}
            className="pointer-events-auto rounded-md bg-souls-ember px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
          >
            Ver detalhes de {activeRegion.title}
          </button>
        </div>

        <button
          type="button"
          onClick={toggleQuickMode}
          className="absolute left-3 top-3 z-20 rounded-md border border-slate-700 bg-slate-950/85 px-3 py-1.5 text-xs text-slate-200 backdrop-blur transition hover:bg-slate-900 md:left-4 md:top-4"
        >
          {isQuickMode ? 'Modo imersivo' : 'Modo rápido'}
        </button>

        <RegionPanel region={selectedRegion} onClose={handleClosePanel}>
          {selectedRegion ? <RegionDetails regionId={selectedRegion.id} /> : null}
        </RegionPanel>
      </div>
    </div>
  )
}
