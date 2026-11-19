// Caçador "Capuz e cajado": silhueta preta de capuz, cajado com gancho e lanterna pendurada.
// Isolado aqui de propósito: para trocar o desenho por uma ilustração em imagem, basta
// implementar as mesmas duas funções (drawHunter e hunterHook); a cena não muda.
// Sistema de coordenadas do desenho: pés em (0, 0), para cima é negativo, ~400 de altura.

export type HunterPose = {
  x: number
  y: number
  scale: number
  /** tempo em segundos (balanço do manto, tremor da chama) */
  t: number
  /** ângulo do pêndulo da lanterna no gancho, em radianos (0 = pendurada reta) */
  lampAngle: number
}

const TAU = Math.PI * 2
const INK = '#050506'
const AMBER = '240,180,76'
const MOON = '169,214,229'

// Pontas do cajado, em unidades do desenho.
const TOP = { x: -94, y: -392 }
const HOOK = { x: -116, y: -384 }
const CHAIN = 26

type Ctx2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

// Camada própria do corpo preto: criada uma vez e reaproveitada enquanto o tamanho do canvas não muda.
let layer: OffscreenCanvas | HTMLCanvasElement | null = null
let layerCtx: Ctx2D | null = null

function getLayer(w: number, h: number): Ctx2D | null {
  if (layer && layer.width === w && layer.height === h && layerCtx) return layerCtx
  layer = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(w, h) : document.createElement('canvas')
  layer.width = w
  layer.height = h
  layerCtx = layer.getContext('2d') as Ctx2D | null
  return layerCtx
}

type Lamp = { x: number; y: number; rx: number; ry: number; moon: number }

// Luz de contorno: a silhueta deslocada para o lado de cada luz, e o preto por cima.
function silhouette(c: CanvasRenderingContext2D, parts: Path2D[], lamp: Lamp, t: number) {
  const fillAll = (g: Ctx2D) => parts.forEach(q => g.fill(q))
  c.save()
  c.translate(2.2, -2)
  c.fillStyle = `rgba(${MOON},${lamp.moon})`
  fillAll(c)
  c.restore()
  const flick = 1 + Math.sin(t * 9) * 0.04 + Math.sin(t * 23) * 0.02
  const g = c.createRadialGradient(lamp.x, lamp.y, 4, lamp.x, lamp.y, 230 * flick)
  g.addColorStop(0, `rgba(${AMBER},1)`)
  g.addColorStop(0.5, `rgba(${AMBER},.55)`)
  g.addColorStop(1, `rgba(${AMBER},0)`)
  c.save()
  c.translate(lamp.rx, lamp.ry)
  c.fillStyle = g
  fillAll(c)
  c.restore()
  // corpo preto e a luz rebatida da lanterna numa camada própria, para as partes não aparecerem
  const o = getLayer(c.canvas.width, c.canvas.height)
  if (!o) return
  o.setTransform(1, 0, 0, 1, 0, 0)
  o.globalCompositeOperation = 'source-over'
  o.clearRect(0, 0, c.canvas.width, c.canvas.height)
  o.setTransform(c.getTransform())
  o.fillStyle = INK
  fillAll(o)
  o.globalCompositeOperation = 'source-atop'
  const inn = o.createRadialGradient(lamp.x, lamp.y, 2, lamp.x, lamp.y, 120 * flick)
  inn.addColorStop(0, `rgba(${AMBER},.3)`)
  inn.addColorStop(1, `rgba(${AMBER},0)`)
  o.fillStyle = inn
  o.fillRect(lamp.x - 140, lamp.y - 140, 280, 280)
  o.globalCompositeOperation = 'source-over'
  c.save()
  c.setTransform(1, 0, 0, 1, 0, 0)
  c.drawImage(layer as CanvasImageSource, 0, 0)
  c.restore()
}

function lantern(c: CanvasRenderingContext2D, x: number, y: number, t: number) {
  const f = 1 + Math.sin(t * 9) * 0.05
  c.save()
  c.globalCompositeOperation = 'lighter'
  const g = c.createRadialGradient(x, y, 2, x, y, 70 * f)
  g.addColorStop(0, `rgba(${AMBER},.6)`)
  g.addColorStop(1, `rgba(${AMBER},0)`)
  c.fillStyle = g
  c.beginPath(); c.arc(x, y, 70 * f, 0, TAU); c.fill()
  c.restore()
  c.save()
  c.translate(x, y)
  c.fillStyle = INK
  c.beginPath(); c.moveTo(-9, -13); c.lineTo(0, -19); c.lineTo(9, -13); c.closePath(); c.fill()
  c.fillRect(-10, -13, 20, 3)
  c.fillRect(-10, 11, 20, 3)
  c.fillStyle = `rgb(${AMBER})`
  c.fillRect(-7, -10, 14, 21)
  c.fillStyle = '#FFE7B0'
  c.fillRect(-3, -4, 6, 10)
  c.strokeStyle = INK
  c.lineWidth = 1.6
  c.beginPath(); c.moveTo(0, -10); c.lineTo(0, 11); c.moveTo(-7, 0); c.lineTo(7, 0); c.stroke()
  c.restore()
}

