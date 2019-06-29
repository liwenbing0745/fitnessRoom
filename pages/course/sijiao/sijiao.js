// pages/course/sijiao/sijiao.js
const util = require('../../../utils/util.js')
const app = getApp();
// 引用公共js
var request = require('../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tab切换  
    currentTab: 0,
    currentTab1: 0,
    currentTab2: 0,
    areaHd: false,
    // 购物车动画
    chooseSize1: false,
    chooseSize2: false,
    chooseSize3: false,
    chooseSize4: false,
    // 遮罩层
    showModalStatus1: false,
    showModalStatus2: false,
    showModalStatus3: false,
    showModalStatus4: false,
    city: '',    //市
    area: '',   //区域
    storeSubject: '', //门店
    todayDate: '',  //今天时间
    kecheng: '', //筛选课程目的
    kecheng2: '',
    goods:'',
    defautCity:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'ooo')
    let that = this;
    // 获取时间
    let time = util.formatDate(new Date());
    let date = util.getDates(7, time);
    // console.log(date);
    that.setData({
      date: date
    });
    that.area();  //请求市区
    // 门店ID
    let mdId = options.id;
    let now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if (month < 10) {
      month = '0' + month;
    };
    if (day < 10) {
      day = '0' + day;
    };
    var formatDate = year + '-' + month + '-' + day;
    that.setData({
      todayDate: formatDate
    })
    // 获取内容
    // let url = "course/findByStoreId";
    // let data = {
    //   trainingDate: formatDate
    // };
    // request.postRequest(url, data).then((res) => {
    //   console.log(res,'获取内容');
    //   that.setData({
    //     goods: res.data.data.data,
    //     // id: id
    //   })
    // });
    // 获取课程目的
    let url1 = "course/tag";
    let data1 = {};
    request.postRequest(url1, data1).then((res) => {
      console.log(res,'获取课程目的');
      that.setData({
        kecheng: res.data.data.data,
        // id: id
      })
    });
    // 获取私教内容
    let url2 = "course/findByPrivate";
    let data2 = {};
    request.postRequest(url2, data2).then((res) => {
      console.log(res,'获取私教内容');
      that.setData({
        goods: res.data.data.data,
        // id: id
      })
    });
  },
  // 请求市区
  area: function () {
    let that = this;
    // 获取内容
    let url = "cityArea/findByParentCode";
    let data = {};
    request.postRequest(url, data).then((res) => {
      // console.log(res.data.data);
      that.setData({
        city: res.data.data.data,  //市
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
      // 获取内容
      let url1 = "store/list";
      let data1 = {
        cityAreald: that.data.defautCityId
      };
      request.postRequest(url1, data1).then((res) => {
        // console.log(res.data.data.page.content);
        that.setData({
          storeSubject: res.data.data.page.content, //市
        })
      });
        
      },fail(){
          
      }
    })
    });


    
  },

  // 筛选全城确认按钮
  allSelectBtn: function () {
    let that = this;
    let storeSubject = that.data.storeSubject;
    let todayDate = that.data.todayDate;
    var a = [];
    for (let i = 0; i < storeSubject.length; i++) {
      if (storeSubject[i].selected == 1) {
        a.push(storeSubject[i].id);
      }
    }
    // console.log(a);
    // 获取内容
    let url = "course/findByStoreId";
    let data = {
      trainingDate: todayDate,
      storeId: a
    };
    request.postRequest(url, data).then((res) => {
      // console.log(res.data.data.data);
      wx.showToast({
        icon: 'loading',
        title: '加载中...',
        success: function () {
          that.setData({
            chooseSize1: false,
            areaHd: false,
            goods: res.data.data.data
          })
        }
      })
    });
  },
  // 课程确认按钮
  kechengBtn: function () {
    let that = this;
    let kecheng2 = that.data.kecheng2;
    let todayDate = that.data.todayDate;
    let a = [];
    for (let i = 0; i < kecheng2.length; i++) {
      if (kecheng2[i].selected == 1) {
        a.push(kecheng2[i].id)
      }
    };
    let url = "course/findByStoreId";
    let data = { courseId: a, trainingDate: todayDate };
    request.postRequest(url, data).then((res) => {
      // console.log(res.data.data);
      wx.showToast({
        icon: 'loading',
        title: '加载中...',
        success: function () {
          that.setData({
            chooseSize2: false,
            goods: res.data.data.data,  //内容
          })
        }
      })
    });
  },
  // 市
  swichNav: function (e) {
    var that = this;
    let current = e.currentTarget.dataset.current;
    let areaCode = e.currentTarget.dataset.id;
    let areaId = e.currentTarget.dataset.areaid;//城市id
    // console.log(areaCode);
    that.setData({
      currentTab: e.currentTarget.dataset.current
    })
    // // 获取区
    let url2 = "cityArea/findByParentCode";
    let data2 = { parentCode: areaCode };
    request.postRequest(url2, data2).then((res) => {
      // console.log(res.data.data.data);
      that.setData({
        areaHd: true,
        area: res.data.data.data,
      })
    });
    // 获取门店
    let storeUrl = 'store/list';
    let storeDate = {cityAreald:areaId};
    request.postRequest(storeUrl,storeDate).then((res)=>{
       that.setData({
          storeSubject: res.data.data.page.content, //市
        })
    })
    that.setData({
      defautCity:null
    })
  },
  // 区
  swichNav1: function (e) {
    var that = this;
    let current = e.currentTarget.dataset.current;
    let id = e.currentTarget.dataset.id;
    that.setData({
      currentTab1: e.currentTarget.dataset.current,
    })

    // console.log(current);
  },
  // 店名
  swichNav2: function (e) {
    var that = this;
    let current = e.currentTarget.dataset.current;
    let id = e.currentTarget.dataset.id;
    let storeSubject = that.data.storeSubject;
    let a = 'storeSubject[' + current + '].selected';
    if (storeSubject[current].selected == 1) {
      that.setData({
        [a]: 0,
      })
    } else {
      that.setData({
        [a]: 1,
      })
    }
  },
  // 课程目的
  shTabKecheng: function (e) {
    var that = this;
    let current = e.currentTarget.dataset.current;
    let id = e.currentTarget.dataset.id;
    let kecheng = that.data.kecheng;
    let a = 'kecheng[' + current + '].selected';
    // console.log(current);
    let b = [];

    if (kecheng[current].selected == 1) {
      that.setData({
        [a]: 0,
      });
      for (let i = 0; i < kecheng.length; i++) {
        if (kecheng[i].selected == 1) {
          b.push(kecheng[i].id);
        }
      }
      // 获取内容
      let url = "course/findByTag";
      let data = { tags: b };
      request.postRequest(url, data).then((res) => {
        // console.log(res.data.data);
        that.setData({
          kecheng2: res.data.data.data,  //内容
        })
      });
    } else {
      that.setData({
        [a]: 1,
      });
      for (let i = 0; i < kecheng.length; i++) {
        if (kecheng[i].selected == 1) {
          b.push(kecheng[i].id);
        }
      }
      // 获取内容
      let url = "course/findByTag";
      let data = { tags: b };
      request.postRequest(url, data).then((res) => {
        // console.log(res.data.data);
        that.setData({
          kecheng2: res.data.data.data,  //内容
        })
      });
    };
  },
  // 课程全部
  swTabKeAll: function (e) {
    var that = this;
    let current = e.currentTarget.dataset.current;
    let id = e.currentTarget.dataset.id;
    let kecheng2 = that.data.kecheng2;
    let a = 'kecheng2[' + current + '].selected';
    if (kecheng2[current].selected == 1) {
      that.setData({
        [a]: 0,
      })
    } else {
      that.setData({
        [a]: 1,
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

  // 跳转到
  jumpjlJob: function () {
    wx.navigateTo({
      url: '../jlJob/jlJob',
    })
  },
  // 跳转到急速燃脂
  jumpfatBurn: function (e) {
    let name = e.currentTarget.dataset.title;
    let courseId = e.currentTarget.dataset.courseid;
    wx.navigateTo({
      url: '../../index/fatBurn/fatBurn?title=' + name +'&courseId='+courseId,
    })
  },
})