const {mapActions, mapState} = require('vuex')
const {Emoji} = require('emoji-mart-vue')
const types = require('../store/types')

module.exports = {
  template: `
    <div class="StatusList">
      <div @click="setStatus(item)" v-for="item in items" class="StatusList-Item">
        <Emoji :emoji="item.status_emoji" :set="emojiSet"></Emoji>
        <span class="text">{{item.status_text}}</span>
      </div>
    </div>
  `,
  computed: mapState({
    emojiSet: 'emojiSet',
    items: 'preset',
  }),
  methods: mapActions({
    setStatus: types.SET_CURRENT_STATUS
  }),
  components: {
    Emoji
  }
}
