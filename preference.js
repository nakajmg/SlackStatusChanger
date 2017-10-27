const {ipcRenderer} = require('electron')
const {Emoji} = require('emoji-mart-vue')
const Vue = require('vue/dist/vue.common')
const storage = require('electron-json-storage')
const assign = require('object-assign')
const types = require('./store/types')
const components = require('./preference/index')

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
          <APIToken v-show="isSelectedMenu('token')" :emojiSet="emojiSet" :apiToken="apiToken"/>
          <Autorun v-show="isSelectedMenu('autorun')" :emojiSet="emojiSet" v-model="autorun"/>        
          <EmojiStyle v-show="isSelectedMenu('emoji')" v-model="emojiSet"/>
          <Preset v-show="isSelectedMenu('preset')" :preset="preset" :emojiSet="emojiSet"/>
        </main>
      </div>
      `,
    data() {
      return assign({}, data, {
        selectedMenu: 'token'
      })
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
