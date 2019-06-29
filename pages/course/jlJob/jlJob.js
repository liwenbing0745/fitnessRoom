// pages/course/jlJob/jlJob.js
const util = require('../../../utils/util.js')
const app = getApp();
// 引用公共js
var request = require('../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currTab:0,
    coach:'', //教练故事
    // 教练故事
    list:[
      { id: 0, txt: '教练故事' }, { id: 0, txt: '学员排名' }, { id: 0, txt: '教练课程' },
    ],
    // 学员排名
    xyPm: [
      { id: 0, name: '你是谁', num: '10' }, { id: 1, name: '你是谁', num: '10' }, { id: 2, name: '你是谁', num: '10' }, { id: 3, name: '你是谁', num: '10' }, { id: 4, name: '你是谁', num: '10' },
    ],
    // 教练课程
    goods: [
      {
        id: 0, number: '2432431534', status: '1', shopHome: '深圳市南山区深南分店', image: '../../../image/t01de8d1955be900b06@2x.png', name: 'TOTAL全能燃脂', content: '燃脂 塑形 心率控制', date: '12:00-13:00', price: '129', vipPrice: '122', status: 1
      },
      {
        id: 0, number: '2432431534', status: '1', shopHome: '深圳市南山区深南分店', image: '../../../image/t01de8d1955be900b06@2x.png', name: 'TOTAL全能燃脂', content: '燃脂 塑形 心率控制', date: '12:00-13:00', price: '129', vipPrice: '122', status: 2
      },
      {
        id: 0, number: '2432431534', status: '1', shopHome: '深圳市南山区深南分店', image: '../../../image/t01de8d1955be900b06@2x.png', name: 'TOTAL全能燃脂', content: '燃脂 塑形 心率控制', date: '12:00-13:00', price: '129', vipPrice: '122', status: 3
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let id = options.id;
    // 获取内容
    let url = "coach/findById";
    let data = {
      id: id
    };
    request.postRequest(url, data).then((res) => {
      // console.log(res.data.data.coach);
      that.setData({
        coach: res.data.data.coach
      })
    }); 

  },
  swTab:function(e){
    let that = this;
    let currTab = that.data.currTab;
    let index = e.currentTarget.dataset.index;
    if (currTab == index){
      return false;
    }else{
      that.setData({
        currTab:index
      })
    }
  }
})