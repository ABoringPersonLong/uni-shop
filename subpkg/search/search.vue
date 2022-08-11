<template>
  <view>
    <!-- 搜索框 -->
    <view class="search-box">
      <!-- 使用 uni-ui 提供的搜索栏组件 -->
      <uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
    </view>

    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchResults.length !== 0">
      <view class="sugg-item" v-for="(item, index) in searchResults" :key="index" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>

    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
      </view>
      <view class="history-list">
        <uni-tag v-for="(item, index) in historys" :key="index" :text="item" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        timer: null, // 延时器的 timerId
        kw: '', // 搜索关键词
        searchResults: [], // 搜索结果列表
        historyList: JSON.parse(uni.getStorageSync('uni_shop_kw') || '[]') // 搜索关键词的历史记录
      }
    },
    methods: {
      input(value) {
        // 防抖处理
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.kw = value
          this.getSearchList()
        }, 500)
      },
      // 根据搜索关键词，搜索商品建议列表
      async getSearchList() {
        // 判断关键词是否为空
        if (this.kw === '') {
          this.searchResults = []
          return
        }

        // 发起请求，获取搜索建议列表
        const {data} = await uni.$http.get('/api/public/v1/goods/qsearch', {query: this.kw})
        if (data.meta.status !== 200) return uni.$showMsg()
        this.searchResults = data.message
        
        // 查询到搜索建议之后，保存搜索关键词
        this.saveSearchHistory()
      },
      // 点击搜索项，跳转到详情页面
      gotoDetail(goods_id) {
        uni.navigateTo({url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id})
      },
      // 保存搜索关键词
      saveSearchHistory() {
        // 去除重复关键词
        const set = new Set(this.historyList)
        set.delete(this.kw)
        set.add(this.kw)
        this.historyList = Array.from(set)
        uni.setStorageSync('uni_shop_kw', JSON.stringify(this.historyList)) // 将搜索历史记录持久化存储到本地
      },
      // 清空搜索历史记录
      cleanHistory() {
        this.historyList = []
        uni.setStorageSync('uni_shop_kw', '[]')
      },
      // 点击跳转到商品列表页面
      gotoGoodsList(kw) {
        uni.navigateTo({url: '/subpkg/goods_list/goods_list?query=' + kw})
      }
    },
    computed: {
      // 反转搜索关键词的历史记录
      historys() {
        return [...this.historyList].reverse()
      }
    }
  }
</script>

<style lang="scss">
  // 搜索框
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
    
    .uni-searchbar {
      display: flex;
      position: relative;
      padding: 16rpx;
      background-color: #c00000;
    }
  }
  
  // 搜索建议列表
  .sugg-list {
    padding: 0 5px;
  
    .sugg-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #efefef;
      padding: 13px 0;
      font-size: 12px;
  
      .goods-name {
        margin-right: 3px;
        // 一行文字溢出显示省略号（...）
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  
  // 搜索历史
  .history-box {
    padding: 0 5px;
  
    .history-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #efefef;
      height: 40px;
      font-size: 13px;
    }
  
    .history-list {
      display: flex;
      flex-wrap: wrap;
  
      uni-tag {
        margin-top: 5px;
        margin-right: 5px;
        margin-bottom: 5px;
      }
    }
  }
</style>
