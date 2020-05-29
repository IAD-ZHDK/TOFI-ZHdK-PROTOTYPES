import Blob from './Blob.js'

class Meta {
  constructor (p, width, height) {
    this.blobs = []
    this.width = width
    this.height = height
    for (let i = 0; i < 6; i++) {
      this.blobs.push(new Blob(p, Math.random(0, width), p.random(0, height)))
    }
  }

  update (p, myBLE) {
    // let vOffset = p.windowHeight / 2 - visRadius
    // let hOffset = p.windowWidth / 2 - visRadius
    let img = p.createImage(this.height, this.width)
    img.loadPixels()
    for (let x = 0; x < this.width; x += 1) {
      for (let y = 0; y < this.height; y += 1) {
        let sum = 0
        for (let i = 0; i < this.blobs.length; i++) {
          let xdif = x - this.blobs[i].x - (this.width / 2)
          let ydif = y - this.blobs[i].y - (this.height / 2)
          let d = p.sqrt((xdif * xdif) + (ydif * ydif))
          if (d <= this.blobs[i].r) {
            sum += 10 * this.blobs[i].r / d
          }
        }
        if (sum >= 200) {
          sum = Math.min(sum, 255)
          sum -= 200
          sum *= 4
          let i = (x + (y * this.width)) * 4
          img.pixels[i] = 255
          img.pixels[i + 1] = 254
          img.pixels[i + 2] = 254
          img.pixels[i + 3] = sum
        }
      }
    }
    img.updatePixels()
    // img.resize(this.width * 2, this.height * 2)
    p.image(img, (p.width - this.width) / 2, (p.height - this.height) / 2)
    // p.image(pg, -pg.width / 2, -pg.width / 2)
    for (let i = 0; i < this.blobs.length; i++) {
      this.blobs[i].Xamp = p.map(myBLE.sensorValues[0], 100, 16384, 2, this.width * 0.65)
      this.blobs[i].Yamp = p.map(myBLE.sensorValues[1], 100, 16384, 2, this.height * 0.65)
      this.blobs[i].r = 30 + (myBLE.sensorValues[1] + myBLE.sensorValues[0]) * 0.025
      this.blobs[i].speed = (myBLE.sensorValues[0] / 16384 + myBLE.sensorValues[1] / 16384) * 0.03
      this.blobs[i].update(p)
    }
  }

  minMax (num, min, max) {
    const MIN = min || 1
    const MAX = max || 20
    const parsed = parseInt(num)
    return Math.min(Math.max(parsed, MIN), MAX)
  }

  draw (p) {

  }
}
export default Meta
