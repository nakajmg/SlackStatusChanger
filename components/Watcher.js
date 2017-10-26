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
      this.watcher = setInterval(() => {
        wifiName().then((ssid) => {
          console.log(ssid)
          this.setSSID({ssid})
        }, (err) => {
          console.log(err)
        })
      }, this.autorun.interval)
    },
    stopWatcher() {
      this.watcher && clearInterval(this.watcher)
    },
  }, mapActions({
    setSSID: types.SET_CURRENT_SSID,
  }))
}
