//logs.js
const util = require('../../../utils/util.js')
//获取应用实例
const app = getApp()
// 引用公共js
var request = require('../../../utils/common.js');
Page({
  data: {
    imageUrl: 'http://aleiaapi.oss-cn-qingdao.aliyuncs.com',
    userId: '',      //用户ID
    //图片  
    Height: 0,
    // tab切换  
    currentTab: 0,
    winWidth: 0,
    winHeight: 0,
    scrollTop: 0,
    num: true,              //判断点击次数
   
    // 分类
    list: [
      { id: '', list: '全部' },
      { id: '1', list: '待付款' },
      { id: '2', list: '待收/取货' },
      { id: '3', list: '已完成' },
    ],
    // 商品
    goods: [
      { id: 0, number: '2432431534', status: '1',shopHome:'深圳市南山区深南分店',image: '../../../image/foods.jpg', name: '配餐', color: 'fds', measure: 'fds', realprice: 'fds', amount: '3',price:'36', paymoney: '123',
      },
      {
        id: 0, number: '2432431534', status: '2', shopHome: '深圳市南山区深南分店', image: '../../../image/foods.jpg', name: '配餐', color: 'fds', measure: 'fds', realprice: 'fds', amount: '3', price: '36', paymoney: '123',
      },
      {
        id: 0, number: '2432431534', status: '3', shopHome: '深圳市南山区深南分店', image: '../../../image/foods.jpg', name: '配餐', color: 'fds', measure: 'fds', realprice: 'fds', amount: '3', price: '36', paymoney: '123',
      },
      {
        id: 0, number: '2432431534', status: '4', shopHome: '深圳市南山区深南分店', image: '../../../image/foods.jpg', name: '配餐', color: 'fds', measure: 'fds', realprice: 'fds', amount: '3', price: '36', paymoney: '123',
      },
    ],
    // 可能喜欢果品
    recommendlist: ''
  },


  // onShow:function(){
  //   let that = this;
    
  // },
  onLoad: function (options) {
    var that = this;
    let status = '';
      that.queryOrderList(status)
  },
  queryOrderList(status){
    let that = this;
    let url = 'order/catering/list/find';
    // 发送请求
    let data = { status: status };
    request.postRequest(url, data).then((res) => {
      console.log(res.data.data.data);
      that.setData({
        goods: res.data.data.data,
        // recommendlist: res.data.data.recommendlist
      })
    })
  },
  // 跳转商品详情
  jumpGoodsDetail: function (e) {
    var activityArea = this.data.activityArea;
    var index = e.currentTarget.dataset.id;
    // var adsUrl = e.currentTarget.dataset.id
    // var id = activityArea[index].id;
    // console.log(index);
    // 获取新品发布商品列表
    var that = this;
    wx.navigateTo({
      url: '../nopayDetail/nopayDetail?id=' + index,
    })

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;
    wx.showToast({
      title: '加载中...',
      icon:'loading',     
    })
    let current = e.currentTarget.dataset.current;
    console.log(current);
    if (current == 0){
      let status = '';
      that.queryOrderList(status)
    } else if (current == 1){
      let status = '1';
      that.queryOrderList(status)
    } else if (current == 2){
      let status = '4';
      that.queryOrderList(status)
    } else if (current == 3) {
      let status = '5';
      that.queryOrderList(status)
    }
    
    if (this.data.currentTab === current) {
      return false;
    } else {
        wx.hideTabBar({})
        that.setData({
          currentTab: current,
        })
    }
  },
  // 确认收货
  confirmGoods:function(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let goods = that.data.goods;
    console.log(goods);
    let url = 'order/receipt/confirm';
    let data = { orderId: id };
    wx.showModal({
      title: '提示',
      content: '确定收货',
      success: function (res) {

        if (res.confirm) {
      
          // 给后台发送请求
          request.postRequest(url, data).then((res) => {
            goods.splice(index, 1);
            that.setData({
              goods: goods
            });
          })
          // console.log('用户点击确定')
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
    
  },
  // 删除功能
  deleteList(e) {
    var that = this;
    let id = e.target.dataset.id;
    let index = e.target.dataset.index;
    let goods = that.data.goods;
    let url = app.globalData.orderUpdate;
  
    let data = { id: id, status: 9 };
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？如若删除当前订单,所使用的购物券将失效！',
      success: function (res) {
        if (res.confirm) {
          request.getRequest(url, data).then((res) => {
            goods.splice(index, 1);
            that.setData({
              goods: goods
            });
          })
          
      
          // console.log('用户点击确定')
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
//取消
  quxiao(e) {
    var that = this;
    let id = e.target.dataset.id;
    let index = e.target.dataset.index;
    let goods = that.data.goods;
    let url = app.globalData.orderUpdate;
    // console.log(goods);
    // console.log(index);
    let data = { id: id, status: 5 };
    wx.showModal({
      title: '提示',
      content: '确定要取消吗？如若取消当前订单,所使用的购物券将失效！',
      success: function (res) {
        if (res.confirm) {
          request.getRequest(url, data).then((res) => {
            goods.splice(index, 1);
            that.setData({
              goods: goods
            });
          })
          // console.log('用户点击确定')
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },


  // 跳转到订单详情页
  // jumpOrderDetail:function(e){
  //   let that = this;
  //   let id = e.currentTarget.dataset.id;
  //   let currentId = e.currentTarget.dataset.index;
  //   // console.log(currentId);
  //   wx.navigateTo({
  //     url: '../orderDetail/orderDetail?id=' + id + '&currentId' + currentId,
  //     success: function(res) {},
  //     fail: function(res) {},
  //     complete: function(res) {},
  //   })
  // },
  // 跳转到添加评价页面
  // jumpEvalu:function(e){
  //   let that = this;
  //   wx.navigateTo({
  //     url: '../myEvaluation/myEvaluation',
  //   })
  // },


  onPayMoney: function (e) {

    let eid=e.currentTarget.dataset.id;
    // console.log(eid);
    let money
    var that = this;
    let num = that.data.num;
    if (num) {
      that.setData({
        num: false
      });
      wx.login({
        success: function (res) {
          wx.showToast({
            title: '加载中',
            icon:'loading',
            success:function(){
              that.getOpenId(res.code, eid);
              
            }
          })
        }
      });
    }
   
  },
  //获取openid
  getOpenId: function (code,eid) {
    var that = this;
    // console.log("code:" + code);
    // 发送请求
    let url = 'common/getOpenId.jhtml';
    let data = { code: code };
    request.postRequest(url, data).then((res) => {
      var openId = res.data.data;
      // console.log("获取openid:" + openId);
      that.xiadan(openId,eid);
    });

  },
  xiadan: function (openId,eid) {
    var that = this;
    // 发送请求

    // console.log(address);
    // console.log(cartArr);
    let url = 'order/updateOrderPay';



    let userId = that.data.userId;
    // console.log(111111111111);
    // console.log(eid);
    
    let orderid = that.data.goods[eid].id;
    let payable = that.data.goods[eid].paymoney;

    let data = {
      openid: openId,
      payable: payable,
      orderid: orderid

    };
    request.postRequest(url, data).then((res) => {
      // var prepay_id = res.data.data.prepay_id;
      // console.log("统一下单返回 prepay_id:" + prepay_id);

      var iii = res.data.data.order.id;
      that.requestPayment(res.data.data.pay, iii);
    });
  },
  //申请支付
  requestPayment: function (obj, iii) {
    let that = this;
    wx.requestPayment({
      'timeStamp': obj.timeStamp,
      'nonceStr': obj.nonceStr,
      'package': obj.package,
      'signType': obj.signType,
      'paySign': obj.paySign,
      'success': function (res) {
        let url = app.globalData.orderUpdate;
        let data = { id: iii, status: 2 };
        request.postRequest(url, data).then((res) => {
          console.log(res.data);
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 1000,
            success: function () { //成功回调
              that.setData({
                num: true
              });
              wx.switchTab({
                url: '../../home/my/my'
              });
            }
          });
        });
      },
      'fail': function (res) {
        wx.showToast({
          title: '支付失败',
          icon: 'none',
          duration: 2000,
          success: function () { //成功回调
            that.setData({
              num: true
            });
          }
        });
      }
    })
  },

})
