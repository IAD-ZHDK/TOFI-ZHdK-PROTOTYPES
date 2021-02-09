import Game from './Game'
import Meta from './Meta.js'

class RelaxGame extends Game {
  constructor (p) {
    super(p)
    this.p = p
    this.p.colorMode(p.HSB)
    this.p.noStroke()
    this.myMeta = new Meta(p, 350, 350)
  }
  draw (p, sensorValues, params) {
    p.background(249, 60, 56)
    this.myMeta.update(p, sensorValues, params)
    /*
    let fps = p.frameRate()
    p.fill(255)
    p.translate(30, p.height - 10)
    p.textSize(10)
    p.text('FPS: ' + fps.toFixed(2), 0, 0)
     */
  }
}
export default RelaxGame
