//logs.js
const util = require('../../../utils/util.js')
const app = getApp();
// 引用公共js
var request = require('../../../utils/common.js');
Page({
  data: {

    // 购物车动画
    chooseSize1: false,
    // 遮罩层
    showModalStatus1: false,

    camp:'',
    index:0,
    cityArea:'',
    keId:'',  //从私教页面ID 
    goods:'',
    campCourse:'',  //教练课程安排
    timestamp:''  //倒计时

  },
  // 获取用户是否登录
  onShow: function() {
    var that = this;   
  },

  onLoad: function(options) {
    let that = this;
    let name = options.title;
    let keId = options.keId;
    let id = options.id;
    if (keId){
      that.setData({
        keId: keId
      });
    }
    // 获取内容
    let url = "camp/findById";
    let data = {
      id: id
    };
    request.postRequest(url, data).then((res) => {
      // console.log(res.data.data.campCourse);
      that.setData({
        camp: res.data.data.camp,
        goods: res.data.data.campCourse,
        cityArea: res.data.data.cityArea
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
  jumpOrderIn: function (e) {
    var that = this;
    // var index = e.currentTarget.dataset.id;
    // 获取新品发布商品列表
    wx.navigateTo({
      url: '../orderInfor/orderInfor'
    })
  },

  // 选择地区
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
 

  // 遮罩层
  chooseSezi: function (e) {
    // 用that取代this，防止不必要的情况发生
    var that = this;
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    // 用setData改变当前动画
    if (index == 1) { //领卷
      that.setData({
        chooseSize1: true
      })
    };
    // 获取内容
    let url = "camp/findByCampCourseId";
    let data = {
      id: id
    };
    request.postRequest(url, data).then((res) => {
      console.log(res.data.data);
      that.setData({
        campCourse: res.data.data.campCourse,
        timestamp: res.data.data.timestamp
      })
    }); 
  },
  hideModal: function (e) {
    // console.log('错误');
    // 隐藏遮罩层
    var that = this;
    let index = e.currentTarget.dataset.index;
    if (index == 1) {
      that.setData({
        chooseSize1: false,
      })
    }
  },  

  // 跳转到
  jumpjlJob: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../jlJob/jlJob?id='+ id,
    })
  }

})