function eyes(c: CanvasRenderingContext2D, pts: Array<[number, number]>) {
  pts.forEach(([x, y]) => {
    const g = c.createRadialGradient(x, y, 0, x, y, 5)
    g.addColorStop(0, `rgba(${AMBER},.9)`)
    g.addColorStop(1, `rgba(${AMBER},0)`)
    c.fillStyle = g
    c.beginPath(); c.arc(x, y, 5, 0, TAU); c.fill()
    c.fillStyle = '#FFE2A6'
    c.beginPath(); c.arc(x, y, 1.3, 0, TAU); c.fill()
  })
}

// Desenha o caçador e devolve onde a lanterna ficou, em coordenadas do canvas.
export function drawHunter(c: CanvasRenderingContext2D, pose: HunterPose): { lamp: { x: number; y: number } } {
  const { x, y, scale, t, lampAngle: ang } = pose
  const sway = Math.sin(t * 1.2) * 4
  const flap = Math.sin(t * 1.9 + 1) * 3
  const lamp: Lamp = {
    x: HOOK.x + Math.sin(ang) * CHAIN,
    y: HOOK.y + Math.cos(ang) * CHAIN + 14,
    rx: -2.4,
    ry: -1.4,
    moon: 0.2,
  }
  const parts: Path2D[] = []
  let p: Path2D

  c.save()
  c.translate(x, y)
  c.scale(scale, scale)

  // capa longa, com a barra rasgada
  p = new Path2D(); parts.push(p)
  p.moveTo(-14, -300)
  p.bezierCurveTo(-36, -296, -50, -282, -52, -258)
  p.bezierCurveTo(-56, -190, -62, -100, -70 - sway, -2)
  p.lineTo(-58, -26); p.lineTo(-46, -4); p.lineTo(-34, -34); p.lineTo(-20, -6); p.lineTo(-8, -28)
  p.lineTo(6, -2); p.lineTo(18, -30); p.lineTo(32, -4); p.lineTo(46, -24); p.lineTo(58, 0); p.lineTo(66 + flap, -20)
  p.lineTo(74 + sway, -2)
  p.bezierCurveTo(64, -100, 58, -190, 52, -258)
  p.bezierCurveTo(50, -282, 36, -296, 14, -300)
  p.closePath()

  // braço do lado da luz, saindo da capa até o cajado
  p = new Path2D(); parts.push(p)
  p.moveTo(-46, -264); p.bezierCurveTo(-62, -250, -78, -236, -88, -224); p.lineTo(-80, -210); p.bezierCurveTo(-68, -222, -52, -236, -38, -246); p.closePath()
  p = new Path2D(); parts.push(p)
  p.moveTo(-98, -224); p.quadraticCurveTo(-92, -232, -84, -228); p.quadraticCurveTo(-78, -220, -82, -208); p.quadraticCurveTo(-92, -204, -98, -210); p.closePath()

  // capuz: cobre a cabeça, ponta caída para trás
  p = new Path2D(); parts.push(p)
  p.moveTo(-24, -292)
  p.bezierCurveTo(-34, -318, -26, -350, 0, -356)
  p.bezierCurveTo(18, -358, 30, -350, 38, -338)
  p.bezierCurveTo(46, -326, 56 + flap, -316, 64 + flap, -300)
  p.bezierCurveTo(50, -306, 40, -308, 32, -306)
  p.bezierCurveTo(30, -300, 26, -294, 24, -290)
  p.closePath()

  // cajado, gancho e corrente da lanterna
  c.strokeStyle = INK
  c.lineCap = 'round'
  c.lineWidth = 5
  c.beginPath(); c.moveTo(-88, 0); c.lineTo(TOP.x, TOP.y); c.stroke()
  c.lineWidth = 4
  c.beginPath(); c.moveTo(TOP.x, TOP.y); c.quadraticCurveTo(TOP.x - 4, TOP.y - 18, HOOK.x, HOOK.y - 8); c.lineTo(HOOK.x, HOOK.y); c.stroke()
  c.lineWidth = 1.6
  c.beginPath(); c.moveTo(HOOK.x, HOOK.y); c.lineTo(lamp.x, lamp.y - 18); c.stroke()

  silhouette(c, parts, lamp, t)

  // abertura do capuz: rosto todo na sombra, só os olhos
  c.fillStyle = '#000'
  c.beginPath(); c.ellipse(-4, -318, 14, 19, -0.08, 0, TAU); c.fill()
  eyes(c, [[-9, -318], [2, -318]])

  c.save()
  c.translate(lamp.x, lamp.y)
  c.rotate(-ang)
  lantern(c, 0, 0, t)
  c.restore()

  c.restore()
  return { lamp: { x: x + lamp.x * scale, y: y + lamp.y * scale } }
}

// Ponto do gancho do cajado (pivô da lanterna), em coordenadas do canvas.
export function hunterHook(pose: Pick<HunterPose, 'x' | 'y' | 'scale'>): { x: number; y: number } {
  return { x: pose.x + HOOK.x * pose.scale, y: pose.y + HOOK.y * pose.scale }
}
