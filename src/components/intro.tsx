import { useEffect, useRef, useState } from 'react'

import { endIntro, introIsRunning } from '@/lib/motion'

type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number }

const SPARK_COUNT = 46
const SKIP_EVENTS = ['keydown', 'pointerdown', 'wheel', 'touchstart'] as const

// Abertura: o nome acende e solta faíscas. Qualquer tecla, toque ou rolagem encerra.
export function Intro() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [running, setRunning] = useState(introIsRunning)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!running || !canvas || !ctx) return

    const sparks: Spark[] = []
    let emitted = 0
    let frame = 0
    let done = false

    const size = () => {
      const ratio = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * ratio
      canvas.height = window.innerHeight * ratio
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    const finish = () => {
      if (done) return
      done = true
      cancelAnimationFrame(frame)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      endIntro()
      setRunning(false)
    }

    size()
    const surname = document.querySelector('.surname')
    const start = performance.now()
    const draw = (now: number) => {
      const t = now - start
      if (surname && t > 1100 && t < 1800 && emitted < SPARK_COUNT) {
        const box = surname.getBoundingClientRect()
        for (let k = 0; k < 2 && emitted < SPARK_COUNT; k++, emitted++) {
          sparks.push({
            x: box.left + Math.random() * box.width,
            y: box.top + box.height * (0.3 + Math.random() * 0.6),
            vx: (Math.random() - 0.5) * 0.6,
            vy: -(0.8 + Math.random() * 1.6),
            life: 0,
            max: 50 + Math.random() * 50,
            size: 1 + Math.random() * 1.8,
          })
        }
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.globalCompositeOperation = 'lighter'
      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i]
        spark.life++
        spark.x += spark.vx + Math.sin((spark.life + i) / 6) * 0.25
        spark.y += spark.vy
        spark.vy *= 0.992
        const alpha = 1 - spark.life / spark.max
        if (alpha <= 0) {
          sparks.splice(i, 1)
          continue
        }
        ctx.fillStyle = `rgba(240,196,120,${alpha.toFixed(3)})`
        ctx.beginPath()
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2)
        ctx.fill()
      }

      if (t < 2900 || sparks.length) frame = requestAnimationFrame(draw)
      else finish()
    }
    frame = requestAnimationFrame(draw)

    // Espera um instante para o clique que abriu a página não encerrar a abertura.
    const listen = window.setTimeout(() => {
      SKIP_EVENTS.forEach(name => window.addEventListener(name, finish, { passive: true }))
    }, 50)
    window.addEventListener('resize', size)

    return () => {
      window.clearTimeout(listen)
      cancelAnimationFrame(frame)
      SKIP_EVENTS.forEach(name => window.removeEventListener(name, finish))
      window.removeEventListener('resize', size)
    }
  }, [running])

  return (
    <>
      <canvas id="sparks" ref={canvasRef} aria-hidden="true" />
      {running && (
        <button className="skip-intro" type="button" onClick={() => { endIntro(); setRunning(false) }}>
          pular abertura
        </button>
      )}
    </>
  )
}
