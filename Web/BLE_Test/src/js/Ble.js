import P5 from 'p5'
import P5ble from 'p5ble'
let that

class Ble {
  constructor () {
    /*
    let isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)
    if (!isChrome) {
      window.alert('BLE may not work in your browser. Use Chrome or check for a list of compatible browsers here: https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API')
    }
    */
    this.id = 'default'
    this.serviceUuid = 'A22A0001-AD0B-4DF2-A4E2-1745CBB4dCEE' // The UUID for the main service on the TOFI trainer
    console.log('looking for:' + this.serviceUuid)
    this.myBLE = new P5ble()
    this.noChannels = 8
    this.isConnected = false
    this.sensorValues = []
    for (let i = 0; i < this.noChannels; i++) {
      this.sensorValues[i] = 0
    }
    this.chanelNames = ['Battery', 'Reference', 'Ch 6', 'Ch 5', 'Ch 4', 'Ch 3', 'Ch 2', 'Ch 1']
    this.chanelOptions = {
    }
    for (let i = 0; i < this.noChannels; ++i) {
      this.chanelOptions[this.chanelNames[i]] = {
        // 'name': this.chanelNames[i],
        'active': true,
        'filter': 0.8,
        'min': 1000,
        'max': 16384,
        'threshold': 10000
      }
    }
    that = this
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
      // console.log('address: ' + that.myBLE.address)
      console.log(characteristics[0])
      // Check if myBLE is connected
      console.log('check connection.')
      that.isConnected = that.myBLE.isConnected()
      // console.log()
      that.id = that.myBLE.device.id
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

  setFilter (chanel, value) {
    this.chanelOptions[ chanel ].filter = value
    if (value <= 0.01) {
      this.chanelOptions[ chanel ].filterering = false
    } else {
      this.chanelOptions[ chanel ].filterering = true
    }
  }

  handleSensor (data) {
    for (let i = 0; i < that.noChannels; i++) {
      let byteCount = i * 2
      if (that.chanelOptions[ i ].filterering === true) {
        that.sensorValues[i] = Math.floor(that.sensorValues[i] * that.chanelOptions[i].filter)
        that.sensorValues[i] += Math.floor(data.getUint16(byteCount, true) * (1.0 - that.chanelOptions[i].filter))
      } else {
        that.sensorValues[i] = data.getUint16(byteCount, true)
      }
    }
  }
}
export default Ble
