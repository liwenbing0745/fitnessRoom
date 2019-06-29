//logs.js
const util = require('../../../utils/util.js')
const app = getApp();
// 引用公共js
var request = require('../../../utils/common.js');
Page({
  data: {
    store:'',
    mdId: ''
  },
  // 获取用户是否登录
  onShow: function() {
    var that = this;   
  },

  onLoad: function(options) {
    console.log(options,'options')
    let id = options.id;
    let name = options.name;
    var that = this;
    that.setData({
      mdId: id
    })
    // 获取内容
    let url = "store/findById";
    let data = { id: id };
    request.postRequest(url, data).then((res) => {
      // console.log(res.data.data);
      that.setData({
        store: res.data.data.store,
      })
    });

    // 动态获取标题
    wx.setNavigationBarTitle({
      title: name,    //页面标题
      success: () => { },   //接口调用成功的回调函数
      fail: () => { },      //接口调用失败的回调函数
      complete: () => { }   //接口调用结束的回调函数（调用成功、失败都会执行）
    })
  },

  // 跳转确认订单
  jumpOrderIn: function(e) {
    var that = this;
    var mdId = that.data.mdId;
    // console.log(mdId);
    // var index = e.currentTarget.dataset.id;
    // 获取新品发布商品列表
    wx.navigateTo({
      url: '../yueCourse/yueCourse?id=' + mdId
    })
  },

// 打开地图
openMap:function(){
  let that = this;
  let store = that.data.store;
  const latitude = parseInt(store.latitude);
  const longitude = parseInt(store.longitude);
  // wx.getLocation({
  //   type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
  //   success(res) {
  //     const latitude = res.latitude
  //     const longitude = res.longitude
      
  //   }
  // })
  wx.openLocation({
    latitude,
    longitude,
    scale: 18
  })
}
 
    



})