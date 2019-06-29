//app.js       
App({
  onLaunch: function () {
    var that = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          //发起网络请求  
          // console.log(res.code)
          wx.request({
            url: 'https://www.dongjingfit.com/W001',
            data: {
              js_code: res.code
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: "post",
            success: function (resule) {
              // console.log(resule.data.data.token);
              that.globalData.tokenid = resule.data.data.token
            }
          })

        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        } 
      }
    })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => { 
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },

  onShow: function () {
    let that = this;
    wx.getSystemInfo({
      success: res => {
        // console.log('手机信息res'+res.model)
        let modelmes = res.model;
        if (modelmes.search('iPhone X') != -1) {
          that.globalData.isIphoneX = true
        }
      }
    })
  },

  globalData: {
    wxuser: "",
    tokenid: "",
    userInfo: null,
    isVip:null,
    content:'',
    // cate_id:'12',
    
    url:'https://www.dongjingfit.com/',
    defautCity:'',//定位到默认城市
    // url: 'https://dev.dongjingfit.com/',
    // url:'http://47.99.99.252:8080/ax_api/api/', 
    //url: 'http://192.168.0.111:8080/ax_api/api/',
     //url: 'http://127.0.0.1:8080/ax_api/api/',
    //url: 'http://47.104.255.223:8080/ax_api/api/',
  }
  
})