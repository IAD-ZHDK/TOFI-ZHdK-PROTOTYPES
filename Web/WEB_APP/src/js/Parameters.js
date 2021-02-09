class Parameters {
  constructor (id) {
    this.cookieID = id
    // construct calibration object
    this.noChannels = 8
    this.chanelNames = ['Battery', 'Reference', 'Ch 6', 'Ch 5', 'Ch 4', 'Ch 3', 'Ch 2', 'Ch 1']
    this.params = {
    }
    for (let i = 0; i < this.noChannels; ++i) {
      this.params[this.chanelNames[i]] = {
        'active': true,
        'filter': 0.1,
        'min': 30700,
        'max': 32000,
        'threshold': 31000
      }
    }
    let cookieData = this.getCookie(this.cookieID)
    if (cookieData !== '' && cookieData !== 'undefined') {
      console.log('last cookie:')
      console.log(cookieData)
      let obj = JSON.parse(cookieData)
      console.log('old cookie')
      console.log(obj)
      Object.assign(this.params, obj)
      // this.chanelOptions = obj
    } else {
      console.log('no cookie')
    }
  }

  getFilters () {
    let filters = []
    for (let i = 0; i < this.noChannels; i++) {
      filters[i] = this.params[Object.keys(this.params)[i]].filter
    }
    return filters
  }

  objectToJsonCookie () {
    // creat Json object and set cookie
    console.log('object to json cookie set')
    let myJSON = JSON.stringify(this.params)
    this.setCookie(myJSON, 2000)
  }
  // https://www.w3schools.com/js/js_cookies.asp
  setCookie (cvalue, exdays) {
    let d = new Date()
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    let expires = 'expires=' + d.toUTCString()
    document.cookie = this.cookieID + '=' + cvalue + ';' + expires + ';path=/'
    // console.log(this.getCookie(this.cookieID))
  }

  getActive (i) {
    return this.params[Object.keys(this.params)[i]].active
  }
  getThreshold (i) {
    return this.params[Object.keys(this.params)[i]].threshold
  }
  getMin (i) {
    return this.params[Object.keys(this.params)[i]].min
  }
  getMax (i) {
    return this.params[Object.keys(this.params)[i]].max
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
}
export default Parameters
