import Vue from 'vue'
import Vuex from 'vuex'
import moduleCart from './cart.js' // 导入购物车的 vuex 模块
import moduleUser from './user.js' // 导入用户的 vuex 模块

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  getters: {},
  modules: {
    moduleCart,
    moduleUser
  }
})
