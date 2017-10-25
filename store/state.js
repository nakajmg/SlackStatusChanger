module.exports = {
  initialized: false,
  // 今のstatusを保持
  profile: {
    status_emoji: '',
    status_text: '',
    ssid: null,
  },
  emojiSet: 'google',
  preset: [
    {
      name: 'office',
      status_emoji: ':office:',
      status_text: 'オフィスにいる',
    },
    {
      name: 'home',
      status_emoji: ':house_with_garden:',
      status_text: '家にいる',
    },
    {
      name: 'sushi',
      status_emoji: ':sushi:',
      status_text: 'お寿司たべたい',
    },
  ],
  // presetを編集 or 追加したら次からこっちを見る
  // localstorageに保存
  statusList: [

  ],
  // 設定
  settings: {
    // statusの自動切り替え
    autorun: {
      enable: false,
      interval: 60000,
    },
    // 接続したことあるSSID
    knownSSID: []
  },
  wifi: {
    'jmghome': {
      enable: true,
      status: 'home',
    },
    'pxgrid-guest': {
      enable: true,
      status: 'office',
    }
  },
}
