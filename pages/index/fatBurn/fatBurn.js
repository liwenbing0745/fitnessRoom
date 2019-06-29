//logs.js
const util = require('../../../utils/util.js')
const app = getApp();
// 引用公共js
var request = require('../../../utils/common.js');
Page({
  data: {
    keId:'',  //从私教页面ID 
     // 广告图
    circular: true,
    autoplay: true,
    vertical: true,
    interval: 3000,
    duration: 500,
    // 图片轮播
    imageUrl:'',
    coachId:'',//教练id
    coachInfo:'',//教练信息
    branchId:'',//门店id
    store:'',//门店信息
  },
  // 获取用户是否登录
  onShow: function() {
    var that = this;   
  },

  onLoad: function(options) {
    console.log(options,'options')
    let that = this;
    let name = options.title;
    let keId = options.courseId;
    if (keId){
      that.setData({
        courseId: keId
      });
    }
    // 动态获取标题
    wx.setNavigationBarTitle({
      title: name,    //页面标题
      success: () => { },   //接口调用成功的回调函数
      fail: () => { },      //接口调用失败的回调函数
      complete: () => { }   //接口调用结束的回调函数（调用成功、失败都会执行）
    })

    // 调取详情
    let url = 'course/findById';
    let data = {id:that.data.courseId};
     request.postRequest(url, data).then((res) =>{
        console.log(res,'123');
        let imgUrl =res.data.data.course.banners.split(',');
        console.log(imgUrl,'url')
        that.setData({
          course:res.data.data.course,
          imageUrl:imgUrl,
          coachId:res.data.data.course.coachId,
          branchId:res.data.data.course.storeId
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
  },

  // 跳转确认订单
  jumpOrderIn: function (e) {
    var that = this;
    // var index = e.currentTarget.dataset.id;
    // 获取新品发布商品列表
    wx.navigateTo({
      url: '../orderInfor/orderInfor?courseId='+that.data.courseId
    })
  },


 
    



})