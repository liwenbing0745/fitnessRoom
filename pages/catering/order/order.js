// pages/home/lx/lx.js
// pages/home/lx/lx.js
const util = require('../../../utils/util.js')
const app = getApp();
// 引用公共js
var request = require('../../../utils/common.js');
const hours = [];
const minutes = [];
//获取小时
for (let i = 0; i < 24; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  hours.push("" + i);
}
//获取分钟
for (let i = 0; i < 60; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  minutes.push("" + i);
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: '',
    hours,
    hour: '02',
    minutes,
    minute: '00',

    // 时间/支付切换
    tabIndex: '',
    // tab切换  
    currentTab: 0,
    currentTab1: 0, //性别
    currentTab2: 0, //品类
    currentTab3: 0, //时间
    currentTab4: 0, //品类1
    promoteprice: 1, //数量
    color: 0,
    num: true,              //判断点击次数
    // 购物车动画
    chooseSize: false,
    animationData: {},
    // 遮罩层
    showModalStatus: false,



    items: [
      {
        name: 'wx',
        value: '微信支付',
      },
      {
        name: 'ye',
        value: '余额支付',
        
      },
    ],
    // 分类
    list: [
      {
        id: '0',
        list: '外卖配送',
        num: '0'
      },
      {
        id: '1',
        list: '到店自取',
        num: '0'
      }
    ],

    // 每日精选
    content: '',
    allTotal1:'',
    packagingFee: '',//包装费
    shippingFee: '',//配送费
    totalAmount: null,//总支付费用
    remarks:'',  //备注


    // 套餐专区
    sex: [{
      id: '0',
      sex: '男',
    }, {
      id: '1',
      sex: '女'
    }],
    ptype: [
      {
      id: '0',
      ptype: '健身',
    }, {
      id: '1',
      ptype: '减脂'
    }, {
      id: '2',
      ptype: '营养'
    }, ],
    time: [{
      id: '0',
      time: '周餐',
    }, {
      id: '1',
      time: '月餐'
    }],
    ptype1: [{
      id: '0',
      ptype1: '午餐',
    }, {
      id: '1',
      ptype1: '晚餐'
    }],
    packageA: [{
      id: '0',
      img: '../../../image/foods.jpg',
      title: '型男必备套餐A',
      label1: '男',
      label2: '营养',
      label3: '周餐',
      label4: '晚餐',
      price: '36',
      num: '20'
    }, {
      id: '0',
      img: '../../../image/foods.jpg',
      title: '型男必备套餐A',
      label1: '男',
      label2: '营养',
      label3: '周餐',
      label4: '晚餐',
      price: '36',
      num: '20'
    }, {
      id: '0',
      img: '../../../image/foods.jpg',
      title: '型男必备套餐A',
      label1: '男',
      label2: '营养',
      label3: '周餐',
      label4: '晚餐',
      price: '36',
      num: '20'
    }, ],
    // 收货地址
    address: [],
    payType:'',
    tel:'',  //电话号码
    store:'',  //门店
    infoSettingId:''  //用户ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.getStorage({
      key: 'userInfo',
      fail:function(res){
        console.log('失败')
        wx.navigateTo({
          url: '../../my/wxLogin/wxLogin',
        })
      }
    })
    let content = app.globalData.content
    console.log(content,'content')

    let packagingFee = 0
    let shippingFee = 0
    let totalAmount = 0

    for (let i = 0;i < content.length; i++) {
      packagingFee += content[i]['packagingFee']
      shippingFee += content[i]['shippingFee']
    }
    totalAmount = parseFloat(packagingFee) + parseFloat(shippingFee) + parseFloat(options.allTotal)
    that.setData({
      content: app.globalData.content,
      allTotal1:options.allTotal,
      shippingFee: shippingFee,
      packagingFee: packagingFee,
      totalAmount: totalAmount
    })
    // 获取每日精选内容
    let url = "store/findById";
    console.log(content[0].storeId,' content[0].storeId')
    let data = {
      id: content[0].storeId
    };
    request.postRequest(url, data).then((res) => {
      console.log(res.data.data);
      that.setData({
        store: res.data.data.store,
        // id: id
      })
    });
    // 获取ID
    let url1 = "infoSetting/findByToken";
    let data1 = {
    };
    request.postRequest(url1, data1).then((res) => {
      console.log(res.data.data.info);
      if (res.data.data.info){
        that.setData({
          infoSettingId: res.data.data.info.id,
          tel: res.data.data.info.phoneNumber
        })
      }
    });
    
  },
  onShow: function () {
    let that = this
    // 获取用户地址
    let addressUrl = "address/findByToken"
    request.postRequest(addressUrl, {}).then((res) => {
      console.log(res.data.data.address)
      that.setData({
        address: res.data.data.address
      })
    })
  },
  // 跳转到地址列表
  jumpAddress: function() {
    
    let address = this.data.address;
    if (address) {

      let userInfo = app.globalData.wxuser;
      //if (userInfo) {
        wx.navigateTo({
          url: '../address/address?only=1',
        })
      // } else {
      //   wx.navigateTo({
      //     url: '../../my/addAddress1/addAddress1?only=1', //&userId=' + this.data.userId
      //   })
      // }
    } else {
      wx.navigateTo({
        url: '../address/address?only=1', //&userId=' + this.data.userId
      })
    }
  },
  // 跳转到自取地址
  jumpZqAddress: function() {
    wx.navigateTo({
      url: '../zqAddress/zqAddress',
    })
  },
  // 时间选择器
  bindTimeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  // 绑定时间
  bindChange(e) {
    const val = e.detail.value
    console.log(val);
    this.setData({
      hour: this.data.hours[val[0]],
      minute: this.data.minutes[val[1]]
    })
  },
  // 单选
  radioChange(e) {
    let that = this;
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    that.setData({
      payType: e.detail.value
    })
    
  },

