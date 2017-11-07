const {ipcRenderer} = require('electron')
ipcRenderer.on('getWebviewContent', () => {
  ipcRenderer.sendToHost('getWebviewContent', document.body.textContent)
})
