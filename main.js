//const electron = require('electron')
const {BrowserWindow} = require('electron')
const {ipcMain} = require('electron')
const types = require('./store/types')

const menubar = require('menubar')({
  preloadWindow: true,
  transparent: true,
  frame: false,
  width: 280,
})
const token = require('./token')
const request = require('axios')

menubar.on('ready', () => {
  console.log('ready')
  const menuWindow = menubar.window.webContents
  ipcMain.on(types.INITIALIZE_STATUS, (e) => {
    request({
      url: 'https://slack.com/api/users.profile.get',
      methods: 'POST',
      params: {
        token
      }
    })
      .then(res => res.data)
      .then(body => {
        menuWindow.send(types.SET_CURRENT_STATUS, body.profile)
        console.log('initialize success')
      })
      .catch(err => {
        console.log(err.message)
      })
  })

  ipcMain.on(types.SET_CURRENT_STATUS, (e, {status_emoji, status_text}) => {
    const options = {
      url: 'https://slack.com/api/users.profile.set',
      method: 'POST',
      params: {
        token,
        profile: {
          status_emoji,
          status_text,
        }
      }
    }

    request(options)
      .then(res => res.data)
      .then(body => {
        console.log(body.ok, body.profile.status_emoji, body.profile.status_text)
        menuWindow.send(types.SET_CURRENT_STATUS, body.profile)
      })
      .catch(err => {
        console.log(err)
      })
  })


  /**
   * 設定画面開く
   */
  ipcMain.on(types.OPEN_PREFERENCE, (e) => {
    const preference = new BrowserWindow({
      width: 480,
      height: 400,
      titleBarStyle: 'hidden',
      fullscreenable: false,
      maximizable: false,
      show: false,
    });
    preference.loadURL(`file://${__dirname}/preference.html`)
    preference.on('ready-to-show', () => {
      preference.show()
    })

    preference.on('close', () => {
      menuWindow.send(types.CLOSE_PREFERENCE)
    })
  })

  // preferenceでデータを更新したらmenuWindowで更新処理
  ipcMain.on(types.UPDATE_PREFERENCE, (e, payload) => {
    menuWindow.send(types.UPDATE_PREFERENCE, payload)
  })


//  preference.show()
})


//const app = electron.app
//const path = require('path')
//const url = require('url')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
//let mainWindow
//
//function createWindow () {
//  // Create the browser window.
//  mainWindow = new BrowserWindow({width: 800, height: 600})
//
//  // and load the index.html of the app.
//  mainWindow.loadURL(url.format({
//    pathname: path.join(__dirname, 'index.html'),
//    protocol: 'file:',
//    slashes: true
//  }))
//
//  // Open the DevTools.
//  // mainWindow.webContents.openDevTools()
//
//  // Emitted when the window is closed.
//  mainWindow.on('closed', function () {
//    // Dereference the window object, usually you would store windows
//    // in an array if your app supports multi windows, this is the time
//    // when you should delete the corresponding element.
//    mainWindow = null
//  })
//}
//
//// This method will be called when Electron has finished
//// initialization and is ready to create browser windows.
//// Some APIs can only be used after this event occurs.
//app.on('ready', createWindow)
//
//// Quit when all windows are closed.
//app.on('window-all-closed', function () {
//  // On OS X it is common for applications and their menu bar
//  // to stay active until the user quits explicitly with Cmd + Q
//  if (process.platform !== 'darwin') {
//    app.quit()
//  }
//})
//
//app.on('activate', function () {
//  // On OS X it's common to re-create a window in the app when the
//  // dock icon is clicked and there are no other windows open.
//  if (mainWindow === null) {
//    createWindow()
//  }
//})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
