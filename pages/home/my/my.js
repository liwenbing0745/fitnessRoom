//index.js
//获取应用实例
const app = getApp()
// 引用公共js
var request = require('../../../utils/common.js');
Page({
  data: {
    userInfo:'', //获取用户名
    bindStatus:'',
    other: [ {
        url: '../../my/kcNoPayment/kcNoPayment',
        img: '../../../image/gr@2x.png',
        pro: '课程订单'
      }, {
        url: '../../my/NoPayment/NoPayment',
        img: '../../../image/gw@2x.png',
        pro: '配餐订单'
      }, {
        url: '../../my/czAcity/czAcity',
        img: '../../../image/hb@2x.png',
        pro: '钱包充值'
      }, 
      // {
      //   url: '../../my/czAcity/czAcity',
      //   img: '../../../image/cz@2x.png',
      //   pro: '充值优惠'
      // },
       {
        url: '../../catering/address/address',
        img: '../../../image/dz@2x.png',
        pro: '收货地址'
      },
    ],
  },

  onLoad: function() {
    let that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log(res.data,'xinxi')
        // that.setData({
        //   userInfo: res.data
        // })
        // 有缓存才进行操作
        let url = "infoSetting/findByToken";
        let data = {};
        request.postRequest(url, data).then((res) => {
          console.log(res);
          if (res.data.data.info) {
              if (res.data.data.info.phoneNumber) {
                that.setData({
                  bindStatus: true
                })
              } else {
                that.setData({
                  bindStatus: false
                })
              }
          }
        });
      },
      fail:function(res){
        console.log('失败')
        wx.navigateTo({
          url: '../../my/wxLogin/wxLogin',
        })
      }
    });
    
  },
  onShow: function() {
    this.onLoad();
  },
  // 跳转到个人资料
  jumpPerson:function(){
    wx.navigateTo({
      url: '../../my/personInfo/personInfo',
    })
  },
// 拨打电话
  callPhone:function(){
    wx.makePhoneCall({
      phoneNumber: '028-1938532235',
    })
  },

})