//获取应用实例
const app = getApp()
// post请求
function postRequest(url, data) {
  // wx.getStorage({
  //   key: 'key',
  //   success: function (res) {
  //     // console.log(res.data)
  //   }
  // // });
  // data.tokenid = app.globalData.tokenid;
  var url3 = app.globalData.url + url;
  // console.log(url);
  var promise = new Promise((resolve, reject) => {
    //init
    var that = this;
    //网络请求
    wx.request({
      url: url3,
      data: data,
      method: 'POST',
      header: { 
        'content-type': 'application/x-www-form-urlencoded',
        'token': app.globalData.tokenid,
       },
      success: function (res) {//服务器返回数据
        // console.log(res);
        if (res) {//res.data 为 后台返回数据，可以根据自己业务逻辑来设定判断条件
          resolve(res);
        } else {//返回错误提示信息
          reject(res.statusCode);
          wx.showToast({
            title: '网络错误，请重试',
            icon: 'none',
            duration: 3000,
          });
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
  });
  return promise;
};
// get请求
function getRequest(url, data) {
  // data.tokenid = app.globalData.tokenid;
  var url3 = app.globalData.url + url;
  var promise = new Promise((resolve, reject) => {
    //init
    var that = this;
    var postData = data;
    // var url = url;
    //网络请求
    wx.request({
      url: url3,
      data: postData,
      method: 'get',
      header: { 
        'content-type': 'application/json',
        'token': app.globalData.tokenid,
         },
      success: function (res) {//服务器返回数据
        if (res) {//res.data 为 后台返回数据，可以根据自己业务逻辑来设定判断条件
          resolve(res);
        } else {//返回错误提示信息
          wx.showToast({
            title: '网络错误，请重试',
            icon: 'none',
            duration: 3000,
          });
          reject(res.statusCode);
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
  });
  return promise;
};

// 跳转页面
function jump(url){
  var promise = new Promise((resolve,reject) =>{
    wx.navigateTo({
      url: url,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  });
  return promise;
};



//最下面一定要加上你自定义的方法（作用：将模块接口暴露出来），否则会报错：util.trim is not a function;
module.exports = {
  postRequest: postRequest,
  getRequest: getRequest,
  jump: jump,
}
