const types = require('./types')
const {ipcRenderer} = require('electron')
const {isUndefined, find, includes, keys} = require('lodash')
const storage = require('electron-json-storage')
const assign = require('object-assign')
const Promise = require('bluebird')
const getStorage = Promise.promisify(storage.get)
const setStorage = Promise.promisify(storage.set)

module.exports = {
  [types.INITIALIZE_STORE]({commit, dispatch}) {
    ipcRenderer.on(types.UPDATE_PREFERENCE, (e, payload) => {
      commit(types.UPDATE_PREFERENCE, payload)
      dispatch(types.SAVE_TO_STORAGE)
    })

    /**
     * @param {object} profile
     * @param {string} profile.status_emoji
     * @param {string} profile.status_text
     */
    ipcRenderer.on(types.SET_CURRENT_STATUS, (e, profile) => {
      commit(types.SET_CURRENT_STATUS, profile)
    })

    ipcRenderer.on(types.CLOSE_PREFERENCE, (e) => {
      // console.log('preference closed')
    })

    return dispatch(types.RESTORE_FROM_STORAGE)
  },


  [types.SAVE_TO_STORAGE]({state}) {
    const clonedData = assign({}, state)
    delete clonedData.initialized
    delete clonedData.prevSSID

    return setStorage(types.STORAGE_DATA, clonedData)
      .then(console.log)
      .catch(console.error)
  },
  async [types.RESTORE_FROM_STORAGE]({commit, dispatch}) {
    const data = await getStorage(types.STORAGE_DATA).catch(console.error)
    // dataのkeyがあればデータあり
    if (keys(data).length) {
      return commit(types.RESTORE_FROM_STORAGE, {data})
    }
    else {
      // 保存されたデータがないときはstateを初期値として保存しておく
      return dispatch(types.SAVE_TO_STORAGE)
    }
  },
  [types.CLEAR_STORAGE]() {
    setStorage(types.STORAGE_DATA, {})
  },


  [types.SYNC_STATUS]({state}) {
    ipcRenderer.send(types.SYNC_STATUS, {apiToken: state.apiToken})
  },
  [types.SET_CURRENT_STATUS]({state}, {status_emoji, status_text}) {
    ipcRenderer.send(types.SET_CURRENT_STATUS, {
      status_emoji: isUndefined(status_emoji) ? state.profile.status_emoji : status_emoji,
      status_text: isUndefined(status_text) ? state.profile.status_text : status_text,
      apiToken: state.apiToken,
    })
  },
  [types.OPEN_PREFERENCE]({state}, preferenceName) {
    preferenceName = preferenceName || 'preset'
    ipcRenderer.send(types.OPEN_PREFERENCE, {preferenceName})
  },


  [types.CLEAR_STATUS]({dispatch}) {
    dispatch(types.SET_CURRENT_STATUS, {
      status_emoji: '',
      status_text: '',
    })
  },

  [types.INITIALIZE_STATUS]({commit, dispatch, state}) {
    if (state.apiToken) {
      ipcRenderer.send(types.INITIALIZE_STATUS, {apiToken: state.apiToken})
    }

    ipcRenderer.on(types.TOKEN_VERIFIED, (e, {apiToken}) => {
      commit(types.TOKEN_VERIFIED, {apiToken})
      dispatch(types.AFTER_INITIALIZE)
    })
  },

  [types.AFTER_INITIALIZE]({commit, dispatch}) {
    dispatch(types.SAVE_TO_STORAGE)
      .then(() => {
        commit(types.AFTER_INITIALIZE)
      })
  },

  [types.SET_CURRENT_SSID]({state, commit, dispatch}, {ssid}) {
    // ないときはprevのssid変えていいかも。日付またいでオフィスtoオフィスな場合にSSIDが一緒で自動でステータス変更が有効にならない
    if (!ssid) return console.log('SSIDない')
    if (ssid === state.prevSSID) return console.log('SSID変わってない')

    const status = find(state.autorun.settings, (setting) => {
      return includes(setting.ssid.split(','), ssid)
    })

    if (!status || !status.enable) return console.log('設定がないかdisableになってる')

    const {status_emoji, status_text} = status
    if ( state.profile.status_text === status_text
      && state.profile.status_emoji === status_emoji) return console.log('変化なし')

    dispatch(types.SET_CURRENT_STATUS, {status_emoji, status_text})
    commit(types.SET_CURRENT_SSID, {ssid})
  },

}
