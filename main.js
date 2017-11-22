//const electron = require('electron')
const {BrowserWindow, ipcMain, Menu, app} = require('electron')
const axios = require('axios')
const types = require('./store/types')
const APIError = require('./APIError')
const {keys, each, debounce} = require('lodash')
const Promise = require('bluebird')

function apiErrorReport({name, message}) {
  console.error(name, message)
}

const menubar = require('menubar')({
  preloadWindow: true,
  transparent: true,
  frame: false,
  width: 280,
  icon: `${__dirname}/icon.png`,
})

menubar.app.once('ready', () => {
  const menuTemplate = require('./menuTemplate')
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
})

let preference = null
let signinWindow = null

menubar.on('ready', () => {
  let menuWindow = menubar.window.webContents

  menubar.window.on('close', () => {
    app.quit()
  })

  /**
   * for debug
   */
  //menubar.showWindow()
  //menuWindow.openDevTools()

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
        menuWindow.send(types.SET_CURRENT_STATUS, body.profile)
      })
  }

  function getInfo({apiToken}) {
    return Promise.all([
      axios({
        url : 'https://slack.com/api/team.info',
        method: 'POST',
        params: {
          token: apiToken
        }
      })
        .then(res => res.data)
        .then(res => {
          const name = res.team.name
          const icon = res.team.icon.image_original
          return {name, icon}
        }),

      axios({
        url: 'https://slack.com/api/users.profile.get',
        method: 'POST',
        params: {
          token: apiToken
        }
      })
        .then(res => res.data)
        .then(res => {
          const name = res.profile.display_name
          const icon = res.profile.image_original
          return {name, icon}
        })
    ])

  }

  /**
   * @param {string} apiToken
   * tokenをセットしてsyncStatusを呼ぶ役
   */
  function verifyToken({apiToken}) {
    // tokenのverifyを行う
    // verifyが成功したらINITIALIZE_SUCCEESSかなにか飛ばしてINITIALIZEを完了する
    // verify失敗したらpreferenceのtoken開いてエラー通知 エラーの詳細はURLパラメータで送る
    return syncStatus({apiToken})
      .then(() => {
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

  /**
   * @param {string} apiToken
   * tokenの検証が成功したら各windowに通知
   */
  function verifySuccess({apiToken}) {
    menuWindow.send(types.TOKEN_VERIFIED, {apiToken})
    if (preference) {
      preference.webContents.send(types.TOKEN_VERIFIED, {apiToken})
    }
  }


  /**
   * @param {string} apiToken
   * @param {string} status_emoji
   * @param {string} status_text
   * 絵文字とテキストをAPIに投げる
   */
  function setCurrentStatus({apiToken, status_emoji, status_text}) {
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
        menuWindow.send(types.SET_CURRENT_STATUS, body.profile)
      })
      .catch(apiErrorReport)
  }

  /**
   * @param {string} preferenceName - メニューの名前
   * @param {error} error - カンマ区切りでnameとmessage
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

    const listeners = {
      [types.UPDATE_TOKEN](e, {apiToken}) {
        verifyToken({apiToken})
        if (signinWindow) {
          signinWindow.close()
          signinWindow = null
        }
      },
      [types.READY_TO_SHOW]() {
        preference.show()
      }
    }
    each(listeners, (cb, channel) => ipcMain.on(channel, cb))

    const errorParam = error ? `&error=${error}` : ''
    preference.loadURL(`file://${__dirname}/preference.html?name=${preferenceName}${errorParam}`)

    preference.on('close', () => {
      menuWindow.send(types.CLOSE_PREFERENCE)
      preference = null
      ipcMain.removeAllListeners(keys(listeners))
    })
  }

  const dsyncStatus = debounce(syncStatus, 100)
  const dverifyToken = debounce(verifyToken, 100)

  const listeners = {
    [types.SYNC_STATUS](e, {apiToken}) { dsyncStatus({apiToken}) },
    [types.INITIALIZE_STATUS](e, {apiToken}) { dverifyToken({apiToken}) },
    [types.SET_CURRENT_STATUS](e, {apiToken, status_emoji, status_text}) {
      setCurrentStatus({apiToken, status_emoji, status_text})
    },
    [types.OPEN_PREFERENCE](e, params = {}) { openPreference(params) },
    [types.UPDATE_PREFERENCE](e, payload) { menuWindow.send(types.UPDATE_PREFERENCE, payload) },
    [types.RESTART_APP]() {
      if (preference) preference.close()
      menuWindow.reload()
    },
    [types.EXIT_APP]() {
      if (preference) preference.close()
      menubar.window.close()
    },
    [types.OPEN_SIGNIN]() {
      signinWindow = new BrowserWindow({
        width: 600,
        height: 660,
        show: true,
      })
      signinWindow.loadURL(`file://${__dirname}/signin.html`)
    },
    [types.GOT_TOKEN](e, {apiToken}) {
      if (signinWindow) {
        signinWindow.close()
      }
      getInfo({apiToken})
        .then(([team, user]) => {
          preference.webContents.send(types.SET_INFO, {team, user})
          menuWindow.send(types.UPDATE_PREFERENCE, {team, user})
          verifySuccess({apiToken})
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
  each(listeners, (cb, channel) => ipcMain.on(channel, cb))

})
