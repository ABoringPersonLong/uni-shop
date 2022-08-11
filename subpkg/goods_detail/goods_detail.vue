<template>
  <view v-if="goods_info.goods_name">
    <!-- 轮播图区域 -->
    <swiper indicator-dots autoplay :interval="3000" :duration="1000" circular>
      <swiper-item v-for="(item, index) in goods_info.pics" :key="index">
        <image :src="item.pics_big" @click="preview(index)"></image>
      </swiper-item>
    </swiper>

    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <view class="price">￥{{goods_info.goods_price}}</view>
      <view class="goods-info-body">
        <view class="goods-name">{{goods_info.goods_name}}</view>
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <view class="yf">快递：免运费</view>
    </view>

    <!-- 商品详情信息 -->
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>
    
    <!-- 商品导航组件 -->
    <view class="goods_nav">
      <uni-goods-nav fill :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick"/>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        goods_info: {}, // 商品详情对象
        options: [ // 左侧按钮组的配置对象
          {
            icon: 'shop',
            text: '店铺'
          },
          {
            icon: 'cart',
            text: '购物车',
            info: 2
          }
        ],
        buttonGroup: [ // 右侧按钮组的配置对象
          {
            text: '加入购物车',
            backgroundColor: '#f00',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: '#ffa200',
            color: '#fff'
          }
        ]
      }
    },
    onLoad(options) {
      const goods_id = options.goods_id // 获取商品 Id
      this.getGoodsDetail(goods_id) // 调用请求商品详情数据的方法
    },
    methods: {
      // 获取商品详情数据
      async getGoodsDetail(goods_id) {
        const {data} = await uni.$http.get('/api/public/v1/goods/detail', {goods_id})
        if (data.meta.status !== 200) return uni.$showMsg()

        // 使用字符串的 replace() 方法，为 img 标签添加行内的 style 样式，从而解决图片底部空白间隙的问题
        // 使用字符串的 replace() 方法，将 webp 的后缀名替换为 jpg 的后缀名
        data.message.goods_introduce = data.message.goods_introduce.replace(/<img /g, '<img style="display: block;" ').replace(/webp/g, 'jpg')

        this.goods_info = data.message
      },
      // 实现轮播图的预览效果
      preview(index) {
        // 调用 uni.previewImage() 方法预览图片
        uni.previewImage({
          current: index, // 预览时，默认显示图片的索引
          urls: this.goods_info.pics.map(item => item.pics_big) // 所有图片 url 地址的数组
        })
      },
      // 点击左侧按钮组的按钮
      onClick({content: {text}}) {
        if (text === '购物车') uni.switchTab({url: '/pages/cart/cart'})
      },
      // 点击右侧按钮组的按钮
      buttonClick({content: {text}}) {
        console.log(`点击了 “${text}” 按钮`)
      }
    }
  }
</script>

<style lang="scss">
  // 轮播图区域
  swiper {
    height: 750rpx;
  
    image {
      width: 100%;
      height: 100%;
    }
  }
  
  // 商品信息区域
  .goods-info-box {
    padding: 10px;
    padding-right: 0;
  
    .price {
      margin: 10px 0;
      color: #c00000;
      font-size: 18px;
    }
  
    .goods-info-body {
      display: flex;
      justify-content: space-between;
  
      .goods-name {
        padding-right: 10px;
        font-size: 13px;
      }

      .favi {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 120px;
        border-left: 1px solid #efefef;
        color: gray;
        font-size: 12px;
      }
    }

    .yf {
      margin: 10px 0;
      color: gray;
      font-size: 12px;
    }
  }

  // 商品导航组件
  .goods-detail-container {
    // 给页面外层的容器，添加 50px 的内padding，
    // 防止页面内容被底部的商品导航组件遮盖
    padding-bottom: 50px;
  }

  .goods_nav {
    // 为商品导航组件添加固定定位
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
</style>
