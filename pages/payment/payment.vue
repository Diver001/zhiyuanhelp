<template>
	<view class="payment">
		<Header title="支付页面"></Header>
		<div class="payment_content">

			<TipsTitle title="温馨提示"></TipsTitle>

			<ul class="tips_content">
				<li>支付前请确认省份、文理科、成绩，购买后不可更改</li>
				<li>本系统不支持艺术与体育生使用</li>
				<li>购买的服务有效期至2019年9月31日</li>
			</ul>

			<TipsTitle title="购买分数"></TipsTitle>

			<!--购买权限为1的时候才允许编辑-->
			<div v-if="payType == 1" class="buy_score">

				<div class="location score_item" @click="openAddress">
					<span class="iconfont">&#xe64e;</span>
					<text>{{currentCity.title}}</text>
				</div>

				<div class="score score_item"
						 @click="showEdit = !showEdit"
						 v-if="showEdit">
					{{ currentCity.score || UserMessage.score }} 分
				</div>

				<input class="new_num"
							 focus="true"
							 @blur="ChangeEdit"
							 type="number" v-else placeholder="新分数">


				<div class="city_project" v-if="isShowNewsTets">
					<radio-group @change="radioChange" class="radioF">
						<label class="uni-list-cell uni-list-cell-pd radio_item"
									 v-for="(item, index) in LiberalArts" :key="index">
							<radio color="#1b78fa" :value="item.code" :checked="index === currentRadioChioose" />
							<view>{{item.title}}</view>
						</label>
					</radio-group>
				</div>

				<div class="city_project" v-else>{{ currentCity.subName }}</div>

			</div>

			<div v-else class="buy_score">
				<div class="location score_item">
					<span class="iconfont">&#xe64e;</span>
					<text>{{currentCity.title}}</text>
				</div>

				<div class="score score_item">
					{{ currentCity.score || UserMessage.score }} 分
				</div>

				<div class="score_item">
					{{LiberalArts[currentRadioChioose].title}}
				</div>

				<div class="score_item tips">
					{{ payType == 2 ? '筛选权限' : '专业权限' }}
				</div>

			</div>

			<div class="buy_score_tips">
				{{ payType == 1 ? '当前购买仅为院校概率测算，不包含院校筛选和专业分数线' : payType == 2 ? '当前购买权限为院校筛选' : '当前购买权限为专业分数线查询' }}
			</div>

			<div class="pay_monkey">
				<text class="message">付款金额</text>
				<text class="monkey">￥ {{ payType == 1 ? 29.9 : payType == 2 ? 9.9 : payType == 3 ? 19.9 : '' }}</text>
			</div>

			<div class="pay_type">
				<div class="pay_button_weixin" @click="checkUserLoginStatus('weixin')">
					<span class="iconfont">&#xe655;</span>
					<text>微信支付</text>
				</div>
				<div class="pay_button_alipay" @click="checkUserLoginStatus('alipay')">
					<span class="iconfont">&#xe628;</span>
					<text>支付宝支付</text>
				</div>
			</div>


			<AddressPopup :address="address" @itemChange="addressChoice" ref="AddressPopup"></AddressPopup>

			<div v-html="formPay"></div>

			<uni-popup class="weixin_pay" ref="showimage" type="center" :mask-click="false">
				<view class="uni-image">
					<image class="image" :src="payWeixQrCode" mode="scaleToFill" />
					<view class="uni-image-close" @click="cancelPlay()">
						<uni-icons type="clear" color="#fff" size="30" />
					</view>
				</view>
			</uni-popup>
		</div>
	</view>
</template>

