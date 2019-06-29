// pages/course/topUp/topUp.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    cjTab:[
      { id: 0, cMoney: '1000', sMoney: '1000' }, { id: 0, cMoney: '500', sMoney: '500' }, { id: 0, cMoney: '300', sMoney: '300' }, { id: 0, cMoney: '100', sMoney: '100' },
    ],
    // 购物车动画
    chooseSize1: false,
    chooseSize2: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  cjTab:function(e){
    let that = this;
    let currentTab = that.data.currentTab;
    let index = e.currentTarget.dataset.index;
    if (currentTab == index){
      return false;
    }else{
      that.setData({
        currentTab:index
      })
    }
  },
  // 遮罩层
  chooseSezi: function (e) {
    // 用that取代this，防止不必要的情况发生
    var that = this;
    let index = e.currentTarget.dataset.index;
    // 用setData改变当前动画
    if (index == 1) { //领卷
      that.setData({
        chooseSize1: true
      })
    } else if (index == 2) {
      that.setData({
        chooseSize2: true
      })
    } else if (index == 3) {
      that.setData({
        chooseSize3: true
      })
    }
  },
  hideModal: function (e) {
    // console.log('错误');
    // 隐藏遮罩层
    var that = this;
    let index = e.currentTarget.dataset.index;
    if (index == 1) {
      that.setData({
        chooseSize1: false,
        areaHd: false
      })
    } else if (index == 2) {
      that.setData({
        chooseSize2: false,
      })
    } else if (index == 3) {
      that.setData({
        chooseSize3: false
      })
    }
  },

})