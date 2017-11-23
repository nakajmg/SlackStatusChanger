const {mapActions, mapState} = require('vuex')
const {Emoji} = require('emoji-mart-vue')
const types = require('../store/types')
const assign = require('object-assign')
const {find} = require('lodash')

module.exports = {
  template: `
    <div class="StatusList">
      <div class="StatusList-Label">Preset (<span @click="openPreference()" class="edit">edit</span>)</div>
      <div @click="setStatus(item)" v-for="item in items" class="StatusList-Item">
        <CustomEmoji :item="item" :emojiSet="emojiSet" :customEmojis="customEmojis" />
        <span class="text">{{item.status_text}}</span>
      </div>
    </div>
  `,
  computed: mapState({
    emojiSet: 'emojiSet',
    items: 'preset',
    customEmojis: state => state.team.customEmojis
  }),
  methods: assign(mapActions({
    setStatus: types.SET_CURRENT_STATUS,
    openPreference: types.OPEN_PREFERENCE,
  }), {
    imageUrl(status_emoji) {
      if (!status_emoji) return ''
      const name = status_emoji.substring(1, status_emoji.length - 1)
      const emoji = find(this.customEmojis, {name})
      return emoji.imageUrl
    }
  }),
  components: {
    Emoji
  }
}
