import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type ProgressState = {
  visitedAreas: string[]
}

type ProgressContextValue = ProgressState & {
  visitArea: (area: string) => void
}

const STORAGE_KEY = 'soulslike-portfolio-progress'

const initialState: ProgressState = {
  visitedAreas: ['map'],
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string')
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(initialState)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return

    try {
      const parsed = JSON.parse(stored) as Partial<ProgressState>
      setState({
        visitedAreas: isStringArray(parsed.visitedAreas)
          ? [...new Set(parsed.visitedAreas)]
          : initialState.visitedAreas,
      })
    } catch {
      setState(initialState)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const visitArea = useCallback((area: string) => {
    setState(prev => {
      if (prev.visitedAreas.includes(area)) return prev
      return { ...prev, visitedAreas: [...prev.visitedAreas, area] }
    })
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      visitArea,
    }),
    [state, visitArea]
  )

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider')
  }

  return context
}
