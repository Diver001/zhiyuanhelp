<template>
  <!--招生专业-->
  <div class="Major">

      <div class="major_list_item">

        <div class="title">

          <!--如果有学校名称，那么现实学校名称 和专业名-->
          <div v-if="item.sch_name">
            <div class="m_title">概率 {{item.probability}}%</div>
            <slot name="shctitle"></slot>
          </div>

          <!--如果没有学校名称，那么只显示学习标题-->
          <div v-else>
            <div class="m_school_title">{{item.title}}</div>
          </div>


        </div>

        <view class="item_content">

          <div class="left" :data-index="item.logo">
            <img :src="
            item.hasOwnProperty('logo')
            ? $img.url(item.sch_id || item.collegeId)
            : require('@/static/img/current_school.jpg')" alt="">

            <!--判断是否有 学费，如果有显示普通高考 全部院校的布局-->
            <div v-if="item.hasOwnProperty('cost')" class="cen">
              <div class="cen_t">专业代码{{item.code}} 专业学费 {{item.cost}}</div>
              <text class="badeg" v-if="typeof item.tags == 'string' ">{{item.tags}}</text>
            </div>


            <div v-else class="cen">
              <div class="cen_t">{{item.title}} {{item.learnYear}}学制  {{item.degree}}</div>
              <text class="badeg">{{item.typeName}}</text>
              <text class="proportion">男女比例：{{item.sex_bili}}</text>
            </div>

          </div>

          <div class="right" @click="showSchoolPopup(item)">
            <slot name="action"></slot>
          </div>

        </view>

        <div class="item_footer" v-if="item.hasOwnProperty('countSch')">
          2020年在本省招生该专业院校共{{item.countSch}}所，招生人数共{{item.sumPlan}}人
        </div>

        <div class="item_footer" v-else>
          <ul class="item_message">
            <li>
              <text>2018最低位次</text>
              <view>{{item.lowestRank || '- ' }}</view>
            </li>
            <li>
              <text>2018最低分</text>
              <view>{{item.minScore == null || item.minScore == 0 ? '-' : `${item.minScore}分`}}</view>
            </li>
            <li>
              <text>2019录取人数</text>
              <view>{{item.enterNum == null || item.enterNum == 0 ? '-' : `${item.enterNum}人` }}</view>
            </li>
            <li>
              <text>2020招生人数</text>
              <view>{{item.planNum  || '- ' }}</view>
            </li>
          </ul>
        </div>

      </div>

  </div>

</template>

<script>

  export default {
    props: {
      item: {
        type: Object,
        default: {}
      }
    },
    methods: {
      showSchoolPopup(item) {
        this.$emit("showPopup", item)
      }
    },
    components: {
    }
  }
</script>

<style lang="less" scoped>
  .major_list_item {
    border-radius: 14.492rpx;
    background-color: rgba(255, 255, 255, 1);
    border: 1.811rpx solid rgba(255, 255, 255, 0);
    box-shadow: 0 3px 15px 0 rgba(97,81,66,.18);
    padding: 32.608rpx 19.927rpx;
    margin-bottom: 32.608rpx;
    padding-bottom: 0;
    .title {
      overflow: hidden;
      .m_title {
        float: right;
        font-size: 27.173rpx;
        color: #7c7777;
      }
      .m_school_title {
        font-size: 27.173rpx;
        font-weight: 400;
        float: left;
        width: 75%;
      }
    }

    .item_content {
      display: flex;
      margin-top: 18.115rpx;
      padding-bottom: 12.681rpx;
      border-bottom: 1px dashed #ede8e3;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 21.739rpx;
      .left {
        display: flex;
        img {
          width: 88.768rpx;
          height: 88.768rpx;
          margin-right: 14.492rpx;
        }
        .cen {
          .cen_t {
            font-size: 25.362rpx;
            color: #7D7878;
            width: 362.318rpx;
            white-space: pre-wrap;
          }
          .badeg {
            padding: 3.923rpx 12.981rpx; 
			font-size: 23.75rpx; 
			background: #f0eeec; 
			border-radius: 52.536rpx; 
			margin-right: 12.681rpx; 
			color: #aea4ab;
          }
          .proportion {
            font-size: 21.739rpx;
            color: #999595;
          }
        }
      }
    }
    .item_footer {
      font-size: 23.55rpx;
      color: #ACACAC;
      padding: 28.985rpx 10.869rpx;
    }
  }
</style>