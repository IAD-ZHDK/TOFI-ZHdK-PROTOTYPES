import './css/style.css'
import P5 from 'p5'
import Ble from './js/Ble'
import BleSimulator from './js/BleSimulator'
import Parameters from './js/Parameters'
import SensorViewer from './js/SensorViewer'
import RelaxGame from './js/RelaxGame'
import SonicSimon from './js/SonicSimon'
import CalibrationGUI from './js/CalibrationGUI'
// import * as dat from 'dat.gui'
// todo: webpack is building with html file paths defaulting to root. This should be local to make it easer to host demos with github pages
const containerElement = document.getElementById('p5-container')

const sketch = (p) => {
  let myFont
  let myBLE
  let bleSimulator
  let game
  let params
  let calibrationGUI
  let debug = false
  let settingsIcon
  let applicationState = 'Simon' // 'SensorViewer'
  p.preload = function () {
    myFont = p.loadFont('static/fonts/inconsolata.otf')
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight)
    myBLE = new Ble()
    bleSimulator = new BleSimulator()
    p.changeState(applicationState)
    // game = new SensorViewer(p)
    p.textFont(myFont)
    p.textSize(p.width / 100)
    p.fill(255)
    p.noStroke()
    p.textAlign(p.CENTER, p.CENTER)
    // setup settings gui
    // todo: id should be sent from ble only after connection established
    params = new Parameters(6) // myBLE.id
    calibrationGUI = new CalibrationGUI(params)
    calibrationGUI.toggle()
    // GUI
    settingsIcon = p.loadImage('static/textures/settings.svg')
  }

  p.draw = function () {
    if (myBLE.isConnected || debug) {
      let sensorValues = p.updateSensorValues()
      p.push()
      p.drawScreen(sensorValues)
      p.pop()
    } else {
      p.push()
      p.background(0)
      p.translate(p.windowWidth / 2, p.windowHeight / 2)
      p.text('No BLE Connection, touch anywhere to pair BLE device', 0, 0)
      p.pop()
    }
    p.image(settingsIcon, 5, 5, 20, 20)
  }

  p.drawScreen = function (sensorValues) {
    game.draw(p, sensorValues, params)
  }

  p.changeState = function (newState) {
    if (newState === 'Simon') {
      game = new SonicSimon(p)
      applicationState = newState
    } else if (newState === 'SensorViewer') {
      game = new SensorViewer(p)
      applicationState = newState
    }
  }

  p.updateSensorValues = function () {
    let sensorValues = []
    if (myBLE.isConnected) {
      debug = false
      for (let i = 0; i < myBLE.sensorValues.length; i++) {
        sensorValues.push(myBLE.sensorValues[i])
      }
      myBLE.updateFilters(params.getFilters())
    } else {
      // random values to testing without device
      for (let i = 0; i < bleSimulator.sensorValues.length; i++) {
        sensorValues.push(bleSimulator.sensorValues[i])
      }
      bleSimulator.updateFilters(params.getFilters())
    }
    return sensorValues
  }
  /*
    p.keyPressed = function () {
      if (p.keyCode === p.LEFT_ARROW) {
        // debug = true
        p.changeState('Simon')
      }
    }
  */
  p.touchEnded = function () {
    // let fs = p.fullscreen()
    // p.fullscreen(!fs)
    // p.fullscreen(true)
    if (p.mouseY <= 50 && p.mouseX <= 50) {
      // todo: implement gui library for buttons
      calibrationGUI.toggle()
      if (applicationState === 'Simon') {
        p.changeState('SensorViewer')
      } else {
        p.changeState('Simon')
      }
    }
    if (!myBLE.isConnected && !debug) {
      myBLE.connectAndStartNotify()
    }
    if (myBLE.isConnected) {
      p.fullscreen(true)
    }
  }
  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }
}

let PFIVE = new P5(sketch, containerElement)
