const {ipcRenderer} = require('electron')
const {Emoji} = require('emoji-mart-vue')
const Vue = require('vue/dist/vue.common')
const storage = require('electron-json-storage')
const assign = require('object-assign')
const types = require('./store/types')
const components = require('./preference/index')
const queryString = require('query-string')
const axios = require('axios')

Vue.component('Emoji', Emoji)
Vue.mixin({
  methods: {
    emojiSheet(set, size) {
      return `${__dirname}/img/${set}64.png`
    }
  }
})

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
          <Account v-show="isSelectedMenu('account')"
            :apiToken="apiToken"
            :tokenVerified="tokenVerified"
            :team="team"
            :user="user"
            :emojiSet="emojiSet"
            :signOut="signOut"
          />
          <Auto v-show="isSelectedMenu('auto')" :emojiSet="emojiSet" v-model="auto"/>        
          <EmojiStyle v-show="isSelectedMenu('emoji')" v-model="emojiSet"/>
          <Preset v-show="isSelectedMenu('preset')" v-model="preset" :emojiSet="emojiSet" :customEmojis="team.customEmojis"/>
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

      ipcRenderer.on(types.SET_INFO, (e, {team, user}) => {
        this.team = team
        this.user = user
      })
    },

    methods: {
      update(payload) {
        ipcRenderer.send(types.UPDATE_PREFERENCE, payload)
      },
      isSelectedMenu(type) {
        return this.selectedMenu === type
      },

      signOut() {
        axios({
          url: 'https://slack.com/api/auth.revoke',
          params: {
            token: this.apiToken
          }
        })
          .then(res => res.data)
          .then(res => {
            if (res.ok && res.revoked) {
              this.apiToken = null
              this.update({apiToken: null})
            }
          })
      }
    },

    components: assign({}, components)
  })
}
