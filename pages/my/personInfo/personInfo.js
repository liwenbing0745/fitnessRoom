// pages/my/personInfo/personInfo.js
//index.js
//获取应用实例
const app = getApp()
// 引用公共js
var request = require('../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    array: ['男', '女'],
    formData:'',
    changeInfo:'',  //修改按钮
    date: '2016-09-01',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let url = "infoSetting/findByToken";
    let data = {};
    request.postRequest(url, data).then((res) => {
      // console.log(res.data.data.data);
      if (res.data.data.info){
        if (res.data.data.info.gender == "男") {
          that.setData({
            index: 0
          })
        } else {
          that.setData({
            index: 1
          })
        }
        that.setData({
          date: res.data.data.info.birthday,
          changeInfo:true,
          formData: res.data.data.info,
        })
      }else{
        that.setData({
          changeInfo: false
        })
      }
    });
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  formSubmit: function (e) {
    let index = this.data.index;
    let array = this.data.array; 
    let date = this.data.date;
    let formData = this.data.formData;
    let id;
    // console.log(date);
    if (formData){
      id = formData.id
    }
    let url = "infoSetting/add";
    let data = {
      id:id,
      birthday:date,
      gender:array[index],
      bodyWeight: e.detail.value.bodyWeight,
      height: e.detail.value.height
    };
    request.postRequest(url, data).then((res) => {
      // console.log(res.data.data.data);
      wx.showToast({
        icon:'success',
        title: '添加成功',
        success:function(){
          wx.switchTab({
            url: '../../home/my/my',
          })
        }
      })
      
    });
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
})