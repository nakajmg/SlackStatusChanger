const {Emoji} = require('emoji-mart-vue')
const types = require('../store/types')
const {mapActions, mapState} = require('vuex')

module.exports = {
  template: `
  <div class="ToolBar">
    <Emoji @click="resetData" emoji=":scissors:" :set="emojiSet" title="Reset Preference"/>
    <Emoji @click="syncStatus" emoji=":arrows_counterclockwise:" :set="emojiSet" title="Sync Status"/>
    <Emoji @click="openPreference" emoji=":gear:" :set="emojiSet" title="Open Preference"/>
  </div>
  `,

  computed: mapState({
    emojiSet: 'emojiSet'
  }),

  methods: mapActions({
    resetData: types.RESET_DATA,
    openPreference: types.OPEN_PREFERENCE,
    syncStatus: types.SYNC_STATUS,
  }),

  components: {
    Emoji
  }
}
