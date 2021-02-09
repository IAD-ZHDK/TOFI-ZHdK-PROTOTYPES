class CalibrationGUI {
  constructor (Cookie) {
    this.Cookie = Cookie
    this.display = true
    this.buildGUI(this.Cookie.params)
  }

  writeCookie () {
    this.Cookie.objectToJsonCookie()
  }
  // automaticly building guid from javascript taken from:  https://gist.github.com/heaversm/b159b51f4e68603b05dc417dfadb43c5
  buildGUI (config) {
    const dat = require('dat.gui')
    this.gui = new dat.GUI()
    this.guiFolder = this.gui.addFolder('Calibration')
    this.addToGui(config, this.guiFolder)
    // add a button to be able to update your scene with changed variables if they don't auto-update things on screen
  }

  removeGui () {
    this.gui.destroy()
  }

  toggle () {
    this.display = !this.display
    if (this.display) {
      this.buildGUI(this.Cookie.params)
    } else {
      this.removeGui()
    }
  }
  addToGui (obj, folder) {
    let bindCallback = this.writeCookie.bind(this)
    for (const key in obj) { // for each key in your object
      if (obj.hasOwnProperty(key)) {
        let val = obj[key]
        if (typeof val === 'object') {
          let newFolder = folder.addFolder(key)
          this.addToGui(val, newFolder) // if the key is an object itself, call this function again to loop through that subobject, assigning it to the same folder
        } else if (typeof val === 'number') { // if the value of the object key is a number, establish limits and step
          let step, limit
          if (key === 'filter') { // if it's a small decimal number, give it a GUI range of -1,1 with a step of 0.1...
            step = 0.01
            limit = 0.99
          } else { // otherwise, calculate the limits and step based on # of digits in the number
            limit = 32768 // 15 bits
            step = 10 // ...with a step one less than the number of digits, i.e. '10'
          }
          folder.add(obj, key, 0, limit).step(step).onChange(function () {
            bindCallback()
          })// add the value to your GUI folder
        } else if (typeof val === 'boolean') {
          folder.add(obj, key).onChange(function () {
            bindCallback()
          }) // add a radio button to GUI folder
        } else {
          folder.add(obj, key).onChange(function () {
            bindCallback()
          }) // ...this would include things like boolean values as checkboxes, and strings as text fields
        }
      }
    }
  }
}
export default CalibrationGUI
