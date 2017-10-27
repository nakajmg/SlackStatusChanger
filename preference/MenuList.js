module.exports = {
  template: `
  <div class="Menu">
    <span class="MenuItem"
      v-for="menu in menuItems"
      :class="{'-active': isSelectedMenu(menu.type)}"
      @click="selectMenu(menu.type)"
    >
      <Emoji :emoji="menu.emoji" :set="emojiSet"/>
      <span class="MenuItem__label">{{menu.label}}</span>
    </span>
  </div>
  `,

  props: ['emojiSet', 'selectedMenu'],

  data() {
    return {
      menuItems: [
        {
          label: 'Token',
          emoji: ':key:',
          type: 'token',
        },
        {
          label: 'Emoji',
          emoji: ':smiley:',
          type: 'emoji',
        },
        {
          label: 'Preset',
          emoji: ':scroll:',
          type: 'preset',
        },
      ],
    }
  },

  methods: {
    selectMenu(type) {
      this.selectedMenu = type
    },
    isSelectedMenu(type) {
      return this.selectedMenu === type
    },
  }
}
