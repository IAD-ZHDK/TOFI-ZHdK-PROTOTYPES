import P5 from 'p5'
import P5ble from 'p5ble'
let that
class Ble {
  constructor () {
    this.serviceUuid = 'A22A0001-AD0B-4DF2-A4E2-1745CBB4dCEE'
    this.myBLE = new P5ble()
    this.isConnected = false
    this.sensorValues = []
    this.sensorValues[0] = 16384
    this.sensorValues[1] = 16384
    this.sensorValues[2] = 16384
    this.sensorValues[3] = 16384
    that = this // set a reference to the instance this
  }

  connectAndStartNotify () {
    // Connect to a device by passing the service UUID
    this.myBLE.connect(this.serviceUuid, this.gotCharacteristics)
  }
  gotCharacteristics (error, characteristics) {
    // A function that will be called once got characteristics
    if (error) {
      console.log('error: ', error)
    } else {
      console.log(characteristics[0])
      // Check if myBLE is connected
      console.log('check connection.')
      that.isConnected = that.myBLE.isConnected()

      // Add a event handler when the device is disconnected
      that.myBLE.onDisconnected(that.onDisconnected)

      for (let i = 0; i < characteristics.length; i++) {
        if (i === 0) {
          const sensorCharacteristic = characteristics[i]
          // Set datatype to 'custom', p5.ble.js won't parse the data, will return data as it is.

          that.myBLE.startNotifications(sensorCharacteristic, that.handleSensor, 'custom')
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
  }

  onDisconnected () {
    console.log('Device was disconnected.')
    this.isConnected = false
  }

  handleSensor (data) {
    let factor = 0.8
    // weighted moving average of values
    that.sensorValues[1] = Math.floor(that.sensorValues[1] * factor)
    that.sensorValues[0] = Math.floor(that.sensorValues[0] * factor)
    that.sensorValues[2] = Math.floor(that.sensorValues[2] * factor)
    that.sensorValues[3] = Math.floor(that.sensorValues[3] * factor)
    that.sensorValues[0] += Math.floor(data.getUint16(0, true) * (1.0 - factor))
    that.sensorValues[1] += Math.floor(data.getUint16(2, true) * (1.0 - factor))
    that.sensorValues[2] += Math.floor(data.getUint16(4, true) * (1.0 - factor))
    that.sensorValues[3] += Math.floor(data.getUint16(6, true) * (1.0 - factor))
  }
}
export default Ble
