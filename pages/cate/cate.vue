<template>
  <view>
    <!-- 使用自定义的搜索组件 -->
    <my-search @click="gotoSearch"/>

    <view class="scroll-view-container">
      <!-- 左侧的滚动视图区域 -->
      <scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">
        <block v-for="(item, index) in cateList" :key="index">
          <view :class="['left-scroll-view-item', index === active ? 'active' : '']" @click="activeChanged(index)">
            {{item.cat_name}}
          </view>
        </block>
      </scroll-view>

      <!-- 右侧的滚动视图区域 -->
      <scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item, index) in cateLevel2" :key="index">
          <view class="cate-lv2-title">/ {{item.cat_name}} /</view>
          <!-- 动态渲染三级分类的列表数据 -->
          <view class="cate-lv3-list">
            <view class="cate-lv3-item" v-for="(item2, index2) in item.children" :key="index2" @click="gotoGoodsList(item2)">
              <!-- 这个图片请求不到 -->
              <!-- <image :src="item2.cat_icon"></image> -->
              <image src="../../static/classify.jpeg"></image>
              <text>{{item2.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        wh: 0, // 窗口的可用高度
        cateList: [], // 分类数据列表
        active: 0, // 当前选中项的索引，默认让第一项被选中
        cateLevel2: [], // 二级分类列表
        scrollTop: 0 // 滚动条距离顶部的距离
      }
    },
    onLoad() {
      const sysInfo = uni.getSystemInfoSync() // 获取当前系统的信息
      this.wh = sysInfo.windowHeight - 50 // 屏幕高度 - navigationBar高度 - tabBar高度 - 自定义的search组件高度
      this.getCateList()
    },
    methods: {
      // 获取分类列表
      async getCateList() {
        const {data} = await uni.$http.get('/api/public/v1/categories')
        if (data.meta.status !== 200) return uni.$showMsg()
        this.cateList = data.message // 为分类列表赋值
        this.cateLevel2 = data.message[0].children // 为二级分类赋值
      },
      // 选中项改变的事件处理函数
      activeChanged(index) {
        this.active = index // 改变当前选中项
        this.cateLevel2 = this.cateList[index].children // 为二级分类列表重新赋值
        this.scrollTop = this.scrollTop ? 0 : 1 // 让 scrollTop 的值在 0 与 1 之间切换（不能直接赋值 0，因为赋值前后的值一致的话，赋值不生效）
      },
      // 点击三级分类项跳转到商品列表页面
      gotoGoodsList(item2) {
        uni.navigateTo({url: '/subpkg/goods_list/goods_list?cid=' + item2.cat_id})
      },
      // 点击搜索
      gotoSearch() {
        uni.navigateTo({url: '/subpkg/search/search'})
      }
    }
  }
</script>

<style lang="scss">
  .scroll-view-container {
    display: flex;
  
    // 左侧的滚动视图区域
    .left-scroll-view {
      width: 120px;
  
      .left-scroll-view-item {
        background-color: #f7f7f7;
        line-height: 60px;
        text-align: center;
        font-size: 12px;
  
        // 激活项的样式
        &.active {
          position: relative;
          background-color: #ffffff;
  
          // 渲染激活项左侧的红色指示边线
          &::before {
            position: absolute;
            left: 0;
            top: 50%;
            display: block;
            content: ' ';
            width: 3px;
            height: 30px;
            background-color: #c00000;
            transform: translateY(-50%);
          }
        }
      }
    }

    // 右侧的滚动视图区域
    .right-scroll-view {
      // 二级分类
      .cate-lv2-title {
        padding: 15px 0;
        font-size: 12px;
        font-weight: bold;
        text-align: center;
      }
      
      // 三级分类
      .cate-lv3-list {
        display: flex;
        flex-wrap: wrap;
      
        .cate-lv3-item {
          width: 33.33%;
          margin-bottom: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
      
          image {
            width: 60px;
            height: 60px;
          }
      
          text {
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
