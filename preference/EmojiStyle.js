const {ipcRenderer} = require('electron')
const types = require('../store/types')
const {Emoji} = require('emoji-mart-vue')

module.exports = {
  template: `
  <section class="Contents">
    <div class="field">
      <label class="label Contents__Label">
        <Emoji emoji=":smiley:" :set="emojiSet" :size="20" :backgroundImageFn="emojiSheet" />
        <span>Emoji Style</span>
      </label>
      <div class="EmojiStyle control">
        <label class="radio" v-for="emojiType in emojiSetList">
          <input type="radio" name="emojiSet" style="display: none;"
            v-model="emojiSet"
            :value="emojiType.value"
          >
          <div class="EmojiType">
            <Emoji :size="20" emoji=":smiley:" :set="emojiType.value" :backgroundImageFn="emojiSheet" />
            <span>&nbsp;{{emojiType.label}}</span>
          </div>
        </label>
      </div>
      <div class="PermissionCaution">
        This preference is only affect on this app. <br>
        See Slack Preferences > Messages & Media > Emoji Style.
      </div>
    </div>
  </section>
  `,

  props: ['value'],

  data() {
    return {
      emojiSet: '',
      emojiSetList: [
        {
          label: 'Apple',
          value: 'apple',
        },
        {
          label: 'Google',
          value: 'google',
        },
        {
          label: 'Twitter',
          value: 'twitter',
        },
        {
          label: 'Emoji One',
          value: 'emojione',
        },
      ],
    }
  },

  created() {
    this.emojiSet = this.value
  },

  watch: {
    emojiSet(emojiSet, oldVal) {
      if (!oldVal) return
      this.update(emojiSet)
    }
  },

  methods: {
    update(emojiSet) {
      ipcRenderer.send(types.UPDATE_PREFERENCE, {emojiSet})
      this.$emit('input', emojiSet)
    },
  },

  components: {
    Emoji
  }
}
