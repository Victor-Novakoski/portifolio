import { useEffect, useRef, type ReactNode } from 'react'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    mainRef.current?.focus()
  }, [])

  return (
    <div className="min-h-screen bg-souls-abyss text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(199,162,93,0.14),transparent_35%),radial-gradient(circle_at_80%_15%,rgba(96,165,250,0.12),transparent_30%)]" />
      <a
        href="#main-content"
        className="sr-only z-[90] rounded bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:not-sr-only focus:fixed focus:left-16 focus:top-4"
      >
        Ir para o conteúdo principal
      </a>

      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className="relative min-h-screen w-full outline-none"
      >
        {children}
      </main>
    </div>
  )
}
