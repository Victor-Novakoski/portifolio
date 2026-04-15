import { ProgressProvider } from '@/app/providers/progress-provider'
import { AppShell } from '@/components/layout/app-shell'
import { MapaPage } from '@/pages/mapa'

export function App() {
  return (
    <ProgressProvider>
      <AppShell>
        <MapaPage />
      </AppShell>
    </ProgressProvider>
  )
}
