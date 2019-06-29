//index.js 
//index.js
// 引入SDK核心类 
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
 
// 实例化API核心类
var qqmapsdk = new QQMapWX({
    key: 'PLNBZ-HSH6P-B6CDA-VG2ZA-USAH5-NCBOV' // 必填
});
//获取应用实例
const app = getApp()
// 自定义轮播
// 引用公共js
var request = require('../../../utils/common.js');
Page({
  data: {
    show:true,
    // tab切换  
    currentTab: 0,
    currentTab1: 0,
    currentTab2:0,
    areaHd:false,
    // 购物车动画
    chooseSize1: false,
    chooseSize2: false,
    // 遮罩层
    showModalStatus1: false,
    showModalStatus2: false,

    // 广告图
    imgUrls: '',
    circular: true,
    autoplay: true,
    vertical: true,
    interval: 3000,
    duration: 500,
    // 图片轮播
    imageUrl:'',
    // 分类
    conList: '',   //内容
    city: '',    //市
    area: '',   //区域
    storeSubject:'',   //全部
    defautCity:null,//默认城市
    defautCityId: null
  },

 
  onShow: function() {
    var that = this;
  },
  onLoad: function(option) {
    var that = this;
   
   // 判断是否有定位
    wx.getStorage({
      key: 'defautCity',
      success (res) {
        console.log(res)
        that.setData({
          defautCity:res.data,
        })
        that.login();
      },
      fail(){
         // 获取定位
          wx.getLocation({
            type: 'wgs84',
            success: function (res) {
              console.log(res)
              var latitude = res.latitude;
              var longitude = res.longitude;



              qqmapsdk.reverseGeocoder({
            //位置坐标，默认获取当前位置，非必须参数
            /**
             * 
             //Object格式
              location: {
                latitude: 39.984060,
                longitude: 116.307520
              },
            */
            /**
             *
             //String格式
              location: '39.984060,116.307520',
            */
            location: {
                latitude: latitude,
                longitude: longitude
            },
            //get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
            success: function(res) {//成功后的回调
              console.log(res);
              var res = res.result;
              var mks = [];
               that.setData({
                 defautCity:res.address_component.city
              })
               wx.setStorage({
                key:"defautCity",
                data:res.address_component.city
              })
              /**
               *  当get_poi为1时，检索当前位置或者location周边poi数据并在地图显示，可根据需求是否使用
               *
                  for (var i = 0; i < result.pois.length; i++) {
                  mks.push({ // 获取返回结果，放到mks数组中
                      title: result.pois[i].title,
                      id: result.pois[i].id,
                      latitude: result.pois[i].location.lat,
                      longitude: result.pois[i].location.lng,
                      iconPath: './resources/placeholder.png', //图标路径
                      width: 20,
                      height: 20
                  })
                  }
              *
              **/
              //当get_poi为0时或者为不填默认值时，检索目标位置，按需使用
              mks.push({ // 获取返回结果，放到mks数组中
                title: res.address,
                id: 0,
                latitude: res.location.lat,
                longitude: res.location.lng,
                iconPath: './resources/placeholder.png',//图标路径
                width: 20,
                height: 20,
                callout: { //在markers上展示地址名称，根据需求是否需要
                  content: res.address,
                  color: '#000',
                  display: 'ALWAYS'
                }
              });
              that.setData({ //设置markers属性和地图位置poi，将结果在地图展示
                markers: mks,
                poi: {
                  latitude: res.location.lat,
                  longitude: res.location.lng
                }
              });

              that.login();

            },
            fail: function(error) {
              console.error(error);
            },
            complete: function(res) {
              console.log(res);
            }
          })

        },
            fail: function (res) {
              //未开启定位权限，拉起授权
              if (res.errMsg == 'getLocation:fail auth deny') {
                  //重新拉起授权
                  wx.openSetting({
                      success: function (res) {
                          if (res.authSetting['scope.userLocation'] == false) {
                              wx.showModal({
                                  title: '提示',
                                  content: '您未开启定位权限，将导致无法使用本软件',
                                  showCancel: false
                              });
                          } else {
                              wx.showModal({
                                  title: '提示',
                                  content: '您已开启定位权限，请重新点击登录',
                                  showCancel: false
                              });
                          }
                      }
                  });
              }
          }
          })
      }
    })

    



    // 获取珠海市
    // let url1 = "cityArea/findByParentCode";
    // let data1 = {};
    // request.postRequest(url1, data1).then((res) => {
    //   // console.log(res.data.data.data);
    //   that.setData({
    //     city: res.data.data.data
    //   })
    // });
    
    
  },
  login(){
    var that = this;
          // 获取内容
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          //发起网络请求  
          // console.log(res.code)
          wx.request({
            url: 'https://www.dongjingfit.com/W001',
            data: {
              js_code: res.code
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: "post",
            success: function (resule) {
              // console.log(resule.data.data.token);
              let tokenId = resule.data.data.token
              wx.request({
                url: 'https://www.dongjingfit.com/index/load',
                data: {
                  cityAreald: 3
                },
                header: { 
                  'content-type': 'application/x-www-form-urlencoded' ,
                  'token': tokenId,
                },
                method: "post",
                success: function (res) {
                  // console.log(res.data.data.cityArea);
                  that.setData({
                    // conList: res.data.data.store.content,  //内容
                    city: res.data.data.cityArea,  //市
                    storeSubject: res.data.data.storeSubject,   //全部
                    imageUrl: res.data.data.banners   //广告轮播
                  })
                  that.data.city.forEach(function(v,i){
                     if (v.areaName == that.data.defautCity) {
                        that.setData({
                          defautCityId:v.id
                        })
                        //保存cityAreaId
                        wx.setStorageSync('cityAreaId', v.id)
                     }
                  })

                   wx.request({
                        url: 'https://www.dongjingfit.com/store/list', //仅为示例，并非真实的接口地址
                        data: {
                          cityAreaId:that.data.defautCityId
                        },
                        header: {
                          'content-type': 'application/x-www-form-urlencoded',
                          'token': app.globalData.tokenid,
                        },
                         method: "post",
                        success (res) {
                          console.log(res,'当前内容');
                          that.setData({
                            conList:res.data.data.page.content
                          })
                        }
                      })

                }
              })
            }
          })

        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
// 跳转详情页
  jumpGoods:function(e){
    let id = e.currentTarget.dataset.id;
    let name =  e.currentTarget.dataset.title;
    // console.log(name);
    wx.navigateTo({
      url: '../../index/goodsDetail/goodsDetail?id=' + id + '&name=' + name,
    })
  },
// 跳转到文本页面
  jumpTxt:function(e){
    let id = e.currentTarget.dataset.id;
    // console.log(name);
    wx.navigateTo({
      url: '../../index/txtPage/txtPage?id=' + id ,
    })
  },
  // 确认按钮
  qrBtn:function(){
    var that = this;
    wx.showToast({
      icon:'none',
      title: '订单完成',
    })
    that.setData({
      show: false
    })
  },
  // 跳转到订单详情
  jumpOrder:function(){
    wx.navigateTo({
      url: '../../my/NoPayment/NoPayment',
    })
  },

  /** 
     * 点击tab切换 
     */
    // 市
  swichNav: function (e) {
    var that = this;
    let current = e.currentTarget.dataset.current;
    let areaCode = e.currentTarget.dataset.id;
    let cityName = e.currentTarget.dataset.city;
    let areaId = e.currentTarget.dataset.areaid;
    // console.log(areaCode);
    that.setData({      
      currentTab: e.currentTarget.dataset.current,
      defautCity:e.currentTarget.dataset.city
    })
    // // 获取区
    let url2 = "cityArea/findByParentCode";
    let data2 = { parentCode: areaCode };
    request.postRequest(url2, data2).then((res) => {
      console.log(res.data.data.data);
      that.setData({
        areaHd: true,
        area: res.data.data.data,
      })
    });   

    // 获取内容
    let url = "store/list";
    let data = { cityAreaId: areaId };
    request.postRequest(url, data).then((res) => {
      console.log(res.data.data,'lll');
       that.setData({
            conList: res.data.data.page.content,  //内容
        })
    });
    //保存cityAreaId
    wx.setStorageSync('cityAreaId', areaId)
  },
  // 区
  swichNav1: function (e) {
    wx.showToast({
        icon: 'loading',
        title: '加载中...',
      })
    var that = this;
    let current = e.currentTarget.dataset.current;
    let id = e.currentTarget.dataset.id;
    that.setData({
      currentTab1: e.currentTarget.dataset.current,
      chooseSize1:false,
      areaHd:false
    })
    
    // console.log(current);
    
  },
  // 门店主题
  swichTabShop: function (e) {
    var that = this;
    let current = e.currentTarget.dataset.current;
    let id = e.currentTarget.dataset.id;
    // console.log(current);
    that.setData({
      currentTab2: e.currentTarget.dataset.current,
      chooseSize2: false
    })
    
    // 获取内容
    let url = "store/list";
    let data = { subject : id };
    request.postRequest(url, data).then((res) => {
      // console.log(res.data.data);
      wx.showToast({
        icon: 'loading',
        title: '加载中...',
        success: function () {
          that.setData({
            conList: res.data.data.page.content,  //内容
          })
        }
      })
      
    });
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
    } else if (index == 2){
      that.setData({
        chooseSize2: true
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
        areaHd:false
      })
    } else if (index == 2) {
      that.setData({
        chooseSize2: false,
        areaHd: false
      })
    }
  },


  // "subPackages": [分包加载
  //   {
  //     "root": "pages/index/",
  //     "pages": [
  //       "goodsDetail/goodsDetail"
  //     ]
  //   },
  //   {
  //     "root": "pages/catering/",
  //     "pages": [
  //       "agentIdentity/agentIdentity"
  //     ]
  //   },
  //   {
  //     "root": "pages/course/",
  //     "pages": [
  //       "lxDetail/lxDetail"
  //     ]
  //   },
  //   {
  //     "root": "pages/my/",
  //     "pages": [
  //       "wxLogin/wxLogin"
  //     ]
  //   }
  // ],



})