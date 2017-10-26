const types = require('./types')

module.exports = {
  [types.SET_CURRENT_STATUS](state, {status_emoji, status_text}) {
    state.profile.status_emoji = status_emoji
    state.profile.status_text = status_text
  },
  [types.SET_CURRENT_SSID](state, {ssid}) {
    state.prevSSID = ssid
  },
  [types.INITIALIZED](state) {
    state.initialized = true
  }
}
