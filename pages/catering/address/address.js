//index.js
//获取应用实例
const app = getApp()
// 引用公共js
var request = require('../../../utils/common.js');
Page({
  data: {
    imageUrl: 'http://aleiaapi.oss-cn-qingdao.aliyuncs.com',
    // 收货地址
    // address: '',
    only: '',       //判断从下单页面传的id
    address:'',

    // 微信用户ID
    userId: '',
  },
  onLoad: function (options) {
    let that = this;
    // let onlyId = options.only
    // if (onlyId){
    //   this.setData({
    //     only: onlyId
    //   })
    // };
    // 发送请求
    let url = 'address/findByToken';
    let data = {};
    request.postRequest(url, data).then((res) => {
      console.log(res.data.data.address);
      that.setData({
        address: res.data.data.address
      })
    });
    
  },
  onShow:function(){
    var that = this;
    that.onLoad();
    // that.setData({
    //   userId: app.globalData.tokenid
    // })
  },
  chooseSezi(){
    wx.navigateTo({
      url: '../addAddress/addAddress?id=' + 'add',
    })
  },
  // 返回上个页面
  jumpBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  // 绑定微信收货地址
  wxAdderss: function (e) {
    if (wx.chooseAddress) {
      wx.chooseAddress({
        success: function (res) {
        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          // complete
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }

  },

  check: function (e) {

    let that = this
    let id = e.currentTarget.dataset.id
    let memberId = that.data.userId;
    let address = that.data.address;
    let addressId = e.currentTarget.dataset.id;
    let only = that.data.only;     //判断从下单页面传的id
    // console.log("only："+ only);
    // 发送请求
    let url = app.globalData.addressUpdateDefult;
    let data = { id: id, memberid: memberId };

    if (!only) {
      request.getRequest(url, data).then((res) => {
        // console.log('成功');
      });
    } else {
      var pages = getCurrentPages();  
      var currPage = pages[pages.length - 1];
      var prevPage = pages[pages.length - 2];
      // console.log(prevPage);
      for (var i = 0; i < address.length; i++) {
        if (address[i].id == addressId) {
          let addressContent = address[i];
          this.setData({
            address: addressContent
          })
          // console.log(addressContent);
          wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 1000,
          });
          wx.navigateBack({
            url: '../order/order',
          })
        }
      }
    }
  },
  // 编辑
  writeBtn: function (e) {
    let id = e.currentTarget.dataset.id;
    // console.log("当前选择：" + id);
    wx.navigateTo({
      url: '../addAddress/addAddress?id=' + id,
    })
  },

  // 删除功能
  deleteList(e) {
    var that = this;
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.id;
    let address = this.data.address;
    // console.log(index);
    // 发送请求
    let url = 'address/delete';
    let data = { id: id};
    wx.showModal({
      title: '提示',
      content: '确定要删除吗',
      success: function (res) {

        if (res.confirm) {
          address.splice(index, 1);
          request.postRequest(url, data).then((res) => {
            // console.log('成功');
            that.setData({
              address: address
            });
          });
          
          // console.log('用户点击确定')
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },

  // 跳转到shopCar传个ID
  jumpShopCarId: function (e) {
    let that = this;
    let address = that.data.address;
    let addressId = e.currentTarget.dataset.id;
    let only = that.data.only;
    if (only) {
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];
      var prevPage = pages[pages.length - 2];
      for (var i = 0; i < address.length; i++) {
        if (address[i].id == addressId) {
          let addressContent = address[i];
          this.setData({
            address: addressContent
          })
          // console.log(addressContent);
          wx.navigateBack({
            url: '../order/order',
          })
        }
      }
    }

  }

})
