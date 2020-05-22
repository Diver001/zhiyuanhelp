<template>
	<view class="me">
		<Header title="个人中心"></Header>
		<ul class="setting_list">
			<li @click="$utils.enterPage('../orderStatus/orderStatus')">
				<div class="list_left">
					<image src="http://static.geekhelp.cn/01.png" alt=""></image>
					<view class="setting_text">我的成绩</view>
				</div>
				<div class="list_right">
					<text>管理分数</text>
					<uni-icons type="forward" size="24"></uni-icons>
				</div>
			</li>
			<li @click="$utils.enterPage('../mySchool/mySchool?type=1&title=我的院校')">
				<div class="list_left">
					<image src="http://static.geekhelp.cn/02.png" alt=""></image>
					<view class="setting_text">我的院校</view>
				</div>
				<div class="list_right">
					<uni-icons type="forward" size="24"></uni-icons>
				</div>
			</li>
			<li @click="$utils.enterPage('../mySchool/mySchool?type=2&title=我的专业')">
				<div class="list_left">
					<image src="http://static.geekhelp.cn/03.png" alt=""></image>
					<view class="setting_text">我的专业</view>
				</div>
				<div class="list_right">
					<uni-icons type="forward" size="24"></uni-icons>
				</div>
			</li>
			<li @click="$utils.enterPage('../feedback/feedback?type=1&title=考生建议')">
				<div class="list_left">
					<image src="http://static.geekhelp.cn/004.png" alt=""></image>
					<view class="setting_text">考生建议</view>
				</div>
				<div class="list_right">
					<uni-icons type="forward" size="24"></uni-icons>
				</div>
			</li>
			<li @click="$utils.enterPage('../feedback/feedback?type=2&title=提交工单')">
				<div class="list_left">
					<image src="http://static.geekhelp.cn/005.png" alt=""></image>
					<view class="setting_text">提交工单</view>
				</div>
				<div class="list_right">
					<uni-icons type="forward" size="24"></uni-icons>
				</div>
			</li>
			<li @click="$utils.enterPage('../WorkOrder/WorkOrder')">
				<div class="list_left">
					<image src="http://static.geekhelp.cn/workorder.jpg" alt=""></image>
					<view class="setting_text">我的工单</view>
				</div>
				<div class="list_right">
					<uni-icons type="forward" size="24"></uni-icons>
				</div>
			</li>
			<li @click="logOutUser">
				<div class="list_left">
					<image src="http://static.geekhelp.cn/006.png" alt=""></image>
					<view class="setting_text">退出账户</view>
				</div>
				<div class="list_right">
					<uni-icons type="forward" ></uni-icons>
				</div>
			</li>
		</ul>
		<CustomerService></CustomerService>
	</view>
</template>

<script>
	import CustomerService from '@/components/tpl/CustomerService.vue'
	import Header from '@/components/tpl/Header.vue'
	export default {
		components: {
			CustomerService,
			Header
		},
		data() {
			return {
				UserMessage: this.$utils.getLocalStorage("user_message")
			};
		},
		onShow() {
			this.$utils.isLogin();
		},
		onLoad() {
		},
		methods: {
			logOutUser() {
				uni.showModal({
					title: '温馨提示',
					content: '您确定退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							uni.removeStorageSync('user_message');
							// uni.removeStorageSync('user_input');
							getApp().globalData.status = {}
							this.$utils.closedEnterPage("../startUp/startUp")
						}
					}
				})

			}
		}
	}
</script>

<style lang="less" scoped>
	@import url("../../common/less/page/me.less");
</style>
