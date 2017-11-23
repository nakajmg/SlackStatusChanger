const types = require('./types')
const {each} = require('lodash')
const assign = require('object-assign')

module.exports = {
  [types.RESTORE_FROM_STORAGE](state, {data}) {
    console.log(data)
    assign(state, data)
  },

  [types.SET_CURRENT_STATUS](state, {status_emoji, status_text, custom}) {
    state.profile.status_emoji = status_emoji
    state.profile.status_text = status_text
    state.profile.custom = custom
  },

  [types.SET_CURRENT_SSID](state, {ssid}) {
    state.prevSSID = ssid
  },

  [types.TOKEN_VERIFIED](state, {apiToken}) {
    state.apiToken = apiToken
    state.tokenVerified = true
  },

  [types.AFTER_INITIALIZE](state) {
    state.initialized = true
  },

  [types.UPDATE_PREFERENCE](state, payload) {
    each(payload, (value, key) => {
      state[key] = value
    })
  },

  [types.SET_CUSTOM_EMOJI](state, {customEmojis}) {
    state.team.customEmojis = customEmojis
  },

  [types.SET_PROFILE_CUSTOM](state, {custom}) {
    state.profile.custom = !!custom
  }
}
