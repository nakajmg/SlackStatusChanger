// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const Vue = require('vue/dist/vue.common')
const store = require('./store')
const assign = require('object-assign')
const {mapState, mapActions, mapMutations} = require('vuex')
const {Picker} = require('emoji-mart-vue')
const {Emoji} = require('emoji-mart-vue')
const wifiName = require('wifi-name')
const types = require('./store/types')
const components = require('./components')

new Vue({
  el: '#app',
  template: `
  <div class="App">
    <template v-if="initialized">
      <div class="App-Status">
        <CurrentStatus/>
      </div>
      <StatusList/>
    </template>
  </div>
  `,
  store,
  computed: assign({
    // local computed
  }, mapState({
    preset: 'preset',
    message: 'msg',
    initialized: 'initialized',
    profile: 'profile',
    emojiSet: 'emojiSet',
  })),
  data() {
    return {
      showPicker: false
    }
  },
  created() {
    this.initializeStore()
    setInterval(() => {
      wifiName().then((ssid) => {
        return console.log(ssid)
        this.setSSID({ssid})
      }, (err) => {
        console.log(err)
      })
    }, 60000)
  },
  methods: assign(mapActions({
      setStatus: types.SET_CURRENT_STATUS,
      setSSID: types.SET_CURRENT_SSID,
      initializeStore: types.INITIALIZE_STATUS,
    }),{
    onClickEmoji(emoji, e) {
      this.setStatus({
        status_emoji: emoji.colons,
      })
      this.showPicker = false
    },
    onChangeText({target}) {
      const status_text = target.value
      this.setStatus({
        status_text,
      })
    },
    changeEmoji() {
      this.showPicker = true
    }
  }),
  components: assign({
    Picker,
    Emoji
  }, components)
})
