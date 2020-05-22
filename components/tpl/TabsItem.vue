<template>
  <div class="tabs_item">
    <div class="city_action">
      <view v-if="hiddenClosed" class="iconfont closed" @click="Closed">&#xe627;</view>
      <view v-if="hiddenClear" class="clear" @click="Clear">重置</view>
      <view v-if="hiddenSubmit" class="determine" @click="Submit">{{submitTitle}}</view>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      refName: {
        type: String,
        default: ""
      },
      hiddenClear: {
        type: Boolean,
        default: true
      },
      submitTitle: {
        type: String,
        default: "确定"
      },
      hiddenSubmit: {
        type: Boolean,
        default: true
      },
      hiddenClosed: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      Closed() {
        this.$emit("Closed")
      },
      /**
       * 重置
       */
      Clear() {
        this.$emit("Clear")
      },
      Submit() {
        this.$emit("Submit")
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../../common/less/index";

  .city_action {
    width: 100%;
    height: 97.826rpx;
    color: #fff;
    font-size: 30.997rpx;
    display: flex;
    margin-top:126.811rpx;
    position: fixed;
    left: 0;
    bottom: 0;

    .closed {
      position: absolute;
      top: -112.318rpx;
      color: #1b78fa;
      font-size: 54.347rpx;
      left: 50%;
      margin-left: calc(-54.347rpx / 2);
    }
    .clear {
      text-align: center;
      width: 50%;
      line-height: 97.826rpx;
      background-color: #1ba3fa;
    }
    .determine {
      width: 50%;
      text-align: center;
      line-height: 97.826rpx;
      background-color: @themeColor;
    }
  }
</style>