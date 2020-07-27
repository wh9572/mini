/**
 * 获取用户的收货地址
 *  1 绑定点击事件
 *  2 调用小程序内置 api 获取用户的收获地址  wx.chooseAddress
 * 
 * 
 * 2 获取 用户 对小程序 所授予 获取地址的 权限状态 scope
 *  1 假设 用户 点击获取收获地址的提示框 确定
 *    scope true  直接调用 获取收获地址
 *  2 假设 用户 点击获取收获地址的提示框 取消
 *    scope false 
 *     1 诱导用户 自己 打开 授权设置页面 当用户重新给与 获取地址权限的时候
 *  3 假设 用户 从来没调用过收获地址的api
 *    scope undefined   直接调用  获取收获地址
 * 4 获取到的收获地址 存入到本地存储中
 * 
 * 2 页面加载完毕
 *  1 获取本地存储中的地址数据
 *  2 把数据 设置给data中的一个变量
 * 
 * 3 onShow
 *   0 会到了商品详情页 第一次添加商品的时候 手动添加了属性
 *      1 num=1;
 *      2 checked=true;
 *    1 获取缓存在的购物车数组
 *    2 把购物车数据 填充到data中
 * 
 * 
 * 4 全选的实现
 *    1 onShow 获取缓存中的购物车数组
 *    2 根据购物车中的商品数据 所有的商品都被选择 xhecked=true 全选就被选中
 * 
 * 5 总价格和总数量
 *    1 都需要商品被选择 我们才计算
 *    2 获取购物车数组
 *    3 遍历
 *    4 判断商品是否被选中
 *    5 总价格 += 商品的单价 * 商品的数量
 *    6 总数量 += 商品的数量
 *    7 计算后的价格和数量  都设置回data即可
 * 
 * 6 商品的选中功能
 *    1 绑定change事件
 *    2 获取到被修改的商品对象
 *    3 商品对象的选中状态 取反
 *    4 重新填充回data中和缓存中
 *    5 重新计算全选 总价格 总数量
 * 
 * 7 全选和反选
 *    1 全选复选框绑定事件 change
 *    2 获取 data中的全选变量 allChecked
 *    3 直接取反 allChecked=!allChecked
 *    4 遍历购物车数组 让里面商品 选择状态跟随 allChecked 改变而改变
 *    5 把购物车数组 和 allChecked 重新设置回data中 把购物车重新设置回 缓存中
 * 8  商品数量的编辑
 *    1 "+" "-" 按钮 绑定同一个点击事件  区分的关键 自定义属性
 *      1 "+" "+1"
 *      2 "-" "-1"
 *    2 传递被点击的商品id goods_id
 *    3 获取data中的购物车数组  来获取需要被修改的商品对象
 *    4 直接修改商品对象的数量
 *      当购物车的数量 =1 用户点击 "-" 
 *      弹窗提示(showModel) 询问用户 是否要删除
 *      确定 直接删除
 *      取消  什么也不做
 *    5 把cart数组 重新设置回缓存中和data中 this.setCart
 * 
 * 9 点击结算
 *    1 判断有没有收货地址信息
 *    2 判断用户有没有选购商品
 *    3 经过以上的验证  跳转到  支付页面
 *    
 * 
 */
import {getSetting,chooseAddress,openSetting,showModel,showToast} from '../../utils/asyncWx.js'

