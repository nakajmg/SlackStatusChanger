const {ipcRenderer} = require('electron')
const types = require('./store/types')
const {Emoji} = require('emoji-mart-vue')
const Vue = require('vue/dist/vue.common')
Vue.component('Emoji', Emoji)
const storage = require('electron-json-storage')
const assign = require('object-assign')
const components = require('./preference/index')
//    storage.get(types.STORAGE_DATA, (err, data) => {
//      if (err) return console.log(err)
//      console.log(data)
//    })
// API token取得方法をREADMEに書いてリンク貼る
new Vue({
  el: '#preference',
  template: `
      <div v-if="initialized">
        <header class="Header">
          <div class="Header__Title">
            Preference
          </div>
          
          <MenuList :emojiSet="emojiSet" :selectedMenu="selectedMenu" />
          
        </header>
        
        <APIToken :emojiSet="emojiSet" :apiToken="apiToken"/>        
        
        <EmojiStyle v-model="emojiSet"/>
        
        <Preset :preset="preset" :emojiSet="emojiSet"/>
        
      </div>
      
      <div v-else>Initializing...</div>
      `,
  data() {
    return {
      initialized: false,
      selectedMenu: 'token',
      apiToken: null,
      emojiSet: null,
      preset: [],
    }
  },
  created() {
    storage.get(types.STORAGE_DATA, (err, data) => {
      if (err) return console.log(err)
      this.apiToken = data.apiToken
      this.emojiSet = data.emojiSet
      this.preset = data.preset
      this.initialized = true
    })
  },
  watch: {
    emojiSet(newVal, oldVal) {
      if (!oldVal) return
      this.update({emojiSet: newVal})
    }
  },

  methods: {
    update(payload) {
      ipcRenderer.send(types.UPDATE_PREFERENCE, payload)
    },

  },

  components: assign({
  }, components)
})
