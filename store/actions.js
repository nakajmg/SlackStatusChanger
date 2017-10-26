const types = require('./types')
const {ipcRenderer} = require('electron')
const {isUndefined, find, includes} = require('lodash')
const storage = require('electron-json-storage')
const assign = require('object-assign')
const Promise = require('bluebird')
const getStorage = Promise.promisify(storage.get)
const setStorage = Promise.promisify(storage.set)

module.exports = {
  [types.RESET_DATA]() {
    setStorage(types.STORAGE_DATA, {})
  },

  [types.INITIALIZE_STORE]({commit, dispatch}) {
    ipcRenderer.on(types.UPDATE_PREFERENCE, (e, payload) => {
      commit(types.UPDATE_PREFERENCE, payload)
      dispatch(types.SAVE_TO_STORAGE)
    })

    ipcRenderer.on(types.SET_CURRENT_STATUS, (e, profile) => {
      commit(types.SET_CURRENT_STATUS, profile)
    })

    ipcRenderer.on(types.CLOSE_PREFERENCE, (e) => {
      console.log('preference closed')
    })
    return dispatch(types.RESTORE_FROM_STORAGE)
  },
  async [types.RESTORE_FROM_STORAGE]({commit}) {
    const data = await getStorage(types.STORAGE_DATA).catch(console.error)
    commit(types.RESTORE_FROM_STORAGE, {data})
  },

  [types.SAVE_TO_STORAGE]({state}) {
    const clonedData = assign({}, state)
    delete clonedData.initialized
    delete clonedData.prevSSID

    return setStorage(types.STORAGE_DATA, clonedData)
      .then(console.log)
      .catch(console.error)
  },

  [types.CHECK_TOKEN]({state}) {
    return new Promise((s, f) => {})
  },

  [types.SYNC_STATUS]() {
    ipcRenderer.send(types.INITIALIZE_STATUS)
  },

  [types.CLEAR_STATUS]() {
    ipcRenderer.send(types.SET_CURRENT_STATUS, {status_emoji: '', status_text: ''})
  },

  [types.INITIALIZE_STATUS]({dispatch}) {
    dispatch(types.SYNC_STATUS)
    dispatch(types.AFTER_INITIALIZE)
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

  [types.SET_CURRENT_STATUS]({state}, {status_emoji, status_text}) {
    ipcRenderer.send(types.SET_CURRENT_STATUS, {
      status_emoji: isUndefined(status_emoji) ? state.profile.status_emoji : status_emoji,
      status_text: isUndefined(status_text) ? state.profile.status_text : status_text,
    })
  },

  [types.OPEN_PREFERENCE]({state}) {
    ipcRenderer.send(types.OPEN_PREFERENCE, {state})
  }
}
