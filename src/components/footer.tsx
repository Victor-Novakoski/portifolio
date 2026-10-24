import { profile } from '@/data/profile'

export function Footer() {
  return (
    <footer className="wrap">
      <div className="inner">
        <span>
          {profile.name} · {profile.role}
        </span>
        <span>Feito com React, Vite e canvas.</span>
      </div>
    </footer>
  )
}
