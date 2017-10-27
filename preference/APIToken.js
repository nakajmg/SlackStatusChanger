const {ipcRenderer} = require('electron')
const types = require('../store/types')

module.exports = {
  template: `
  <section class="Contents">
    <div class="field">
      <label class="label Contents__Label">
        <Emoji emoji=":key:" :set="emojiSet" :size="20"/>
        <span>API token</span>
      </label>
      
      
      <div class="field is-clearfix is-flex">
        <div class="control" style="flex-grow: 1;margin-right: 10px;">
          <input :value="apiToken" ref="tokenInput" class="input" type="text" placeholder="Input your API token">
        </div>
        
        <button @click="saveToken" class="button is-link ">
          <Emoji emoji=":heavy_check_mark:" :set="emojiSet" :size="16"/>
          <span>&nbsp;&nbsp;Save</span>
        </button>
      </div>
    </div>
  </section>
  `,

  props: ['emojiSet', 'apiToken'],

  methods: {
    saveToken() {
      const apiToken = this.$refs.tokenInput.value
      ipcRenderer.send(types.UPDATE_PREFERENCE, {apiToken})
    }
  },
}
