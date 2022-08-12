<template>
  <view class="goods-item">
    <!-- 商品左侧图片区域 -->
    <view class="goods-item-left">
      <radio color="#C00000" v-if="showRadio" :checked="goods.goods_state" @click="radioClickHandler"></radio>
      <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
    </view>
    <!-- 商品右侧信息区域 -->
    <view class="goods-item-right">
      <view class="goods-name">{{goods.goods_name}}</view>
      <view class="goods-info-box">
        <view class="goods-price">￥{{goods.goods_price | tofixed}}</view>
        <uni-number-box v-if="showNum" :min="1" :value="goods.goods_count" @change="numChangeHandler"></uni-number-box>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'my-goods',
    props: {
      goods: {default: {}, type: Object}, // 商品的信息对象
      showRadio: {default: false, type: Boolean}, // 是否展示图片左侧的 radio
      showNum: {default: false, type: Boolean} // 是否展示价格右侧的 NumberBox 组件
    },
    data() {
      return {
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png' // 默认的空图片
      }
    },
    methods: {
      // radio 组件的点击事件处理函数
      radioClickHandler() {
        this.$emit('radio-change', {
          goods_id: this.goods.goods_id, // 商品的 Id
          goods_state: !this.goods.goods_state // 商品最新的勾选状态
        })
      },
      // uni-number-box 组件的 change 事件处理函数
      numChangeHandler(value) {
        this.$emit('num-change', {
          goods_id: this.goods.goods_id, // 商品的 Id
          goods_count: +value // 商品的最新数量
        })
      }
    },
    filters: {
      // 把数字处理为带两位小数点的数字
      tofixed(num) {
        return Number(num).toFixed(2)
      }
    }
  }
</script>

<style lang="scss">
  .goods-item {
    display: flex;
    border-bottom: 1px solid #f0f0f0;
    padding: 10px 5px;
    width: 750rpx; // 让 goods-item 项占满整个屏幕的宽度
    box-sizing: border-box;

    .goods-item-left {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-right: 5px;
  
      .goods-pic {
        display: block;
        width: 100px;
        height: 100px;
      }
    }
  
    .goods-item-right {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
  
      .goods-name {
        font-size: 13px;
      }

      .goods-info-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
  
      .goods-price {
        font-size: 16px;
        color: #c00000;
      }
    }
  }
</style>