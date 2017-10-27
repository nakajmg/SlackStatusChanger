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
        
        <Preset :preset="preset"/>
        <section class="Contents">
          <div class="field">
            <label class="label Contents__Label">
              <Emoji emoji=":scroll:" :set="emojiSet" :size="20"/>
              <span>Preset</span>
            </label>
            <div class="PresetItem" v-for="item in preset">
              <div class="control has-icons-left has-icons-right">
                <input class="input is-medium PresetItem__Text" :value="item.status_text">
                <span class="icon is-left PresetItem__Emoji">
                  <Emoji :emoji="item.status_emoji" :set="emojiSet"/>
                </span>
                <span class="icon is-right PresetItem__Remove">
                  <Emoji emoji=":x:" :set="emojiSet" :size="16"/>
                </span>
              </div>
            </div>
            <div class="control is-clearfix" style="text-align: center;">
              <span class="icon is-large">
                <Emoji class="PresetItem__Add" emoji=":heavy_plus_sign:" :set="emojiSet"/>
              </span>
            </div>
          </div>
        </section>
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
    saveToken() {
      // Tokenの検証してから保存する
      // 検証が成功したら通知出す
      const apiToken = this.$refs.tokenInput.value
      this.update({apiToken})
    },

    update(payload) {
      ipcRenderer.send(types.UPDATE_PREFERENCE, payload)
    },

    isSelectedMenu(type) {
      return this.selectedMenu === type
    },
    selectMenu(type) {
      this.selectedMenu = type
    }
  },

  components: assign({
    Emoji
  }, components)
})
