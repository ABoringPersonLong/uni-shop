<template>
  <view class="my-settle-container">
    <!-- 全选区域 -->
    <label class="radio" @click="changeAllState">
      <radio color="#C00000" :checked="isFullCheck"/>
      <text>全选</text>
    </label>

    <!-- 合计区域 -->
    <view class="amount-box">
      合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
    </view>

    <!-- 结算按钮 -->
    <view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
  </view>
</template>

<script>
  import {mapState, mapMutations, mapGetters} from 'vuex'

  export default {
    name: 'my-settle',
    data() {
      return {
        seconds: 3, // 倒计时的秒数
        timer: null // 定时器的 Id
      }
    },
    methods: {
      ...mapMutations('moduleCart', ['updateAllGoodsState']),
      ...mapMutations('moduleUser', ['updateRedirectInfo']),
      // 点击全选按钮
      changeAllState() {
        this.updateAllGoodsState(!this.isFullCheck) // 当前全选按钮的状态取反之后，就是最新的勾选状态
      },
      // 点击了结算按钮
      settlement() {
        if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品！') // 判断是否勾选了商品
        // if (!this.addstr) return uni.$showMsg('请选择收货地址！') // 判断用户是否选择了收货地址
        if (!this.token) return this.delayNavigate() // 判断用户是否登录了，如果没有登录，则调用 delayNavigate() 进行倒计时的导航跳转
        // ============================================================================================================================
        // this.payOrder() // 实现微信支付功能
      },
      // 倒计时导航到 my 页面
      delayNavigate() {
        this.seconds = 3 // 每次进来把 data 中的秒数重置成 3 秒
        this.showTips(this.seconds) // 展示提示消息
        this.timer = setInterval(() => {
          this.seconds--
          if (this.seconds <= 0) {
            clearInterval(this.timer)
            uni.switchTab({
              url: '/pages/my/my', // 跳转到 my 页面
              success: () => { // 页面跳转成功之后的回调函数
                this.updateRedirectInfo({ // 把跳转信息存储到 Store 中
                  openType: 'switchTab', // 跳转的方式
                  from: '/pages/cart/cart' // 从哪个页面跳转过去的
                })
              }
            })
            return
          }
          this.showTips(this.seconds)
        }, 1000)
      },
      // 展示倒计时的提示消息
      showTips(n) {
        uni.showToast({
          title: '请登录后再结算！' + n + ' 秒后自动跳转到登录页',
          icon: 'none',
          mask: true // 为页面添加透明遮罩，防止点击穿透
        })
      },
      // 微信支付
      async payOrder() {
        // 1. 创建订单
        const orderInfo = { // 组织订单的信息对象
          // order_price: this.checkedGoodsAmount, // 开发期间，注释掉真实的订单价格
          order_price: 0.01, // 写死订单总价为 1 分钱
          consignee_addr: this.addstr,
          goods: this.cart.filter(item => item.goods_state).map(item => ({
            goods_id: item.goods_id,
            goods_number: item.goods_count,
            goods_price: item.goods_price
          }))
        }
        const {data} = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo) // 发起请求创建订单
        console.log(data)
        if (data.meta.status !== 200) return uni.$showMsg('创建订单失败！')
        const orderNumber = data.message.order_number // 得到服务器响应的 “订单编号”

        // 2. 订单预支付
        const {data: res} = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {order_number: orderNumber}) // 发起请求获取订单的支付信息
        if (res.meta.status !== 200) return uni.$showError('预付订单生成失败！') // 预付订单生成失败
        const payInfo = res.message.pay // 得到订单支付相关的必要参数

        // 3. 发起微信支付
        const [error, succ] = await uni.requestPayment(payInfo) // 调用 uni.requestPayment() 发起微信支付
        if (error) return uni.$showMsg('订单未支付！') // 未完成支付
        const {data: res2} = await uni.$http.post('/api/public/v1/my/orders/chkOrder', {order_number: orderNumber}) // 完成了支付，进一步查询支付的结果
        if (res2.meta.status !== 200) return uni.$showMsg('订单未支付！') // 检测到订单未支付
        uni.showToast({title: '支付完成！', icon: 'success'}) // 检测到订单支付完成
      }
    },
    computed: {
      ...mapGetters('moduleCart', ['total', 'checkedCount', 'checkedGoodsAmount']),
      ...mapState('moduleUser', ['token']),
      ...mapGetters('moduleUser', ['addstr']),
      // 是否全选
      isFullCheck() {
        return this.total === this.checkedCount
      }
    }
  }
</script>

<style lang="scss">
  .my-settle-container {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 5px;
    width: 100%;
    height: 50px;
    background-color: white;
    font-size: 14px;
    z-index: 999;

    // 全选区域
    .radio {
      display: flex;
      align-items: center;
    }

    // 合计区域
    .amount {
      color: #c00000;
    }

    // 结算按钮
    .btn-settle {
      padding: 0 10px;
      min-width: 100px;
      height: 50px;
      background-color: #c00000;
      color: white;
      line-height: 50px;
      text-align: center;
    }
  }
</style>
