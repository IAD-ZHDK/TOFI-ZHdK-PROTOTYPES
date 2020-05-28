class Blob {
  constructor (p, x, y) {
    this.x = x
    this.y = y
    let angle = p.random(0, 2 * p.PI)
    this.xspeed = p.random(2, 5) * Math.cos(angle)
    this.yspeed = p.random(2, 5) * Math.sin(angle)
    this.r = p.random(300, 400)
    this.Xangle = p.random(p.PI)
    this.Yangle = p.random(p.PI)
    this.Xamp = p.random(120)
    this.Yamp = p.random(120)
  }

  update (p) {
    this.Xangle += 0.04
    this.Yangle += 0.04
    this.x = p.width / 2 + p.sin(this.Xangle) * this.Xamp
    this.y = p.height / 2 + p.sin(this.Yangle) * this.Yamp
  }

  show (p) {
    p.noFill()
    p.stroke(0)
    p.strokeWeight(4)
    p.ellipse(this.x, this.y, this.r * 2, this.r * 2)
  }
}
export default Blob
