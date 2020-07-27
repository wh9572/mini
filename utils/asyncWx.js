//  promise 形式 getSetting

export const getSetting=()=> {
  return new Promise((resolve,reject)=>{
    wx.getSetting({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
    });
      
  });
}

//  promise 形式 chooseAddress

export const chooseAddress=()=> {
  return new Promise((resolve,reject)=>{
    wx.chooseAddress({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
    });
      
  });
}

//  promise 形式 openSetting

export const openSetting=()=> {
  return new Promise((resolve,reject)=>{
    wx.openSetting({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
    });
      
  });
}

export const showModel=({content})=> {
  return new Promise((resolve,reject)=>{
    wx.showModal({
      title: '提示',
      content: content,
      success:(res)=>{
        resolve(res);
      },
      fail:(err)=> {
        reject(err);
      }
    });     
      
  });
}

export const showToast=({title})=> {
  return new Promise((resolve,reject)=>{
    wx.showToast({
      title: title,
      icon:'none',
      success:(res)=>{
        resolve(res);
      },
      fail:(err)=> {
        reject(err);
      }
    });       
  });
}

// 微信登录
export const login=()=> {
  return new Promise((resolve,reject)=>{
    wx.login({
      timeout:10000,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
    });
      
  });
}

// 支付所必要的参数
export const requestPayment=(pay)=> {
  return new Promise((resolve,reject)=>{
    wx.requestPayment({
     ...pay,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}