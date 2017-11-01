module.exports = {
  template: `
  <section class="message is-danger ErrorReport">
    <div class="message-body">
      <Emoji 
        emoji=":man-gesturing-no:"
        :set="emojiSet"
        :size="20"
        :backgroundImageFn="emojiSheet" 
        style="marign-right: 5px;"
      />
      <span>
        {{err.message}}    
      </span>
    </div>  
  </section>
  `,
  props: ['error', 'emojiSet'],
  computed: {
    err() {
      console.log(this.error)
      const [name, message] = this.error.split(',')
      return {name, message}
    }
  }
}
