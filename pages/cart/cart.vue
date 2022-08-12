<template>
  <view>
    <!-- 购物车区域 -->
    <view class="cart-container" v-if="cart.length !== 0">
      <!-- 收货地址组件 -->
      <my-address></my-address>

      <!-- 购物车商品列表的标题区域 -->
      <view class="cart-title">
        <uni-icons type="shop" size="18"></uni-icons>
        <text class="cart-title-text">购物车</text>
      </view>

      <!-- 商品列表区域 -->
      <!-- uni-swipe-action 是最外层包裹性质的容器 -->
      <uni-swipe-action>
        <view v-for="(item, index) in cart" :key="index">
          <!-- uni-swipe-action-item 可以为其子节点提供滑动操作的效果。需要通过 right-options 属性来指定操作按钮的配置信息 -->
          <uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(item)">
            <my-goods :goods="item" showRadio showNum @radio-change="radioChangeHandler" @num-change="numberChangeHandler"></my-goods>
          </uni-swipe-action-item>
        </view>
      </uni-swipe-action>

      <!-- 结算区域，使用自定义的结算组件 -->
      <my-settle></my-settle>
    </view>

    <!-- 空白购物车区域 -->
    <view class="empty-cart" v-else>
      <image src="/static/cart_empty@2x.png" class="empty-img"></image>
      <text class="tip-text">空空如也~</text>
    </view>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js' // 导入自己封装的 mixin 模块
  import {mapState, mapMutations} from 'vuex'

  export default {
    mixins: [badgeMix], // 将 badgeMix 混入到当前的页面中进行使用
    data() {
      return {
        options: [
          {
            text: '删除', // 显示的文本内容
            style: {
              backgroundColor: '#C00000' // 按钮的背景颜色
            }
          }
        ]
      }
    },
    methods: {
      ...mapMutations('moduleCart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
      // 商品的勾选状态发生变化
      radioChangeHandler(goods) {
        this.updateGoodsState(goods)
      },
      // 商品的数量发生变化
      numberChangeHandler(goods) {
        this.updateGoodsCount(goods)
      },
      // 点击了滑动操作按钮
      swipeActionClickHandler({goods_id}) {
        this.removeGoodsById(goods_id)
      }
    },
    computed: {
      ...mapState('moduleCart', ['cart'])
    }
  }
</script>

<style lang="scss">
  // 购物车区域
  .cart-container {
    padding-bottom: 50px;

    .cart-title {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #efefef;
      padding-left: 5px;
      height: 40px;
      font-size: 14px;
    
      .cart-title-text {
        margin-left: 10px;
      }
    }
  }

  // 空白购物车区域
  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;

    .empty-img {
      width: 90px;
      height: 90px;
    }

    .tip-text {
      font-size: 12px;
      color: gray;
      margin-top: 15px;
    }
  }
</style>
