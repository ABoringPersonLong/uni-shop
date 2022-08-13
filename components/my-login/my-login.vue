<template>
  <view class="login-container">
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <button type="primary" class="btn-login" @click="getUserInfo">一键登录</button>
    <view class="tips-text">登录后尽享更多权益</view>
  </view>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: 'my-login',
    methods: {
      ...mapMutations('moduleUser', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
      // 获取微信用户的基本信息
      async getUserInfo() {
        const [error, response] = await uni.getUserProfile({desc: 'wexin'})
        if (error && error.errMsg === 'getUserProfile:fail auth deny') return uni.$showMsg('您取消了登录授权！') // 判断是否获取用户信息成功
        this.updateUserInfo(response.userInfo) // 将用户的基本信息存储到 vuex 中
        this.getToken(response) // 获取登录成功后的 Token 字符串
      },
      // 调用登录接口，换取永久的 token
      async getToken(info) {
        const [error, response] = await uni.login({provider: 'weixin', onlyAuthorize: true}).catch(error => error) // 调用微信登录接口
        if (error || response.errMsg !== 'login:ok') return uni.$showError('登录失败！') // 判断是否 uni.login() 调用失败

        // 准备参数对象
        const query = {
          code: response.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }

        // 换取 token
        const {data} = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        console.log('data', data)
        // ================================================================================================================================ 接口有问题
        // if (data.meta.status !== 200) return uni.$showMsg('登录失败！')
        // this.updateToken(data.message.token) // 更新 vuex 中的 token
        this.updateToken('longyuhuan') // 更新 vuex 中的 token
        this.navigateBack() // 调用 navigateBack 函数，判断是否需要重新导航到对应的页面
      },
      // 返回登录之前的页面
      navigateBack() {
        // redirectInfo 不为 null，并且导航方式为 switchTab
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          uni.switchTab({
            url: this.redirectInfo.from, // 要导航到的页面地址
            complete: () => this.updateRedirectInfo(null) // 导航完成之后，把 vuex 中的 redirectInfo 对象重置为 null
          })
        }
      }
    },
    computed: {
      ...mapState('moduleUser', ['redirectInfo'])
    }
  }
</script>

<style lang="scss">
  .login-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 750rpx;
    background-color: #f8f8f8;
    overflow: hidden;

    &::after {
      position: absolute;
      left: 0;
      display: block;
      border-radius: 100%;
      bottom: 0;
      content: ' ';
      width: 100%;
      height: 40px;
      background-color: white;
      transform: translateY(50%);
    }

    .btn-login {
      border-radius: 100px;
      margin: 15px 0;
      width: 90%;
      background-color: #c00000;
    }

    .tips-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>
