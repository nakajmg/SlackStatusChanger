const {ipcRenderer} = require('electron')
const types = require('../store/types')

module.exports = {
  template: `
  <section class="Contents Autorun">
    <div class="field is-flex">
      <div class="control" style="margin-right: 10px;">
        <label class="label Contents__Label">
          <Emoji emoji=":traffic_light:" :set="emojiSet" :size="20"/>
          <span>Autorun</span>
        </label>
        <div class="control">
          <div class="buttons has-addons"">
            <label  class="button" :class="{'is-link': enable, 'is-light': !enable}">
              <input type="radio" name="enable" :value="true" v-model="enable" style="display: none;">
              <span>
                ON
              </span>
            </label>
            <label class="button" :class="{'is-danger': !enable, 'is-light': enable}">
              <input type="radio" name="enable" :value="false" v-model="enable" style="display: none;">
              <span>
                OFF
              </span>
            </label>
          </div>
        </div>
      </div>
      
      <div class="control">
        <label class="label Contents__Label">
          <Emoji emoji=":alarm_clock:" :set="emojiSet" :size="20"/>
          <span>Interval</span>
        </label>
        <div class="field is-flex">
          <div class="control has-icons-right">
            <input v-model="interval" type="number" class="input" min="60" placeholder="Autorun interval per seconds">
            <span class="icon is-right">
              /s
            </span>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div v-for="setting in settings" class="is-flex">
        <label class="checkbox">
          <input type="checkbox" :value="setting.enable">
        </label>
        
        <label class="control">
          <input class="input" :value="setting.ssid">
        </label>
        
        <label class="control has-icons-left">
          <span class="icon is-left">
            <Emoji :emoji="setting.status_emoji" :set="emojiSet"/>
          </span>
          <input class="input" :value="setting.status_text">
        </label>
      </div>
    </div>
  </section>
  `,

  props: ['emojiSet', 'value'],

  data() {
    return {
      autorun: null,
      enable: null,
      interval: 60,
    }
  },

  created() {
    this.autorun = this.value
    this.enable = this.value.enable
    this.interval = this.value.interval
    this.settings = this.value.settings
  },

  watch: {
    enable(enable, oldVal) {
      this.update({enable})
    },
    interval(interval, oldVal) {
      this.update({interval})
    },
  },

  methods: {
    update(payload) {
      const autorun = assign({}, this.autorun, payload)
      this.$emit('input', autorun)
      ipcRenderer.send(types.UPDATE_PREFERENCE, {autorun})
    },
  },

}
