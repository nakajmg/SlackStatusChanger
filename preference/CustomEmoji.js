const {find} = require('lodash')
const {Emoji} = require('emoji-mart-vue')

module.exports = {
  template: `
  <span v-if="item.custom" class="emoji-mart-emoji emoji">
    <img :src="imageUrl(item.status_emoji)" alt="" width="24" height="24" style="display: block;">
  </span>
  <Emoji v-else :size="20" :emoji="item.status_emoji" :set="emojiSet" :backgroundImageFn="emojiSheet"/>
  `,
  props: [
    'item', 'customEmojis', 'emojiSet'
  ],
  methods: {
    imageUrl(status_emoji) {
      if (!status_emoji) return ''
      const name = status_emoji.substring(1, status_emoji.length - 1)
      const emoji = find(this.customEmojis, {name})
      return emoji.imageUrl
    }
  },
  components: {
    Emoji
  }
}
