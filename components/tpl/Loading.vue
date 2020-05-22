<template>
  <div class="loading" :data-index="$store.state.showStatus">
    <div class="WaitingText" v-if="$store.state.showStatus == 1">{{waitingText}}</div>
    <div class="EndText" v-else-if="$store.state.showStatus == 2">{{endText}}</div>
    <div class="EmptyText" v-else="$store.state.showStatus == 3">{{emptyText}}</div>
  </div>
</template>

<script>
  export default {
    props: {
      waitingText: {
        type: String,
        default: "正在加载.."
      },
      endText: {
        type: String,
        default: "加载完成"
      },
      emptyText: {
        type: String,
        default: "暂无数据"
      }
    },
    data() {
      return {
      }
    },
    onLaunch() {
    },
    created() {
    },
    methods: {

    }
  }
</script>

<style scoped lang="less">
  .loading {
    .WaitingText,
    .EmptyText,
    .EndText{
      margin-top: 20px;
      font-size: 27.173rpx;
      text-align: center;
      color: #a499a1;
    }
  }
</style>
