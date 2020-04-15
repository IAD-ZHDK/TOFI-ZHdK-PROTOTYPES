import './css/style.css'
import P5 from 'p5'
import P5ble from 'p5ble'
const containerElement = document.getElementById('p5-container')
const serviceUuid = 'ff9c1e42-7b32-11ea-bc55-0242ac130003'
let sensorCharacteristic
let sensorValues = []
let myBLE
let isConnected = false

const sketch = (p) => {
  let x = 100
  let y = 100
  let myFont
  p.preload = function () {
    myFont = p.loadFont('static/fonts/inconsolata.otf')
  }

  p.setup = function () {
    sensorValues[0] = 65534
    sensorValues[1] = 65534
    sensorValues[2] = 65534
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.background(0)
    myBLE = new P5ble()
    p.textFont(myFont)
    p.textSize(p.width / 60)
    p.textAlign(p.CENTER, p.CENTER)
    let isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)
    if (!isChrome) {
      window.alert('BLE may not work in your browser. Use Chrome or check for a list of compatible browsers here: https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API')
    }
  }

  p.draw = function () {
    if (isConnected) {
      p.background(0)
      // p.normalMaterial()
      let spacing = p.windowWidth / sensorValues.length
      for (let i = 0; i < sensorValues.length; i++) {
        p.push()
        p.translate((p.windowWidth / 2) - spacing, p.windowHeight / 2)
        p.translate(spacing * i, 0)
        p.fill(255)
        let radius = p.map(sensorValues[i], 0, 65534, 10, spacing / 3)
        p.ellipse(0, 0, radius, radius)
        p.text(sensorValues[i], 0, spacing / 3 * 1.20)
        p.pop()
      }
    } else {
      p.background(255, 0, 0)
      p.translate(p.windowWidth / 2, p.windowHeight / 2)
      p.text('No BLE Connection, click anywhere to pair BLE device', 0, 0)
    }
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
  // You can also filter devices by name
  // myBLE.connect({
  //   filters: [{
  //     services: [serviceUuid],
  //   }, {
  //     name: 'ArduinoIMU'
  //   }]
  // }, gotCharacteristics)
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
      sensorCharacteristic = characteristics[i]
      // myBLE.startNotifications(sensorCharacteristic, handlebyte, 'custom')
      console.log('characteristics: 2')
    } else if (i === 2) {
      console.log('characteristics: 3')
    } else {
      console.log("characteristic doesn't match.")
    }
  }
}

function onDisconnected () {
  console.log('Device got disconnected.')
  isConnected = false
}

// A function that will be called once got characteristics
/*
function handlebyte (data) {
  let byteArray = [0, 0, 0, 0]
  let btnData = (data.getUint8(0, true)).toString(2)
  for (let i = 0; i < byteArray.length; i++) {
    byteArray[i] = btnData & 1
    console.log(i + '_' + byteArray[i])
    btnData = btnData >> 1
  }
  console.log('0')
  if (byteArray[0] === 1) {
    // console.log(byteArray[0])
    color = '#FFF3D9'
  }
  if (byteArray[1] === 1) {
    // console.log(byteArray[1])
    color = '#FFE6B3'
  }
  if (byteArray[2] === 1) {
    // console.log(byteArray[2])
    color = '#47AAD9'
  }
  if (byteArray[3] === 1) {
    // console.log(byteArray[3])
    color = '#2E6E8D'
  }
}
*/
function handleSensor (data) {
  // weighted moving average of values
  sensorValues[0] = Math.floor(sensorValues[0] * 0.8)
  sensorValues[1] = Math.floor(sensorValues[1] * 0.8)
  sensorValues[2] = Math.floor(sensorValues[2] * 0.8)
  sensorValues[0] += Math.floor(data.getUint16(0, true) * 0.2)
  sensorValues[1] += Math.floor(data.getUint16(2, true) * 0.2)
  sensorValues[2] += Math.floor(data.getUint16(4, true) * 0.2)
}

let PFIVE = new P5(sketch, containerElement)
