class Spring {
  constructor () {
    this.Velocity = 0
    this.TargetHeight = 0
    this.CurentHeight = 0
    // float k = 1;
    // float m = 100;
    this.km = 0.01 // spring constant (k) divided by mass (m)
    this.d = 0.04 // dampening factor
    this._x = 0
    this._y = 0
    this.x = 0
    this.Acceleration = 0
  }
  update () {
    // Calculions based on the work of Michael Hoffman
    this.x = this.CurentHeight - this.TargetHeight
    this.Acceleration = -this.km * this.x - this.d * this.Velocity
    this.CurentHeight += this.Velocity
    this.Velocity += this.Acceleration
  }
}
export default Spring
