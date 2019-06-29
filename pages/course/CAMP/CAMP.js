// pages/course/CAMP/CAMP.js
const util = require('../../../utils/util.js')
const app = getApp();
// 引用公共js
var request = require('../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cjTab: '',
    // 购物车动画
    chooseSize1: false,
    chooseSize2: false,
    // tab切换  
    currentTab: 0,
    currentTab1: 0,
    currentTab2: 0,
    // 分类
    conList: '',   //内容
    city: '',    //市
    area: '',   //区域
    storeSubject: '',   //全部
    timeList:'',
    defautCity:null,
    defautCityId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    
    
    // 获取市
    let url2 = "index/load";
    let data2 = {};
    request.postRequest(url2, data2).then((res) => {
      console.log(res,'内容');
      that.setData({
        city: res.data.data.cityArea,  //市
      })
      
      // 判断是否有定位
      wx.getStorage({
        key: 'defautCity',
        success (res) {
          console.log(res)
          that.setData({
            defautCity:res.data,
          })
          that.data.city.forEach(function(v,i){
             if (v.areaName == that.data.defautCity) {
                  that.setData({
                    defautCityId:v.id
                  })                    
             }
          })
          // 获取列表
          let url = "camp/list";
          let data = {
            cityAreaId: that.data.defautCityId
          };
          request.postRequest(url, data).then((res) => {
            console.log(res,'CAMP列表');
            that.setData({
              cjTab: res.data.data.page.content,
              // id: id
            })
          });

        },fail(){
            
        }
      })

  });


    // 获取全部标签
    let url3 = "label/load";
    let data3 = {
    };
    request.postRequest(url3, data3).then((res) => {
      // console.log(res,'las');
      that.setData({
        timeList: res.data.data.labels
      })
    });
  },
  // 全部时段
  swichTabTime: function (e) {
    var that = this;
    let current = e.currentTarget.dataset.current;
    let id = e.currentTarget.dataset.id;
    let timeList = that.data.timeList;
    let a = 'timeList[' + current + '].selected';
    let c = 'timeList[' + 0 + '].selected';
    if (current == 0) {
      for (let i = 0; i < timeList.length; i++) {
        let b = 'timeList[' + i + '].selected';
        that.setData({
          [b]: 0,
          [c]: 1
        })
      }
    } else {
      if (timeList[current].selected == 1) {
        that.setData({
          [a]: 0,
          [c]: 0
        })
      } else {
        that.setData({
          [a]: 1,
          [c]: 0
        })
      }
    }
  },
  // 全部时段确认按钮
  requestTimeBtn: function () {
    let that = this;
    let timeList = that.data.timeList;
    console.log(timeList);
    let a = [];
    for (let i = 0; i < timeList.length; i++) {
      if (timeList[i].selected == 1) {
        a.push(timeList[i].id)
      }
    }
    console.log(a);
    let url = "camp/list";
    let data = {
      labels: a,
    };
    request.postRequest(url, data).then((res) => {
      console.log(res.data.data.page.content);
      wx.showToast({
        icon: 'loading',
        title: '加载中...',
        success: function () {
          that.setData({
            chooseSize2: false,
            cjTab: res.data.data.page.content, //内容
          })
        }
      })
    });
  },
  // 跳转到CAMP详情页
  jumpCAdetail:function(e){
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title
    console.log(id);
    wx.navigateTo({
      url: '../CAMPdetial/CAMPdetial?id=' + id +'&title=' + title,
    })
  },
  /** 
      * 点击tab切换 
      */
  // 市
  swichNav: function (e) {
    var that = this;
    let current = e.currentTarget.dataset.current;
    let areaCode = e.currentTarget.dataset.id;
    let cityAreaId = e.currentTarget.dataset.cityId;
    // console.log(areaCode);
    that.setData({
      currentTab: e.currentTarget.dataset.current,
      defautCity:null
    })
    // // 获取区
    let url2 = "cityArea/findByParentCode";
    let data2 = { parentCode: areaCode };
    request.postRequest(url2, data2).then((res) => {
      console.log(res.data.data.data);
      that.setData({
        areaHd: true,
        area: res.data.data.data,
      })
    });
  },
  // 区
  swichNav1: function (e) {
    var that = this;
    let current = e.currentTarget.dataset.current;
    let id = e.currentTarget.dataset.id;
    that.setData({
      currentTab1: e.currentTarget.dataset.current,
      chooseSize1: false,
      areaHd: false
    })
    // 获取内容
    let url = "camp/list";
    let data = { cityAreaId: id };
    request.postRequest(url, data).then((res) => {
      // console.log(res.data.data);
      wx.showToast({
        icon: 'loading',
        title: '加载中...',
        success: function () {
          that.setData({
            cjTab: res.data.data.page.content,  //内容
          })
        }
      })
    });
    // console.log(current);

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