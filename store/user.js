export default {
  namespaced: true, // 开启命名空间
  state: {
    address: JSON.parse(uni.getStorageSync('uni_shop_address') || '{}') // 收货地址
  },
  mutations: {
    // 更新收货地址
    updateAddress(state, address) {
      state.address = address
      this.commit('moduleUser/saveAddressToStorage') // 通过 this.commit() 方法，调用 moduleUser 模块下的 saveAddressToStorage 方法持久化存储到本地
    },
    // 将 address 持久化存储到本地
    saveAddressToStorage(state) {
      uni.setStorageSync('uni_shop_address', JSON.stringify(state.address))
    }
  },
  actions: {},
  getters: {
    // 收货详细地址的计算属性
    addstr(state) {
      const {address} = state
      if (!address.provinceName) return ''
      return address.provinceName + address.cityName + address.countyName + address.detailInfo // 拼接 省，市，区，详细地址 的字符串并返回给用户
    }
  }
}