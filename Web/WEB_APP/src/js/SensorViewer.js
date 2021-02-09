import P5 from 'p5'
import Game from './Game'

class SensorViewer extends Game {
  constructor (p) {
    super(p)
    this.p = p
    this.histogram = new Array(8)
    // Loop to create 2D array
    for (let i = 0; i < this.histogram.length; i++) {
      this.histogram[i] = new Array(1)
    }
    this.p.colorMode(this.p.RGB)
    p.textSize(18)
  }
  draw (p, sensorValues, params) {
    p.clear()
    let spacing = p.windowWidth / sensorValues.length
    p.translate((spacing / 2), p.windowHeight / 2)
    for (let i = 0; i < sensorValues.length; i++) {
      let active = params.getActive(i)
      let threshold = params.getThreshold(i)
      let min = params.getMin(i)
      let max = params.getMax(i)
      if (active) {
        p.push()
        // histogram
        p.translate(spacing * i, 0)
        let radius = p.map(sensorValues[i], min, max, 10, spacing * 0.9)
        this.histogram[i].unshift(radius / 2)
        p.stroke(100)
        p.noFill()
        p.beginShape()
        for (let j = 0; j < this.histogram[i].length - 1; j++) {
          p.vertex(this.histogram[i][j], -j)
        }
        p.endShape()
        p.beginShape()
        for (let j = 0; j < this.histogram[i].length - 1; j++) {
          p.vertex(-this.histogram[i][j], -j)
        }
        p.endShape()

        if (sensorValues[i] > threshold) {
          p.fill(0)
        } else {
          p.fill(255)
        }
        p.ellipse(0, 0, radius, radius)
        p.fill(255)
        p.noStroke()
        p.translate(0, spacing / 3 * 4.0)
        p.text(sensorValues[i], 0, 0)
        p.translate(0, p.textSize())
        p.text(params.chanelNames[i], 0, 0)
        p.pop()
      } else {
        p.push()
        // histogram
        p.translate(spacing * i, 0)
        let radius = spacing * 0.2
        p.fill(100)
        p.noStroke()
        p.ellipse(0, 0, radius, radius)
        p.translate(0, spacing / 3 * 4.0)
        p.text(sensorValues[i], 0, 0)
        p.translate(0, p.textSize())
        p.text(params.chanelNames[i], 0, 0)
        p.pop()
      }
    }
  }
}
export default SensorViewer
