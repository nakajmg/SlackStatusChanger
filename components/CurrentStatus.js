const assign = require('object-assign')
const {mapActions, mapState} = require('vuex')
const {Picker} = require('emoji-mart-vue')
const {Emoji} = require('emoji-mart-vue')
const types = require('../store/types')

module.exports = {
  template: `
    <div class="CurrentStatus">
      <Emoji class="emoji"
        :emoji="profile.status_emoji"
        :set="emojiSet"
        @click="showEmojiPicker"
      />
      <span class="text">
        <input type="text" :value="profile.status_text" @change="onChangeText">
      </span>
      <Picker v-if="pickerVisible"
        :set="emojiSet"
        :sheetSize="32"
        :perLine="7"
        @click="onClickEmoji"
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
    setStatus: types.SET_CURRENT_STATUS
  })),
  components: {
    Picker,
    Emoji
  }
}
