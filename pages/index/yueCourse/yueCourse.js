//logs.js
const util = require('../../../utils/util.js')
const app = getApp();
// 引用公共js
var request = require('../../../utils/common.js');
// pages/home/course/course.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 商品
    goods:'',
    todayDate:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 门店ID
    let mdId = options.id;
    let now  = new Date();
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
      todayDate: month + ':' + day
    })
    // 获取内容
    let url = "course/findByStoreId";
    let data = { storeId: mdId, trainingDate: formatDate };
    request.postRequest(url, data).then((res) => {
      console.log(res.data.data.page);
      that.setData({
        goods: res.data.data.data,
        // id: id
      })
    });
  },
  jumpjlJob: function () {
    wx.navigateTo({
      url: '../../course/jlJob/jlJob',
    })
  },
  jumpFatBurn: function (e) {
    let name = e.currentTarget.dataset.title;
    let courseId = e.currentTarget.dataset.courseid;
    wx.navigateTo({
      url: '../fatBurn/fatBurn?title=' + name+'&courseId='+courseId,
    })
  },
})