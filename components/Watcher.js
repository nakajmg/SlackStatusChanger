const {mapActions, mapState} = require('vuex')
const wifiName = require('wifi-name')
const assign = require('object-assign')
const types = require('../store/types')

module.exports = {
  template: '<div></div>',
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
      this.watcher = setInterval(() => this.setSSID(), this.autorun.interval)
    },
    stopWatcher() {
      if (this.watcher) {
        clearInterval(this.watcher)
        this.watcher = null
      }
    },
    setSSID() {
      wifiName().then((ssid) => {
        this.setCurrentSSID({ssid})
      }, (err) => {
        this.setCurrentSSID({ssid: ''})
        console.log(err)
      })
    }
  }, mapActions({
    setCurrentSSID: types.SET_CURRENT_SSID,
  }))
}
