const {mapActions, mapState} = require('vuex')
const wifiName = require('wifi-name')
const assign = require('object-assign')
const types = require('../store/types')

module.exports = {
  template: '<div style="display: none;"></div>',
  data() {
    return {
      watcher: null
    }
  },

  computed: mapState({
    autorun: 'autorun',
  }),

  created() {
    this.$store.watch((state) => {
      return state.autorun.enable
    }, (enable) => {
      if (enable) {
        this.startWatcher()
      }
      else {
        this.stopWatcher()
      }
    })
    if (this.autorun.enable) {
      this.startWatcher()
    }
  },

  methods: assign({
    startWatcher() {
      this.stopWatcher()
      this.setSSID()
      this.watcher = setInterval(() => this.setSSID(), this.autorun.interval)
    },
    stopWatcher() {
      if (this.watcher) {
        clearInterval(this.watcher)
        this.watcher = null
      }
    },
    // 名前変えたい。change statusとか ssidセットするわけじゃないし
    async setSSID() {
      const ssid = await wifiName().catch(err => {
        console.log(err)
      })
      this.setCurrentSSID({ssid})
    }
  }, mapActions({
    setCurrentSSID: types.SET_CURRENT_SSID,
  }))
}
