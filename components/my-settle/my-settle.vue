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
    <view class="btn-settle">结算({{checkedCount}})</view>
  </view>
</template>

<script>
  import {mapMutations, mapGetters} from 'vuex'

  export default {
    name: 'my-settle',
    methods: {
      ...mapMutations('moduleCart', ['updateAllGoodsState']),
      // 点击全选按钮
      changeAllState() {
        this.updateAllGoodsState(!this.isFullCheck) // 当前全选按钮的状态取反之后，就是最新的勾选状态
      }
    },
    computed: {
      ...mapGetters('moduleCart', ['total', 'checkedCount', 'checkedGoodsAmount']),
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
