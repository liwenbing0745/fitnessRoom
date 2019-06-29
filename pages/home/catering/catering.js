// pages/home/lx/lx.js
const util = require('../../../utils/util.js')
const app = getApp();
// 引用公共js
var request = require('../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tab切换  
    currentTab: 0,
    currentTab1: 0,//性别
    currentTab2: 0,//品类
    currentTab3: 0,//时间
    currentTab4: 0,//品类1
    promoteprice: 1,  //数量
    // color: 0,
    // goodsNum: 1,
    // 分类
    list: [
      { id: '0', list: '每日精选', num: '0' },
      { id: '1', list: '套餐专区', num: '0' }
    ],
    // 每日精选
    allTotal: '',  //总价
    allNum:'',
    content:'',
    cityAreaId: null,
    // content: [
    //   { id: '0', img: '../../../image/foods.jpg', title: '瘦身精选套餐', content: '瘦身精选套餐今日特价', price: '36', num: '20', goodsNum: 0, }, { id: '0', img: '../../../image/foods.jpg', title: '瘦身精选套餐', content: '瘦身精选套餐今日特价', price: '36', num: '20', goodsNum: 0, }, { id: '0', img: '../../../image/foods.jpg', title: '瘦身精选套餐', content: '瘦身精选套餐今日特价', price: '36', num: '20', goodsNum: 0, }, { id: '0', img: '../../../image/foods.jpg', title: '瘦身精选套餐', content: '瘦身精选套餐今日特价', price: '36', num: '20', goodsNum: 0, },
    // ],
    // 套餐专区
    allTotal1: '',  //总价
    allNum1: '',
    sex: [{ id: '0', sex: '男', name: 'MAN' }, { id: '1', sex: '女', name: 'WOMAN' }],
    ptype: [{ id: '0', ptype: '健身', name: 'FITNESS' }, { id: '1', ptype: '减脂', name: 'FATLOSS' }, { id: '2', ptype: '营养', name: 'NUTRITION'},],
    time: [{ id: '0', time: '周餐', name: 'WEEK' }, { id: '1', time: '月餐', name: 'MONTH'  }],
    ptype1: [{ id: '0', ptype1: '午餐', name: 'LUNCH' }, { id: '1', ptype1: '晚餐', name: 'DINNER'  }],
    packageA:'',
    // packageA: [
    //   { id: '0', img: '../../../image/foods.jpg', title: '型男必备套餐A', label1: '男', label2: '营养', label3: '周餐', label4: '晚餐', price: '36', num: '20', goodsNum: 0, }, { id: '0', img: '../../../image/foods.jpg', title: '型男必备套餐A', label1: '男', label2: '营养', label3: '周餐', label4: '晚餐', price: '36', num: '20', goodsNum: 0, }, { id: '0', img: '../../../image/foods.jpg', title: '型男必备套餐A', label1: '男', label2: '营养', label3: '周餐', label4: '晚餐', price: '36', num: '20', goodsNum: 0, },
    // ],
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;    
    let packageA = that.data.packageA;
    var total = 0;
    var total1 = 0;
    //获取cityAreaId
    // that.setData({
    //   cityAreaId: wx.getStorageSync('cityAreaId')
    // })
    console.log(this.data.cityAreaId)
    // 获取每日精选内容
    let url = "catering/list";
    let data = { caterType:'F'};
    request.postRequest(url, data).then((res) => {
      // console.log(res.data.data.page.content);
      let content = res.data.data.page.content;
      for (var i = 0; i < content.length; i++) {
        // if (cartArr[i].selected) {
        total += content[i].goodsNum * content[i].price;
        // }
      };
      for (var i = 0; i < packageA.length; i++) {
        // if (cartArr[i].selected) {
        total1 += packageA[i].goodsNum * packageA[i].price;
        // }
      };
      that.setData({
        allTotal: total.toFixed(2),
        allTotal1: total1.toFixed(2),
        content: res.data.data.page.content,
        // id: id
      })
    });
    // 获取每日精选内容
    let url1 = "catering/list";
    let data1 = { caterType: 'P'};
    request.postRequest(url1, data1).then((res) => {
      // console.log(res.data.data.page);
      that.setData({
        packageA: res.data.data.page.content,
        // id: id
      })
    });
  },
  // 跳转到套餐详情页
  jumpGoodesDet:function(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../catering/goodsDetail/goodsDetail?id=' + id,
    })
  },
  // 跳转到订单页面
  jumpOrder:function(){
    // console.log(this.data.content);
    let that = this;
    let content= this.data.currentTab == 0 ? this.data.content : this.data.packageA;
    let allTotal= this.data.currentTab == 0 ? this.data.allTotal : this.data.allTotal1;
    let a =[];
    for (let i = 0; i < content.length;i++){
      if (content[i].goodsNum>0){
        a.push(content[i]);
      }
    }
    let b = a;
    app.globalData.content = b;
    wx.navigateTo({
      url: '../../catering/order/order?allTotal=' +  allTotal,
    })
  },
  /** 
     * 点击tab切换 
     */
  swichNav: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.current
    })
  },
  // 性别
  swichSex: function (e) {
    var that = this;
    let current = e.currentTarget.dataset.current1;
    let current2 = that.data.currentTab2;
    let current3 = that.data.currentTab3;
    let current4 = that.data.currentTab4;
    let sex = that.data.sex;
    let ptype = that.data.ptype;
    let time = that.data.time;
    let ptype1 = that.data.ptype1;
    let name = e.currentTarget.dataset.name;
    that.setData({
      currentTab1: current
    });
    // 获取每日精选内容
    let url = "catering/list";
    let data = { 
      caterType: 'P', 
      gender: name, 
      category: ptype[current2].name,
      cycle: time[current3].name,
      meal: ptype1[current4].name,
    };
    request.postRequest(url, data).then((res) => {
      // console.log(res.data.data.page);
      that.setData({
        packageA: res.data.data.page.content,
        // id: id
      })
    });
  },
  // 品类
  swichType: function (e) {
    var that = this;
    let current1 = that.data.currentTab1;
    let current2 = e.currentTarget.dataset.current2;
    let current3 = that.data.currentTab3;
    let current4 = that.data.currentTab4;
    let sex = that.data.sex;
    let ptype = that.data.ptype;
    let time = that.data.time;
    let ptype1 = that.data.ptype1;
    let name = e.currentTarget.dataset.name;
    that.setData({
      currentTab2: current2
    });
    // 获取每日精选内容
    let url = "catering/list";
    let data = { 
      caterType: 'P', 
      gender: sex[current1].name,
      category: name,
      cycle: time[current3].name,
      meal: ptype1[current4].name, 
    };
    request.postRequest(url, data).then((res) => {
      // console.log(res.data.data.page);
      that.setData({
        packageA: res.data.data.page.content,
        // id: id
      })
    });
  },
  // 时间
  swichTime: function (e) {
    var that = this;
    let current1 = that.data.currentTab1;
    let current2 = that.data.currentTab2;
    let current3 = e.currentTarget.dataset.current3;
    let current4 = that.data.currentTab4;
    let sex = that.data.sex;
    let ptype = that.data.ptype;
    let time = that.data.time;
    let ptype1 = that.data.ptype1;
    let name = e.currentTarget.dataset.name;
    that.setData({
      currentTab3: current3
    });
    // 获取每日精选内容
    let url = "catering/list";
    let data = { 
      caterType: 'P', 
      gender: sex[current1].name,
      category: ptype[current1].name,
      cycle:name,
      meal: ptype1[current4].name,  
    };
    request.postRequest(url, data).then((res) => {
      // console.log(res.data.data.page);
      that.setData({
        packageA: res.data.data.page.content,
        // id: id
      })
    });
  },
  // 品类
  swichType1: function (e) {
    var that = this;
    let current1 = that.data.currentTab1;
    let current2 = that.data.currentTab2;
    let current3 = that.data.currentTab3;
    let current4 = e.currentTarget.dataset.current4;
    let sex = that.data.sex;
    let ptype = that.data.ptype;
    let time = that.data.time;
    let ptype1 = that.data.ptype1;
    let name = e.currentTarget.dataset.name;
    that.setData({
      currentTab4: current4
    });
    // 获取每日精选内容
    let url = "catering/list";
    let data = { 
      caterType: 'P',
      gender: sex[current1].name,
      category: ptype[current1].name,
      cycle: time[current1].name,
      meal:name, 
      };
    request.postRequest(url, data).then((res) => {
      // console.log(res.data.data.page);
      that.setData({
        packageA: res.data.data.page.content,
        // id: id
      })
    });
  },
  // 每日精选获得所有总价
  getTotalPrice: function () {
    let cartArr = this.data.content;    //获取购物车列表
    var total = 0;
    for (var i = 0; i < cartArr.length; i++) {
      // if (cartArr[i].selected) {
      total += cartArr[i].goodsNum * cartArr[i].price;
      // }
    };
    console.log(total);
    this.setData({
      allTotal: total.toFixed(2)
    });
    let tru = 0;
    for (var i = 0; i < cartArr.length; i++) {
      if (cartArr[i].goodsNum > 0)
        tru += cartArr[i].goodsNum
    }
    this.setData({
      allNum: tru,
    });
  },
  // 购物车加减号
  // 加减号
  add(e) {
    let that = this;
    let allTotal = that.data.allTotal;
    let content = that.data.content;
    let index = e.currentTarget.dataset.index;

    let color = 'content[' + index + '].color';
    if (content[index].num <1) {return false}
    content[index].goodsNum += 1
    content[index].num -= 1

    this.setData({
      content: content,
      [color]: 1
    });
    that.getTotalPrice();
  },
  sub(e) {
    let that = this;
    let content = that.data.content;
    let index = e.currentTarget.dataset.index;
    let num = content[index].goodsNum;
    let color = 'content[' +index+'].color' ;
    let a = 1;
    // console.log(color);
    if (num <= 1) {
      a = 0;
    }
    if (content[index].goodsNum < 1) {return false}
    content[index].goodsNum -= 1
    content[index].num += 1
    this.setData({
      content: content,
      [color]: a
    });
    that.getTotalPrice();
  },

  // 套餐专区获得所有总价
  getTotalPrice1: function () {
    let cartArr = this.data.packageA;    //获取购物车列表
    var total = 0;
    for (var i = 0; i < cartArr.length; i++) {
      // if (cartArr[i].selected) {
      total += cartArr[i].goodsNum * cartArr[i].price;
      // }
    };
    this.setData({
      allTotal: total.toFixed(2),
      allTotal1: total.toFixed(2)
    });
    let tru = 0;
    for (var i = 0; i < cartArr.length; i++) {
      if (cartArr[i].goodsNum > 0)
        tru += cartArr[i].goodsNum
    }
    this.setData({
      allNum1: tru,
    });
  },
  // 购物车加减号
  // 加减号
  add1(e) {
    let that = this;
    let allTotal = that.data.allTotal1;
    let content = that.data.packageA;
    let index = e.currentTarget.dataset.index;
    let color = 'packageA[' + index + '].color';
    if (content[index].num < 1) {return false}
    content[index].goodsNum += 1
    content[index].num -= 1
    this.setData({
      packageA: content,
      [color]: 1
    });
    // }
    that.getTotalPrice1();
  },
  sub1(e) {
    let that = this;
    let content = that.data.packageA;
    let index = e.currentTarget.dataset.index;
    let num = content[index].goodsNum;
    let color = 'packageA[' + index + '].color';
    let a = 1;
    // console.log(color);
    if (num <= 1) {
      a = 0;
    }
    if (content[index].goodsNum < 1) {return false}
    content[index].goodsNum -= 1
    content[index].num += 1
    this.setData({
      packageA: content,
      [color]: a
    });
    that.getTotalPrice1();
  },
})