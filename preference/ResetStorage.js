const {remote, ipcRenderer} = require('electron')
const currentWindow = remote.getCurrentWindow()
const Promise = require('bluebird')
const setStorage = Promise.promisify(storage.set)
const types = require('../store/types')

module.exports = {
  template: `
  <section class="Contents">
    <div class="field">
      <label class="label Contents__Label">
        <Emoji emoji=":exclamation:" :set="emojiSet" :size="20" :backgroundImageFn="emojiSheet"/>
        <span>Resetting the data cannot be undone</span>
      </label>
    </div>
    <div class="field">
      <div>
        <div>
          <button @click="openDialog" class="button is-medium is-danger">
            <Emoji :size="20" emoji=":bomb:" :set="emojiSet" style="margin-right: 10px;" :backgroundImageFn="emojiSheet" />
            Reset
          </button>
        </div>
      </div>
    </div>
  </section>
  `,

  props: ['emojiSet'],

  data() {
    return {
      options: {
        type: 'question',
        buttons: ['No', 'Yes'],
        title: 'Reset the Data',
        message: 'Are you sure want to reset?',
        detail: 'After reset, restart app automatically',
      },
    }
  },

  methods: {
    openDialog() {
      remote.dialog.showMessageBox(currentWindow, this.options, this.onConfirm);
    },
    async onConfirm(res) {
      if (res) {
        await setStorage(types.STORAGE_DATA, {})
        ipcRenderer.send(types.RESTART_APP)
      }
    }
  }
}
