import {mapGetters} from 'vuex'

// 导出一个 mixin 对象
export default {
  methods: {
    // 购物车 tabBar 设置右上角的徽标
    setBadge() {
      uni.setTabBarBadge({
        index: 2, // 索引
        text: this.total + '' // 注意：text 的值必须是字符串，不能是数字
      })
    }
  },
  computed: {
    ...mapGetters('moduleCart', ['total']),
  },
  watch: {
    total: {
      handler() {
        this.setBadge() // 在 total 改变的时候，设置数字徽标
      },
      immediate: true // 表示页面初次渲染好之后，就立即触发当前的 watch 侦听器
    }
  }
}