//logs.js
const util = require('../../../utils/util.js')
const app = getApp();
// 引用公共js
var request = require('../../../utils/common.js');
Page({
  data: {
    currentTab1: 0,
    people: [{ id: '0', people: '1' }, { id: '1', people: '2' }, { id: '2', people: '3' }],
    items: [{
        name: 'wx',
        value: '微信支付',
      },
      {
        name: 'ye',
        value: '余额支付',
        
      },
    ],//支付方式
    click:true,
    coachInfo:'',//教练信息
    branchId:'',//门店id
    store:'',//门店信息
    storeName: '',//门店简称
    course:'',
    courseId: '',//课程id
    payPrice:'',//需支付金额
    isPaying: true
  },
  // 获取用户是否登录
  onShow: function() {
    var that = this;   
  },
  
  onLoad: function(options) {
    var that = this;
      that.setData({
       courseId:options.courseId
     })
     
     // 调取课程详情
     let url = 'course/findById';
     let data = {id:that.data.courseId};

     request.postRequest(url, data).then((res) =>{
         that.setData({
           course:res.data.data.course,
           branchId:res.data.data.course.storeId,
           coachId:res.data.data.course.coachId,
           payPrice:res.data.data.course.price,
           danprice:res.data.data.course.price
         })
         
         // 调取教练信息
        let coachUrl = 'coach/findById';
        let coachDate = {id:that.data.coachId};
        request.postRequest(coachUrl,coachDate).then((res1)=>{
          that.setData({
              coachInfo:res1.data.data.coach
            })
            console.log(res1,'教练信息')
        })
        // 调取门店信息
        let branchUrl = 'store/findById';
        let branchData = {id:that.data.branchId};
        request.postRequest(branchUrl,branchData).then((branchRes)=>{
             console.log(branchRes,'门店信息')
             that.setData({
               store:branchRes.data.data.store
             })
        })
     })
     wx.getStorage({
      key: 'userInfo',
      fail:function(res){
        wx.navigateTo({
          url: '../../my/wxLogin/wxLogin',
        })
      }
    })
  },

  // 跳转商品详情
  // goodsJump: function(e) {
  //   var that = this;
  //   var index = e.currentTarget.dataset.id;
  //   // 获取新品发布商品列表
  //   wx.navigateTo({
  //     url: '../../index/goodsDetail/goodsDetail?id=' + index,
  //   })
  // },
    // 遮罩层动画
  hideModal: function() {
    // 隐藏遮罩层
    var that = this;
    that.setData({
      click:true
    })
    var animation = wx.createAnimation({
      duration: 0,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(500).step()
    that.setData({
      animationData: animation.export()
    });
    if (that.data.payType == 'wx') { //微信支付
      that.onPayMoney();
    } else {//余额支付
      that.payRequest();
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
    that.setData({
      click:false
    })
    // console.log(index);
    
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
      chooseSize: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 0)
  },

  swichNav1: function (e) {
    var that = this;
    let current = e.currentTarget.dataset.current;
    console.log(current,'current');
    that.setData({
      currentTab1: e.currentTarget.dataset.current
    })
    that.setData({
       payPrice:that.data.danprice*(parseInt(current)+1)
    })

  },
  // 跳转到充值页面
  jumpTopUp:function(){
    wx.navigateTo({
      url: '../../course/topUp/topUp',
    })
  },

  // 余额支付
  payRequest() {
    let that = this;
    let url = "https://www.dongjingfit.com/order/course/book";
    let data = {
      orderId: orderId,
      courseId: courseId,
      peopleNum: peopleNum,
      remarks: remarks,
      storeId: storeId,
      storeName: storeName,
      userId: userId,
      payMethod: 2
    }
    if (!this.data.isPaying) {return false}
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
          })
          wx.navigateBack({
            delta: 1
          })
        }else{
          wx.showToast({
            icon: 'none',
            title: res.data.tooltips,
          })
        }
        that.setData({
          isPaying: true
        })
      },
      error: function (e) {
        that.setData({
          isPaying: true
        })
        reject('网络出错');
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none',
          duration: 3000,
        });
      }
    })
  },


})