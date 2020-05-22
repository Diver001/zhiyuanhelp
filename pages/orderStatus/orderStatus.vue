<template>
  <div class="order_status">
    <Header title="我的成绩">
      <view class="add_score" slot="action" @click="editScore">
        <span class="iconfont">&#xe626;</span>
        <text>测算新分数</text>
      </view>
    </Header>
    <div class="order_status_content">

      <!--当前使用分数-->
      <TipsTitle title="当前使用分数"></TipsTitle>

      <div class="score_item">
        <text class="score">{{UserInfo.proName}} {{UserInfo.subTypeName || UserInfo.subName}} {{UserInfo.score}}分</text>
        <text class="tips">当前分数</text>
      </div>

      <!--未支付分数-->
      <TipsTitle title="未支付分数"></TipsTitle>

      <div class="NoPayOrder" v-if="NoPayOrder.length != 0">
          <div class="score_item" @click="useOrder(item)" v-for="(item,index) in NoPayOrder">
            <text class="score">{{item.province_title}} {{item.subTypeName || item.subName}} {{item.score}}分</text>
            <text class="tips" @click.stop="againPlay(item)">点击支付</text>
          </div>
      </div>

      <div class="error" v-else>
        暂无数据
      </div>


      <!--已支付分数-->
      <TipsTitle title="已支付分数"></TipsTitle>

      <div class="PayOrder" v-if="PayOrder.length != 0">
        <div @click="useOrder(item)" class="score_item" v-for="(item,index) in PayOrder">
          <text class="score">{{ item.province_title }} {{ item.subTypeName || item.subName }} {{ item.score }}</text>
          <ul class="status">
            <li :class=" item.vip.toString().includes(1) ? '' : 'no' ">算</li>
            <li :class=" item.vip.toString().includes(2) ? '' : 'no' ">筛</li>
            <li :class=" item.vip.toString().includes(3) ? '' : 'no' ">专</li>
          </ul>
        </div>
      </div>

      <div class="error" v-else>
        暂无数据
      </div>


      <CustomerService></CustomerService>

    </div>
  </div>
</template>

<script>
  import Header from '@/components/tpl/Header.vue'
  import TipsTitle from '@/components/tpl/TipsTitle.vue'
  import CustomerService from '@/components/tpl/CustomerService.vue'

  export default {
    components: {
      Header,
      TipsTitle,
      CustomerService
    },
    data() {
      return {
        UserInfo: { proName: '' },
        createdOrder: { // 下单的参数
          is_login: 0,  // 是否登录用户
          token: '',    // 用户token，登录是必须要
          telnum: '',   // rsa加密后的手机号（用户未登录情况下必填）
          subType: 0,   // 1文科，2理科默认0
          score: 0,     // 分数
          mySub: 0,     // 新高考考生的科目和特殊高考科目默认0
          userPro: 0,   // 考生所在省
          province: "",  // 省份real_code 当用户未登录的时候必填
          chooseLevel: 0, // 特殊高考的成绩对应mySub 默认0
          vip_type: 1     // 购买会员类型
        },
        NoPayOrder: [],     // 未付款订单
        PayOrder: []        // 付款的订单
      }
    },
    async onShow() {
      await this.$utils.isLogin();
      this.UserInfo = this.$utils.getLocalStorage("user_message");
      this.getMyOrder()
    },
    methods: {

      editScore() {
        getApp().globalData.status.identity = 'new'
        getApp().globalData.status.action = 'needInput'
        uni.navigateTo({
          url: '../startUp/startUp?action=add'
        });
      },

      /**
       * 点击已支付分数的使用，使用已支付分数
       */
      async useOrder(item) {
        console.log(item)
        uni.showModal({
          title: '温馨提示',
          content: '点击【确定】使用该分数作为默认查询的条件！',
          success: async res => {
            if (res.confirm) {

              // 保存数据到userinput 中
              let userInput = this.$utils.getUserInput() || this.$utils.getLocalStorage("user_message");
              userInput.mySub = item.mykemu;
              this.$utils.setLocalStorage("user_input", userInput)

              let UpdateInfo = {}
              UpdateInfo.token = this.UserInfo.token
              UpdateInfo.subType = item.wenli
              UpdateInfo.score = item.score
              UpdateInfo.mySub = item.mykemu
              UpdateInfo.province = item.stu_province / 10000
              UpdateInfo.chooseLevel = this.UserInfo.chooseLevel

              let res = await this.$http.startUpService.modifyUser(UpdateInfo);
              res.data.subTypeName = item.subTypeName

              this.$utils.setLocalStorage("user_message", res.data)
              this.$utils.enterPage("../index/index")
            }
          }
        });
      },
      /**
       * 点击支付 按钮的点击事件
       */
      againPlay(item) {
        this.$utils.enterPage(`../payment/payment?type=${item.vip}&item=${JSON.stringify(item)}`)
      },
      /**
       * 获取订单
       * @returns {Promise<void>}
       */
      async getMyOrder() {
        let res = await this.$http.userService.myOrders({
          token: this.$utils.getLocalStorage("user_message").token
        });
        this.NoPayOrder = res.data.NoPayOrder
        this.PayOrder = res.data.payOrder
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../common/less/page/orderStatus.less";

</style>