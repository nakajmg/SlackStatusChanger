module.exports = {
  initialized: false,
  apiToken: null,

  // 今のstatusを保持
  profile: {
    status_emoji: '',
    status_text: '',
  },

  // 自動実行を実行したときのSSIDを保持
  prevSSID: null,

  // emojiの表示種類
  emojiSet: 'google',

  preset: [
    {
      status_emoji: ':office:',
      status_text: 'オフィスにいる',
    },
    {
      status_emoji: ':house_with_garden:',
      status_text: '家にいる',
    },
    {
      status_emoji: ':sushi:',
      status_text: 'お寿司たべたい',
    },
  ],

  // statusの自動切り替え
  autorun: {
    enable: true,
    interval: 10000,
    settings: [
      {
        enable: true,
        ssid: 'jmghome',
        status_emoji: ':sushi:',
        status_text: 'お寿司たべたい',
      },
      {
        enable: true,
        ssid: 'pxgrid-guest',
        status_emoji: ':office:',
        status_text: 'オフィスにいる',
      }
    ]
  },

  // 接続したことあるSSID
  knownSSID: [],
}
