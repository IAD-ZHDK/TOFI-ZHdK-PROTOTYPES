(this.webpackJsonp=this.webpackJsonp||[]).push([[0],{"8z7e":function(o,t){},ERIh:function(o,t,e){"use strict";e("8z7e");var n=c(e("I335")),i=c(e("pvlQ"));function c(o){return o&&o.__esModule?o:{default:o}}var a=document.getElementById("p5-container"),r=void 0,l=[],s=void 0,d=!1;function h(o,t){o&&console.log("error: ",o),console.log(t.length),d=s.isConnected(),s.onDisconnected(w);for(var e=0;e<t.length;e++)0===e?(r=t[e],s.startNotifications(r,f,"custom"),console.log("characteristics: 1")):1===e?console.log("characteristics: 2"):2===e?console.log("characteristics: 3"):console.log("characteristic doesn't match.")}function w(){console.log("Device was disconnected."),d=!1}function f(o){l[0]=Math.floor(.8*l[0]),l[1]=Math.floor(.8*l[1]),l[2]=Math.floor(.8*l[2]),l[3]=Math.floor(.8*l[3]),l[0]+=Math.floor(.2*o.getUint16(0,!0)),l[1]+=Math.floor(.2*o.getUint16(2,!0)),l[2]+=Math.floor(.2*o.getUint16(4,!0)),l[3]+=Math.floor(.2*o.getUint16(6,!0))}new n.default((function(o){var t=void 0;o.preload=function(){t=o.loadFont("static/fonts/inconsolata.otf")},o.setup=function(){l[0]=16384,l[1]=16384,l[2]=16384,l[3]=16384,o.createCanvas(o.windowWidth,o.windowHeight),o.background(0),s=new i.default,o.textFont(t),o.textSize(o.width/60),o.textAlign(o.CENTER,o.CENTER),window.chrome&&(window.chrome.webstore||window.chrome.runtime)||window.alert("BLE may not work in your browser. Use Chrome or check for a list of compatible browsers here: https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API")},o.draw=function(){if(d){o.background(0);var t=o.windowWidth/l.length;o.translate(t/2,o.windowHeight/2);for(var e=0;e<l.length;e++){o.push(),o.translate(t*e,0),o.fill(255);var n=o.map(l[e],0,16384,10,.8*t);o.ellipse(0,0,n,n),o.text(l[e],0,t/3*1.2),o.pop()}}else o.background(255,0,0),o.translate(o.windowWidth/2,o.windowHeight/2),o.text("No BLE Connection, click anywhere to pair BLE device",0,0)},o.touchStarted=function(){s.connect("ff9c1e42-7b32-11ea-bc55-0242ac130003",h)},o.windowResized=function(){o.resizeCanvas(o.windowWidth,o.windowHeight)}}),a)}},[["ERIh",1,2]]]);
//# sourceMappingURL=0.116d7cddd37d1715078e.js.map