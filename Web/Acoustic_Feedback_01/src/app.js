import './css/style.css'
import P5 from 'p5'
import 'p5/lib/addons/p5.sound'
import Ble from './js/Ble'
import Note from './js/Note'
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
  let Notes = []
  let interval = 700
  let SimonSequencePlaying = false
  let SimonSequence = []
  let PlayerSequence = []
  let SimonSequenceLength = 4
  let SimonSequenceIndex = 0
  let usedChannelNames = []
  let midiNotes = [60, 62, 64, 67, 69, 72, 74] // C D E G A C
  let colorPallet = [190.43, 166.42, 50.09, 30.9, 23.4]
  let noSensors = 5
  let visualWidth = p.windowWidth * 0.7
  let isConnected = false
  let demoMode = false
  // states
  let ConnectBLE = 0
  let GamePlayer = 1
  let GameSimon = 2
  let state = ConnectBLE
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
    p.colorMode(p.HSB)
    p.blendMode(p.SCREEN)
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
    for (let i = 2; i < 8; i++) {
      usedChannelNames.push(myBLE.chanelNames[i + 1])
    }
  }

  p.draw = function () {
    p.clear()
    p.background(0, 20, 10)
    if (state === GamePlayer) {
      drawGamePlayer()
    } else if (state === GameSimon) {
      p.background(0, 50, 10)
      drawGameSimon()
    } else if (state === ConnectBLE) {
      BLEMesage()
    }
  }
  p.touchStarted = function () {
    if (state === ConnectBLE) {
      setupSoundObjects()
      myBLE.connectAndStartNotify()
      state = GamePlayer
    } else {
      if (p.mouseY > p.height / 2) {
        if (state === GamePlayer) {
          state = GameSimon
        }
      }
    }
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }

  p.keyPressed = function () {
    setupSoundObjects()
    demoMode = true
    state = GamePlayer
  }

  function newSimonSequence () {
    SimonSequence = []
    for (let i = 0; i < SimonSequenceLength; i++) {
      SimonSequence.push(p.floor(p.random(noSensors)))
    }
  }

  function drawGameSimon () {
    if (SimonSequence.length === 0) {
      newSimonSequence()
    }
    if (SimonSequencePlaying === false) {
      SimonSequencePlaying = true
      setTimeout(playSequence, interval)
    }
    for (let i = 0; i < noSensors; i++) {
      Notes[i].draw()
    }
  }

  function playSequence () {
    if (SimonSequenceIndex < SimonSequenceLength) {
      releaseAllNotes()
      Notes[SimonSequence[SimonSequenceIndex]].trigger()
      setTimeout(playSequence, interval)
      SimonSequenceIndex++
    } else {
      SimonSequencePlaying = false
      SimonSequenceIndex = 0
      state = GamePlayer
    }
  }

  function drawGamePlayer () {
    myBLE.setFilter(p.guiObject.factor)
    let sensorValues = []
    // get set of sensor values in use, discard
    for (let i = 2; i < myBLE.sensorValues.length - 1; i++) {
      sensorValues.push(myBLE.sensorValues[i + 1])
    }
    for (let i = 0; i < noSensors; i++) {
      Notes[i].draw()
      // let radius = p.map(sensorValues[i], 0, 16384, 10, spacing * 0.3)
      if (demoMode === false) {
        if (sensorValues[i] >= p.guiObject.threshold) {
          if (Notes[i].trigger()) {
            checkSequence(i)
          }
        } else if (sensorValues[i] < p.guiObject.threshold) {
          Notes[i].release()
        }
      } else {
        if (Notes[i].checkMouseOver()) {
          if (Notes[i].trigger()) {
            checkSequence(i)
          }
        } else {
          Notes[i].release()
        }
      }

      p.text(sensorValues[i], Notes[i].x, p.height - 50)
      p.text(usedChannelNames[i], Notes[i].x, p.height - 30)
    }
  }
  function checkSequence (i) {
    if (SimonSequence.length > 0) {
      if (i === SimonSequence[SimonSequenceIndex]) {
        console.log('correct_' + SimonSequenceIndex + ' of' + SimonSequence.length)
        SimonSequenceIndex++
        if (SimonSequenceIndex >= SimonSequenceLength) {
          // sequence won
          setTimeout(sequenceWon, 500)
        }
      } else {
        // repeat
        setTimeout(sequenceLost, 1000)
      }
    }
  }
  function releaseAllNotes () {
    for (let i = 0; i < noSensors; i++) {
      Notes[i].release()
    }
  }

  function sequenceWon () {
    console.log('sequence won')
    SimonSequenceIndex = 0
    newSimonSequence()
    state = GameSimon
  }
  function sequenceLost () {
    SimonSequenceIndex = 0
    console.log('repeat:' + SimonSequence)
    state = GameSimon
  }
  function BLEMesage () {
    p.translate(p.windowWidth / 2, p.windowHeight / 2)
    p.text('No BLE Connection, click anywhere to pair BLE device', 0, 0)
    if (myBLE.isConnected) {
      state = GamePlayer
    }
  }

  function setupSoundObjects () {
    // sound
    let initialOffsetX = (p.windowWidth - visualWidth) / 2
    let diameter = visualWidth / (noSensors / 2) // slightly overlaping
    let spacing = visualWidth / noSensors
    initialOffsetX += spacing / 2
    for (let i = 0; i < noSensors; i++) {
      Notes[i] = new Note(p, midiNotes[i], (spacing * i) + initialOffsetX, p.windowHeight / 2, diameter, colorPallet[i])
    }
  }
}

let PFIVE = new P5(sketch, containerElement)
