// pages/my/nopayDetail/nopayDetail.js
//logs.js
const util = require('../../../utils/util.js')
//获取应用实例
const app = getApp()
// 引用公共js
var request = require('../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 每日精选
    content: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let id = options.id;
    let url = 'order/catering/info/get';
    // 发送请求
    let data = { id: id };
    request.postRequest(url, data).then((res) => {
      console.log(res.data.data.data);
      that.setData({
        content: res.data.data.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})