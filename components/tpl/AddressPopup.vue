<template>
  <div class="AddressPopup">
    <uni-popup class="AddressPopup" ref="AddressPopup" type="bottom">
      <div class="title">
        <text class="address">请选择省份</text>
        <text class="submit" @click="close">关闭</text>
      </div>
      <ul>
        <li v-for="(it,index) in address"
            :class="{ on: index ==  cIndex }"
            @click="addressChoice(it,index)"
            :key="index">
          {{ it.title }}
        </li>
      </ul>
    </uni-popup>
  </div>
</template>

<script>
  import uniPopup from "@/components/uni-popup/uni-popup.vue"

  export default {
    components: {
      uniPopup
    },
    props: {
      address: {
        type: Array,
        default: []
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        cIndex: this.currentIndex, // 默认省份
      }
    },
    watch:{
      currentIndex: function (val){
        this.cIndex = val
      }
    },
    methods: {
      open() {
        this.$refs.AddressPopup.open()
      },
      close() {
        this.$refs.AddressPopup.close()
      },
      addressChoice(it,index) {
        this.cIndex = index;
        this.$emit("itemChange", it)
      }
    }
  }
</script>

<style lang="less" scoped>
  @import url("../../common/less/tpl/color");
  .AddressPopup {
    padding: 18.115rpx;
    box-sizing: border-box;
    .title {
      height: 81.521rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 9.057rpx 36.231rpx;
      border-bottom: 1.811rpx solid #ececec;
      .address {
        font-size: 28.985rpx;
      }
      .submit {
        font-size: 27.173rpx;
        color: @themeColor;
      }
    }
    ul {
      display: flex;
      justify-content: space-around;
      text-align: center;
      padding: 0 9.057rpx;
      padding-top: 27.173rpx;
      flex-wrap: wrap;
      li {
        color: #8d8d8d;
        font-size: 25.362rpx;
        width: 16%;
        padding: 5.434rpx;
        border: 1.811rpx solid #e4e4e4;
        border-radius: 54.347rpx;
        margin-bottom: 18.115rpx;
      }
      .on {
        color: @themeColor;
        border: 1.811rpx solid @themeColor;
      }
    }
  }
</style>