<script>
	import Header from '@/components/tpl/Header.vue'
	import CustomerService from '@/components/tpl/CustomerService.vue'
	import TipsTitle from '@/components/tpl/TipsTitle.vue'
	import AddressPopup from "@/components/tpl/AddressPopup.vue"
	import QR from "../../static/js/wxqrcode.js"
	import uniPopup from '@/components/uni-popup/uni-popup.vue'

	export default {
		components: {
			Header,
			CustomerService,
			TipsTitle,
			AddressPopup,
			uniPopup
		},
		data() {
			return {
				checkTimePay: '',         // 保存轮询的定时器
				payWeixQrCode: '',        // 微信pc支付二维码数据
				isShowNewsTets: true,
				formPay: "",              // 保存支付宝支付的form表单代码
				currentRadioChioose: 0,   // 默认文科选中
				LiberalArts: [            // 文理科单选
					{code: "1", title: '文科'},
					{code: "2", title: '理科'}
				],
				currentCity: {
					title: ''
				},  // 当前城市
				UserMessage: {},     // 本地的用户信息
				showEdit: true,      // 是否显示编辑新分数的文本框
				userInputPhone: "", // 用户手机号
				payType: "",      // 保存地址栏支付类型
				orderStatus: {},   // 保存下单后的订单数据
				OrderParams: {
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
				address: [] // 从本地读出来的地址
			};
		},
		onLoad(option) {
			this.UserMessage = this.$utils.getLocalStorage("user_message");
			this.address = this.$utils.getLocalStorage("address");
			this.address.forEach((val,index) => {
				if (val.title == '西藏') {
					this.address.splice(index,1)
				}
			})

			this.currentCity = this.UserMessage
			this.currentCity.title = this.currentCity.proName

			this.payType = option.type
			// 判断是否有item，如果有表示从 我的成绩 购买未支付成绩进来的
			if (option.hasOwnProperty("item")) {
				let againParams = JSON.parse(option.item)
				againParams.title = againParams.province_title
				this.currentCity = againParams;

				this.OrderParams.is_login = 1;
				this.OrderParams.userPro = againParams.stu_yzy_province
				this.OrderParams.subType = againParams.wenli
				this.OrderParams.score = againParams.score
				this.OrderParams.province = againParams.stu_province / 10000
				this.OrderParams.vip_type = this.payType
				this.OrderParams.telnum = this.$utils.getLocalStorage("__DC_STAT_PID")

			} else {
				this.OrderParams.is_login = 1;
				this.OrderParams.userPro = this.UserMessage.userPro
				this.OrderParams.subType = this.UserMessage.wenli
				this.OrderParams.score = this.UserMessage.score
				this.OrderParams.province = this.UserMessage.province / 10000
				this.OrderParams.vip_type = this.payType
				this.OrderParams.telnum = this.$utils.getLocalStorage("__DC_STAT_PID")
			}



			// 如果有江苏等特殊高考，那么带上 chooseLevel
			if (this.UserMessage.chooseLevel.length != 0) {
				this.OrderParams.chooseLevel = this.UserMessage.chooseLevel
			}

			// 如果有江苏等特殊高考，那么带上 chooseLevel
			if (this.$utils.getLocalStorage("user_input").chooseLevel.length != 0) {
				this.OrderParams.chooseLevel = this.$utils.getLocalStorage("user_input").chooseLevel
			}

			if (`${this.currentCity.mykemu}`.length == 3) {
				this.isShowNewsTets = false
			}

			// 如果是文科，那么选中文科 0，否则选中理科 1
			if (this.currentCity.subTypeName == '文科') {
				this.currentRadioChioose = 0
			} else {
				this.currentRadioChioose = 1
			}

		},
		async onShow(){
			await this.$utils.isLogin();
		},
		created() {
			this.checkPayOrder()
		},
		methods: {
			checkPayOrder() {
				// 支付，不管是取消还是完成支付都会重新进入这个页面，所以判断
				// 是否是微信进入，如果是弹窗问用户你支付成功了吗？
				if (this.$utils.getLocalStorage("order_message")) {
					uni.showModal({
						title: '支付确认',
						cancelText: '未支付',
						cancelColor: '#999',
						confirmText: '已支付',
						content: '您是否已经支付成功？',
						success: (res) => {
							if (res.confirm) {
								this.checkUserOrderStatus(1);
							} else if (res.cancel) {
								this.checkUserOrderStatus(0);
							}
						}
					});
					return false
				}
			},
			/**
			 * 关闭支付的弹窗
			 */
			cancelPlay() {
				this.$refs.showimage.close()
				clearInterval(this.checkTimePay)
				this.checkPayOrder()
			},
			/**
			 * 文理科单选框
			 */
			radioChange(event) {
				console.log(event.detail.value)
			},

			openAddress() {
				this.$refs.AddressPopup.open()
			},

			/**
			 * 地址的点击事件
			 */
			addressChoice(item) {
				// 显示到页面上
				this.currentCity = item
				// 保存到接口请求参数中
				this.OrderParams.userPro = item.code
				// 保存选择的 real_code
				this.OrderParams.province = item.real_code

				if (this.$utils.getLocalStorage("user_message")) {
					// 重新保存token
					this.OrderParams.token = this.$utils.getLocalStorage("user_message").token
				}

				this.$refs.AddressPopup.close()

				// this.updateUserInfo();
				this.provinceSubject();

			},

			/**
			 * 新分数失去焦点后输入框保存数值
			 */
			ChangeEdit(event) {
				if (event.detail.value.length !== 3) {
					uni.showToast({
						title: '分数不能为空必须三位数',
						duration: 2000,
						icon: 'none'
					});
					return false;
				}
				// 保存到接口请求参数中
				this.OrderParams.score = event.detail.value;
				this.UserMessage.score = event.detail.value
				this.$utils.setLocalStorage("user_input", this.UserMessage)
				this.OrderParams.token = this.$utils.getLocalStorage("user_message").token;
				// 隐藏元素
				this.showEdit = !this.showEdit;
				this.updateUserInfo();
			},


			/**
			 * 当用户编辑分数，地址，文理科的时候重新更新用户的信息
			 */
			async updateUserInfo() {
				let res = await this.$http.startUpService.modifyUser(this.OrderParams)
				this.currentCity.score = res.data.score
				this.currentCity.title = res.data.proName
				this.$utils.setLocalStorage("user_message", res.data)
				// 关闭弹窗
				this.$refs.AddressPopup.close()
			},

			/**
			 * 根据省份获取高考科目
			 */
			async provinceSubject() {
				let res = await this.$http.startUpService.provinceSubject({
					id: this.OrderParams.userPro
				});

				console.log("根据省份获取高考科目: ", res)
			},

			/**
			 * 发送请求获取订单状态
			 */
		  async	checkOrderPay() {
				return await this.$http.userService.checkPay({
					token: this.$utils.getLocalStorage("user_message").token,
					order_id: this.$utils.getLocalStorage("order_message").order_id
				});
			},

			/**
			 * 查询用户订单的状态
			 * 1 已支付 用户点按钮传过来的
			 * 0 未支付 用户点按钮传过来的
			 */
			async checkUserOrderStatus(status) {

				let res = await this.checkOrderPay();

				switch (res.data.status) {
					case 0:
						uni.showModal({
							title: '温馨提示',
							content: '检测到您未支付，是否重新发起支付？',
							confirmText: '继续支付',
							success: async (res) => {
								if (res.confirm) {
									uni.showToast({
										title: '请重选支付方式',
										duration: 2000,
										icon: 'none'
									});
								} else {
									uni.removeStorage({ key: 'order_message' });
									this.$utils.enterPage("../index/index")
								}
							}
						});
						break;

					case 1:
						uni.removeStorage({ key: 'order_message' });
						uni.removeStorage({
							key: 'order_message',
							success: (res) => {
								this.$utils.enterPage("../index/index")
							}
						});

						break;
				}

			},

			/**
			 * 检查用户的登录状态，构造参数，调用下单
			 */
			async checkUserLoginStatus(payType) {
				// 组装配置 createOrder 需要的下单参数
				this.OrderParams.token = this.UserMessage.token
				this.OrderParams.mySub = this.UserMessage.mykemu

				// 下单 获取订单id 和 订单号
				this.orderStatus = (await this.$http.userService.createOrder(this.OrderParams)).data.status;
				this.$utils.setLocalStorage("order_message", this.orderStatus);
				this.ParOrder(payType)
			},
			/**
			 * 使用订单id去得到支付地址
			 * @constructor
			 */
			async ParOrder(payType) {
				// 构造参数
				let params = {
					token: this.$utils.getLocalStorage("user_message").token,
					order_id: this.$utils.getLocalStorage("order_message").order_id,
					pay_type: this.$utils.isPcClient() ? 2 : 1,
					rebackUrl: payType == 'weixin' ? encodeURIComponent(location.href) : location.href
				}

				// 配置什么支付方式 1 微信支付，2支付宝支付
				payType == 'weixin' ? params.pay_way = 1 : params.pay_way = 2;


				console.log("支付参数：", params)

				// 支付下单
				let payResult = await this.$http.userService.payOrder(params);

				// 如果PC访问
				if (this.$utils.isPcClient()) {
					// PC 微信
					if (payResult.data.pay_way == 1) {
						this.payWeixQrCode = QR.createQrCodeImg(payResult.data.url, {
							size: parseInt(280)
						})
						this.$refs.showimage.open();
						this.TimeCheckPay()
					// PC 支付宝
					} else {
						this.formPay = payResult.data.url
						this.$nextTick(()=> document.getElementById('alipaysubmit').submit())
					}
				// 如果H5访问
				} else {
					// H5 微信
					if (payResult.data.pay_way == 1) {
						// 跳转支付
						location.href = payResult.data.url
					// H5 支付宝
					} else {
						this.formPay = payResult.data.url
						this.$nextTick(()=> document.getElementById('alipaysubmit').submit())
					}
				}
			},

			/**
			 * ajax轮询检查订单是否支付
			 * @constructor
			 */
			TimeCheckPay() {
				this.checkTimePay = setInterval(async ()=> {
					let res = await this.checkOrderPay();
					if (res.data.status == 1) {
						console.log("支付成功")
						this.$refs.showimage.close()
						clearInterval(this.checkTimePay)
						uni.showToast({
							title: '支付成功，即将跳转回首页',
							duration: 2000,
							icon: 'none',
							complete: ()=> {
								setTimeout(()=> {
									uni.removeStorage({ key: 'order_message' });
									this.$utils.enterPage("../index/index")
								},2100)
							}
						});
					}
				},1000)
			},
		}
	}
</script>

<style lang="less" scoped>
	@import url("../../common/less/page/payment.less");
</style>
