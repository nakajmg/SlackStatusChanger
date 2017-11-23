const {mapActions, mapState} = require('vuex')
const types = require('../store/types')
const assign = require('object-assign')
const Mousetrap = require('mousetrap')
const {each} = require('lodash')

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

  created() {
    this.bindShortcut()
  },

  updated() {
    this.unbindShortcut()
    this.bindShortcut()
  },

  methods: assign(mapActions({
    setStatus: types.SET_CURRENT_STATUS,
    openPreference: types.OPEN_PREFERENCE,
  }), {
    bindShortcut() {
      each(this.items, (item, index) => {
        if (index >= 9) return
        Mousetrap.bind(`command+${index + 1}`, () => {
          this.setStatus(item)
        })
      })
    },
    unbindShortcut() {
      for(let i = 1; i < 10; i++) {
        Mousetrap.unbind(`command+${i}`)
      }
    }
  }),
  components: {
  }
}
