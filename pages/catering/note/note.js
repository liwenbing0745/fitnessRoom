//index.js
//获取应用实例
const app = getApp()
// 引用公共js
var request = require('../../../utils/common.js');
Page({
  data: {
  },

  onLoad: function() {
    var that = this;
    // let url = "member/my";
    // if (app.globalData.tokenid) {
    //   request.getRequest(url, {}).then((res) => {
    //     let num = 'share[' + 0 + '].num';
    //     that.setData({
    //       [num]: res.data.data.ordercount
    //     });
    //   })
    // }
  },
  onShow: function() {
    
  },
// 跳转到有行
  // jumpYouxing:function(){
  //   wx.switchTab({
  //     url: '../youXing/youXing',
  //   })
  // },
 
  formSubmit(e){
    let remarks = e.detail.value.remarks;
    console.log(remarks)
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      remarks: remarks
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
  }

})