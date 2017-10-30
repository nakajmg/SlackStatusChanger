const {ipcRenderer} = require('electron')
const types = require('../store/types')
const {cloneDeep, toNumber} = require('lodash')
const assign = require('object-assign')

module.exports = {
  template: `
  <section class="Contents Autorun">
    <div class="field is-flex">
    
      <div class="control" style="margin-right: 10px;">
        <label class="label Contents__Label">
          <Emoji emoji=":signal_strength:" :set="emojiSet" :size="20"/>
          <span>Autorun</span>
        </label>
        
        <div class="control">
          <div class="buttons has-addons"">
            <label  class="button" :class="{'is-link': value.enable, 'is-light': !value.enable}">
              <input type="radio" name="enable" :value="true" @click="updateEnable(true)" style="display: none;">
              <span>
                ON
              </span>
            </label>
            <label class="button" :class="{'is-danger': !value.enable, 'is-light': value.enable}">
              <input type="radio" name="enable" :value="false" @change="updateEnable(false)" style="display: none;">
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
          <span>Interval (s)</span>
        </label>
        <div class="field is-flex">
          <div class="control">
            <input :value="value.interval" @change="updateInterval" type="number" class="input" min="60" placeholder="60" style="width: 90px;">
          </div>
        </div>
      </div>
      
    </div>
    
    <div v-if="value.settings.length" class="AutorunList" :class="{'-Enable': value.enable}">
      
      <div v-for="(setting, index) in value.settings" class="AutorunList__Item">
        <label class="checkbox AutorunList__ItemEnable">
          <input type="checkbox" :value="setting.enable" :checked="setting.enable" @change="updateSetting(index, 'enable', $event)" title="enable/disable">
        </label>
        
        <label class="control AutorunList__ItemSSID">
          <input class="input"
            placeholder="Input SSID e.g) hogespot,fugaspot"
            :value="setting.ssid" @input="updateSetting(index, 'ssid', $event)"
          >
        </label>
        
        <label class="control has-icons-left AutorunList__ItemStatus">
          <span class="icon is-left">
            <Emoji :emoji="setting.status_emoji" :set="emojiSet"/>
          </span>
          <input class="input"
            :value="setting.status_text"
            @input="updateSetting(index, 'status_text', $event)"
            placeholder="Input your status"
          >
        </label>
        
        <span @click="removeSetting(index)" class="icon AutorunList__ItemRemove">
          <Emoji :size="14" emoji=":x:" :set="emojiSet"/>
        </span>
      </div>
      
    </div>
    
    <div class="control is-clearfix AutorunList__Add" style="text-align: center;">
      <span @click="addSetting" class="icon is-large">
        <Emoji :size="18" emoji=":heavy_plus_sign:" :set="emojiSet"/>
      </span>
    </div>
    <div v-if="!value.settings.length" style="text-align: center;">
      Click <Emoji :size="12" emoji=":heavy_plus_sign:" :set="emojiSet"/> button to add setting
    </div>
    
  </section>
  `,

  props: ['emojiSet', 'value'],

  methods: {
    update(payload) {
      const autorun = assign({}, {
        enable: this.value.enable,
        interval: this.value.interval,
        settings: this.value.settings,
      }, payload)

      this.$emit('input', autorun)
      ipcRenderer.send(types.UPDATE_PREFERENCE, {autorun})
    },

    updateEnable(enable) {
      this.update({enable})
    },

    updateInterval({target}) {
      if (target.value === '') return
      let interval = toNumber(target.value)
      if (interval < 60) interval = 60
      this.update({interval})
    },

    updateSetting(index, type, {target}) {
      const settings = cloneDeep(this.value.settings)
      let value
      switch(type) {
        case 'enable':
          value = target.checked
          break
        default:
          value = target.value
      }
      settings[index][type] = value
      this.update({settings})
    },
    addSetting() {
      const settings = cloneDeep(this.value.settings)
      settings.push({
        enable: false,
        ssid: '',
        status_emoji: ':smiley:',
        status_text: '',
      })
      this.update({settings})
    },

    removeSetting(index) {
      const settings = cloneDeep(this.value.settings)
      settings.splice(index, 1)
      this.update({settings})
    }
  },


}
