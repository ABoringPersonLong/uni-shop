export default {
  namespaced: true, // 开启命名空间
  state: {
    address: JSON.parse(uni.getStorageSync('uni_shop_address') || '{}'), // 收货地址
    token: uni.getStorageSync('uni_shop_token') || '', // 登录成功之后的 token 字符串
    userinfo: JSON.parse(uni.getStorageSync('uni_shop_userinfo') || '{}'), // 用户的基本信息
    redirectInfo: null // 重定向的对象 {openType, from}
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
    },
    // 更新用户的基本信息
    updateUserInfo(state, userinfo) {
      state.userinfo = userinfo
      this.commit('moduleUser/saveUserInfoToStorage') // 持久化存储到本地
    },
    // 将 userinfo 持久化存储到本地
    saveUserInfoToStorage(state) {
      uni.setStorageSync('uni_shop_userinfo', JSON.stringify(state.userinfo))
    },
    // 更新 token 字符串
    updateToken(state, token) {
      state.token = token
      this.commit('moduleUser/saveTokenToStorage') // 持久化存储到本地
    },
    // 将 token 字符串持久化存储到本地
    saveTokenToStorage(state) {
      uni.setStorageSync('uni_shop_token', state.token)
    },
    // 更新重定向的信息对象
    updateRedirectInfo(state, info) {
      state.redirectInfo = info
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