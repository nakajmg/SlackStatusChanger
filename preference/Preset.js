const {ipcRenderer} = require('electron')
const types = require('../store/types')
const {cloneDeep} = require('lodash')
const {Picker} = require('emoji-mart-vue')
const {find} = require('lodash')

module.exports = {
  template: `
  <section class="Contents Preset">
    <div class="field">
      <label class="label Contents__Label">
        <Emoji emoji=":scroll:" :set="emojiSet" :size="20" :backgroundImageFn="emojiSheet"/>
        <span>Preset</span>
      </label>
      
      <div class="PresetItems">
        <div class="PresetItem" v-for="(item, index) in preset">
          <div class="control has-icons-left has-icons-right">
            <input class="input is-medium PresetItem__Text" :value="item.status_text" @input="updateText($event, index)">
            <span @click="showPicker(index)" class="icon is-left PresetItem__Emoji">
              <span v-if="item.custom" class="emoji-mart-emoji emoji">
                <img :src="imageUrl(item.status_emoji)" alt="" width="24" height="24" style="display: block;">
              </span>
              <Emoji v-else :emoji="item.status_emoji" :set="emojiSet" :backgroundImageFn="emojiSheet" :size="24"/>
            </span>
            <span class="icon is-right PresetItem__Remove" @click="removePresetItem(index)">
              <Emoji emoji=":x:" :set="emojiSet" :size="16" :backgroundImageFn="emojiSheet"/>
            </span>
          </div>
        </div>
      </div>
      
      
      <div class="control is-clearfix" style="text-align: center;">
        <span class="icon is-large" @click="addPresetItem">
          <Emoji class="PresetItem__Add" emoji=":heavy_plus_sign:" :set="emojiSet" :backgroundImageFn="emojiSheet"  :size="24"/>
        </span>
      </div>
      
      
    </div>
    <Picker v-show="selectedIndex !== null" class="EmojiPicker"
      @click="onClickEmoji"
      :set="emojiSet"
      :sheetSize="32"
      :emoji="selectedEmoji"
      :backgroundImageFn="emojiSheet" 
      title="Pick a Emoji"
      :custom="customEmojis"
    />
  </section>
  `,

  props: ['emojiSet', 'value', 'customEmojis'],

  data() {
    return {
      preset: [],
      selectedIndex: null
    }
  },

  created() {
    this.preset = cloneDeep(this.value)
  },

  computed: {
    selectedEmoji() {
      if (this.selectedIndex === null) return ':smiley:'
      return this.preset[this.selectedIndex].status_emoji
    }
  },

  methods: {
    updateText({target}, i) {
      const status_text = target.value
      this.preset[i].status_text = status_text
      this.update(this.preset)
      this.$emit('input', this.preset)
    },

    showPicker(index) {
      this.selectedIndex = index
    },

    update(preset) {
      ipcRenderer.send(types.UPDATE_PREFERENCE, {preset})
    },

    onClickEmoji(emoji) {
      const status_emoji = emoji.colons
      this.preset[this.selectedIndex].status_emoji = status_emoji
      this.preset[this.selectedIndex].custom = !!emoji.custom
      this.update(this.preset)
      this.selectedIndex = null
    },

    addPresetItem() {
      this.preset.push({
        status_emoji: ':smiley:',
        status_text: '',
        custom: false
      })
      this.update(this.preset)
    },

    removePresetItem(index) {
      this.preset.splice(index, 1)
      this.update(this.preset)
    },

    imageUrl(status_emoji) {
      if (!status_emoji) return ''
      const name = status_emoji.substring(1, status_emoji.length - 1)
      const emoji = find(this.customEmojis, {name})
      return emoji.imageUrl
    }
  },

  components: {
    Picker
  }
}
