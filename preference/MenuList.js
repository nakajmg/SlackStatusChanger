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

  props: ['emojiSet', 'value'],

  data() {
    return {
      menuItems: [
        {
          label: 'Preset',
          emoji: ':scroll:',
          type: 'preset',
        },
        {
          label: 'Autorun',
          emoji: ':traffic_light:',
          type: 'autorun',
        },
        {
          label: 'Emoji',
          emoji: ':smiley:',
          type: 'emoji',
        },
        {
          label: 'Token',
          emoji: ':key:',
          type: 'token',
        },
      ],
    }
  },

  methods: {
    selectMenu(type) {
      if (this.isSelectedMenu(type)) return
      this.$emit('input', type)
    },
    isSelectedMenu(type) {
      return this.value === type
    },
  }
}