Page({
  data:{
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    // 1 获取本地存储中的地址数据
    const address = wx.getStorageSync("address");
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart")||[];
    //计算全选
    // every 数组方法 会遍历 接收一个回调函数 那么 每一个回调函数都会返回true
    // 那么 every方法的返回值就为true   
    // 只要有一个为false  就不在执行 直接返回false
    // 空数组 调用 every  返回值就是true
    // const allChecked=cart.length?cart.every(v=>v.checked):false;
    this.setData({address});
    this.setCart(cart);   
  },

   // 点击收货地址
   async handleChooseAddress() {
    try {
          // // 获取 权限状态
    // wx.getSetting({
    //   success: (result) => {
    //     // 获取权限状态  主要发现一些 属性名很怪异的时候 都要用[]形式来获取属性值
    //     const scopeAddress = result.authSetting["scope.address"];
    //     if (scopeAddress===true||scopeAddress===undefined) {
    //       wx.chooseAddress({
    //         success:(result1) => {
    //           console.log(result1);            
    //         }
    //       });
    //     } else {
    //       // 用户 拒绝过授权 先诱导用户打开授权页面
    //       wx.openSetting({
    //         success: (result2) => {
    //           // 可以调用 收获地址代码
    //           wx.chooseAddress({
    //             success:(result3) => {
    //               console.log(result3); 
    //             }
    //           });
    //         },
    //       });
            
    //     }
    //   },
    // });   

  // 获取 权限状态
    const res1 = await getSetting();
    const scopeAddress = res1.authSetting["scope.address"];
    // 判断权限状态
    if (scopeAddress===false) {
      // 先诱导用户打开授权页面
      await openSetting();
    }
    // 调用获取地址的 api
    let address = await chooseAddress();
     address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo;
    // 存入到缓存中
    wx.setStorageSync("address", address);
      
    } catch (error) {
      console.log(error);
      
    }
  },

  handleItemChange(e) {
    // console.log(e);
    
    // 获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    // 获取购物车数组
    let {cart} = this.data;
    // 找到被修改的商品对象
    let index=cart.findIndex(v=>v.goods_id===goods_id);
    // 选中状态取反
    cart[index].checked = !cart[index].checked;
  
    this.setCart(cart);
  },

  // 设置购物车状态 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart){
    let allChecked = true;
    // 总价格 总数量
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v => {
      if(v.checked) {
        totalPrice+= v.num*v.goods_price;
        totalNum+=v.num;
      }else {
        allChecked = false;
      }
    });

    // 判断数组是否为空
    allChecked=cart.length!=0?allChecked:false;
    // 给data赋值
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    });
    wx.setStorageSync("cart",cart);
  },

  // 商品全选功能
  handleItemAllCheck() {
    // 获取购物车中的数据
    let {cart,allChecked} = this.data;
    // 修改值
    allChecked = !allChecked;
    // 循环修改cart数组中的商品选中状态
    cart.forEach(v=>v.checked=allChecked);
    // 把修改后的值 填充回data或者缓存中
    this.setCart(cart);
  },

  // 商品数量的编辑功能
 async handleItemNumEdit(e) {
    // 获取传递过来的参数
    const {id,operation} = e.currentTarget.dataset;
    // 获取购物车数组
    let {cart} = this.data;
    // 找到需要修改的商品的索引
    const index = cart.findIndex(v=>v.goods_id===id);
    // 判断是否要执行删除
    if (cart[index].num===1&&operation===-1) {
      // 弹窗提示
      // wx.showModal({
      //   title: '提示',
      //   content: '您是否要删除',
      //   success: (result) => {
      //     if (result.confirm) {
      //       cart.splice(index,1);
      //       this.setCart(cart);
      //     } else if(result.cancal) {
      //       console.log("用户点击取消");
            
      //     }
      //   },
      // });     
      const res = await showModel({content:"您是否要删除?"});
      if (res.confirm) {
        cart.splice(index,1);
        this.setCart(cart);
      } 
    } else {
      // 进行修改数量
    cart[index].num+=operation;
    // 设置回缓存和data中
    this.setCart(cart);
    }   
  },

  // 点击结算
 async handlePay() {
    // 判断收货地址
    const {address,totalNum} = this.data;
    if (!address.userName) {
      await showToast({title:"您还没没有选择收货地址"});
      return;
    }
    // 判断用户有没有选购商品
    if (totalNum===0) {
      await showToast({title:"您还没有选购商品"});
      return;
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });
      
  }
})