import './css/style.css'
import P5 from 'p5'
import P5ble from 'p5ble'
import Ble from './js/Ble'
import Meta from './js/Meta.js'

const containerElement = document.getElementById('p5-container')
let myBLE
let isConnected = false
let visRadius = 100
let myMeta
// todo: webpack is building with html file paths defaulting to root. This should be local to make it easer to host demos with github pages
// https://codepen.io/mnmxmx/pen/VjjvEq

const sketch = (p) => {
  let x = 100
  let y = 100
  let myFont
  p.preload = function () {
    myFont = p.loadFont('static/fonts/inconsolata.otf')
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.colorMode(p.HSB)
    myBLE = new Ble()
    p.textFont(myFont)
    p.noStroke()
    p.textSize(p.width / 60)
    myMeta = new Meta(p, 350, 350)
    p.textAlign(p.CENTER, p.CENTER)
  }

  p.draw = function () {
    p.clear()
    if (myBLE.isConnected) {
      drawGame(p)
      let fps = p.frameRate()
      p.fill(255)
      p.translate(30, p.height - 10)
      p.textSize(10)
      p.text('FPS: ' + fps.toFixed(2), 0, 0)
    } else {
      startScreen(p)
    }
  }

  p.touchStarted = function () {
    myBLE.connectAndStartNotify()
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }

  function drawGame (p) {
    myMeta.update(p, myBLE)
  }
  function startScreen (p) {
    p.push()
    p.translate(p.windowWidth / 2, p.windowHeight / 2)
    p.fill(255)
    p.text('No BLE Connection, click anywhere to pair BLE device', 0, 0)
    p.pop()
  }
}

let PFIVE = new P5(sketch, containerElement)
