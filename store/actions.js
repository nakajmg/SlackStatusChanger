const types = require('./types')
const {ipcRenderer} = require('electron')
const {isUndefined, find, includes} = require('lodash')

module.exports = {
  [types.INITIALIZE_STATUS]({commit}) {
    // localstorageからの復元とか
    ipcRenderer.send(types.INITIALIZE_STATUS)
    commit(types.INITIALIZED)
    ipcRenderer.on(types.SET_CURRENT_STATUS, (e, profile) => {
      commit(types.SET_CURRENT_STATUS, profile)
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
  }
}
