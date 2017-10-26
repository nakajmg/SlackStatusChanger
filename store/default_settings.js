module.exports = (() => {
  return {
    // emojiの表示種類
    emojiSet: 'apple',
    statusList: [
      {
        status_emoji: ':office:',
        status_text: 'In the office',
      },
      {
        status_emoji: ':house_with_garden:',
        status_text: 'In the home',
      },
      {
        status_emoji: ':sushi:',
        status_text: 'Need Sushi',
      },
    ],

    // 設定
      // statusの自動切り替え
    autorun: {
      enable: true,
      interval: 60000,
    },
    // 接続したことあるSSID
    knownSSID: [],
    //  wifi: [
    //    // TODO ssidをカンマくぎりで指定できるようにすればいいのでは
    //    {
    //      enable: true,
    //      ssid: 'jmghome,'
    //    }
    //  ],
    wifi: {
      'jmghome': {
        enable: true,
        status_emoji: ':sushi:',
        status_text: 'すし',
      },
      'pxgrid-guest': {
        enable: true,
        status_emoji: ':office:',
        status_text: 'オフィスにいる',
      }
    },
  }
})()
