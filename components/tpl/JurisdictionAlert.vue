<template>
  <div class="JurisdictionAlert">
    <uni-popup ref="showpopup" :maskClick="false" class="showpopup" type="center">
     <div class="title">
       <div class="left_tips">
         <span class="iconfont">&#xe660;</span>
         <text>温馨提示</text>
       </div>
       <icon class="closed" @click="cancelPopup(true)" type="cancel" color="#1aa3fa" size="18"/>
     </div>
      <div class="contents" v-html="text"></div>
      <div class="buy" @click="buy">点击购买</div>
      <div v-if="showCancel" @click="cancelPopup(true)" class="cancel">以后再说</div>
    </uni-popup>
  </div>
</template>

<script>
  import uniPopup from "@/components/uni-popup/uni-popup.vue";

  export default {
    props: {
      text: {
        type: String,
        default: ''
      },
      showCancel: {
        type: Boolean,
        default: true
      },
      vipType: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
      }
    },
    methods: {
      buy() {
        this.$emit("clearChoice")
        // 已经登录成功去购买页面
        if (this.$utils.checkLogin()) {
            this.$utils.enterPage(`../payment/payment?type=${this.vipType}`)
        // 没有登录，去登录页面登录
        } else {
          uni.showToast({
            title: '尚未登录，请登录后购买',
            duration: 2000,
            icon: 'none',
            complete: () =>
              setTimeout(() =>
                this.$utils.enterPage(`../login/login?type=${this.vipType}`),1800)
          });
        }
      },
      cancelPopup(type) {
        if (type)  {
          this.$emit("clearChoice")
        } else {
          this.$refs.showpopup.close()
        }
      },
      openPopup() {
        this.$refs.showpopup.open()
      }
    },
    components: {uniPopup}
  }
</script>

<style lang="less" scoped>
  @import "../../common/less/index";
  .JurisdictionAlert {
    .showpopup {

      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 41.666rpx;
        .left_tips {
          .iconfont {
            font-size: 39.855rpx;
            vertical-align: middle;
            color: @themeColor;
          }
          text {
            margin-left: 9.057rpx;
            font-size: 27.173rpx;
          }
        }
		
      }
      .contents {
        font-size: 30.797rpx;
        width: 83%;
        margin: 0 auto;
        margin-bottom: 72.463rpx;
		    line-height: 50.724rpx;
        b {
          color: @themeColor;
        }
      }
      .buy {
        height: 63.405rpx;
        background: @themeColor;
        color: #fff;
        text-align: center;
        line-height: 63.405rpx;
        border-radius: 54.347rpx;
        font-size: 25.362rpx;
        width: 90%;
        margin: 0 auto;
      }
      .cancel {
        color: #BAC2C8;
        text-align: center;
        margin-top: 19.927rpx;
        font-size: 23.55rpx;
      }
    }
  }
</style>

