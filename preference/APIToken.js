const {ipcRenderer} = require('electron')
const types = require('../store/types')
const {shell} = require('electron')

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
          <input :class="{'is-danger': !tokenVerified, 'is-success': tokenVerified}" :value="value" ref="tokenInput" class="input " type="text" placeholder="Input your API token">
        </div>
        
        <button @click="verify" class="button is-link ">
          <Emoji 
            emoji=":heavy_check_mark:"
            :set="emojiSet"
            :size="16"
          />&nbsp;
          <span>Verify</span>
        </button>
      </div>
      <span v-if="tokenVerified" class="TokenVerified">Token verified</span>
      
      <div class="PermissionCaution">
        This app required permission scope: <br> <b>users.profile:read</b> & <b>users.profile:write</b>
      </div>
      <div class="Caution">
          <a @click.prevent="openLink('https://api.slack.com/apps')" href="https://api.slack.com/apps" target="_blank">
            <Emoji emoji=":link:" :size="12" :set="emojiSet"/>
            <span>Get your API token.</span>
          </a>
      </div>
      
    </div>
  </section>
  `,

  props: ['emojiSet', 'tokenVerified', 'value'],

  methods: {
    verify() {
      const apiToken = this.$refs.tokenInput.value
      this.$emit('input', apiToken)
      ipcRenderer.send(types.UPDATE_TOKEN, {apiToken})
    },

    openLink(href) {
      shell.openExternal(href)
    }
  },
}
