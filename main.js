//const electron = require('electron')
const {BrowserWindow} = require('electron')
const {ipcMain} = require('electron')
const axios = require('axios')
const types = require('./store/types')
const APIError = require('./APIError')

function apiErrorReport({name, message}) {
  console.error(name, message)
}

const menubar = require('menubar')({
  preloadWindow: true,
  transparent: true,
  frame: false,
  width: 280,
})

let preference = null

menubar.on('ready', () => {
  const menuWindow = menubar.window.webContents

  /**
   * for debug
   */
  //menubar.showWindow()
  //menuWindow.openDevTools()


  function setCurrentStatus (profile){
    menuWindow.send(types.SET_CURRENT_STATUS, profile)
  }

  /**
   * @param {string} apiToken
   */
  function syncStatus ({apiToken}){
    const url = 'https://slack.com/api/users.profile.get'
    return axios({
      url,
      method: 'POST',
      params: {
        token: apiToken,
      }
    })
      .then(res => res.data)
      .then(body => {
        if (body.error) throw new APIError(body)
        console.log('sync success')
        setCurrentStatus(body.profile)
      })
  }

  ipcMain.on(types.SYNC_STATUS, (e, {apiToken}) => syncStatus({apiToken}))

  // tokenをセットしてsyncStatusを呼ぶ役
  function verifyToken({apiToken}) {
    // tokenのverifyを行う
    // verifyが成功したらINITIALIZE_SUCCEESSかなにか飛ばしてINITIALIZEを完了する
    // verify失敗したらpreferenceのtoken開いてエラー通知 エラーの詳細はURLパラメータで送る
    return syncStatus({apiToken})
      .then(() => {
        console.log('Complete: Initialize')
        verifySuccess({apiToken})
      })
      .catch(error => {
        openPreference({
          preferenceName: 'token',
          error: `${error.name},${error.message}`,
        })
        console.log(error.name, error.message)
      })
  }

  function verifySuccess({apiToken}) {
    menuWindow.send(types.TOKEN_VERIFIED, {apiToken})
    if (preference) {
      preference.webContents.send(types.TOKEN_VERIFIED, {apiToken})
    }
  }

  ipcMain.on(types.INITIALIZE_STATUS, (e, {apiToken}) => {
    verifyToken({apiToken})
  })


  ipcMain.on(types.SET_CURRENT_STATUS, (e, {apiToken, status_emoji, status_text}) => {
    const url = 'https://slack.com/api/users.profile.set'
    const options = {
      url,
      method: 'POST',
      params: {
        token: apiToken,
        profile: {
          status_emoji,
          status_text,
        }
      }
    }

    return axios(options)
      .then(res => res.data)
      .then(body => {
        console.log(body.ok, body.profile.status_emoji, body.profile.status_text)
        setCurrentStatus(body.profile)
      })
      .catch(apiErrorReport)
  })


  /**
   * 設定画面開く
   */
  function openPreference({preferenceName, error}) {
    // 設定画面が開かれてたら既存の設定画面にフォーカス
    if (preference) {
      // 指定された設定項目を開く
      preference.webContents.send(types.CHANGE_PREFERENCE_MENU, {preferenceName, error})
      return preference.show()
    }

    preference = new BrowserWindow({
      width: 480,
      height: 400,
      titleBarStyle: 'hidden',
      fullscreenable: false,
      maximizable: false,
      show: false,
    })

    const errorParam = error ? `&error=${error}` : ''
    preference.loadURL(`file://${__dirname}/preference.html?name=${preferenceName}${errorParam}`)
    preference.on('ready-to-show', () => {
      preference.show()
    })

    preference.on('close', () => {
      menuWindow.send(types.CLOSE_PREFERENCE)
      preference = null
    })

    ipcMain.on(types.UPDATE_TOKEN, (e, {apiToken}) => {
      verifyToken({apiToken})
    })
  }


  ipcMain.on(types.OPEN_PREFERENCE, (e, params = {}) => {
    openPreference(params)
  })

  // preferenceでデータを更新したらmenuWindowで更新処理
  ipcMain.on(types.UPDATE_PREFERENCE, (e, payload) => {
    menuWindow.send(types.UPDATE_PREFERENCE, payload)
  })

//  preference.show()
})
