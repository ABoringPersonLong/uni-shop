import Vue from 'vue'
import App from './App.vue'
import store from './store/store.js'

// 按需导入 $http 对象
import {$http} from '@escook/request-miniprogram'
// 设置请求根路径
$http.baseUrl = 'https://api-ugo-web.itheima.net'
// 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http

// 请求开始之前显示 loading 效果
$http.beforeRequest = () => uni.showLoading({title: '数据加载中...'})

// 请求完成之后隐藏 loading 效果
$http.afterRequest = () => uni.hideLoading()

// 封装展示消息提示的方法
uni.$showMsg = (title = '数据加载失败！') => uni.showToast({title, icon: 'none'})

Vue.config.productionTip = false

App.mpType = 'app'

new Vue({
  ...App,
  store
}).$mount()
