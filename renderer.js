const Vue = require('vue/dist/vue.common')
const store = require('./store')
const assign = require('object-assign')
const {mapState, mapActions} = require('vuex')
const types = require('./store/types')
const components = require('./components')
const {Emoji} = require('emoji-mart-vue')

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
      <div class="App-Footer">
        <Emoji @click="openPreference" class="SettingsIcon" emoji=":gear:"/>
      </div>
    </template>
  </div>
  `,
  store,
  computed: assign({
    // local computed
  }, mapState({
    initialized: 'initialized',
  })),
  data() {
    return {
    }
  },
  created() {
    this.initializeStore()
  },
  methods: assign({
    // local methods
  }, mapActions({
    initializeStore: types.INITIALIZE_STATUS,
    openPreference: types.OPEN_PREFERENCE,
  })),
  components: assign({
    // local components
    Emoji,
  }, components)
})
