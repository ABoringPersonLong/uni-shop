<template>
  <view>
    my.vue 页面
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js' // 导入自己封装的 mixin 模块

  export default {
    mixins: [badgeMix] // 将 badgeMix 混入到当前的页面中进行使用
  }
</script>

<style lang="scss">

</style>
