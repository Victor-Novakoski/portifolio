import { lazy, Suspense, useEffect, useState } from 'react'

import { loadGame } from '@/lib/game-loader'
import { OPEN_GAME_EVENT } from '@/lib/runtime'

const CacaBugs = lazy(loadGame)

// Monta o mini game só depois do primeiro pedido para jogar (cabeçalho, seção ou fim das lutas).
export function CacaBugsHost({ onBest }: { onBest(score: number): void }) {
  const [open, setOpen] = useState(false)
  const [opener, setOpener] = useState<HTMLElement | null>(null)

  useEffect(() => {
    function onOpen() {
      setOpener(document.activeElement instanceof HTMLElement ? document.activeElement : null)
      setOpen(true)
    }
    window.addEventListener(OPEN_GAME_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_GAME_EVENT, onOpen)
  }, [])

  if (!open) return null
  return (
    <Suspense fallback={null}>
      <CacaBugs
        onBest={onBest}
        onClose={() => {
          setOpen(false)
          opener?.focus()
        }}
      />
    </Suspense>
  )
}
