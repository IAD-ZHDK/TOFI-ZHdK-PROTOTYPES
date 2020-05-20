import P5 from 'p5'
import P5ble from 'p5ble'

class Ble {
  constructor () {
    this.serviceUuid = 'ff9c1e42-7b32-11ea-bc55-0242ac130003'
    this.myBLE = new P5ble()
    this.isConnected = false
    this.sensorValues = []
    this.sensorValues[0] = 16384
    this.sensorValues[1] = 16384
    this.sensorValues[2] = 16384
    this.sensorValues[3] = 16384
  }

  connectAndStartNotify () {
    // Connect to a device by passing the service UUID
    this.myBLE.connect(this.serviceUuid, this.gotCharacteristics)
  }
  gotCharacteristics (error, characteristics) {
    // A function that will be called once got characteristics
    if (error) console.log('error: ', error)
    console.log(characteristics.length)
    // Check if myBLE is connected
    this.isConnected = this.myBLE.isConnected()

    // Add a event handler when the device is disconnected
    this.myBLE.onDisconnected(this.onDisconnected)

    for (let i = 0; i < characteristics.length; i++) {
      if (i === 0) {
        this.sensorCharacteristic = characteristics[i]
        // Set datatype to 'custom', p5.ble.js won't parse the data, will return data as it is.

        this.myBLE.startNotifications(this.sensorCharacteristic, this.handleSensor, 'custom')
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

  onDisconnected () {
    console.log('Device was disconnected.')
    this.isConnected = false
  }

  handleSensor (data) {
    // weighted moving average of values
    this.sensorValues[1] = Math.floor(this.sensorValues[1] * 0.8)
    this.sensorValues[0] = Math.floor(this.sensorValues[0] * 0.8)
    this.sensorValues[2] = Math.floor(this.sensorValues[2] * 0.8)
    this.sensorValues[3] = Math.floor(this.sensorValues[3] * 0.8)
    this.sensorValues[0] += Math.floor(data.getUint16(0, true) * 0.2)
    this.sensorValues[1] += Math.floor(data.getUint16(2, true) * 0.2)
    this.sensorValues[2] += Math.floor(data.getUint16(4, true) * 0.2)
    this.sensorValues[3] += Math.floor(data.getUint16(6, true) * 0.2)
  }
}
export default Ble
