const {ipcRenderer} = require('electron')
const types = require('../store/types')
const {cloneDeep, toNumber} = require('lodash')
const assign = require('object-assign')
const {Picker} = require('emoji-mart-vue')
const Mousetrap = require('mousetrap')

module.exports = {
  template: `
  <section class="Contents Autorun">
    <div class="field is-flex">
    
      <div class="control" style="margin-right: 10px;">
        <label class="label Contents__Label">
          <Emoji emoji=":signal_strength:" :set="emojiSet" :size="20" :backgroundImageFn="emojiSheet" />
          <span>Suspended or Resumed</span>
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
      
    </div>
    
    <div class="field">This feature automatically changes your status <br> when your computer is suspended or resumed.</div>
    
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
          <span @click.prevent="showPicker(index)" class="icon is-left AutorunList__ItemEmoji">
            <CustomEmoji :item="setting" :emojiSet="emojiSet" :customEmojis="customEmojis" />
          </span>
          <input class="input"
            :value="setting.status_text"
            @input="updateSetting(index, 'status_text', $event)"
            placeholder="Input your status"
          >
        </label>
        
        <span @click="removeSetting(index)" class="icon AutorunList__ItemRemove">
          <Emoji :size="14" emoji=":x:" :set="emojiSet" :backgroundImageFn="emojiSheet"/>
        </span>
      </div>
      
    </div>
    
    <div class="control is-clearfix AutorunList__Add" style="text-align: center;">
      <span @click="addSetting" class="icon is-large">
        <Emoji :size="18" emoji=":heavy_plus_sign:" :set="emojiSet" :backgroundImageFn="emojiSheet"/>
      </span>
    </div>
    <div v-if="!value.settings.length" style="text-align: center;">
      Click <Emoji :size="12" emoji=":heavy_plus_sign:" :set="emojiSet" :backgroundImageFn="emojiSheet"/> button to add setting
    </div>
    
    <Picker v-show="selectedIndex !== null" class="EmojiPicker"
      :set="emojiSet"
      :sheetSize="32"
      :emoji="selectedEmoji"
      :backgroundImageFn="emojiSheet" 
      title="Pick a Emoji"
      @click="onClickEmoji"
      ref="picker"
    />
  </section>
  `,

  props: ['emojiSet', 'value', 'customEmojis'],

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
      const suspend = assign({}, {
        enable: this.value.enable,
        interval: this.value.interval,
        settings: this.value.settings,
      }, payload)

      this.$emit('input', suspend)
      ipcRenderer.send(types.UPDATE_PREFERENCE, {suspend})
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
        custom: false,
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
      this.bindShortcut()
    },
    onClickEmoji(emoji) {
      const settings = cloneDeep(this.value.settings)
      settings[this.selectedIndex].status_emoji = emoji.colons
      settings[this.selectedIndex].custom = !!emoji.custom
      this.update({settings})
      this.selectedIndex = null
      this.unbindShortcut()
    },
    bindShortcut() {
      Mousetrap.bind('esc', () => {
        this.selectedIndex = null
        this.unbindShortcut()
      })
    },
    unbindShortcut() {
      Mousetrap.unbind('esc')
    },
  },

  components: {
    Picker,
  },
}
