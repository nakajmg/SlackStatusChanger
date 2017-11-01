const assign = require('object-assign')
const {mapActions, mapState} = require('vuex')
const {Picker} = require('emoji-mart-vue')
const {Emoji} = require('emoji-mart-vue')
const types = require('../store/types')

module.exports = {
  template: `
    <div class="CurrentStatus">
      <div class="status">
        <Emoji class="emoji"
          :title="profile.status_emoji"
          :emoji="profile.status_emoji"
          :set="emojiSet"
          :backgroundImageFn="emojiSheet"
          :size="24"
          @click="showEmojiPicker"
          v-if="profile.status_emoji"
        />
        <Emoji class="empty emoji"
          title="Pick a Emoji"
          emoji=":smiley:"
          @click="showEmojiPicker"
          :set="emojiSet"
          :backgroundImageFn="emojiSheet"
          :size="24"
          v-else
        />
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
       />
    </div>
  `,
  data() {
    return {
      pickerVisible: false
    }
  },
  computed: mapState({
    profile: 'profile',
    emojiSet: 'emojiSet',
  }),
  methods: assign({
    showEmojiPicker() {
      this.pickerVisible = true
    },
    onClickEmoji(emoji) {
      this.setStatus({
        status_emoji: emoji.colons,
      })
      this.pickerVisible = false
    },
    onChangeText({target}) {
      const status_text = target.value
      this.setStatus({
        status_text,
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
