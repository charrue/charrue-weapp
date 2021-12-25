Page({
  data: {
    navs: [
      {
        title: "倒计时 Countdown",
        name: "countdown",
        icon: "countdown"
      }
    ]
  },
  onClick(e) {
    const { name } = e.currentTarget.dataset
    if (name) {
      wx.navigateTo({
        url: `/pages/components/${name}/${name}`
      })
    }

  }
})