// 余额支付
  payRequest() {
    let that = this;
    let infoSettingId = that.data.infoSettingId;  //用户ID
    let content = that.data.content;  //商品信息
    let store = that.data.store;  //门店信息
    let deliveryTime = util.getNowFormatDate()
    let hour = that.data.hour;
    let item = [];
    let aJson ={};
    let dispatchMoney;
    for(let i = 0;i<content.length;i++){
      dispatchMoney = content[i].packagingFee++;
      aJson.cateringId = content[i].id;
      aJson.num = content[i].goodsNum;
      aJson.detailId = '';
      item.push(aJson);
    }
    console.log(item);

    let url = "https://www.dongjingfit.com/order/catering/prepare/pay";
    let data = {
      storeId: store.id,
      storeName: store.storeName,
      shippingMethod: that.data.currentTab+1,
      deliveryTime: deliveryTime,
      discountsMoney: that.data.currentTab == 1 ? 0 : that.data.shippingFee,
      dispatchMoney: that.data.packagingFee,
      payMethod:2, 
      groupBooking: 2,
      items: item,
       groupId:'' ,
       userId: '',
      infoSettingId: infoSettingId,
       orderId: '',
      remarks: that.data.remarks
    };
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'token': app.globalData.tokenid,
      },
      success: function (res) {//服务器返回数据
        if (res.data.data.data){
          wx.showToast({
            icon: 'success',
            title: '支付成功',
            duration: 3000,
            success:function(){
              wx.switchTab({
                url: '../../home/my/my',
              })
            }
          })
        }else{
          wx.showToast({
            icon: 'none',
            title: res.data.tooltips,
          })
        }
      },
      error: function (e) {
        reject('网络出错');
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none',
          duration: 3000,
        });
      }
    })
  },

