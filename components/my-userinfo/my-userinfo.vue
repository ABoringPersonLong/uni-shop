<template>
  <view class="my-userinfo-container">
    <!-- 头像昵称区域 -->
    <view class="top-box">
      <image :src="userinfo.avatarUrl" class="avatar"></image>
      <view class="nickname">{{userinfo.nickName}}</view>
    </view>

    <!-- 面板列表区域 -->
    <view class="panel-list">
      <!-- 第一个面板 -->
      <view class="panel">
        <view class="panel-body">
          <view class="panel-item">
            <text>8</text>
            <text>收藏的店铺</text>
          </view>
          <view class="panel-item">
            <text>14</text>
            <text>收藏的商品</text>
          </view>
          <view class="panel-item">
            <text>18</text>
            <text>关注的商品</text>
          </view>
          <view class="panel-item">
            <text>84</text>
            <text>足迹</text>
          </view>
        </view>
      </view>

      <!-- 第二个面板 -->
      <view class="panel">
        <view class="panel-title">我的订单</view>
        <view class="panel-body">
          <view class="panel-item">
            <image src="/static/my-icons/icon1.png" class="icon"></image>
            <text>待付款</text>
          </view>
          <view class="panel-item">
            <image src="/static/my-icons/icon2.png" class="icon"></image>
            <text>待收货</text>
          </view>
          <view class="panel-item">
            <image src="/static/my-icons/icon3.png" class="icon"></image>
            <text>退款/退货</text>
          </view>
          <view class="panel-item">
            <image src="/static/my-icons/icon4.png" class="icon"></image>
            <text>全部订单</text>
          </view>
        </view>
      </view>

      <!-- 第三个面板 -->
      <view class="panel">
        <view class="panel-list-item">
          <text>收货地址</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
        <view class="panel-list-item">
          <text>联系客服</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
        <view class="panel-list-item" @click="logout">
          <text>退出登录</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: 'my-userinfo',
    methods: {
      ...mapMutations('moduleUser', ['updateAddress', 'updateUserInfo', 'updateToken']),
      // 退出登录
      async logout() {
        // 询问用户是否退出登录
        const [error, success] = await uni.showModal({
          title: '提示',
          content: '确认退出登录吗？',
        }).catch(error => error)

        // 用户确认了退出登录的操作
        if (success && success.confirm) {
          this.updateAddress({})
          this.updateUserInfo({})
          this.updateToken('')
        }
      }
    },
    computed: {
      ...mapState('moduleUser', ['userinfo'])
    }
  }
</script>

<style lang="scss">
  .my-userinfo-container {
    height: 100%;
    background-color: #f4f4f4;

    // 头像昵称区域
    .top-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 400rpx;
      background-color: #c00000;

      .avatar {
        display: block;
        border-radius: 45px;
        border: 2px solid white;
        box-shadow: 0 1px 5px black;
        width: 90px;
        height: 90px;
      }

      .nickname {
        margin-top: 10px;
        color: white;
        font-size: 16px;
        font-weight: bold;
      }
    }

    // 面板列表区域
    .panel-list {
      position: relative;
      top: -10px;
      padding: 0 10px;

      .panel {
        border-radius: 3px;
        margin-bottom: 8px;
        background-color: white;

        .panel-title {
          border-bottom: 1px solid #f4f4f4;
          padding-left: 10px;
          line-height: 45px;
          font-size: 15px;
        }

        .panel-body {
          display: flex;
          justify-content: space-around;

          .panel-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
            padding: 10px 0;
            font-size: 13px;

            .icon {
              width: 35px;
              height: 35px;
            }
          }
        }

        .panel-list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 10px;
          height: 45px;
          font-size: 15px;
        }
      }
    }
  }
</style>
