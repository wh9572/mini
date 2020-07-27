// pages/login/index.js
Page({

  // 获取用户信息
  handleGetUserInfo(e) {
    const {userInfo} = e.detail;
    wx.setStorageSync("userinfo",userInfo);
    wx.navigateBack({  //返回一级
      delta: 1
    });
      
  }

})