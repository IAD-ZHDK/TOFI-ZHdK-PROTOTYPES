import './css/style.css'
import P5 from 'p5'
import P5ble from 'p5ble'
const containerElement = document.getElementById('p5-container')
const serviceUuid = 'ff9c1e42-7b32-11ea-bc55-0242ac130003'
let sensorCharacteristic
let sensorValues = []
let myBLE

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
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
    p.background('#FFF')
    myBLE = new P5ble()
    p.textFont(myFont)
    p.textSize(p.width / 60)
    p.textAlign(p.CENTER, p.CENTER)
  }

  p.draw = function () {
    p.background(0)
    p.normalMaterial()

    let spacing = p.windowWidth / sensorValues.length

    for (let i = 0; i < sensorValues.length; i++) {
      p.push()
      p.translate(-(spacing), 0, 0)
      p.translate(spacing * i, 0, 0)
      let radius = p.map(sensorValues[i], 0, 65534, 10, spacing / 3)
      p.sphere(radius, 20, 20)
      p.fill(255)
      p.text(sensorValues[i], 0, spacing / 3 * 1.20)
      p.pop()
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

// A function that will be called once got characteristics
function handlebyte (data) {
  // let a = data.getByte(0, true)
  // let b = data.getByte(1, true)
  // let c = data.getByte(2, true)
  // console.log(data)
}

function handleSensor (data) {
  sensorValues[0] = Math.floor(sensorValues[0] * 0.8)
  sensorValues[1] = Math.floor(sensorValues[1] * 0.8)
  sensorValues[2] = Math.floor(sensorValues[2] * 0.8)
  sensorValues[0] += Math.floor(data.getUint16(0, true) * 0.2)
  sensorValues[1] += Math.floor(data.getUint16(2, true) * 0.2)
  sensorValues[2] += Math.floor(data.getUint16(4, true) * 0.2)
}

let PFIVE = new P5(sketch, containerElement)
