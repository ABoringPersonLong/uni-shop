<template>
  <view class="goods-list">
    <view v-for="(item, index) in goodsList" :key="index" @click="gotoDetail(item)">
      <!-- 为 my-goods 组件动态绑定 goods 属性的值 -->
      <my-goods :goods="item"></my-goods>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        queryObj: { // 请求参数对象
          query: '', // 查询关键词
          cid: '', // 商品分类 Id
          pagenum: 1, // 当前页
          pagesize: 10 // 每页显示条数
        },
        goodsList: [], // 商品列表的数据
        total: 0, // 总数量，用来实现分页
        isloading: false // 是否正在请求数据
      }
    },
    methods: {
      // 获取商品列表
      async getGoodsList(callback) {
        this.isloading = true // 打开节流阀
        const {data} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        this.isloading = false // 关闭节流阀
        callback && callback() // callback 存在就调用 callback() 函数
        if (data.meta.status !== 200) return uni.$showMsg()
        this.goodsList = [...this.goodsList, ...data.message.goods]
        this.total = data.message.total
      },
      // 点击跳转到商品详情页面
      gotoDetail(item) {
        uni.navigateTo({url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id})
      }
    },
    onLoad(options) {
      // 将页面参数转存到 this.queryObj 对象中
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
    
      this.getGoodsList()
    },
    // 下拉刷新第一页的数据
    onPullDownRefresh() {
      // 重置关键数据
      this.queryObj.pagenum = 1
      this.goodsList = []
      this.total = 0
      this.isloading = false
    
      // 重新发起请求，并把关闭下拉刷新效果的函数传递过去
      this.getGoodsList(() => uni.stopPullDownRefresh())
    },
    // 上拉触底加载下一页数据
    onReachBottom() {
      if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！') // 判断是否还有下一页数据
      if (this.isloading) return // 判断是否正在请求其它数据，如果是，则不发起额外的请求
      this.queryObj.pagenum += 1
      this.getGoodsList()
    }
  }
</script>

<style lang="scss">

</style>
