const {ipcRenderer} = require('electron')
const types = require('../store/types')

module.exports = {
  template: `
  <section class="Contents">
    <div class="field">
      <label class="label Contents__Label">
        <Emoji emoji=":scroll:" :set="emojiSet" :size="20"/>
        <span>Preset</span>
      </label>
      
      <div class="PresetItem" v-for="item in preset">
        <div class="control has-icons-left has-icons-right">
          <input class="input is-medium PresetItem__Text" :value="item.status_text">
          <span class="icon is-left PresetItem__Emoji">
            <Emoji :emoji="item.status_emoji" :set="emojiSet"/>
          </span>
          <span class="icon is-right PresetItem__Remove">
            <Emoji emoji=":x:" :set="emojiSet" :size="16"/>
          </span>
        </div>
      </div>
      
      <div class="control is-clearfix" style="text-align: center;">
        <span class="icon is-large">
          <Emoji class="PresetItem__Add" emoji=":heavy_plus_sign:" :set="emojiSet"/>
        </span>
      </div>
      
    </div>
  </section>
  `,

  props: ['emojiSet', 'preset'],
}
