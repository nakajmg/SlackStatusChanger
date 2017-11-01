const {mapActions, mapState} = require('vuex')
const {Emoji} = require('emoji-mart-vue')
const types = require('../store/types')
const assign = require('object-assign')

module.exports = {
  template: `
    <div class="StatusList">
      <div class="StatusList-Label">Preset (<span @click="openPreference()" class="edit">edit</span>)</div>
      <div @click="setStatus(item)" v-for="item in items" class="StatusList-Item">
        <Emoji :backgroundImageFn="emojiSheet" :emoji="item.status_emoji" :set="emojiSet" :title="item.status_emoji" :size="24"></Emoji>
        <span class="text">{{item.status_text}}</span>
      </div>
    </div>
  `,
  computed: mapState({
    emojiSet: 'emojiSet',
    items: 'preset',
  }),
  methods: assign(mapActions({
    setStatus: types.SET_CURRENT_STATUS,
    openPreference: types.OPEN_PREFERENCE,
  })),
  components: {
    Emoji
  }
}
