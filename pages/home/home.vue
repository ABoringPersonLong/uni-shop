<template>
  <view>
    <!-- 使用自定义的搜索组件 -->
    <view class="search-box">
      <my-search @click="gotoSearch"/>
    </view>

    <!-- 轮播图区域 -->
    <swiper indicator-dots autoplay :interval="3000" circular>
      <swiper-item v-for="(item, index) in swiperList" :key="index">
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>

    <!-- 分类导航区域 -->
    <view class="nav-list">
      <view class="nav-item" v-for="(item, index) in navList" :key="index" @click="navClickHandler(item)">
        <image :src="item.image_src" class="nav-img"></image>
      </view>
    </view>

    <!-- 楼层区域 -->
    <view class="floor-list">
      <view class="floor-item" v-for="(item, index) in floorList" :key="index">
        <!-- 楼层标题 -->
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <!-- 楼层图片区域 -->
        <view class="floor-img-box">
          <!-- 左侧大图片的盒子 -->
          <navigator class="left-img-box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src"
                   :style="{width: item.product_list[0].image_width + 'rpx'}"
                   mode="widthFix"
            ></image>
          </navigator>
          <!-- 右侧 4 个小图片的盒子 -->
          <view class="right-img-box">
            <navigator class="right-img-item"
                       v-for="(item2, index2) in item.product_list"
                       v-if="index2 !== 0"
                       :key="index2"
                       :url="item2.url"
            >
              <image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js' // 导入自己封装的 mixin 模块

  export default {
    mixins: [badgeMix], // 将 badgeMix 混入到当前的页面中进行使用
    data() {
      return {
        swiperList: [], // 轮播图的数据列表
        navList: [], // 分类导航的数据列表
        floorList: [] // 楼层的数据列表
      }
    },
    methods: {
      // 获取轮播图列表
      async getSwiperList() {
        const {data} = await uni.$http.get('/api/public/v1/home/swiperdata')
        if (data.meta.status !== 200) return uni.$showMsg()
        this.swiperList = data.message
      },
      // 获取分类导航列表
      async getNavList() {
        const {data} = await uni.$http.get('/api/public/v1/home/catitems')
        if (data.meta.status !== 200) return uni.$showMsg()
        this.navList = data.message
      },
      // nav-item 项被点击时候的事件处理函数
      navClickHandler(item) {
        if (item.name === '分类') uni.switchTab({url: '/pages/cate/cate'})
      },
      // 获取楼层列表
      async getFloorList() {
        const {data} = await uni.$http.get('/api/public/v1/home/floordata')
        if (data.meta.status !== 200) return uni.$showMsg()

        // 通过双层 forEach 循环，添加 url 属性
        data.message.forEach(floor => {
          floor.product_list.forEach(prod => {
            prod.url = `/subpkg/goods_list/goods_list?${prod.navigator_url.split('?')[1]}`
          })
        })

        this.floorList = data.message
      },
      // 点击搜索
      gotoSearch() {
        uni.navigateTo({url: '/subpkg/search/search'})
      }
    },
    onLoad() {
      this.getSwiperList()
      this.getNavList()
      this.getFloorList()
    }
  }
</script>

<style lang="scss">
  // 搜索框
  .search-box {
    position: sticky; // 设置定位效果为 “吸顶”
    top: 0;
    z-index: 999;
  }

  // 轮播图区域
  swiper {
    height: 330rpx;

    .swiper-item,
    image {
      width: 100%;
      height: 100%;
    }
  }

  // 分类导航区域
  .nav-list {
    display: flex;
    justify-content: space-around;
    margin: 15px 0;

    .nav-img {
      width: 128rpx;
      height: 140rpx;
    }
  }

  // 楼层区域
  .floor-list {
    // 楼层标题
    .floor-title {
      display: flex;
      width: 100%;
      height: 60rpx;
    }

    // 楼层图片区域
    .floor-img-box {
      display: flex;
      padding-left: 10rpx;

      // 右侧 4 个小图片的盒子
      .right-img-box {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
      }
    }
  }
</style>
