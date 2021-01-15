import './css/style.css'
import P5 from 'p5'
import Ble from './js/Ble'
import Parameters from './js/Parameters'
// import * as dat from 'dat.gui'
// todo: webpack is building with html file paths defaulting to root. This should be local to make it easer to host demos with github pages
const containerElement = document.getElementById('p5-container')

const sketch = (p) => {
  let x = 100
  let y = 100
  let myFont
  let myBLE
  let calibration
  let histogram = new Array(8)
  // Loop to create 2D array
  for (let i = 0; i < histogram.length; i++) {
    histogram[i] = new Array(1)
  }

  const serviceUuid = 'ff9c1e42-7b32-11ea-bc55-0242ac130003'
  let isConnected = false

  p.preload = function () {
    myFont = p.loadFont('static/fonts/inconsolata.otf')
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight)
    myBLE = new Ble()
    p.textFont(myFont)
    p.textSize(p.width / 100)
    p.fill(255)
    p.noStroke()
    p.textAlign(p.CENTER, p.CENTER)
    // setup settings gui
    // todo: id should be sent from ble only after connection established
    calibration = new Parameters(6) // myBLE.id
    // histogram
  }

  p.draw = function () {
    p.clear()
    if (myBLE.isConnected) {
      let sensorValues = []
      for (let i = 0; i < myBLE.sensorValues.length - 1; i++) {
        sensorValues.push(myBLE.sensorValues[i + 1])
      }
      let spacing = p.windowWidth / myBLE.sensorValues.length
      p.translate((spacing / 2), p.windowHeight / 2)
      for (let i = 0; i < myBLE.sensorValues.length; i++) {
        let active = calibration.chanelOptions[Object.keys(calibration.chanelOptions)[i]].active
        let threshold = calibration.chanelOptions[Object.keys(calibration.chanelOptions)[i]].threshold
        let min = calibration.chanelOptions[Object.keys(calibration.chanelOptions)[i]].min
        let max = calibration.chanelOptions[Object.keys(calibration.chanelOptions)[i]].max
        if (active) {
          p.push()
          // histogram
          p.translate(spacing * i, 0)
          let radius = p.map(myBLE.sensorValues[i], min, max, 0, spacing * 0.5)
          histogram[i].unshift(radius / 2)
          p.stroke(100)
          p.noFill()

          p.beginShape()
          for (let j = 0; j < histogram[i].length - 1; j++) {
            p.vertex(histogram[i][j], -j)
          }
          p.endShape()
          p.beginShape()
          for (let j = 0; j < histogram[i].length - 1; j++) {
            p.vertex(-histogram[i][j], -j)
          }
          p.endShape()

          if (myBLE.sensorValues[i] > threshold) {
            p.fill(255, 0, 0)
          } else {
            p.fill(255)
          }
          p.ellipse(0, 0, radius, radius)
          p.noStroke()
          p.translate(0, spacing / 3 * 4.0)
          p.text(myBLE.sensorValues[i], 0, 0)
          p.translate(0, p.textSize())
          p.text(calibration.chanelNames[i], 0, 0)
          p.pop()
        } else {
          p.push()
          // histogram
          p.translate(spacing * i, 0)
          let radius = spacing * 0.5
          p.fill(100)
          p.noStroke()
          p.ellipse(0, 0, radius, radius)
          p.translate(0, spacing / 3 * 4.0)
          p.text(myBLE.sensorValues[i], 0, 0)
          p.translate(0, p.textSize())
          p.text(calibration.chanelNames[i], 0, 0)
          p.pop()
        }
      }
      myBLE.updateFilters(calibration.getFilters())
    } else {
      p.translate(p.windowWidth / 2, p.windowHeight / 2)
      p.text('No BLE Connection, click anywhere to pair BLE device', 0, 0)
    }
  }

  p.touchStarted = function () {
    if (!myBLE.isConnected) {
      myBLE.connectAndStartNotify()
    }
  }
  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }
}

let PFIVE = new P5(sketch, containerElement)
