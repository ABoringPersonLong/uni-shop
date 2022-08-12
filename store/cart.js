export default {
  namespaced: true, // 为当前模块开启命名空间
  state: {
    cart: JSON.parse(uni.getStorageSync('uni_shop_cart') || '[]') // 购物车的数组，用来存储购物车中每个商品的信息对象
  },
  mutations: {
    // 加入购物车
    addToCart(state, goods) {
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id) // 根据 goods_id 查找购物车中是否存在这件商品
      if (findResult) findResult.goods_count++ // 如果有
      else state.cart.push(goods) // 如果没有
      
      this.commit('moduleCart/saveToStorage') // 通过 commit 方法，调用 moduleCart 命名空间下的 saveToStorage 方法持久化存储到本地
    },
    // 将购物车中的数据持久化存储到本地
    saveToStorage(state) {
      uni.setStorageSync('uni_shop_cart', JSON.stringify(state.cart))
    },
    // 更新购物车中商品的勾选状态
    updateGoodsState(state, goods) {
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id) // 根据 goods_id 查找购物车中是否存在这件商品
      if (findResult) {
        findResult.goods_state = goods.goods_state // 更新对应商品的勾选状态
        this.commit('moduleCart/saveToStorage') // 持久化存储到本地
      }
    },
    // 更新购物车中商品的数量
    updateGoodsCount(state, goods) {
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id) // 根据 goods_id 查找购物车中是否存在这件商品
      if(findResult) {
        findResult.goods_count = goods.goods_count // 更新对应商品的数量
        this.commit('moduleCart/saveToStorage') // 持久化存储到本地
      }
    },
    // 根据 Id 从购物车中删除对应的商品信息
    removeGoodsById(state, goods_id) {
      state.cart = state.cart.filter(item => item.goods_id !== goods_id) // 用过滤的方式进行删除
      this.commit('moduleCart/saveToStorage') // 持久化存储到本地
    },
    // 更新所有商品的勾选状态
    updateAllGoodsState(state, newGoodsState) {
      state.cart.forEach(item => item.goods_state = newGoodsState) // 循环更新购物车中每件商品的勾选状态
      this.commit('moduleCart/saveToStorage') // 持久化存储到本地
    }
  },
  actions: {},
  getters: {
    // 统计购物车中商品的总数量
    total(state) {
      return state.cart.reduce((total, item) => total += item.goods_count, 0)
    },
    // 计算勾选的商品的总数量
    checkedCount(state) {
      return state.cart.filter(item => item.goods_state).reduce((total, item) => total += item.goods_count, 0)
    },
    // 已勾选的商品的总价
    checkedGoodsAmount(state) {
      return state.cart.filter(item => item.goods_state).reduce((total, item) => total += item.goods_count * item.goods_price, 0).toFixed(2)
    }
  }
}
