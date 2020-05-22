<template>
	<view class="work_order">

		<Header title="我的工单"></Header>

		<div class="work_order_content">

			<TipsTitle title="我的工单记录"></TipsTitle>

			<div class="order_content">

				<div v-if="MessageList.length != 0">
					<div class="order_l"
							 @click="showOrderContent(index)"
							 v-for="(item,index) in MessageList">

						<div class="order_item">

							<span class="iconfont">{{item.type == 1 ? '&#xe63b;' : '&#xe66a;' }}</span>

							<div class="item_center">
								<div class="top">
									<text class="title">工单号：{{index + 1}}</text>
									<div class="time">{{item.add_time}}</div>
								</div>
								<div class="mess">{{item.info[0].desc}}</div>
							</div>

							<div :class="item.type == 1 ? 'status error' : 'status success' ">
								{{item.type == 1 ? item.status : item.status }}
							</div>

						</div>

						<div class="show_content" v-show="index == currentIndex">
							<uni-steps :options="item.info"
												 @itemClick="ImageShow"
												 direction="column"
												 active-color="#bbb9b9"
												 :active="1">
							</uni-steps>
						</div>

					</div>
				</div>

				<NoData v-else></NoData>

			</div>

		</div>

	</view>
</template>

<script>
	import Header from '@/components/tpl/Header.vue'
	import TipsTitle from '@/components/tpl/TipsTitle.vue'
	import uniSteps from '@/components/uni-steps/uni-steps.vue'
	import NoData from '@/components/tpl/NoData.vue'

	export default {
		components: {
			Header,
			TipsTitle,
			uniSteps,
			NoData
		},
		created() {
			this.getUserMes()
		},
		data() {
			return {
				currentImageIndex: 0, // 预览图片显示第几个
				currentIndex: 0,   // 默认打开的第一个留言
				MessageList: [],
				list: [  // 1 未回复 2 已回复
					{
						title: '工单1',
						time: '2020-04-24',
						status: 1,
						content: [
							{     // 第一个对象是用户反馈
								title: '用户',
								desc: '软件不能正常访问',
								imgArr: [       // 用户上传的两张图片地址
									{ imgUrl: 'https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/gh_33446d7f7a26_430.jpg' },
									{ imgUrl: 'https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/gh_33446d7f7a26_430.jpg' },
								]
							},
							{   // 这个是管理员的回复
								title: '管理员',
								desc: '软件正在更新',
							  imgArr: ""   // 管理员这边 imgArr 直接为空就行
							},
						]
					}
				]
			};
		},
		async onShow(){
			await this.$utils.isLogin();
		},
		methods: {

			ImageShow(item,index) {
				this.currentImageIndex = index;
				uni.previewImage({
					current: this.currentImageIndex,
					urls: item,
					indicator: 'default'
				});

				console.log(item,index)
			},

			/**
			 * 获取用户留言
			 * @returns {Promise<void>}
			 */
			async getUserMes() {
				let res = await this.$http.userService.getUserMes({
					token: this.$utils.getLocalStorage("user_message").token
				});

				this.MessageList = res.data;
				console.log(res.data)
			},
			showOrderContent(index) {
				this.currentIndex = index
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../common/less/page/WorkOrder.less";

</style>
