import { request } from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
      // 左侧的菜单数据
      leftMenuList:[],
      // 右侧的商品数据
      rightContent:[],
      // 被点击的左侧的菜单
      currentIndex:0,
      // 页面顶部显示
      scrollTop:0
  },
  // 接口的返回数据
  Cates:[],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 先判断本地存储有没有旧的数据
     * 没有旧数据，直接发送新请求
     * 有旧的数据，同时 旧的数据也没有过期 就使用 本地存储中的旧数据即可
     */

    const Cates = wx.getStorageSync("cates");
    if (!Cates) {
      
      this.getCates();
    } else {
      // 有旧的数据 暂时定义一个过期时间
      if (Date.now() - Cates.time > 1000 * 10) {
          // 重新发送请求
          this.getCates();
      } else {
        // 没过期 可以使用
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v=>v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
      

  },

  // 获取分类数据
 async getCates() {
  // request({
  //   url:'/categories'
  // })
  // .then(res => {
  //   // console.log(res);
  //   this.Cates = res.data.message;

  //   // 把接口的数据存入到本地存储中
  //   wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
      

  //   // 构造左侧的大菜单数据
  //   let leftMenuList = this.Cates.map(v=>v.cat_name);
  //   // 构造右侧的商品数据
  //   let rightContent = this.Cates[0].children;
  //   this.setData({
  //     leftMenuList,
  //     rightContent
  //   })
    
  // })
    // 使用es7的 async await发送请求
    const res = await request({url:"/categories"});
    // this.Cates = res.data.message;
    this.Cates = res;
      // 把接口的数据存入到本地存储中
      wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});    
      // 构造左侧的大菜单数据
      let leftMenuList = this.Cates.map(v=>v.cat_name);
      // 构造右侧的商品数据
      let rightContent = this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent
      })
      

  },
  // 左侧菜单的点击事件
  handleItemTap(e) {
    // console.log(e);
    // 获取被点击的标题身上的索引   给data中的currentIndex就可以了
    const index = e.currentTarget.dataset.index;
    // console.log(index);
    // 根据左侧索引显示右侧的值
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
      // 重新设置 右侧内容的scroll-view标签的距离顶部的距离
      scrollTop:0   
    })

  }
  
})