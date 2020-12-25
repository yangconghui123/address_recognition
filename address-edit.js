var QQMapWX  = require("../../utils/qqmap-wx-jssdk.min.js");
let qqMap = new QQMapWX({
  key: 'HQ6BZ-27KKP-4OXDB-V65DW-3RZEF-W5FMA' // 必填
});
Page({
  data: {
    district: {
      province: {
        name: ""
      },
      city: {
        name: ""
      },
      district: {
        name: ""
      }
    },
  },
  onLoad: function (e) {

  },
  changtext: function (e) {
    var that = this;
    var text = that.data.distinguish;
    var text = text.replace(/(^\s*)|(\s*$)/g, ""); //清除文本前后空格
    if (text == '') {
      that.setData({
        u_name: '',
        u_phone: '',
        u_address: ''
      })
      return;
    }
    //电话号码正则表达式
    var regx = /(1[3|4|5|7|8][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})/g;
    var phone_num = text.match(regx);
    if (phone_num != null) {
      var phone = text.indexOf(phone_num[0]);
    }
    var name = text.indexOf("姓名:");
    if (name >= 0) {
      var phone = text.indexOf("电话:"),
        address = text.indexOf("地址:");
      var u_name = text.substring(name + 3, phone),
        u_phone = text.substring(phone + 3, address),
        u_address = text.substring(address + 3, text.length);
      that.setData({
        u_name: u_name,
        u_phone: u_phone,
        u_address: u_address
      })
    } else if (phone >= 0) {
      var u_name = text.substring(0, phone),
        u_phone = text.substring(phone, phone + 11),
        u_address = text.substring(phone + 11, text.length);
      that.setData({
        u_name: u_name,
        u_phone: u_phone,
        u_address: u_address
      })
    } else {
      that.setData({
        u_name: '',
        u_phone: '',
        u_address: ''
      })
      return;
    }
    that.setData({
      name: u_name, //收货人
      mobile: u_phone, //联系方式
    })
    qqMap.geocoder({
      address:u_address,
      complete: res => {
        console.log(res)
        var result = res.result.address_components;
        that.setData({
          district: {
            province: {
              name:result.province
            },
            city: {
              name:result.city
            },
            district: {
              name:result.district
            }
          },
          detail: res.result.title, //详细地址
        });
          }
      });
  },
});