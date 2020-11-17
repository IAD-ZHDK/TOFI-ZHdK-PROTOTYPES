class Parameters {
  constructor (id, chanelOptions) {
    const dat = require('dat.gui')
    this.gui = new dat.GUI()
    // this.guiObject = {}
    this.buildGUI(chanelOptions)
    /* for (let i in chanelOptions) {
      this.guiObject[ 'factor_' + i ] = chanelOptions[i].filter
      this.guiObject[ 'threshold_' + i ] = chanelOptions[i].threshold
    }
    console.log(this.guiObject)
    this.folders = { }
    for (let i in chanelOptions) {
      this.folders[i] = this.gui.addFolder(chanelOptions[i].name)
      this.folders[i].add(this.guiObject, 'factor_' + i, 0.0, 0.99) //  (weighted moving average)
      this.folders[i].add(this.guiObject, 'threshold_' + i, 0, 16384) //  (weighted moving average)
      // this.folders[i].open()
    } */
    let cookieData = this.getCookie('name')
    if (cookieData !== '') {
      console.log(cookieData)
    } else {
      console.log('no cookie')
    }
    // this.setCookie('name', 'test', 365)
  }
  getFactor (chanel) {
    return this.guiObject[ 'factor_' + chanel ]
  }
  // https://www.w3schools.com/js/js_cookies.asp

  setCookie (cname, cvalue, exdays) {
    let d = new Date()
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    let expires = 'expires=' + d.toUTCString()
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
  }

  getCookie (cname) {
    let name = cname + '='
    let ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length)
      }
    }
    return ''
  }
  // automaticly building guid from javascript taken from:  https://gist.github.com/heaversm/b159b51f4e68603b05dc417dfadb43c5
  buildGUI (config) {
    this.guiFolder = this.gui.addFolder('Calibration')
    this.addToGui(config, this.guiFolder)
    // add a button to be able to update your scene with changed variables if they don't auto-update things on screen
  }

  addToGui (obj, folder) {
    for (const key in obj) { // for each key in your object
      if (obj.hasOwnProperty(key)) {
        console.log('key name:' + key)
        console.log(typeof obj[key])
        let val = obj[key]
        if (typeof val === 'object') {
          console.log('new folder:' + key)
          let newFolder = folder.addFolder(key)
          this.addToGui(val, newFolder) // if the key is an object itself, call this function again to loop through that subobject, assigning it to the same folder
        } else if (typeof val === 'number') { // if the value of the object key is a number, establish limits and step
          let step, limit
          if (key === 'filter') { // if it's a small decimal number, give it a GUI range of -1,1 with a step of 0.1...
            step = 0.01
            limit = 0.99
          } else { // otherwise, calculate the limits and step based on # of digits in the number
            limit = 16384 // 14 bits
            step = 10 // ...with a step one less than the number of digits, i.e. '10'
          }
          folder.add(obj, key, 0, limit).step(step) // add the value to your GUI folder
        } else if (typeof val === 'boolean') {
          folder.add(obj, key).onChange(
            function () {
              console.log('gui_Changed')
            }) // add a radio button to GUI folder
        } else {
          folder.add(obj, key) // ...this would include things like boolean values as checkboxes, and strings as text fields
        }
      }
    }
  // .onChange(
  //    function () {
  //      console.log('gui_Changed')
  //    })
  }
}
export default Parameters
