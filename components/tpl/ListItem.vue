<template>
  <div class="listItem">

    <div v-if="list.length != 0">
      <view v-for="(i,index) in list" :key="index" class="list_item">
        <view class="item_title">

          <div class="title_left">
            <text @click="titleClick(i)">{{i.alias || i.professionName || i.collegeName}}</text>
            <view v-if="i.recommendType == 1" class="t chong">冲</view>
            <view v-if="i.recommendType == 2" class="t wen">稳</view>
            <view v-if="i.recommendType == 3" class="t ti">保</view>
          </div>


          <!--新高考 按专业查询-->
          <div v-if="i.chooseCns" class="title_right">
            选科要求：{{i.chooseCns}}
          </div>

          <!--新高考 按学校查询-->
          <div v-else-if="i.is_sch" class="title_right" @click="recruit(i)">
            匹配专业：{{i.majorNum}}
            <span v-if="showDown" class="iconfont">&#xe611;</span>
          </div>


          <!--普通高考-->
          <div v-else class="title_right" @click="recruit(i)">
            招收专业{{i.majorNum}}
            <span v-if="showDown" class="iconfont">&#xe611;</span>
          </div>


        </view>

        <div class="item_content">

          <view class="content_center">

            <img v-if="i.hasOwnProperty('logo')" :src="$img.url(i.sch_id || i.collegeId)"/>

            <text v-else class="probability_text">{{i.probability}}%</text>

            <view class="center_f">

              <!--新高考 按专业查询-->
              <view v-if="i.collegeCode" class="center_text">
                院校代码 {{i.collegeCode}}
              </view>

              <!--新高考 按学校查询-->
              <view v-else-if="i.majorCode" class="center_text">
                <text>{{i.collegeName}}</text>
                专业代码 {{i.professionCode}}
              </view>

              <!--普通高考-->
              <view v-else class="center_text">
                录取概率
                <text>{{i.probability}}%</text>
                {{i.batch_title}}
              </view>

              <ul class="center_li" v-if="i.hasOwnProperty('tags')">
                <li v-for="(j,index) in i.tags" :key="index">{{j}}</li>
              </ul>
            </view>
          </view>

          <!--
            collect: 1: 已收藏
                     2: 移除
                     0 收藏
          -->
          <view :class="i.is_collect == 1 ? 'yj_like like' : 'like' "
                @tap="i.is_collect === 0 ? AddUserLike(i) : i.is_collect === 2 ? RemoveLike(i,index) : '' ">
            <span v-if="i.is_collect == 0" class="iconfont">&#xe626;</span>
            <text> {{ i.is_collect == 1 ? '已收藏' : i.is_collect == 2 ? '移除' : '收藏' }}</text>
          </view>

        </div>

        <ul class="item_message">
          <li>
            <text>2019最低位次</text>
            <view>{{i.lowestRank  || '- ' }}</view>
          </li>
          <li>
            <text>2019最低分</text>
            <view>{{i.minScore == null || i.minScore == 0 ? '-' : `${i.minScore}分` }}</view>
          </li>
          <li>
            <text>2019招生</text>
            <view>{{i.enterNum || i.planNum ? `${i.enterNum || i.planNum }人` : '-'  }}</view>
          </li>
          <li>
            <text>全国排名</text>
            <view>{{i.rankOfCn || '- '}}</view>
          </li>
        </ul>

      </view>
      <Loading></Loading>
    </div>

    <div v-else class="nodata">暂无数据</div>


  </div>
</template>


<script>
  import uniTransition from "@/components/uni-transition/uni-transition.vue"
  import Loading from "@/components/tpl/Loading.vue"

  export default {
    components: {
      uniTransition,
      Loading
    },
    props: {
      list: {
        type: Array,
        default: []
      },
      showDown: {
        type: Boolean,
        default: true
      }
    },
    created() {

    },
    methods: {
      titleClick(item) {
        this.$emit('titleClick', item)
      },
      AddUserLike(item) {
        this.$emit("AddUserLike", item)
      },
      RemoveLike(item,index) {
        this.$emit("RemoveLike", item,index)
      },
      recruit(item) {
        this.$emit("recruit", item)
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../../common/less/tpl/color";
  .nodata {
    text-align: center;
    font-size: 25.362rpx;
    color: #8d8d8d;
    margin-top: 60rpx;
  }
  .list_item {
    margin: 9.057rpx 18.115rpx;
	  margin-bottom: 27.173rpx;
    padding: 18.115rpx 27.173rpx;
    box-shadow: 0 3px 15px 0 rgba(97,81,66,.18);
    border-radius: 18.115rpx;
    .item_title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title_left{
        width: 70%;
        text {
          font-size: 30.997rpx;
          font-weight: 400;
        }
        .t {
          display: inline-block;
          margin-left: 5.434rpx;
          min-width: 28.985rpx;
          width: 28.985rpx;
          height: 28.985rpx;
          color: #fff;
          font-size: 21.739rpx;
          line-height: 28.985rpx;
          text-align: center;
          border-radius: 7.246rpx;
        }
        .ti {
          background: #16d88e;
        }
        .wen {
          background: #03bfff !important;
        }
        .chong {
          background: #ff5f47 !important;
        }
      }
      .title_right {
        width: 30%;
        text-align: center;
        font-size: 23.95rpx;
        color: #a9a9a9;
        span {
          vertical-align: middle;
          margin-left: 5.434rpx;
        }
      }
    }
    .item_content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 19.927rpx;
      padding-bottom: 14.492rpx;
      border-bottom: 1.811rpx dashed #ede8e3;
      .content_center {
        display: flex;
        align-items: center;
        img {
          width: 90.579rpx;
          height: 90.579rpx;
          margin-right: 16.304rpx;
        }
        .probability_text {
          font-size: 43.778rpx;
          color: @themeColor;
          margin-right: 21.739rpx;
        }
        .center_f {
          .center_text {
            font-size: 27.673rpx;
            color: #696969;
            margin-bottom: 10.869rpx;
			width: 362.618rpx;
            text {
              color: @themeColor;
              margin: 0 9.057rpx;
            }
          }
          .center_li {
            display: flex;
            li {
              background: #f0eeec;
              border-radius: 1.811rpx;
              line-height: 30.997rpx;
              font-size: 23.75rpx;
              color: #aea4ab;
              padding: 1.811rpx 5.434rpx;
              margin: 0 3.623rpx 3.623rpx 0;
            }
          }
        }

      }
    }
  }
</style>