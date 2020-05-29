import './css/style.css'
import P5 from 'p5'
import P5ble from 'p5ble'
import Blob from './js/Blob.js'
const containerElement = document.getElementById('p5-container')
const serviceUuid = 'ff9c1e42-7b32-11ea-bc55-0242ac130003'
let sensorCharacteristic
let sensorValues = []
let myBLE
let isConnected = false
let color1, color2
let blobs = []
let visRadius = 100
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
    sensorValues[0] = 0
    sensorValues[1] = 0
    sensorValues[2] = 0
    sensorValues[3] = 0
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.colorMode(p.HSB)
    myBLE = new P5ble()
    p.textFont(myFont)
    p.textSize(p.width / 60)
    p.textAlign(p.CENTER, p.CENTER)
    let isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)
    if (!isChrome) {
      window.alert('BLE may not work in your browser. Use Chrome or check for a list of compatible browsers here: https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API')
    }
    color1 = p.color('#33a9a7')
    color2 = p.color('#503478')
    for (let i = 0; i < 10; i++) {
      blobs.push(new Blob(p, p.random(0, p.width), p.random(0, p.height)))
    }
  }

  p.draw = function () {
    p.clear()
    // drawGame(p)
    if (isConnected) {
      // drawGame(p)
    } else {
      startScreen(p)
    }
    let fps = p.frameRate()
    p.fill(255)
    p.stroke(0)
    p.translate(30, p.height - 10)
    p.textSize(10)
    p.text('FPS: ' + fps.toFixed(2), 0, 0)
  }

  p.touchStarted = function () {
    connectAndStartNotify()
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }
}

function connectAndStartNotify () {
  // Connect to a device by passing the service UUID
  myBLE.connect(serviceUuid, gotCharacteristics)
}

// A function that will be called once got characteristics
function gotCharacteristics (error, characteristics) {
  if (error) console.log('error: ', error)
  console.log(characteristics.length)
  // Check if myBLE is connected
  isConnected = myBLE.isConnected()

  // Add a event handler when the device is disconnected
  myBLE.onDisconnected(onDisconnected)

  for (let i = 0; i < characteristics.length; i++) {
    if (i === 0) {
      sensorCharacteristic = characteristics[i]
      // Set datatype to 'custom', p5.ble.js won't parse the data, will return data as it is.
      myBLE.startNotifications(sensorCharacteristic, handleSensor, 'custom')
      console.log('characteristics: 1')
    } else if (i === 1) {
      console.log('characteristics: 2')
    } else if (i === 2) {
      console.log('characteristics: 3')
    } else {
      console.log("characteristic doesn't match.")
    }
  }
}

function onDisconnected () {
  console.log('Device was disconnected.')
  isConnected = false
}

function handleSensor (data) {
  // weighted moving average of values
  let rate = 0.9
  sensorValues[0] = Math.floor(sensorValues[0] * rate)
  sensorValues[1] = Math.floor(sensorValues[1] * rate)
  sensorValues[2] = Math.floor(sensorValues[2] * rate)
  sensorValues[3] = Math.floor(sensorValues[3] * rate)
  sensorValues[0] += Math.floor(data.getUint16(0, true) * (1.0 - rate))
  sensorValues[1] += Math.floor(data.getUint16(2, true) * (1.0 - rate))
  sensorValues[2] += Math.floor(data.getUint16(4, true) * (1.0 - rate))
  sensorValues[3] += Math.floor(data.getUint16(6, true) * (1.0 - rate))
}

let PFIVE = new P5(sketch, containerElement)

function drawGame (p) {
  // setGradient(p, color1, color2)
  // p.translate(p.width / 2, p.height / 2)
  // pg.background(51)
  p.loadPixels()
  let vOffset = p.windowHeight / 2 - visRadius
  let hOffset = p.windowWidth / 2 - visRadius
  for (let x = hOffset; x < hOffset + visRadius * 2; x += 1) {
    for (let y = vOffset; y < vOffset + visRadius * 2; y += 1) {
      let sum = 0
      for (let i = 0; i < blobs.length; i++) {
        let xdif = x - blobs[i].x
        let ydif = y - blobs[i].y
        let d = p.sqrt((xdif * xdif) + (ydif * ydif))
        if (d <= blobs[i].r / 2) {
          sum += 10 * blobs[i].r / d
        }
      }
      if (sum >= 220) {
        let i = (x + (y * p.width)) * 4
        p.pixels[i] = 20
        p.pixels[i + 1] = 254
        p.pixels[i + 2] = 254
        p.pixels[i + 3] = 254
      }
    }
  }
  p.updatePixels()
  // p.image(pg, -pg.width / 2, -pg.width / 2)
  for (let i = 0; i < blobs.length; i++) {
    // blobs[i].Xamp = p.map(sensorValues[0], 100, 16384, 10, visRadius * 2)
    // blobs[i].Yamp = p.map(sensorValues[1], 100, 16384, 10, visRadius * 2)
    // blobs[i].r = 100 + (sensorValues[1] + sensorValues[0] / 2) * 0.1
    blobs[i].update(p)
  }
}
function startScreen (p) {
  p.push()
  p.background(255, 0, 0)
  p.translate(p.windowWidth / 2, p.windowHeight / 2)
  p.text('No BLE Connection, click anywhere to pair BLE device', 0, 0)
  p.pop()
}
