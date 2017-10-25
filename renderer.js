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

new Vue({
  el: '#app',
  template: `
  <div class="App">
    <template v-if="initialized">
      <div class="App-Status">
        <div class="CurrentStatus">
          <Emoji class="emoji" :emoji="profile.status_emoji" :set="emojiSet" @click="changeEmoji"></Emoji>
          <span class="text">
            <input type="text" :value="profile.status_text" @change="onChangeText">
          </span>
        </div>
      </div>
      <div class="StatusList">
        <div @click="setStatus(item)" v-for="item in preset" class="StatusList-Item">
          <Emoji :emoji="item.status_emoji" :set="emojiSet"></Emoji>
          <span class="text">{{item.status_text}}</span>
        </div>
      </div>
      <Picker v-if="showPicker" :set="emojiSet" @click="onClickEmoji" :sheetSize="32" :perLine="7"></Picker>
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
    this.$store.dispatch(types.INITIALIZE_STATUS)
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
  components: {
    Picker,
    Emoji
  }
})
