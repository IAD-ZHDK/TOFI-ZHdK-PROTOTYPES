import './css/style.css'
import P5 from 'p5'
import 'p5/lib/addons/p5.sound'
import Ble from './js/Ble'
// import * as dat from 'dat.gui'
// inspiration: https://dotpiano.com/
// inspiration: https://compform.net/js_lab/js_lab.html?/music/sketches/hello_env.js
// todo: webpack is building with html file paths defaulting to root. This should be local to make it easer to host demos with github pages
const containerElement = document.getElementById('p5-container')

const sketch = (p) => {
  let x = 100
  let y = 100
  let myFont
  let myBLE
  let oscillators = []
  let envelopes = []
  let usedChannelNames = []
  let midiNotes = [60, 62, 64, 67, 69, 72, 74] // C D E G A C
  let NoteFlag = [false, false, false, false, false, false, false, false]
  let noSensors = 5
  let isConnected = false
  let demoMode = false
  // settings gui
  const dat = require('dat.gui')
  p.gui = new dat.GUI()
  p.guiObject = {
    factor: 0.5,
    threshold: 22000
  }

  p.preload = function () {
    myFont = p.loadFont('static/fonts/inconsolata.otf')
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight)
    myBLE = new Ble()
    // p.textFont(myFont)
    p.textSize(p.width / 100)
    p.fill(255)
    p.noStroke()
    p.textAlign(p.CENTER, p.CENTER)
    // setup settings gui
    let filter = p.gui.addFolder('filter (weighted moving average)')
    filter.add(p.guiObject, 'factor', 0.0, 0.99) //  (weighted moving average)
    filter.add(p.guiObject, 'threshold', 0, 50000) //
    filter.open()
    // sound
    for (let i = 0; i < noSensors; i++) {
      envelopes[i] = new P5.Envelope()
      envelopes[i].setADSR(0.01, 0.1, 0.1, 0.1) // quick decay
      envelopes[i].setRange(1.0, 0.0)
      oscillators[i] = new P5.Oscillator('sine')
      oscillators[i].amp(envelopes[i]) // set amplitude
      oscillators[i].freq(600)// set frequency
      oscillators[i].start() // start oscillating
    }
  }

  p.draw = function () {
    myBLE.setFilter(p.guiObject.factor)
    p.clear()
    if (myBLE.isConnected || demoMode === true) {
      let sensorValues = []
      for (let i = 2; i < myBLE.sensorValues.length - 1; i++) {
        sensorValues.push(myBLE.sensorValues[i + 1])
        usedChannelNames.push(myBLE.chanelNames[i + 1])
      }
      let spacing = p.windowWidth / sensorValues.length
      p.translate((spacing / 2), p.windowHeight / 2)
      for (let i = 0; i < sensorValues.length; i++) {
        p.push()
        p.translate(spacing * i, 0)
        let radius = p.map(sensorValues[i], 0, 16384, 10, spacing * 0.3)
        if (sensorValues[i] >= p.guiObject.threshold) {
          p.fill(255, 0, 0)
        } else {
          p.fill(255)
        }
        if (sensorValues[i] >= p.guiObject.threshold | p.mouseX > p.width / 2) {
          if (NoteFlag[i] === false) {
            trigger(p, i)
          }
        } else if (sensorValues[i] < p.guiObject.threshold | p.mouseX < p.width) {
          if (NoteFlag[i] === true) {
            release(p, i)
          }
        }
        p.ellipse(0, 0, radius, radius)
        p.noStroke()
        p.translate(0, spacing / 3 * 4.0)
        p.text(sensorValues[i], 0, 0)
        p.translate(0, p.textSize())
        p.text(usedChannelNames[i], 0, 0)
        p.pop()
      }
    } else {
      p.translate(p.windowWidth / 2, p.windowHeight / 2)
      p.text('No BLE Connection, click anywhere to pair BLE device', 0, 0)
    }
  }
  function trigger (p, i) {
    NoteFlag[i] = true
    const freq = p.midiToFreq(midiNotes[i])
    oscillators[i].freq(freq)
    envelopes[i].triggerAttack()
    console.log('triger')
  }

  function release (p, i) {
    NoteFlag[i] = false
    envelopes[i].triggerRelease()
    console.log('trigerRelease')
  }

  p.touchStarted = function () {
    if (!myBLE.isConnected && demoMode === false) {
      myBLE.connectAndStartNotify()
    }
  }
  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }

  p.keyPressed = function () {
    demoMode = true
  }
}

let PFIVE = new P5(sketch, containerElement)
