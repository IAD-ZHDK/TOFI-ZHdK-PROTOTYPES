class Parameters {
  constructor (id) {
    this.cookieID = id
    // construct calibration object
    this.noChannels = 8
    this.chanelNames = ['Battery', 'Reference', 'Ch 6', 'Ch 5', 'Ch 4', 'Ch 3', 'Ch 2', 'Ch 1']
    this.chanelOptions = {
    }
    for (let i = 0; i < this.noChannels; ++i) {
      this.chanelOptions[this.chanelNames[i]] = {
        'active': true,
        'filter': 0.8,
        'min': 1000,
        'max': 16384,
        'threshold': 10000
      }
    }
    let cookieData = this.getCookie(this.cookieID)
    if (cookieData !== '') {
      console.log('last cookie:')
      console.log(cookieData)
      let obj = JSON.parse(cookieData)
      console.log('old cookie')
      console.log(obj)
      Object.assign(this.chanelOptions, obj)
      // this.chanelOptions = obj
    } else {
      console.log('no cookie')
    }
    this.buildGUI(this.chanelOptions)
  }

  getFilters () {
    let filters = []
    for (let i = 0; i < this.noChannels; i++) {
      filters[i] = this.chanelOptions[Object.keys(this.chanelOptions)[i]].filter
    }
    return filters
  }

  objectToJsonCookie () {
    // creat Json object and set cookie
    console.log('object to json cookie set')
    let myJSON = JSON.stringify(this.chanelOptions)
    // console.log(myJSON)
    this.setCookie(this.cookieID, myJSON, 2000)
  }
  // https://www.w3schools.com/js/js_cookies.asp
  setCookie (cname, cvalue, exdays) {
    let d = new Date()
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    let expires = 'expires=' + d.toUTCString()
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
    console.log(this.getCookie(cname))
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
    const dat = require('dat.gui')
    this.gui = new dat.GUI()
    this.guiFolder = this.gui.addFolder('Calibration')
    this.addToGui(config, this.guiFolder)
    // add a button to be able to update your scene with changed variables if they don't auto-update things on screen
  }

  addToGui (obj, folder) {
    let bindCallback = this.objectToJsonCookie.bind(this)
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
export default Parameters
