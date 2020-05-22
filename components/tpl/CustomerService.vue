<template>
  <div class="CustomerService">
    <view class="customer_service" @click="goToKf">
      <span class="iconfont">&#xe614;</span>
      <text>联系客服</text>
    </view>
  </div>
</template>

<script>
  export default {
    methods: {
      goToKf(){
        uni.navigateTo({
          url: '../feedback/feedback?type=2&title=联系客服'
        });
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../../common/less/index";
  .customer_service {
    width: 100%;
    bottom: 36.231rpx;
    text-align: center;
    margin: 52.536rpx 0 86.956rpx 0;
    span {
      color: @themeColor;
      font-size: 30.797rpx;
      font-weight: bolder;
      margin-right: 18.115rpx;
    }
    text {
      font-size: 30.797rpx;
      color: #000;
    }
  }
</style>