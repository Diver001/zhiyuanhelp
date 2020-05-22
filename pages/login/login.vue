<template>
	<div class="login">
		<navigation title="返回"></navigation>
		<div class="login_page">
			<h2>您好，欢迎登录聚志愿</h2>
			<div class="user_phone">
				<input type="number" maxlength="11" v-model="UserMessage.telnum" placeholder="请输入手机号">
			</div>
			<div class="user_code">
				<input v-model="UserMessage.code" maxlength="4" type="number" placeholder="请输入验证码"/>
				<div :class="ProhibitCode ? 'getcode disable' : 'getcode' " @click="getSmsCode">{{ codeText }}</div>
			</div>

			<button type="primary" @click="SubmitLogin" class="login_submit">登 录</button>

			<div class="Agreement_consent">
				<div
						@click="saveChiooseAgreement = !saveChiooseAgreement"
						:class="saveChiooseAgreement ? 'yes check' : 'check' ">

				</div>
				<text>
					登录即表示同意《<text class="xy">聚志愿用户协议</text>》
				</text>
			</div>

		</div>
	</div>
</template>

<script>
	import navigation from '@/components/tpl/navigation.vue'
	export default {
		components: {
			navigation
		},
		data() {
			return {
				vipType: false,
				PreviousPage: null,
				cache: null,
				countdown: 60,   // 倒计时时间
				timer: '',       // 保存计时器
				codeText: '获取验证码', // 提示文字
				ProhibitCode: false, // true 发送过，false 没法送
				saveChiooseAgreement: true, // 保存当前是否同意的状态
				UserMessage: {      // 保存用户登录信息
					telnum: '',
					code: ''
				}
			}
		},
		async onLoad(option) {
			if (this.$utils.checkLogin()) {
				uni.navigateBack();
			}

			if (option.hasOwnProperty("type")) {
				this.vipType = option.type
			}

		},
		methods: {

			async SubmitLogin() {

				if (this.UserMessage.telnum.length == 0
						|| this.UserMessage.code.length == 0
				    || this.saveChiooseAgreement == false) {

					uni.showToast({
						title: '手机号，验证码不能为空',
						duration: 2000,
						icon: 'none'
					});

				} else {

					// 登录需要的参数
					let UserParams = this.$utils.getLocalStorage("user_input") || {
						subType: 0,       // 1文科，2理科默认0
						score: 0,         // 分数
						mySub: 0,         // 新高考考生的科目和特殊高考科目默认0
						province: 0,      // 省份real_code
						chooseLevel: 0,   // 特殊高考的成绩对应mySub 默认0
						userPro: 0,       // 考生所在省
					};

					// 加密手机号
					UserParams.telnum = this.$utils.JSEncrypts(this.UserMessage.telnum);

					// 保存用户手机号
					this.$utils.setLocalStorage("__DC_STAT_PID", UserParams.telnum)

					// 验证码
					UserParams.code = this.UserMessage.code;

					let res = await this.$http.loginService.appLogin(UserParams);
					let updateScore = "";

					// 等于 0，新用户没有分数数据，跳转回智能填报页面
					if (res.data.score == 0) {
						console.log("++++++++++++++++++++++++ 新用户登录数据2 ++++++++++++++++++: ", res)
						this.$utils.setLocalStorage("user_message", res.data)

						getApp().globalData.status.identity = 'new'
						getApp().globalData.status.action = 'needInput'

						this.$utils.closedEnterPage("../startUp/startUp")

					} else {

						// 如果用户没有登录
						if( !(this.$utils.getLocalStorage("user_message")) ) {
							// 并且填过智能填报
							if(this.$utils.getLocalStorage("user_input")) {

								console.log("++++++++++++++++++++++++ 用户没有登录 并且填过智能填报 ++++++++++++++++++++")


								let UserInput = this.$utils.getLocalStorage("user_input");
								let params = {
									token: res.data.token,
									subType: UserInput.subType,
									score: UserInput.score,
									mySub: UserInput.mySub,
									province: UserInput.province,
									chooseLevel: UserInput.chooseLevel
								};

								updateScore = await this.$http.startUpService.modifyUser(params)

								this.$utils.setLocalStorage("user_message", updateScore.data)

								this.vipType ?
										this.$utils.closedEnterPage(`../payment/payment?type=${this.vipType}`)
										: this.$utils.closedEnterPage("../index/index")


							} else {
								console.log("跳转1")
								this.$utils.setLocalStorage("user_message", res.data)
								this.vipType ?
										this.$utils.closedEnterPage(`../payment/payment?type=${this.vipType}`)
										: this.$utils.closedEnterPage("../index/index")
							}
						} else {
							console.log("跳转2")
							this.$utils.setLocalStorage("user_message", res.data)
							this.vipType ?
									this.$utils.closedEnterPage(`../payment/payment?type=${this.vipType}`)
									: this.$utils.closedEnterPage("../index/index")
						}
					}
				}
			},
			async getSmsCode() {
				// 如果没有发送过验证码
				if (!this.ProhibitCode) {
					// 如果没输入手机号
					if (this.UserMessage.telnum.length == 0) {
						uni.showToast({
							title: '手机号不能为空',
							duration: 2000,
							icon: 'none'
						});

					// 输入过手机号
					} else {

						let data = await this.$http.loginService.sendCode({
							telnum: this.$utils.JSEncrypts(this.UserMessage.telnum)
						});

						if(data.status == 1) {
							this.ProhibitCode = true
							this.countDown()
							uni.showToast({
								title: data.msg,
								duration: 1000
							});
						}
						console.log("data: ", data)
					}
				}
			},
			countDown() {
				this.timer = setInterval(() =>{
					this.countdown--
					this.codeText = this.countdown + 's'
					if(this.countdown === 0){
						clearInterval(this.timer)
						this.codeText = '获取验证码'
						this.countdown = 60
						this.ProhibitCode = false
					}
				},1000)
			}
		}
	}
</script>

<style scoped lang="less">
@import "../../common/less/page/login.less";
</style>
