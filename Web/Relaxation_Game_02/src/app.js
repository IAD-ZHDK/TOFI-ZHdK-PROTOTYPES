import './css/style.css'
import P5 from 'p5'
import Ble from './js/Ble'
import Wave from './js/Wave'
// todo: webpack is building with html file paths defaulting to root. This should be local to make it easer to host demos with github pages
const containerElement = document.getElementById('p5-container')

const sketch = (p) => {
  let myFont
  let myBLE
  let wave
  const serviceUuid = 'ff9c1e42-7b32-11ea-bc55-0242ac130003'
  let sensorCharacteristic
  let isConnected = false
  p.preload = function () {
    myFont = p.loadFont('static/fonts/inconsolata.otf')
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight)
    myBLE = new Ble()
    p.textFont(myFont)
    p.textSize(p.width / 60)
    p.fill(255)
    p.noStroke()
    p.textAlign(p.CENTER, p.CENTER)
    let isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)
    if (!isChrome) {
      window.alert('BLE may not work in your browser. Use Chrome or check for a list of compatible browsers here: https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API')
    }
    wave = new Wave(p.windowWidth, p.windowHeight)
  }

  p.draw = function () {
    p.clear()
    p.fill(255)
    p.push()
    if (myBLE.isConnected) {
      // p.normalMaterial()
      let spacing = p.windowWidth / myBLE.sensorValues.length

      p.translate((spacing / 2), p.windowHeight / 2)
      for (let i = 0; i < myBLE.sensorValues.length; i++) {
        p.push()
        p.translate(spacing * i, 0)
        let radius = p.map(myBLE.sensorValues[i], 0, 16384, 10, spacing * 0.8)
        p.ellipse(0, 0, radius, radius)
        p.text(myBLE.sensorValues[i], 0, spacing / 3 * 1.20)
        p.pop()
      }
    } else {
      p.translate(p.windowWidth / 2, p.windowHeight / 2)
      p.text('No BLE Connection, click anywhere to pair BLE device', 0, 0)
    }
    let fps = p.frameRate()
    p.fill(255)
    p.translate(0, 30)
    p.text('FPS: ' + fps.toFixed(2), 0, 0)
    p.pop()
    drawGame(p)
  }
  p.touchStarted = function () {
    // myBLE.connectAndStartNotify()
    wave.Splash(p.floor(p.mouseX), p.floor(p.mouseY), 1000)
  }

  function drawGame (p) {
    wave.update(p)
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }
}

let PFIVE = new P5(sketch, containerElement)
