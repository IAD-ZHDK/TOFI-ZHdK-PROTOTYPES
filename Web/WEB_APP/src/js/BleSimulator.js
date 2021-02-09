let that

class BleSimulator {
  constructor () {
    /*
    let isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)
    if (!isChrome) {
      window.alert('BLE may not work in your browser. Use Chrome or check for a list of compatible browsers here: https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API')
    }
    */
    this.noChannels = 8
    this.isConnected = true
    this.sensorValues = []
    this.filters = []
    for (let i = 0; i < this.noChannels; i++) {
      this.sensorValues[i] = 0
      this.filters[i] = 0
    }
    that = this
  }

  updateFilters (newFilters) {
    this.handleSensor()
    for (let i = 0; i < this.noChannels; i++) {
      this.filters[i] = newFilters[i]
    }
  }

  handleSensor () {
    // apply filtering
    for (let i = 0; i < that.noChannels; i++) {
      // let filter = that.chanelOptions[Object.keys(that.chanelOptions)[i]].filter
      let filter = that.filters[i]
      if (filter > 0) {
        that.sensorValues[i] = Math.floor(that.sensorValues[i] * filter)
        that.sensorValues[i] += Math.floor(Math.random() * 3000 * (1.0 - filter))
      } else {
        that.sensorValues[i] = Math.floor(Math.random() * 3000)
      }
    }
  }
}
export default BleSimulator
