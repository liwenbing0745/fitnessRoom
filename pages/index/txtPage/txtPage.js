// pages/index/txtPage/txtPage.js

//获取应用实例
const app = getApp()
// 自定义轮播
// 引用公共js
var request = require('../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner:'',
    bannerContent:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id);
    let that =this;
    // // 获取区
    let url2 = "banner/findById";
    let data2 = { id: options.id };
    request.postRequest(url2, data2).then((res) => {
      // console.log(res.data.data.banner);
      var _content = res.data.data.banner.content;
         _content = _content.replace('<img', '<img style="max-width:100%;height:auto" ')
      that.setData({
        banner: res.data.data.banner,
        bannerContent:_content,
        title:res.data.data.banner.title
      })
      
    });   
    // 动态获取标题
    wx.setNavigationBarTitle({
      title: that.data.title,    //页面标题
      success: () => { },   //接口调用成功的回调函数
      fail: () => { },      //接口调用失败的回调函数
      complete: () => { }   //接口调用结束的回调函数（调用成功、失败都会执行）
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