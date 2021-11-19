//const ipcRenderer = require('electron').ipcRenderer;
const autoDetector = require('./module/auto-detector');

console.log("Script injected");
//document.remoteIpcRenderer = ipcRenderer;
document.addEventListener("DOMContentLoaded", autoDetector);
autoDetector(); 