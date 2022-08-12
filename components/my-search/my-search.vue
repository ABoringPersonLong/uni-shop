<template>
  <view class="my-search-container" :style="{backgroundColor: bgcolor}">
    <view class="my-search-box" :style="{borderRadius: radius + 'px'}" @click="searchBoxHandler">
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'my-search',
    props: {
      bgcolor: {default: '#C00000', type: String}, // 背景颜色
      radius: {default: 18, type: Number} // 圆角尺寸，单位是 px
    },
    data() {
      return {}
    },
    methods: {
      // 点击了模拟的 input 输入框
      searchBoxHandler() {
        this.$emit('click') // 触发外界通过 @click 绑定的 click 事件处理函数
      }
    }
  }
</script>

<style lang="scss">
  .my-search-container {
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 50px;

    .my-search-box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 36px;
      background-color: #ffffff;
    
      .placeholder {
        margin-left: 5px;
        font-size: 15px;
      }
    }
  }
</style>
