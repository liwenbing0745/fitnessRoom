//index.js
//获取应用实例
const app = getApp()
// 引用公共js
var request = require('../../../utils/common.js');
Page({
  data: {
    formData:'',
    changeInfo:'',
    orderTel:''
  },

  onLoad: function(options) {
    var that = this;
    let orderTel = options.orderTel;
    that.setData({
      orderTel: orderTel
    });
    let url = "infoSetting/findByToken";
    let data = {};
    request.postRequest(url, data).then((res) => {
      // console.log(res.data.data.data);
      if (res.data.data.info) {
        that.setData({
          changeInfo: true,
          formData: res.data.data.info,
        })
      } else {
        that.setData({
          changeInfo: false
        })
      }
    });
  },
  onShow: function() {
    
  },
  formSubmit: function (e) {
    let orderTel = this.data.orderTel;
    let formData = this.data.formData;
    let id;
    let data;
    if (orderTel == 0){
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];
      var prevPage = pages[pages.length - 2];
      prevPage.setData({
        tel: e.detail.value.phoneNumber
      })
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 1000,
        success: function () {
          wx.navigateBack({
            url: '../order/order',
          })
        }
      });
    }else{

      // console.log(date);
      if (formData) {
        id = formData.id;
        data = {
          id: id,
          phoneNumber: e.detail.value.phoneNumber
        };
      } else {
        data = {
          phoneNumber: e.detail.value.phoneNumber
        };
      }
      let url = "infoSetting/add";

      request.postRequest(url, data).then((res) => {
        // console.log(res.data.data.data);
        wx.showToast({
          icon: 'success',
          title: '添加成功',
          success: function () {
            wx.switchTab({
              url: '../../home/my/my',
            })
          }
        })

      });
    }
    
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },

})