export type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; gravity: number; color: string }

const colors = ['224,188,116', '199,162,93', '255,243,201']

export function makeSpark(x: number, y: number, vx: number, vy: number, max: number, gravity = 0): Spark {
  return {
    x,
    y,
    vx,
    vy,
    life: 0,
    max,
    size: 1 + Math.random() * 1.8,
    gravity,
    color: colors[Math.floor(Math.random() * colors.length)],
  }
}

// Avança e desenha as faíscas; devolve quantas continuam vivas.
export function stepSparks(ctx: CanvasRenderingContext2D, sparks: Spark[]) {
  ctx.globalCompositeOperation = 'lighter'
  for (let i = sparks.length - 1; i >= 0; i--) {
    const spark = sparks[i]
    spark.life++
    spark.x += spark.vx + Math.sin((spark.life + i) / 6) * 0.25
    spark.y += spark.vy
    spark.vy = spark.vy * 0.992 + spark.gravity
    const alpha = 1 - spark.life / spark.max
    if (alpha <= 0) {
      sparks.splice(i, 1)
      continue
    }
    ctx.fillStyle = `rgba(${spark.color},${alpha.toFixed(3)})`
    ctx.beginPath()
    ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalCompositeOperation = 'source-over'
  return sparks.length
}
