const {Emoji} = require('emoji-mart-vue')
const types = require('../store/types')
const {mapActions, mapState} = require('vuex')

module.exports = {
  template: `
  <div class="ToolBar">
    <Emoji @click="exitApp" emoji=":end:" :set="emojiSet" title="Quit App" style="margin-right: auto;"/>
    <Emoji v-if="false" @click="resetData" emoji=":bomb:" :set="emojiSet" title="Reset Preference"/>
    <Emoji v-if="tokenVerified" @click="syncStatus" emoji=":arrows_counterclockwise:" :set="emojiSet" title="Sync Status"/>
    <Emoji @click="openPreference()" emoji=":gear:" :set="emojiSet" title="Open Preference"/>
  </div>
  `,

  computed: mapState({
    emojiSet: 'emojiSet',
    tokenVerified: 'tokenVerified',
  }),

  methods: mapActions({
    resetData: types.CLEAR_STORAGE,
    openPreference: types.OPEN_PREFERENCE,
    syncStatus: types.SYNC_STATUS,
    exitApp: types.EXIT_APP,
  }),

  components: {
    Emoji
  }
}
