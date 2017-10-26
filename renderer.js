const Vue = require('vue/dist/vue.common')
const store = require('./store')
const assign = require('object-assign')
const {mapState, mapActions} = require('vuex')
const types = require('./store/types')
const components = require('./components')
const {Emoji} = require('emoji-mart-vue')
const Promise = require('bluebird')

new Vue({
  el: '#app',
  template: `
  <div class="App">
    <template v-if="initialized">
      <div class="App-Status">
        <CurrentStatus/>
      </div>
      <div class="App-Contents">
        <StatusList/>
      </div>
      <Watcher/>
    </template>
    <template v-else>
      <div>
        Please set your api token on preference
      </div>
    </template>
    <div class="App-Footer">
      <Emoji @click="openPreference" class="SettingsIcon" emoji=":gear:"/>
    </div>
  </div>
  `,
  store,
  data() {
    return {
    }
  },

  created() {
    this.initializeStore()
      .then(() => {
        return new Promise((resolve, reject) => {
          console.log(this.apiToken)
          if (this.apiToken) return resolve()
          // tokenなかったら強制的にpreference開いてもよさそう
          this.$store.watch(
            state => state.apiToken,
            apiToken => resolve(apiToken)
          )
        })
      })
      .then(() => {
        this.initializeStatus()
      })
  },

  computed: assign({
    // local computed
  }, mapState({
    initialized: 'initialized',
    apiToken: 'apiToken',
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
