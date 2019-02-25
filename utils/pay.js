const api = require('./request.js')
function wxpay(app, money, orderId, redirectUrl) {
  let remark = "在线充值";
  let nextAction = {};
  if (orderId != 0) {
    remark = "支付订单 ：" + orderId;
    nextAction = { type: 0, id: orderId };
  }
  api.fetchRequest('/mlOrder/pay', {
    token: wx.getStorageSync('token'),
    money: money,
    remark: remark,
    payName: "在线支付",
    nextAction: nextAction
  }).then(function (res) {
    if (res.data.state == 'ok') {
      // 发起支付
      wx.requestPayment({
        timeStamp: res.data.mlPay.timeStamp,
        nonceStr: res.data.mlPay.nonceStr,
        package:  res.data.mlPay.package,
        signType: 'MD5',
        paySign: res.data.mlPay.paySign,
        fail: function (aaa) {
          wx.showToast({ title: '支付失败:' + aaa })
        },
        success: function () {
          wx.showToast({ title: '支付成功' })
          wx.redirectTo({
            url: redirectUrl
          });
        }
      })
    } else {
      wx.showModal({
        title: '出错了',
        content: res.data.code + ':' + res.data.msg + ':' + res.data.data,
        showCancel: false,
        success: function (res) {

        }
      })
    }
  })
}

module.exports = {
  wxpay: wxpay
}
