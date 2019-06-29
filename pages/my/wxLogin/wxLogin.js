//index.js
//获取应用实例
const app = getApp()
// 引用公共js
var request = require('../../../utils/common.js');
Page({
  data: {
    userInfo: '', //获取用户名

  },
  
  onLoad: function(option) {
    let that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log(res.data)
        that.setData({
          userInfo: res.data
        })
      }
    });
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      wx.setStorage({
        key: 'userInfo',
        data: e.detail.userInfo,
        success: function (res) {
          // console.log('异步保存成功')
        }
      });
      that.setData({
        userInfo: e.detail.userInfo
      });
      wx.navigateBack({
        delta: 2
      })
      // that.setData({
      //   userInfo: e.detail.userInfo
      // })
      // console.log(e.detail.userInfo);
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },

})