// 微信支付
  onPayMoney3: function() {
    var that = this;
    let num = that.data.num;
    let infoSettingId = that.data.infoSettingId;  //用户ID
    let content = that.data.content;  //商品信息
    let store = that.data.store;  //门店信息
    let deliveryTime = util.getNowFormatDate()

    let hour = that.data.hour;
    let item = [];
    let aJson = {};
    let dispatchMoney;
    for (let i = 0; i < content.length; i++) {
      dispatchMoney = content[i].packagingFee++;
      aJson.cateringId = content[i].id;
      aJson.num = content[i].goodsNum;
      aJson.detailId = '';
      item.push(aJson);
    }
    if (num) {
      that.setData({
        num: false
      })
      let url = "https://www.dongjingfit.com/order/catering/prepare/pay";
      let data = {
        storeId: store.id,
        storeName: store.storeName,
        shippingMethod: parseInt(that.data.currentTab) + 1,
        deliveryTime: deliveryTime,
        discountsMoney: that.data.currentTab == 1 ? 0 : that.data.shippingFee,
        dispatchMoney: that.data.packagingFee,
        payMethod: 1,
        groupBooking: 2,
        items: item,
        groupId: '',
        userId: '',
        infoSettingId: infoSettingId,
        orderId: '',
        remarks: that.data.remarks
      };
      wx.request({
        url: url,
        data: data,
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'token': app.globalData.tokenid,
        },
        success: function (res) {//服务器返回数据
          if (res.data.data.data) {
            that.requestPayment(res.data.data.data);
          }else {
            that.setData({
              num: false
            })
            wx.showToast({
              icon: 'none',
              title: res.data.tooltips,
            })
          }
          
          // wx.showToast({
          //   icon: 'none',
          //   title: res.data.tooltips,
          // })
        },
        error: function (e) {
          reject('网络出错');
          wx.showToast({
            title: '网络错误，请重试',
            icon: 'none',
            duration: 3000,
          });
        }
      })
    }
  },
  //申请支付
  requestPayment: function(obj) {
    let that = this;
    wx.requestPayment({
      'timeStamp': obj.timeStamp,
      'nonceStr': obj.nonceStr,
      'package': obj.package,
      'signType': obj.signType,
      'paySign': obj.sign,
      'success': function(res) {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000,
          success: function() { //成功回调
            wx.navigateBack({
              delta: 1
            })
          }
        })
      },
      'fail': function(res) {
        wx.showToast({
          title: '支付失败',
          icon: 'none',
          duration: 2000,
          success: function() { //成功回调
            that.setData({
              num: true
            });
          }
        });
      }
    })
  },

  // 跳转到手机页
  jumpTel: function() {
    wx.navigateTo({
      url: '../tel/tel?orderTel='+0,
    })
  },
  // 跳转到备注页
  jumpNote: function() {
    wx.navigateTo({
      url: '../note/note',
    })
  },
  // 关闭弹窗
  hideBtn: function() {

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function(e) {

    var that = this
    let totalAmount = this.data.totalAmount
    if (e.currentTarget.dataset.current == 0) {
      totalAmount = parseFloat(this.data.packagingFee) + parseFloat(this.data.allTotal1) + parseFloat(this.data.shippingFee)
    } else {
      totalAmount = parseFloat(this.data.packagingFee) + parseFloat(this.data.allTotal1)
    }
    
    that.setData({
      currentTab: e.currentTarget.dataset.current,
      totalAmount: totalAmount
    })
  },
  // 性别
  swichSex: function(e) {
    var that = this;
    let current = e.currentTarget.dataset.current1;
    that.setData({
      currentTab1: current
    })
  },
  // 品类
  swichType: function(e) {
    var that = this;
    let current = e.currentTarget.dataset.current2;
    that.setData({
      currentTab2: current
    })
  },
  // 时间
  swichTime: function(e) {
    var that = this;
    let current = e.currentTarget.dataset.current3;
    that.setData({
      currentTab3: current
    })
  },
  // 品类
  swichType1: function(e) {
    var that = this;
    let current = e.currentTarget.dataset.current4;
    that.setData({
      currentTab4: current
    })
  },
  // 遮罩层动画
  hideModal: function() {
    // 隐藏遮罩层
    var that = this;
    var animation = wx.createAnimation({
      duration: 0,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(500).step()
    that.setData({
      animationData: animation.export()
    });
    if (this.data.tabIndex == 2) {
      if (that.data.payType == 'wx') { //微信支付
        that.onPayMoney3();
      } else {//余额支付
        that.payRequest();
      }
    }
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseSize: false
      })
    }, 0)
  },
  chooseSezi: function(e) {
    var that = this;
    let index = e.currentTarget.dataset.index;
    if (index == 2) {
      if (this.data.address.length == 0){
        wx.showToast({
          icon: 'none',
          title: '请先选择地址',
          duration: 2000,
        })
        return false
      }
    }
    // console.log(index);
    that.setData({
      tabIndex: index
    });
    // 用that取代this，防止不必要的情况发生
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 0,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(0).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      chooseSize: true,
      isShop: index
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 0)
  },
})