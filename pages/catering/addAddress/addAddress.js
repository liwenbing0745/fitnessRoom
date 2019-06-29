//index.js
//获取应用实例
const app = getApp()
var address = require('../../../utils/city.js')
// 引用公共js
var request = require('../../../utils/common.js');
var off = true;
var animation
Page({
  /**
   * 页面的初始数据
   * 当前    provinces:所有省份
   * citys选择省对应的所有市,
   * areas选择市对应的所有区
   * provinces：当前被选中的省
   * city当前被选中的市
   * areas当前被选中的区
   */
  data: {
    // 用户编号
    vipId: '',
    menuType: 0,
    begin: null,
    status: 1,
    end: null,
    isVisible: false,
    animationData: {},
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    province: '',
    city: '',
    area: '',
    areaInfo: '省市区',
    areaInfoId:'',          //省市区ID
    address: '',
    addressId: '',
    wxAddress:false,     //判断是否有微信地址
    EditAddress:'',
    items: [{ id:1, sex: '先生'}, { id: 2, sex: '女士'}],
    label: [{ id: 0, label: '家' }, { id: 0, label: '公司' }, { id: 0, label: '学校' }, { id: 0, label: '其他' },],
    current:0,
    region: ['广东省', '广州市', '海珠区'], 
    gender:'',
    userId:'',
    defautAdress:[{id:'Y',isdefaut:'是'},{id:'N',isdefaut:'否'}],
    isDefault:null
  },
  onShow: function () {
    var that = this;
    that.setData({
      vipId: app.globalData.tokenid
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取收货地址页面传来的ID
    let addressId = options.id;
    console.log(addressId,'addressId');
    if (addressId) {
      that.setData({
        addressId: addressId
      })
      // 发送请求(查询是否有绑定手机号)
      // let url = 'infoSetting/findByToken';
      // let data = {};
      // request.postRequest(url, data).then((res) => {
      //   console.log(res,'1232344444444444444444444');
      //   that.setData({
      //     userId: res.data.data.info.userId
      //   })
      // });
      // 请求地址请求(编辑地址)
      if (addressId != 'add'){
        let url1 = 'address/findById';
        let data1 = { id: options.id};
        that.setData({
           editId:options.id
        })
        request.postRequest(url1, data1).then((res) => {
          console.log(res.data.data.address);
          that.setData({
            EditAddress: res.data.data.address,
          })
           var arritem = that.data.items;
           if (res.data.data.address.gender=='1') {
                 arritem[0]['checked'] = 'checked';
                 that.setData({
                   gender:1
                 })
           }
           if (res.data.data.address.gender=='2') {
                 arritem[1]['checked'] = 'checked';
                 that.setData({
                   gender:2
                 })
           }
          
           var deff = that.data.defautAdress;
           if (res.data.data.address.isDefault=='Y') {
              deff[0]['checked'] = 'checked';
              that.setData({
                isDefault:res.data.data.address.isDefault
              })
           }
           if (res.data.data.address.isDefault=='N') {
              deff[1]['checked'] = 'checked';
              that.setData({
                isDefault:res.data.data.address.isDefault
              })
           }
            that.setData({
             items:arritem,
             defautAdress:deff
           })

        }); 
      } 
    }

    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    // 默认联动显示北京
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
    });
  },
  // 标签
  switchBtn:function(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let current = that.data.current;
    if(current == index){
      return false;
    }else{
      that.setData({
        current:index
      })
    }
  },
  // 返回上个页面
  jumpBack: function () {
    wx.navigateBack({
      url: '../address/address',
    })
  },
  radioChange: function (e) {
    this.setData({
      gender: e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  // 默认地址切换
   defautAdressChange: function (e) {
    var that = this;
    this.setData({
      isDefault: e.detail.value
    })
    let dd = that.data.defautAdress;
    if (e.detail.value=='Y') {
       dd[0]['checked'] = 'checked';  
    }
    if (e.detail.value=='N') {
       dd[1]['checked'] = 'checked';  
    }
    console.log('默认地址切换，携带value值为：', e.detail.value)
  },
  formSubmit: function (e) {  //点击登录时，调用的函数
    var that = this;
    var data = e.detail.value;  //获取提交from的json数据
    var id = e.currentTarget.dataset.id
    
    console.log(data,'data');
    // 验证手机号
    if (!(/^1[3456789]\d{9}$/.test(data.phoneCode))) {
         wx.showToast({

            title: '提示：请填写正确的联系电话！',

            icon: 'none',

            duration: 1500

          })     
             off = false;
    }else{
      off = true;
    }

    if (data.address.length == 0) { //验证街道地址

      wx.showToast({

        title: '提示：街道地址不能为空！',

        icon: 'none',

        duration: 1500

      })
      off = false;
    }else{
      off = true;
    }

    if (data.address.length < 4) { //验证街道地址

      wx.showToast({

        title: '提示：街道地址不能少于4位！',

        icon: 'none',

        duration: 1500

      })
      off = false;
    }else{
      off = true;
    }

    // 发送给后台请求
    let region = that.data.region;
    let items = that.data.items;
    // let userId = that.data.showA;范德萨范德萨        43243
    let contact = data.contact;
    let gender = that.data.gender;
    let phoneCode = data.phoneCode;
    let shippingAddress = region[0] + '-' + region[1] + '-' + region[2];
    let address = data.address;
    let current = that.data.current;
    let label = that.data.label;
    let tag = label[current].label; 
    var isDefault; 
    if (that.data.isDefault==null) {
       isDefault = 'N'
    }else{
      isDefault = that.data.isDefault
    } 
    let data3 = {
      contact: contact,
      gender: gender,
      phoneCode: phoneCode,
      shippingAddress: shippingAddress,
      detaAddress: address,
      tag: tag,
      isDefault:isDefault
    };
    let url = 'address/add';
    if (off = true) {
        request.postRequest(url, data3).then((res) => { 
            wx.showToast({ //模拟请求数据中
              title: '数据加载中',
              icon: 'none',
              duration: 1000,
              success: function () { //模拟请求数据成功
                wx.showToast({
                  title: '添加成功',
                  icon: 'success',
                  duration: 1000,
                  success: function () { //成功回调
                    wx.navigateBack({ //js跳转的页面
                      url: '../address/address'
                    })
                  }
                });
              },
              fail: function () { //模拟请求数据失败
                wx.showToast({
                  title: '网络错误，请稍后登录',
                  icon: 'none',
                  duration: 3000,
                });
              }
            });
          })
    }
    
  },

  // 修改收货地址
  formSubmitChange: function (e) {
    var that = this;
    var data = e.detail.value;  //获取提交from的json数据
    var id = e.currentTarget.dataset.id;
    // console.log("修改id：" + id);
    console.log(data);
    // 验证手机号
    // var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;  //手机正则式
    if (!(/^1[3456789]\d{9}$/.test(data.phoneCode))) {
         wx.showToast({

            title: '提示：请填写正确的联系电话！',

            icon: 'none',

            duration: 1500

          })     
             off = false;
    }else{
      off = true;
    }


    if (data.address.length == 0) { //验证手机号  

      wx.showToast({

        title: '提示：街道地址不能为空！',

        icon: 'none',

        duration: 1500

      })
      off = false;
    }else{
      off = true;
    }

    if (data.address.length < 4) { //验证手机号

      wx.showToast({

        title: '提示：街道地址不能少于4位！',

        icon: 'none',

        duration: 1500

      })
       off = false;
    }else{
      off = true;
    }
    // 发送给后台请求
    // 发送给后台请求
    let region = that.data.region;
    let items = that.data.items;
    // let userId = that.data.showA;范德萨范德萨        43243
    let contact = data.contact;
    let gender = that.data.gender;
    let phoneCode = data.phoneCode;
    let shippingAddress = region[0] + '-' + region[1] + '-' + region[2];
    let address = data.address;
    let current = that.data.current;
    let label = that.data.label;
    let tag = label[current].label;
    let data3 = {
      userId: that.data.userId,
      contact: contact,
      gender: gender,
      phoneCode: phoneCode,
      shippingAddress: shippingAddress,
      detaAddress: address,
      tag: tag,
      id:that.data.editId
    };
    if (off==true) {
      let url = 'address/add';
      request.postRequest(url, data3).then((res) => {
        wx.showToast({ //模拟请求数据中
          title: '数据加载中',
          icon: 'none',
          duration: 1000,
          success: function () { //模拟请求数据成功
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1000,
              success: function () { //成功回调
                wx.navigateBack({ //js跳转的页面
                  url: '../address/address'
                })
              }
            });
          },
          fail: function () { //模拟请求数据失败
            wx.showToast({
              title: '网络错误，请稍后登录',
              icon: 'none',
              duration: 3000,
            });
          }
        });
      })
    }
    
  },
// 地址三级联动
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  // 显示
  showMenuTap: function (e) {
    console.log('selectState')
    //获取点击菜单的类型 1点击状态 2点击时间 
    var menuType = e.currentTarget.dataset.type
    // 如果当前已经显示，再次点击时隐藏
    if (this.data.isVisible == true) {
      this.startAnimation(false, -200)
      return
    }
    this.setData({
      menuType: menuType
    })
    this.startAnimation(true, 0)
  },
  hideMenuTap: function (e) {
    this.startAnimation(false, -200)
  },
  // 执行动画
  startAnimation: function (isShow, offset) {
    var that = this
    var offsetTem
    if (offset == 0) {
      offsetTem = offset
    } else {
      offsetTem = offset + 'rpx'
    }
    this.animation.translateY(offset).step()
    this.setData({
      animationData: this.animation.export(),
      isVisible: isShow
    })
    console.log(that.data)
  },
  // 选择状态按钮
  selectState: function (e) {
    console.log('selectState1')
    this.startAnimation(false, -200)
    var status = e.currentTarget.dataset.status
    this.setData({
      status: status
    })
    console.log(this.data)

  },
  // 点击所在地区弹出选择框
  selectDistrict: function (e) {
    var that = this;
    if (that.data.addressMenuIsShow) {
      return
    }
    that.startAddressAnimation(true)
  },
  // 执行动画
  startAddressAnimation: function (isShow) {
    // console.log(isShow)
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(60 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].name + '-' + that.data.citys[value[1]].name + '-' + that.data.areas[value[2]].name
    let are = 'address.areaInfo'
    var areaInfoId = that.data.provinces[value[0]].id + '-' + that.data.citys[value[1]].id + '-' + that.data.areas[value[2]].id
    // console.log(areaInfoId)
    that.setData({
      areaInfoId: areaInfoId,
      areaInfo: areaInfo,
      [are]:areaInfo
    });
  },
  hideCitySelected: function (e) {
    console.log(e)
    this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {
    // console.log(e)
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
    // console.log(this.data)
  },
  //用户选择收货地址
  chooseAddress: function () {
    var that = this;
    let consignee = 'address.consignee';
    let telephone = 'address.telephone'
    let areaInfo = 'address.areaInfo'
    let address = 'address.address'
    if (wx.chooseAddress) {
      wx.chooseAddress({
        success: function (res) {
          console.log(res);
          that.setData({
            [consignee]: res.userName,
            [telephone]: res.telNumber,
            [areaInfo]: res.provinceName + res.cityName + res.countyName,
            [address]: res.detailInfo,
            // "add_countyName": res.countyName,
            // "add_detailInfo": res.detailInfo,
            // "add_postalCode": res.postalCode,
            //具体收货地址显示
            flag: false,
            showA: 2,
            wxAddress:true
          })
        },
        fail: function (err) {
          console.log(JSON.stringify(err));
          console.info("收货地址授权失败");
          wx.showToast({
            title: '授权失败，您将无法进行下单支付;重新授权请删除小程序后再次进入',
            icon: 'success',
            duration: 20000
          })
        }
      })
    } else {
      console.log('当前微信版本不支持chooseAddress');
    }
  },

})
