const {ipcRenderer} = require('electron')
const {Emoji} = require('emoji-mart-vue')
const Vue = require('vue/dist/vue.common')
const storage = require('electron-json-storage')
const assign = require('object-assign')
const types = require('./store/types')
const components = require('./preference/index')
const queryString = require('query-string')

Vue.component('Emoji', Emoji)

// API token取得方法をREADMEに書いてリンク貼る
storage.get(types.STORAGE_DATA, (err, data) => {
  if (err) return console.log(err)
  initialize(data)
})

function initialize(data) {
  new Vue({
    el: '#preference',
    template: `
      <div class="Preference">
        <header class="Header">
          <div class="Header__Title">
            Preference
          </div>
          <MenuList :emojiSet="emojiSet" v-model="selectedMenu"/> 
        </header>
        <main class="Main">
          <ErrorReport v-if="error" :error="error" :emojiSet="emojiSet"/>
          <APIToken v-show="isSelectedMenu('token')"
            :emojiSet="emojiSet"
            v-model="apiToken"
            :tokenVerified="tokenVerified"
          />
          <Auto v-show="isSelectedMenu('auto')" :emojiSet="emojiSet" v-model="auto"/>        
          <EmojiStyle v-show="isSelectedMenu('emoji')" v-model="emojiSet"/>
          <Preset v-show="isSelectedMenu('preset')" v-model="preset" :emojiSet="emojiSet"/>
          <ResetStorage v-show="isSelectedMenu('reset')" :emojiSet="emojiSet" />
        </main>
      </div>
      `,

    data() {
      const parsed = queryString.parse(location.search)

      return assign({}, data, {
        selectedMenu: parsed.name,
        error: null,
      })
    },

    created() {
      // 設定画面が開かれてるときにメニューバーから指定された設定項目を開く
      ipcRenderer.on(types.CHANGE_PREFERENCE_MENU, (e, {preferenceName, error}) => {
        this.selectedMenu = preferenceName
        this.error = error
        console.log(this.error)
      })

      ipcRenderer.on(types.TOKEN_VERIFIED, (e, {apiToken}) => {
        this.tokenVerified = true
        this.apiToken = apiToken
        this.error = null
      })

      this.$nextTick(() => {
        ipcRenderer.send('readyToShow')
      })
    },

    watch: {
      apiToken(apiToken) {
        this.tokenVerified = false
        if (!apiToken) return
        ipcRenderer.send(types.UPDATE_TOKEN, {apiToken})
      }
    },

    methods: {
      update(payload) {
        ipcRenderer.send(types.UPDATE_PREFERENCE, payload)
      },
      isSelectedMenu(type) {
        return this.selectedMenu === type
      }
    },

    components: assign({}, components)
  })
}
