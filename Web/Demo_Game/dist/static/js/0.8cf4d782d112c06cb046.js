(this.webpackJsonp=this.webpackJsonp||[]).push([[0],{"8z7e":function(e,o){},ERIh:function(e,o,t){"use strict";t("8z7e");var n=i(t("I335")),s=i(t("pbXo"));function i(e){return e&&e.__esModule?e:{default:e}}var a=document.getElementById("p5-container");new n.default((function(e){var o=void 0,t=void 0;e.preload=function(){o=e.loadFont("static/fonts/inconsolata.otf")},e.setup=function(){e.createCanvas(e.windowWidth,e.windowHeight),t=new s.default,e.textFont(o),e.textSize(e.width/60),e.fill(255),e.noStroke(),e.textAlign(e.CENTER,e.CENTER),window.chrome&&(window.chrome.webstore||window.chrome.runtime)||window.alert("BLE may not work in your browser. Use Chrome or check for a list of compatible browsers here: https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API")},e.draw=function(){if(e.clear(),t.isConnected){var o=e.windowWidth/t.sensorValues.length;e.translate(o/2,e.windowHeight/2);for(var n=0;n<t.sensorValues.length;n++){e.push(),e.translate(o*n,0);var s=e.map(t.sensorValues[n],0,16384,10,.8*o);e.ellipse(0,0,s,s),e.text(t.sensorValues[n],0,o/3*1.2),e.pop()}}else e.translate(e.windowWidth/2,e.windowHeight/2),e.text("No BLE Connection, click anywhere to pair BLE device",0,0)},e.touchStarted=function(){t.connectAndStartNotify()},e.windowResized=function(){e.resizeCanvas(e.windowWidth,e.windowHeight)}}),a)},pbXo:function(e,o,t){"use strict";Object.defineProperty(o,"__esModule",{value:!0});var n=a(t("iCc5")),s=a(t("V7oC")),i=(a(t("I335")),a(t("pvlQ")));function a(e){return e&&e.__esModule?e:{default:e}}var r=void 0,c=function(){function e(){(0,n.default)(this,e),this.serviceUuid="ff9c1e42-7b32-11ea-bc55-0242ac130003",this.myBLE=new i.default,this.isConnected=!1,this.sensorValues=[],this.sensorValues[0]=16384,this.sensorValues[1]=16384,this.sensorValues[2]=16384,this.sensorValues[3]=16384,r=this}return(0,s.default)(e,[{key:"connectAndStartNotify",value:function(){this.myBLE.connect(this.serviceUuid,this.gotCharacteristics)}},{key:"gotCharacteristics",value:function(e,o){if(e)console.log("error: ",e);else{console.log(o[0]),console.log("check connection."),r.isConnected=r.myBLE.isConnected(),r.myBLE.onDisconnected(r.onDisconnected);for(var t=0;t<o.length;t++)if(0===t){var n=o[t];r.myBLE.startNotifications(n,r.handleSensor,"custom"),console.log("characteristics: 1")}else 1===t?console.log("characteristics: 2"):2===t?console.log("characteristics: 3"):console.log("characteristic doesn't match.")}}},{key:"onDisconnected",value:function(){console.log("Device was disconnected."),this.isConnected=!1}},{key:"handleSensor",value:function(e){r.sensorValues[1]=Math.floor(.8*r.sensorValues[1]),r.sensorValues[0]=Math.floor(.8*r.sensorValues[0]),r.sensorValues[2]=Math.floor(.8*r.sensorValues[2]),r.sensorValues[3]=Math.floor(.8*r.sensorValues[3]),r.sensorValues[0]+=Math.floor(e.getUint16(0,!0)*(1-.8)),r.sensorValues[1]+=Math.floor(e.getUint16(2,!0)*(1-.8)),r.sensorValues[2]+=Math.floor(e.getUint16(4,!0)*(1-.8)),r.sensorValues[3]+=Math.floor(e.getUint16(6,!0)*(1-.8))}}]),e}();o.default=c}},[["ERIh",1,2]]]);
//# sourceMappingURL=0.8cf4d782d112c06cb046.js.map