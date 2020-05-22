<template>
  <!--如果是pc访问，限制头部导航条宽度-->
  <div :class=" scrolled ? 'nav back' : 'nav ddd'">
    <view class="navigation" @click="back">
      <span class="iconfont">&#xe654;</span>
      <text>{{ title }}</text>
    </view>
  </div>
</template>

<script>

  export default {
    props: {
      title: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        scrolled: false
      }
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll);
    },
    methods: {
      handleScroll () {
        this.scrolled = window.scrollY > 50;
      },
      back() {
        if (this.$utils.getLocalStorage("order_message")) {
          this.$utils.enterPage("../index/index")
        } else {
          this.$utils.backPage()
        }
      }
    }
  }

</script>

<style scoped lang="less">
  .nav {
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 999;
    background: rgba(27, 120, 250, 0);
    transition: all 2s ease;
  }
  .back {
    background: rgba(27, 120, 250, 1);
  }
  .navigation {
    width: 100%;
    height: 79.71rpx;
    font-size: 28.985rpx;
    color: #fff;
    display: flex;
    align-items: center;
    padding: 0 18.115rpx;
    box-sizing: border-box;
    margin: 0;
    span {
      margin-right: 23.55rpx;
    }
  }
</style>