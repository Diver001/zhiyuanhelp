<template>
	<view class="feedback">
		<Header :title="PageTitle"></Header>
		<div class="feedback_content">
			<TipsTitle v-if="isShowList" title="选择问题类型"></TipsTitle>

			<div class="problem" v-if="isShowList">
				<uniBadge
						v-for="(item,index) in MesType"
						:key="index"
						:text="item.name"
						@click="MesClick(index)"
						:type="index == currentProblemIndex ? 'primary' : 'default' ">

				</uniBadge>
			</div>

			<TipsTitle title="具体问题描述"></TipsTitle>

			<textarea placeholder="请认真描述你的问题，客服会在第一时间与你取得联系！"
								class="user_mess"
								maxlength="200"
								@blur="bindTextAreaBlur"/>

			<TipsTitle title="上传相关图片"></TipsTitle>

			<div class="uploadImage">

				<view class="uni-padding-wrap uni-common-mt"
							v-for="(item, index) in FileImage"
							:key="index">
					<view class="demo">
						<block v-if="item.imgUrl">
							<image :src="item.imgUrl" class="image" mode="aspectFit"></image>
						</block>
						<block v-else>
							<view class="uni-hello-addfile" @click="chooseImage(index)">
								<view>+</view>
								<view>上传照片</view>
							</view>
						</block>
					</view>
				</view>

			</div>

<!--			<TipsTitle title="您的联系方式"></TipsTitle>-->

<!--			<div class="user_phone">-->
<!--				<span class="iconfont">&#xe635;</span>-->
<!--				<input class="phone"-->
<!--							 @input="PhoneChange"-->
<!--							 maxlength="11"-->
<!--							 type="text"-->
<!--							 placeholder="请输入联系方式，方便我们联系您">-->
<!--			</div>-->

			<div class="button_submit" @click="submitRequest">
				提交
			</div>

		</div>
	</view>
</template>

<script>
	import Header from '@/components/tpl/Header.vue'
	import TipsTitle from '@/components/tpl/TipsTitle.vue'
	import uniBadge from "@/components/uni-badge/uni-badge.vue"

	export default {
		components: {
			Header,
			TipsTitle,
			uniBadge
		},
		data() {
			return {
				isShowList: true,  //
				PageTitle: '',   // 网页的标题
				type: 1,      // 类型：1，意见反馈  2，联系客服
				MesType: [],  // 问题类型的数组
				currentProblemIndex: 0,  // 当前默认选中第一个问题
				detailedProblem: "",    //详细问题
				userPhone: '',          // 用户手机号
				FileImageList: {},      // 保存需要上传给后端的两张图片的地址，以对象格式
				FileImage: [
					{ imgUrl: '' }
				]
			};
		},
		async onShow(){
			await this.$utils.isLogin();
		},
		async created() {
			await this.$utils.isLogin();
			this.getMesType();
		},
		onLoad(option) {
			if (option.hasOwnProperty("title")
					&& option.hasOwnProperty("type")) {
				this.PageTitle = option.title
				this.type = option.type
				this.type == 1 ? this.isShowList = false : this.isShowList = true
			}
		},
		onUnload() {
			this.imageSrc = '';
		},
		methods: {
			/**
			 * 提交建议
			 */
			async submitRequest() {
				if (this.detailedProblem.length == 0) {
					uni.showToast({
						title: '具体描述不能为空！',
						duration: 2000,
						icon: 'none'
					});
				} else {

					// 请求需要的参数
					let params = {
						token: this.$utils.getLocalStorage("user_message").token,
						type: '',
						img1: '',
						img2: '',
						telnum: this.$utils.getLocalStorage("__DC_STAT_PID"),
						content: this.detailedProblem
					}

					// type == 1 从 意见反馈 反馈进来，所以不需要type，为 0
					if (this.type == 1) {
						params.type = 0
					} else {
						params.type = this.MesType[this.currentProblemIndex].id
					}

					// 如果上传了第一张图，那么添加图片地址
					if (this.FileImageList.hasOwnProperty("img1")) {
						params.img1 = this.FileImageList.img1
					}

					// 如果上传了第二张图，那么添加图片地址
					if (this.FileImageList.hasOwnProperty("img2")) {
						params.img2 = this.FileImageList.img2
					}

					let res = await this.$http.userService.addMessage(params)

					uni.showToast({
						title: res.msg,
						duration: 2000,
						icon: 'none',
						complete: () => {
							setTimeout( ()=> {
								this.$utils.backPage()
							}, 2100)
						}
					});

					// // 置空默认选中的问题
					// this.currentProblemIndex = 0
					// // 置空具体问题描述
					// this.detailedProblem
					// // 置空上传图片
					// this.FileImage =  [ { imgUrl: '' }, { imgUrl: '' } ]
					// // 置空联系方式
					// this.userPhone = ""
				}
			},
			/**
			 * 获取所有的问题类型
			 * @returns {Promise<void>}
			 */
      async getMesType() {
      	let res = await this.$http.userService.getMesType();
      	this.MesType = res.data
			},

			/**
			 * 为问题绑定点击事件
			 * @constructor
			 */
			MesClick(index) {
				this.currentProblemIndex = index
			},

			PhoneChange(event) {
				this.userPhone = event.detail.value
			},

			/**
			 * 获取输入框的内容
			 */
			bindTextAreaBlur(event) {
				this.detailedProblem = event.detail.value
			},

			/**
			 * 上传图片
			 */
			uploadImage(imageSrc,index) {
				uni.uploadFile({
					url: this.$config.baseUrl + '/uploads',
					filePath: imageSrc,
					fileType: 'image',
					name: 'imageName',
					header: {
						token: this.$utils.getLocalStorage("user_message").token
					},
					success: (res) => {
						// 保存数据
						if (index == 0) {
							this.FileImageList.img1 = JSON.parse(res.data).data
						} else if(index == 1){
							this.FileImageList.img2 = JSON.parse(res.data).data
						}

						// 显示预览地址
						this.FileImage[index].imgUrl = imageSrc

						this.FileImage.push({ imgUrl: '' })

					},
					fail: (err) => {
						uni.showModal({
							content: err.errMsg,
							showCancel: false
						});
					}
				});
			},

			/**
			 * 选择图片
			 * @param index
			 */
			chooseImage(index) {
				if (this.FileImage.length > 2) {
					uni.showToast({
						title: '只能上传两张',
						duration: 2000,
						icon: 'none'
					});
				} else {
					return new Promise((resolve, reject)=> {
						uni.chooseImage({
							count: 1,
							sizeType: ['compressed'],
							sourceType: ['album'],
							success: (res) => {
								this.uploadImage(res.tempFilePaths[0],index)
							},
							fail: (err) => {
								// #ifdef MP
								uni.getSetting({
									success: (res) => {
										let authStatus = res.authSetting['scope.album'];
										if (!authStatus) {
											uni.showModal({
												title: '授权失败',
												content: '需要从您的相册获取图片，请在设置界面打开相关权限',
												success: (res) => {
													if (res.confirm) {
														uni.openSetting()
													}
												}
											})
										}
									}
								})
								// #endif
							}
						})
					});
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../common/less/page/feedback.less";
</style>
