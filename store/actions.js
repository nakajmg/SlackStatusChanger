const types = require('./types')
const {ipcRenderer} = require('electron')
const {isUndefined, find, includes, keys} = require('lodash')
const storage = require('electron-json-storage')
const assign = require('object-assign')
const Promise = require('bluebird')
const getStorage = Promise.promisify(storage.get)
const setStorage = Promise.promisify(storage.set)
const axios = require('axios')
const wifiName = require('wifi-name')

module.exports = {
  [types.INITIALIZE_STORE]({commit, dispatch, state}) {
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
      // custom emojiかどうか判定
      if (state.team.customEmojis.length !== 0) {
        const name = profile.status_emoji.substring(1, profile.status_emoji.length - 1)
        const emoji = find(state.team.customEmojis, {name})
        // emojiが見つかればcustom=true
        profile.custom = !!emoji
      }
      commit(types.SET_CURRENT_STATUS, profile)
      dispatch(types.SAVE_TO_STORAGE)
    })

    ipcRenderer.on(types.CLOSE_PREFERENCE, (e) => {
      // console.log('preference closed')
    })

    ipcRenderer.on(types.SUSPENDED, (e) => {
      dispatch(types.SUSPENDED)
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
  [types.SET_CURRENT_STATUS]({state, commit}, {status_emoji, status_text, custom}) {
    ipcRenderer.send(types.SET_CURRENT_STATUS, {
      status_emoji: isUndefined(status_emoji) ? state.profile.status_emoji : status_emoji,
      status_text: isUndefined(status_text) ? state.profile.status_text : status_text,
      apiToken: state.apiToken,
    })
    commit(types.SET_PROFILE_CUSTOM, {custom})
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

    ipcRenderer.on(types.TOKEN_VERIFIED, async (e, {apiToken}) => {
      commit(types.TOKEN_VERIFIED, {apiToken})
      await dispatch(types.SET_CUSTOM_EMOJI)
      await dispatch(types.SYNC_STATUS)
      await dispatch(types.AFTER_INITIALIZE)
    })
  },

  [types.AFTER_INITIALIZE]({commit, dispatch}) {
    dispatch(types.SAVE_TO_STORAGE)
      .then(() => {
        commit(types.AFTER_INITIALIZE)
      })
  },

  [types.SET_CUSTOM_EMOJI]({state, commit}) {
    const url = 'https://slack.com/api/emoji.list'
    return axios({
      url,
      method: 'POST',
      params: {
        token: state.apiToken,
      }
    })
      .then(res => res.data)
      .then(body => {
        if (!body.ok) return
        const customEmojis = Object.keys(body.emoji).map((name) => {
          const imageUrl = body.emoji[name]
          return {
            name,
            short_names: [name],
            text: '',
            emoticons: [],
            keywords: ['reacji'],
            imageUrl,
            custom: true
          }
        })
        commit(types.SET_CUSTOM_EMOJI, {customEmojis})
      })
  },

  [types.SET_CURRENT_SSID]({state, commit, dispatch}, {ssid}) {
    // ないときはprevのssid変えていいかも。日付またいでオフィスtoオフィスな場合にSSIDが一緒で自動でステータス変更が有効にならない
    // SSIDないからなにもしない
    if (!ssid) return
    // SSID変わってないから何もしない
    if (ssid === state.prevSSID) return

    const status = find(state.auto.settings, (setting) => {
      return includes(setting.ssid.split(','), ssid)
    })

    // 設定がないかdisableになってる'
    if (!status || !status.enable) return

    const {status_emoji, status_text} = status
    // status変化なし
    if ( state.profile.status_text === status_text
      && state.profile.status_emoji === status_emoji) return

    dispatch(types.SET_CURRENT_STATUS, {status_emoji, status_text})
    commit(types.SET_CURRENT_SSID, {ssid})
  },

  [types.SUSPENDED]: async ({state, dispatch}) => {
    if (!state.suspend.enable) return
    const ssid = await wifiName().catch(err => console.log(err))
    if (!ssid) return
    const status = find(state.suspend.settings, (setting) => {
      return includes(setting.ssid.split(','), ssid)
    })

    if (!status || !status.enable) return

    const prevProfile = assign({}, state.profile)
    ipcRenderer.once(types.RESUMED, (e) => {
      dispatch(types.RESUMED, {prevSSID: ssid, prevProfile})
    })

    dispatch(types.SET_CURRENT_STATUS, status)
  },

  [types.RESUMED]: async({dispatch}, {prevSSID, prevProfile}) => {
    const ssid = await wifiName().catch(err => console.log(err))
    if (!ssid) return
    if (ssid !== prevSSID) return
    dispatch(types.SET_CURRENT_STATUS, prevProfile)
  },

  [types.EXIT_APP]() {
    ipcRenderer.send(types.EXIT_APP)
  },
  [types.RESTART_APP]() {
    ipcRenderer.send(types.RESTART_APP)
  },
}
