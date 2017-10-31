const {ipcRenderer} = require('electron')
const types = require('../store/types')
const {cloneDeep, toNumber} = require('lodash')
const assign = require('object-assign')
const {Picker} = require('emoji-mart-vue')

module.exports = {
  template: `
  <section class="Contents Autorun">
    <div class="field is-flex">
    
      <div class="control" style="margin-right: 10px;">
        <label class="label Contents__Label">
          <Emoji emoji=":signal_strength:" :set="emojiSet" :size="20"/>
          <span>Auto</span>
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
    
    <div class="field">This feature provide automatically change status <br> which based on connected Wi-Fi(SSID).</div>
    
    <div v-if="value.settings.length" class="AutorunList" :class="{'-Enable': value.enable}">
      <div v-for="(setting, index) in value.settings" class="AutorunList__Item">
        <label class="checkbox AutorunList__ItemEnable">
          <input type="checkbox" :value="setting.enable" :checked="setting.enable" @change="updateSetting(index, 'enable', $event)" title="enable/disable">
        </label>
        
        <label class="control AutorunList__ItemSSID">
          <input class="input"
            placeholder="hogespot,fugaspot"
            :value="setting.ssid" @input="updateSetting(index, 'ssid', $event)"
          >
        </label>
        
        <label class="control has-icons-left AutorunList__ItemStatus">
          <span @click="showPicker(index)" class="icon is-left AutorunList__ItemEmoji">
            <Emoji :size="20" :emoji="setting.status_emoji" :set="emojiSet"/>
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
    
    <Picker v-show="selectedIndex !== null" class="EmojiPicker"
      :set="emojiSet"
      :sheetSize="32"
      :emoji="selectedEmoji"
      title="Pick a Emoji"
      @click="onClickEmoji"
    />
  </section>
  `,

  props: ['emojiSet', 'value'],

  data() {
    return {
      selectedIndex: null
    }
  },

  computed: {
    selectedEmoji() {
      if (this.selectedIndex === null) return ':smiley:'
      return this.value.settings[this.selectedIndex].status_emoji
    }
  },

  methods: {
    update(payload) {
      const auto = assign({}, {
        enable: this.value.enable,
        interval: this.value.interval,
        settings: this.value.settings,
      }, payload)

      this.$emit('input', auto)
      ipcRenderer.send(types.UPDATE_PREFERENCE, {auto})
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
    },

    showPicker(index) {
      this.selectedIndex = index
    },
    onClickEmoji(emoji) {
      const settings = cloneDeep(this.value.settings)
      settings[this.selectedIndex].status_emoji = emoji.colons
      this.update({settings})
      this.selectedIndex = null
    },
  },

  components: {
    Picker,
  },
}
