const Vue = require('vue/dist/vue.common')
const store = require('./store')
const assign = require('object-assign')
const {mapState, mapActions} = require('vuex')
const types = require('./store/types')
const components = require('./renderer/index.js')
const {Emoji} = require('emoji-mart-vue')

Vue.mixin({
  methods: {
    emojiSheet(set, size) {
      return `${__dirname}/img/${set}64.png`
    }
  }
})

new Vue({
  el: '#app',
  template: `
  <div class="App" :class="{'-Uninitialized': !initialized}">
    <template v-if="initialized && apiToken !== null">
      <div class="App-Status">
        <CurrentStatus/>
      </div>
      <div class="App-Contents">
        <StatusList/>
      </div>
      <Watcher/>
    </template>
    <template v-else>
      <div class="NoToken">
        <Emoji emoji=":link:" :set="emojiSet" :backgroundImageFn="emojiSheet" :size="24"/>
        <span>
          <a @click.prevent="openPreference('account')" href="#">Please Sign in<br> your Slack account</a>
        </span>
      </div>
    </template>
    <div class="App-Footer">
      <ToolBar/>
    </div>
  </div>
  `,
  store,
  data() {
    return {
    }
  },

  async created() {
    await this.initializeStore()
    if (!this.apiToken) {
      this.openPreference('account')
    }
    this.initializeStatus()
  },

  computed: assign({
    // local computed
  }, mapState({
    initialized: 'initialized',
    apiToken: 'apiToken',
    emojiSet: 'emojiSet'
  })),

  methods: assign({
    // local methods
  }, mapActions({
    initializeStore: types.INITIALIZE_STORE,
    initializeStatus: types.INITIALIZE_STATUS,
    openPreference: types.OPEN_PREFERENCE,
  })),

  components: assign({
    // local components
    Emoji,
  }, components)
})
