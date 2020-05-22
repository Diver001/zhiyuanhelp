<template>
  <view class="header">
    <navigation :title="title"></navigation>
    <div class="portrait">
      <div class="left">
        <image src="http://static.geekhelp.cn/auth.jpg" alt=""></image>
        <view class="portrait_info">
          <text>{{ UserMessage ? UserMessage.user_name : '未登录' }}</text>
          <view class="phone">手机号：{{ UserMessage ? UserMessage.phone : '购买后自动绑定' }}</view>
        </view>
      </div>
      <div class="right">
        <slot name="action"></slot>
      </div>
    </div>
  </view>
</template>

<script>
  import navigation from '@/components/tpl/navigation.vue'

  export default {
    components: {
      navigation
    },
    props: {
      title: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        UserMessage: this.$utils.getLocalStorage("user_message")
      }
    },
    methods: {

    }
  }
</script>

<style lang="less" scoped>
  @import "../../common/less/index";
  .header {
    width: 100%;
    height: 286.231rpx;
    background: url("~@/static/img/header_back.jpg") no-repeat;
    background-size: cover;
    position: relative;
    padding-top: var(--status-bar-height);
    .portrait {
      position: absolute;
      bottom: -68.84rpx;
      margin: 0 auto;
      height: 217.391rpx;
      left: 50%;
      margin-left: -95% / 2;
      width: 95%;
      border-radius: 19.927rpx;
      background-color: rgba(255, 255, 255, 1);
      text-align: center;
      box-shadow: 0px 0 9.057rpx 3.623rpx rgba(162, 159, 159, 0.4);
      border: 1.811rpx solid rgba(255, 255, 255, 0);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 28rpx;
      box-sizing: border-box;
      .left {
        display: flex;
        align-items: center;

        image {
          width: 124.999rpx;
          height: 130.434rpx;
          border-radius: 128.623rpx;
          margin-right: 27.173rpx;
        }
        .portrait_info {
          text-align: left;
          text {
            color: rgba(16, 16, 16, 1);
            font-size: 27.173rpx;
            text-align: left;
          }
          .phone {
            color: rgba(187, 185, 185, 1);
            font-size: 23.55rpx;
            text-align: left;
          }
        }
      }
      .right {

      }

    }
  }
</style>

