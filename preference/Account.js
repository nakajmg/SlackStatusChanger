module.exports = {
  template: `
    <section class="Contents Account" v-if="apiToken">
      <label class="label Contents__Label">
        Account
      </label>
      <div class="field is-flex card" style="padding: 5px;">
        <div>
          <label class="label Contents__Label">
            Team
          </label>
          <div class="AccountInfo">
            <span class="AccountInfo__Icon">
              <img :src="team.icon">
            </span>
            <span class="AccountInfo__Name" >
              {{team.name}} 
            </span>
          </div>
        </div>
        <div style="width: 10px;"></div>
        <div>
          <label class="label Contents__Label">
            User
          </label>
          <div class="AccountInfo">
            <span class="AccountInfo__Icon">
              <img :src="user.icon">
            </span>
            <span class="AccountInfo__Name">
              {{user.name}} 
            </span>
          </div>
        </div>
      </div>
      <div>
        <button class="button is-info is-medium is-pulled-right" @click="signOut">
          <Emoji :set="emojiSet" emoji=":outbox_tray:" :size="22"/>
          <span style="margin-left: 10px;">
           Sign Out
          </span>
        </button>
      </div>
    </section>
    <section v-else class="AccountInfo__Signin">
      <a href="#" @click.prevent="openSignin">
        <img alt="Sign in with Slack" height="40" width="172" src="https://platform.slack-edge.com/img/sign_in_with_slack.png" srcset="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"/>
      </a>
    </section>
  `,

  props: [
    'apiToken', 'emojiSet', 'team', 'user', 'signOut'
  ],
  methods: {
    openSignin() {
      ipcRenderer.send('openSignin')
    },
  }
}
