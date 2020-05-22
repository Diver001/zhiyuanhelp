<template>
  <div class="TipsTitle">
    {{title}}
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../common/less/index";
  .TipsTitle {
    margin-top: 18.115rpx;
    font-size: 29.985rpx;
    padding-left: 21.939rpx;
    margin-bottom: 18.515rpx;
    color: #000;
    font-weight: 500;
    border-left: 5.434rpx solid @themeColor;
  }
</style>
