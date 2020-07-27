import {request} from '../../request/index.js';
import {login} from '../../utils/asyncWx.js';

Page({

  // 获取用户信息
 async handleGetUserInfo(e) {
    try {
      // 获取用户信息
    console.log(e);
    
    const {encryptedData,rawData,iv,signature} = e.detail;
    // 获取小程序登录成功后的code
    const {code} = await login();
    const loginParams={encryptedData,rawData,iv,signature};
    
    // 发送请求获取用户的token值
    const {token} = await request({url:"/users/wxlogin",data:loginParams,method:"POST"});
    // 把token存入缓存中 同时跳回到上一个页面
    wx.setStorage("token",token);
    wx.navigateBack({
      delta: 1
    });
    } catch (error) {
      console.log(error);
    }  
  }
})