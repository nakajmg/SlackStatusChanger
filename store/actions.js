const types = require('./types')
const {ipcRenderer} = require('electron')
const {find, isUndefined} = require('lodash')

module.exports = {
  [types.INITIALIZE_STATUS]({commit}) {
    // localstorageからの復元とか
    ipcRenderer.send(types.INITIALIZE_STATUS)
    commit(types.INITIALIZED)
    ipcRenderer.on(types.SET_CURRENT_STATUS, (e, profile) => {
      commit(types.SET_CURRENT_STATUS, profile)
    })
  },
  [types.SET_CURRENT_SSID]({state, dispatch}, {ssid}) {
    if (state.wifi[ssid]) {
      const _name = state.wifi[ssid].status
      const status = find(state.preset, ({name}) => {
        return name === _name
      })
      if (status) {
        dispatch(types.SET_CURRENT_STATUS, status)
      }
    }
  },
  [types.SET_CURRENT_STATUS]({state}, {status_emoji, status_text}) {
    ipcRenderer.send(types.SET_CURRENT_STATUS, {
      status_emoji: isUndefined(status_emoji) ? state.profile.status_emoji : status_emoji,
      status_text: isUndefined(status_text) ? state.profile.status_text : status_text,
    })
  }
}
