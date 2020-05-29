import P5 from 'p5'
import Spring from './Spring.js'
class Wave {
  constructor (width, height) {
    this.scaleFactor = 7
    this.springxcount = Math.floor(width / this.scaleFactor)
    this.springycount = Math.floor(height / this.scaleFactor)
    this.deltas = new Array(this.springxcount)
    this.springs = new Array(this.springxcount)
    this.nodeWidth = 3
    this.maxSplash = 1000
    this.Spread = 0.2
    // controls how fast the waves spread. It can take values between 0 and 0.5, with larger values making the waves spread out faster.

    for (let i = 0; i < this.springxcount; i++) {
      this.deltas[i] = new Array(this.springycount)
      this.springs[i] = new Array(this.springycount)
      for (let j = 0; j < this.springycount; j++) {
        this.deltas[i][j] = 0
        this.springs[i][j] = new Spring()
        this.springs[i][j]._x = this.nodeWidth * i
        this.springs[i][j]._y = this.nodeWidth * j
        this.springs[i][j].TargetHeight = 0
      }
    }
  }
  Splash (x, y, Velocity) {
    x = Math.floor(x / this.scaleFactor)
    y = Math.floor(y / this.scaleFactor)
    this.springs[x][y].Velocity = Velocity
  }

  update (p) {
    for (let i = 0; i < this.springxcount; i++) {
      for (let j = 0; j < this.springycount; j++) {
        let left = (i - 1 + this.springxcount) % this.springxcount
        let right = (i + 1) % this.springxcount
        let up = (j - 1 + this.springycount) % this.springycount
        let down = (j + 1) % this.springycount
        let neighbors = this.springs[left][j].CurentHeight * 0.25 + this.springs[right][j].CurentHeight * 0.25 + this.springs[i][up].CurentHeight * 0.25 + this.springs[i][down].CurentHeight * 0.25
        this.deltas[i][j] = this.Spread * (neighbors - this.springs[i][j].CurentHeight)
      }
    }

    for (let i = 0; i < this.springxcount; i++) {
      for (let j = 0; j < this.springycount; j++) {
        this.springs[i][j].Velocity += this.deltas[i][j]
        this.springs[i][j].CurentHeight += this.deltas[i][j]
        this.springs[i][j].update()
      }
    }
    this.draw(p)
  }

  minMax (num, min, max) {
    const MIN = min || 1
    const MAX = max || 20
    const parsed = parseInt(num)
    return Math.min(Math.max(parsed, MIN), MAX)
  }

  draw (p) {
    let img = p.createImage(this.springxcount, this.springycount)
    img.loadPixels()
    let d = p.pixelDensity()
    for (let i = 0; i < this.springxcount; i++) {
      for (let j = 0; j < this.springycount; j++) {
        if (this.springs[i][j].CurentHeight >= 5) {
          let loc = (i + (j * img.width)) * 4
          img.pixels[loc] = 254
          img.pixels[loc + 1] = 254
          img.pixels[loc + 2] = 254
          img.pixels[loc + 3] = this.minMax(this.springs[i][j].CurentHeight * 6, 0, 254)
          // img.set(i, j, p.color(255))
        }
      }
    }
    img.updatePixels()
    img.resize(p.windowWidth, p.windowHeight)
    p.image(img, 0, 0)
    /*
    p.loadPixels()
    let d = p.pixelDensity()
    for (let x = 0; x < p.windowWidth * d; x += 1) {
      for (let y = 0; y < p.windowHeight * d; y += 1) {
        let loc = (x + (y * p.windowWidth * d)) * 4
      //  p.pixels[loc] = 20
      //  p.pixels[loc + 1] = 254
      //  p.pixels[loc + 2] = 254
      //  p.pixels[loc + 3] = 254
      }
    }
    p.updatePixels()
     */
  }
}
export default Wave
