//logs.js
const util = require('../../../utils/util.js')
const app = getApp();
// 引用公共js
var request = require('../../../utils/common.js');
var num = 1000//计时  
var strH = ''
var strM = ''
var strS = ''
var timer = ''
Page({
  data: {
    
    // 购物车动画
    chooseSize: false,
    animationData: {},
    // 遮罩层
    showModalStatus: false,

    // 广告内容
    imgUrls: [
      '../../../../image/tc2@2x.png',
      '../../../../image/tc2@2x.png',
      '../../../../image/tc2@2x.png',
      '../../../../image/tc2@2x.png'
    ],
    // 面板显示
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
   
    catering:'',
    // 购买按钮
    show1:true,
  },
  // 获取用户是否登录
  onShow: function () {
    var that = this;
    
  },

  onLoad: function (options) {
    var that = this;
    let id = options.id;
    // 获取每日精选内容
    let url1 = "catering/findById";
    let data1 = { id: id };
    request.postRequest(url1, data1).then((res) => {
      console.log(res.data.data.catering);
      that.setData({
        catering: res.data.data.catering,
        // id: id
      })
    });
    var date = new Date('2019-04-17 09:55:49:123');
    // 有三种方式获取
    var time1 = date.getTime();
    that.ready(time1);
  },
  // 点击拼团购买
  yqBtn:function(){
    // let that = this;
    // console.log(that.data.show1);
    // that.setData({
    //   show1:false
    // }) 拼团的先注释
    wx.navigateTo({
      url: '../order/order',
    })
  },
  // 跳转到订单页面
  jumpOrder:function(){
    wx.navigateTo({
      url: '../order/order',
    })
  },





  // 遮罩层动画
  hideModal: function () {
    // 隐藏遮罩层
    var that = this;
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(500).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseSize: false
      })
    }, 200)
  },
  
  
  chooseSezi: function (e) {
    let index = e.currentTarget.dataset.index;
    // console.log(index);
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 200,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(500).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      chooseSize: true,
      isShop:index
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 100)
  },
  // 开始时间
  ready: function (promotiondate) {
    let that = this;
    // if (product.ispromotion == 2) {
    let time = promotiondate / 1000;
    // console.log(time);
    var totalSecond = time - Date.parse(new Date()) / 1000;
    var interval = setInterval(function () {
      // 秒数
      var second = totalSecond;

      // 天数位
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;

      // 小时位
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位
      var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位
      var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      this.setData({
        countDownDay: dayStr,
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        this.setData({
          dateShow: false,
          dateBtn: 1,
          countDownDay: '00',
          countDownHour: '00',
          countDownMinute: '00',
          countDownSecond: '00',
        });
      }
    }.bind(this), 1000);
  },
  
})
