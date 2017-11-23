const assign = require('object-assign')
const {mapActions, mapState} = require('vuex')
const {Picker} = require('emoji-mart-vue')
const {Emoji} = require('emoji-mart-vue')
const types = require('../store/types')
const Mousetrap = require('mousetrap')

module.exports = {
  template: `
    <div class="CurrentStatus">
      <div class="status">
        <span class="status-emoji" @click="showEmojiPicker">
          <CustomEmoji v-if="profile.status_emoji" :item="profile" :emojiSet="emojiSet" :customEmojis="customEmojis" />
          <Emoji class="empty emoji"
          title="Pick a Emoji"
          emoji=":smiley:"
          :set="emojiSet"
          :backgroundImageFn="emojiSheet"
          :size="24"
          v-else
        />
        </span>
        
        <span class="text">
          <input type="text" :value="profile.status_text" @change="onChangeText" title="Input your status">
          <Emoji @click="clearStatus" class="clear" emoji=":x:" :set="emojiSet" title="Clear Status" :backgroundImageFn="emojiSheet" :size="18"/>
        </span>
      </div>

      <Picker v-if="pickerVisible"
        class="picker"
        :emoji="profile.status_emoji"
        :set="emojiSet"
        :sheetSize="32"
        :perLine="7"
        title="Pick a Emoji"
        @click="onClickEmoji"
        :backgroundImageFn="emojiSheet"
        :custom="customEmojis"
       />
    </div>
  `,
  data() {
    return {
      pickerVisible: false
    }
  },
  computed: assign({
  }, mapState({
    profile: 'profile',
    emojiSet: 'emojiSet',
    customEmojis: state => state.team.customEmojis
  })),
  created() {
    this.bindShortcut()
  },
  methods: assign({
    showEmojiPicker() {
      this.pickerVisible = true
    },
    onClickEmoji(emoji) {
      this.setStatus({
        status_emoji: emoji.colons,
        custom: emoji.custom
      })
      this.pickerVisible = false
    },
    onChangeText({target}) {
      const status_text = target.value
      this.setStatus({
        status_text,
      })
    },
    bindShortcut() {
      Mousetrap.bind('esc', () => {
        this.pickerVisible = false
      })
    },
  }, mapActions({
    setStatus: types.SET_CURRENT_STATUS,
    syncStatus: types.SYNC_STATUS,
    clearStatus: types.CLEAR_STATUS,
  })),
  components: {
    Picker,
    Emoji
  }
}
