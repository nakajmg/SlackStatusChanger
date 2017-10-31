module.exports = {
  initialized: false,
  apiToken: null,
  tokenVerified: false,

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
      status_emoji: ':house_with_garden:',
      status_text: 'In the house',
    },
    {
      status_emoji: ':office:',
      status_text: 'In the office',
    },
    {
      status_emoji: ':face_with_thermometer:',
      status_text: 'Out sick',
    },
    {
      status_emoji: ':palm_tree:',
      status_text: 'Vacationing'
    },
    {
      status_emoji: ':bus:',
      status_text: 'Commuting'
    },
  ],

  // statusの自動切り替え
  auto: {
    enable: false,
    interval: 300,
    settings: [
      {
        enable: false,
        ssid: '',
        status_emoji: ':house_with_garden:',
        status_text: 'In the house',
      },
      {
        enable: false,
        ssid: '',
        status_emoji: ':office:',
        status_text: 'In the office',
      }
    ]
  },

  // 接続したことあるSSID
  knownSSID: [],
}
