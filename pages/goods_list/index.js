// pages/goods_list/index.js

/*
  用户上划页面 滚动条触底 开始加载下一页数据
  1 找到滚动条触底事件   微信小程序官方开发文档找
  2 判断还有没有下一页数据
     获取到总页数 
     总页数 = Math.ceil(总条数 / 页容量 pagesize)
     获取当前的页码 pagenum
     判断当前页码是否大于等于 总页数
     大于 没有下一页数据
  3 假如没有下一页数据 弹出一个提示
  4 假如还有下一页数据  来加载下一页数据
    当前的页码 ++
    重新发送请求
    数据请求回来 要对data中的数组 进行 拼接  而不是全部替换!!!

2 下拉刷新页面
  1 触发下拉刷新事件  需要在页面的json文件中开启一个配配置项
  找到 触发下拉刷新的事件
  2 重置 数据 数组
  3 重置页码 设置为1
  4 重新发送请求
  5 数据请求回来 需要手动的关闭等待效果

* */

import { request } from "../../request/index.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      },
    ],
    goodsList:[]
  },
  // 接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  totalPages:1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // console.log(options);
      this.QueryParams.cid = options.cid||"";
      this.QueryParams.query = options.query||"";
      this.getGoodsList();
  },

  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({url:"/goods/search",data:this.QueryParams});
    // console.log(res);
    // 获取总条数
    const total = res.total;
    this.totalPages = Math.ceil(total/this.QueryParams.pagesize);
    this.setData({
      // goodsList:res.goods
      // 拼接数组
      goodsList:[...this.data.goodsList,...res.goods]
    })
    
    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口  直接关闭也不会报错
    wx.stopPullDownRefresh();
  },

  // 标题的点击事件，子组件传过来
  handleTabsItemChange(e) {
    // console.log(e);
    
    // 获取被点击的标题索引
    const {index} = e.detail;
    // 修改原数组
    let {tabs}=this.data;
    tabs.forEach((v,i) => i===index?v.isActive=true:v.isActive=false);
    //赋值到data中
    this.setData({
      tabs
    })
  },

  // 页面上滑 滚动条触底事件
  onReachBottom() {
    // console.log("触底");
    // 判断还有没有下一页数据
    if (this.QueryParams.pagenum>=this.totalPages) {
      // console.log("没有下一页数据");
      wx.showToast({
        title: '没有下一页数据',
      });
        
    } else {
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  // 下拉刷新事件
  onPullDownRefresh() {
    // 1 重新数组
    this.setData({
      goodsList:[]
    })
    // 2 重新页码
    this.QueryParams.pagenum=1;
    // 3 重新发送请求
    this.getGoodsList();
  }
  
})