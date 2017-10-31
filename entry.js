import Vue from 'vue/dist/vue.min'
import {Emoji} from 'emoji-mart-vue'

new Vue({
  el: '#main',
  data() {
    return {
      type: 'apple',
    }
  },

  methods: {
    changeSet(type) {
      this.type = type
    }
  },

  components: {
    Emoji
  },
})
