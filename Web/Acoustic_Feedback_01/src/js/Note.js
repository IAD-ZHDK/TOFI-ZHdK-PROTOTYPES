import P5 from 'p5'
import 'p5/lib/addons/p5.sound'
let that

class Note {
  constructor (P, midiNotes, x, y, diameter, color) {
    this.p = P
    this.midiNotes = midiNotes
    this.NoteFlag = false // playing or note
    this.envelope = new P5.Envelope()
    this.envelope.setADSR(0.2, 0.35, 0.04, 3) // quick decay
    this.envelope.setRange(0.6, 0.0)
    this.oscillator = new P5.Oscillator('sine')
    this.HSBColor = color
    this.oscillator.amp(this.envelope) // set amplitude
    this.freq = this.p.midiToFreq(this.midiNotes)
    this.oscillator.freq(this.freq)// set frequency
    this.oscillator.start() // start oscillating
    this.diameter = diameter
    this.amp = 0 // simulate amplitude
    this.x = x
    this.y = y
    that = this
  }

  draw () {
    let offset = 0
    if (this.amp > 5) {
      this.amp *= 0.99
      let angle = this.p.millis() * (this.freq / 1000) * (this.p.PI * 2)
      offset = this.p.sin(this.p.radians(angle)) * this.amp
    } else {
      this.amp = 5
    }
    /*
     if (this.NoteFlag) {
        this.p.fill(this.HSBColor, 255, this.amp)
      } else {
        this.p.fill(this.HSBColor, 255, 5)
      }
    */
    this.p.fill(this.HSBColor, 255, this.amp)
    this.p.noStroke()
    this.p.ellipse(this.x, this.y + offset, this.diameter, this.diameter)
  }

  checkMouseOver () {
    // mouse check
    let dist = this.p.dist(this.x, this.p.height / 2, this.p.mouseX, this.p.mouseY)
    if (dist <= this.diameter / 4) {
      return true
    } else {
      return false
    }
  }

  trigger () {
    if (this.NoteFlag === false) {
      this.NoteFlag = true
      // this.envelope.triggerAttack()
      this.envelope.play()
      this.amp = 100
      return true
    }
  }

  release () {
    if (this.NoteFlag === true) {
      this.NoteFlag = false
      // this.envelope.triggerRelease()
    }
  }
}
export default Note
