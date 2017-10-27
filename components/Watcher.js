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
    /**
     * 自動実行を監視
     */
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

    /**
     * 起動時にautorunがenableだったら自動実行開始
     */
    if (this.autorun.enable) {
      this.setSSID()
      this.startWatcher()
    }
  },

  watch: {
    /**
     * intervalに変更があればタイマーリセット
     */
    'autorun.interval'() {
      if (this.autorun.enable) {
        this.startWatcher()
      }
      else {
        this.stopWatcher()
      }
    }
  },

  methods: assign({
    startWatcher() {
      // 多重起動しないようにタイマーリセット
      this.stopWatcher()
      this.watcher = setInterval(() => {
        this.setSSID()
      }, this.autorun.interval * 1000)
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
