<template>
	<view class="startUp">
		<div class="header">

			<div @click="$utils.closedEnterPage('../me/me')" class="navigation" v-if="user_message">
				<div class="user_info">
					<span class="iconfont">&#xe610;</span>
					<text>个人中心</text>
				</div>
			</div>

			<div class="navigation" v-else>
				<div class="user_info" @click="DirectLogin">
					<span class="iconfont">&#xe610;</span>
					<text >登录</text>
				</div>
			</div>

			<div class="startUp_page">
				<h2>聚志愿2020知分选大学系统</h2>
				<div class="choice">

					<!--选择城市-->
					<div class="choice_item city">
						<div class="city_title">高考省份</div>
						<div class="city_address" @click="openAddress">
							<span class="iconfont">&#xe64e;</span>
							<text>{{ currentChoiceCity }}</text>
						</div>
					</div>

					<!--选择科目-->
					<div class="choice_item project_radio">
						<div class="city_title">选择科目</div>

						<!--普通高考的文理科选择-->
						<div class="city_project" v-if="isShowExam == 1  || isShowExam == 3">
							<radio-group @change="radioChange">
								<label class="uni-list-cell uni-list-cell-pd radio_item"
											 v-for="(item, index) in LiberalArts" :key="index">
										<radio color="#1b78fa" :value="item.code" :checked="index === current" />
									<view>{{item.title}}</view>
								</label>
							</radio-group>
						</div>

						<!--新高考选择科目-->
						<div class="new_test" v-else-if="isShowExam == 2">
							<uni-badge :text="item" v-for="(item,index) in NewExamination"
												 :type=" newTestItemIndex.includes(index) ? 'primary' : 'default' "
												 @click="newTestClick(index)"
												 :key="index"></uni-badge>
						</div>

					</div>

					<!--输入分数-->
					<div class="choice_item city">
						<div class="city_title">输入分数</div>
						<div class="city_fraction">
							<input @input="inputFraction"  v-model="UserFraction" type="number" placeholder="请输入高考分数" maxlength="3">
							<text>分</text>
						</div>
					</div>

					<!--位次排名-->
					<div class="choice_item city">
						<div class="city_title">位次排名</div>
						<div class="city_ranking city_fraction">
							<input type="number" v-model="UserRanking" placeholder="请输入本省排名">
							<text>名</text>
						</div>
					</div>

					<!--普通高考中的特殊情况 江苏-->
					<div class="choice_item special" v-if="isShowExam == 3">


						<!--文科下拉-->
						<div class="left">

							<div class="left_city">
								<picker @change="bindPickerChange"
												:value="0"
												disabled
												range-key="text">
									<view class="uni-input">{{currentProject.needNum[0].name}}</view>
								</picker>
								<span class="iconfont">&#xe6b9;</span>
							</div>

							<div class="left_leve left_city">
								<picker @change="leftRadioFraction"
												:value="leftRadioFractionIndex"
												range-key="text"
												:range="achievementGrade">
									<view class="uni-input">{{achievementGrade[leftRadioFractionIndex].text}}</view>
								</picker>
								<span class="iconfont">&#xe6b9;</span>
							</div>

						</div>

						<!--理科下拉-->
						<div class="right left">

							<div class="left_city">
								<picker @change="rightRadioSubject"
												:value="rightRadioSubjectIndex"
												:range="currentProject.optionNum"
												range-key="name">
									<view class="uni-input">{{currentProject.optionNum[rightRadioSubjectIndex].name}}</view>
								</picker>
								<span class="iconfont">&#xe6b9;</span>
							</div>

							<div class="left_leve left_city">
								<picker @change="rightRadioFraction"
												:value="rightRadioFractionIndex"
												range-key="text"
												:range="achievementGrade">
									<view class="uni-input">{{achievementGrade[rightRadioFractionIndex].text}}</view>
								</picker>
								<span class="iconfont">&#xe6b9;</span>
							</div>

						</div>
					</div>



					<button @click="submitForm" type="primary" class="submitForm">智能填报</button>

				</div>
			</div>

			<AddressPopup :address="address" :currentIndex="addressCurrentIndex" @itemChange="addressChoice" ref="AddressPopup">
			</AddressPopup>

		</div>

		<div class="clear" style="clear: both"></div>

		<div class="action_list" :style="{ 'margin-top': isShowExam == 2 ? '690.362rpx' : '650.362rpx' }">
			<h2>本系统功能</h2>
			<ul>
				<li v-for="(item,index) in ActionList">
					<div class="list_header">
						<span class="iconfont" v-html="item.icon"></span>
						<text>{{item.title}}</text>
					</div>
					<div class="list_mes">{{item.mes}}</div>
				</li>
			</ul>
		</div>

		<CustomerService></CustomerService>

	</view>
</template>

<script>
	import amap from '../../common/lib/amap-wx.js'
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import AddressPopup from "@/components/tpl/AddressPopup.vue"
	import CustomerService from '@/components/tpl/CustomerService.vue'

	export default {
		components: {
			CustomerService,
			uniPopup,
			AddressPopup
		},
		data() {
			return {
				action: false,   // 如果为true 点击智能填报则为更新数据，否则false
				user_message: '',
				leftRadioFractionIndex: 0,   // 左边分数点击的下标
				rightRadioSubjectIndex: 0,   // 右边科目点击的下标
				rightRadioFractionIndex: 0,  // 右边分数点击的下标
				// 系统提供的功能列表
				ActionList: [
					{ title: '测大学录取率', icon: '&#xe653;', mes: '根据您的分数计算你所报考大学的概率' },
					{ title: '查院校最低分', icon: '&#xe664;', mes: '根据您的分数计算你所报考大学的概率' },
					{ title: '查专业分数线', icon: '&#xe61a;', mes: '根据您的分数计算你所报考大学的概率' },
					{ title: '根据专业选大学', icon: '&#xe633;', mes: '根据您的分数计算你所报考大学的概率' }
				],
				// 江苏省文理科成绩
				achievementGrade: [
					{ id: '1', text: 'A+'},
					{ id: '2', text: 'A'},
					{ id: '3', text: 'B+'},
					{ id: '4', text: 'B'},
					{ id: '5', text: 'C'},
					{ id: '6', text: 'D'}
				],
				// 江苏省文科，理科成绩
				SubjectAchievement: {
					wenkeAchievementTitle: '', // 文科标题
					wenkeAchievementId: '',    // 文科id
					liAchievementTitle: '',    // 理科标题
					liAchievementId: '',       // 理科id
				},
				newTestItemIndex: [],        // 保存新高考 选择科目后的下标
				isShowExam: 1,       // 决定考试科目的展示或者隐藏
				NewExamination:[],   // 新高考科目
				specialTestSub: [],  // 普通高考 保存江苏数据
				current: 0,
				LiberalArts: [            // 文理科单选
					{code: "1", title: '文科'},
					{code: "2", title: '理科'}
				],
				currentChoiceCity: "安徽", // 默认省份
				// 保存用户选择的地理位置
				saveUserChiooseCity: {
					code: 843, title: '浙江', real_code: 34
				},
        UserFraction: '',     // 用户高考分数
				UserRanking: '',      // 用户的位次排名
				currentProject: {},   // 存储当前文理科数据
				SpecialFraction: {},  // 存储特殊高考 用户的开始科目
				// 从本地读取省份
				address: [],
				addressCurrentIndex:  0,
				UserInformation: {
					subType: 0,       // 1文科，2理科默认0
					score: 0,         // 分数
					mySub: 0,         // 新高考考生的科目和特殊高考科目默认0
					province: 0,      // 省份real_code
					chooseLevel: 0,   // 特殊高考的成绩对应mySub 默认0
					userPro: 0,       // 考生所在省
				},
				RecordAction: {}   // 保存用户的操作状态
			}
		},
		onLoad(option) {
		},
		async onShow() {

			if ( !(getApp().globalData.status.hasOwnProperty("identity")) && this.$utils.checkLogin()) {
				this.$utils.closedEnterPage("../index/index")
			}

			// 获取用户登录信息
			this.user_message =  this.$utils.getLocalStorage('user_message')

			// 获取所有省的数据
			this.address = (await this.$http.indexService.getCityList({ type: 2 })).data;
			// 如果用户已经登录 或者 输入过智能填报，那么使用用户的默认信息填充智能填报
			if (this.$utils.getLocalStorage('user_message') || this.$utils.getLocalStorage('user_input')) {
				// 构造默认城市数据
				this.saveUserChiooseCity = {
					code: this.user_message.userPro || this.$utils.getLocalStorage("user_input").userPro,
					title: this.user_message.proName || this.$utils.getLocalStorage("user_input").title,
					real_code: this.user_message.province / 10000 || this.$utils.getLocalStorage("user_input").province,
				}
			} else {
				/**
				 * 获取匹配符合记录的城市
				 */
				// #ifdef H5
				this.saveUserChiooseCity = (this.address.filter((val) => val.title == lo.replace("省", "")))[0];
				// #endif
			}

			// 清除默认科目的选中，分数，排名
			this.newTestItemIndex = []
			this.UserFraction = ''
			this.UserRanking = ''


			// 获取当前用户城市在address的下标，然后修改address弹窗的激活
			this.addressCurrentIndex = this.$utils.getCurrentCity(this.saveUserChiooseCity.title)
			this.addressChoice(this.saveUserChiooseCity)

		},
		methods: {
			/**
			 * 用户直接点登录功能
			 */
			DirectLogin() {
				this.$utils.enterPage('../login/login')
			},

			/**
			 * 新高考 选择科目 被点击
			 */
			newTestClick(index) {
				if (this.newTestItemIndex.length < 3) {
					if (this.newTestItemIndex.includes(index)) {
						this.newTestItemIndex = this.newTestItemIndex.filter(ele => ele != index);
					} else {
						this.newTestItemIndex.push(index)
					}
				} else {
					this.newTestItemIndex = this.newTestItemIndex.filter(ele => ele != index);
				}

				console.log("------新高考选择科目-----：", this.newTestItemIndex)

			},

			// 特殊高考，左边分数选择
			leftRadioFraction(e) {
				this.leftRadioFractionIndex = e.target.value

				// 获取左侧物理或者历史
				this.SpecialFraction.leftSub = this.currentProject.needNum[0].id
				this.SpecialFraction.leftScore = this.achievementGrade[e.target.value].id;

				console.log("左边分数选择: ", this.SpecialFraction)
			},


			// 特殊高考，右边科目选择
			rightRadioSubject(e) {
				this.rightRadioSubjectIndex = e.target.value
				this.SpecialFraction.rightSub = this.currentProject.optionNum[this.rightRadioSubjectIndex].id

				console.log("右边科目选择: ", this.SpecialFraction)
			},


			// 特殊高考，右边分数选择
			rightRadioFraction(e) {
				this.rightRadioFractionIndex = e.target.value
				this.SpecialFraction.rightScore = this.achievementGrade[this.rightRadioFractionIndex].id

				console.log("右边分数选择: ", this.SpecialFraction)
			},
			/**
			 * 普通高考文理科选择
			 */
			radioChange(e) {
				// 选择科目 的时候 如果为江苏
				if (this.isShowExam == 3) {
					// 表示文科
					if (e.detail.value == "1") {
						this.currentProject = this.specialTestSub[0]
					// 表示理科
					} else {
						this.currentProject = this.specialTestSub[1]
					}
					this.SaveSubOrScore()
				}

				// 遍历更新下标
				for (let i = 0; i < this.LiberalArts.length; i++) {
					if (this.LiberalArts[i].code === e.target.value) {
						this.current = i;
						break;
					}
				}

			},

			/**
			 * 高考省份弹窗地址点击选择发生改变
			 * @param item
			 * @returns {Promise<void>}
			 */
			async addressChoice(item) {
				// 保存用户点击选择的地址
				this.saveUserChiooseCity = item;

				// 清除省份和排名
				this.UserFraction = ""
				this.UserRanking = ""

				let res = await this.$http.startUpService.provinceSubject({ id: item.code});
				// type 1 普通高考， 2 新高考 北京， 3 普通特殊高考 江苏
				switch (res.data.type) {
					case 1:
						this.isShowExam = 1
						this.UserInformation.mySub = 0
						break;
					case 2:
						console.log("新高考：",res)
						this.NewExamination = res.data.newTestSub
							this.UserInformation.subType = 0
						this.isShowExam = 2;
						break;
					case 3:

						this.specialTestSub = res.data.specialTestSub;
						this.currentProject = this.specialTestSub[0];
						this.SaveSubOrScore()
						this.isShowExam = 3
						break;

				}

				// 显示用户点击的省份
				this.currentChoiceCity = item.title
				// 关闭弹窗
				this.$refs.AddressPopup.close()
			},

			/**
			 * 用户输入分数，查询名次
			 */
			async inputFraction(event) {
				if (event.detail.value.length >= 3) {
					if(parseInt(event.detail.value) >= 150 && parseInt(event.detail.value) <= 750) {
						this.UserFraction = event.detail.value;
						let res = await this.$http.startUpService.proScoreRank({
							province: this.saveUserChiooseCity.code,
							subType: this.LiberalArts[this.current].code,
							score: event.detail.value
						});
						if (res.data == null) {
							uni.showToast({
								title: '分数不正确',
								duration: 2000,
								icon: 'none'
							});
						} else {
							this.UserRanking = res.data.lowestRank
						}
					} else {
						uni.showToast({
							title: '分数应该位于150-750间',
							duration: 2000,
							icon: 'none'
						});
					}

				}

			},

			// 科目 必须3个
			/**
			 * 职能填报，提交用户信息的表单
			 */
			async submitForm() {

				if (parseInt(this.UserFraction) >= 150 && parseInt(this.UserFraction) <= 750) {

				} else {
					uni.showToast({
						title: '分数应该位于150-750间',
						duration: 2000,
						icon: 'none'
					});
					return false
				}

				// 判断公共参数是否填写
				if (this.UserFraction.length === 0 || this.UserRanking == 0) {
					uni.showToast({
						title: '分数和位次排名不能为空',
						duration: 2000,
						icon: "none"
					});
					return false
				}

				// type 1 普通高考， 2 新高考， 3 普通特殊高考 江苏
				switch (this.isShowExam) {
					case 1:
						// 用户省份
						this.UserInformation.province = this.saveUserChiooseCity.real_code
						// 用户分数
						this.UserInformation.score = this.UserFraction
						// 用户位次
						// UserInformation.rank = this.UserRanking
						// 保存科目
						this.UserInformation.subType = this.LiberalArts[this.current].code
						// 考生所在省
						this.UserInformation.userPro = this.saveUserChiooseCity.code

						console.log("普通高考", this.UserInformation)

						break;
					case 2:

						if (this.newTestItemIndex.length != 3) {
							uni.showToast({
								title: '新高考科目必须三个',
								duration: 2000,
								icon: "none"
							});
							return false
						}

						// 用户省份
						this.UserInformation.province = this.saveUserChiooseCity.real_code
						// 用户分数
						this.UserInformation.score = this.UserFraction
						// 用户位次
						// this.UserInformation.rank = this.UserRanking
						// 新高考的科目
						let newArr = []
						this.newTestItemIndex.forEach(val => newArr.push(val+1));

						// 排序特殊高考的科目防止bug
						newArr.sort((a,b)=> a-b)

						// 新高考科目
						this.UserInformation.mySub = newArr.join("")

						// 考生所在省
						this.UserInformation.userPro = this.saveUserChiooseCity.code

						break;
					case 3:

						// 用户省份
						this.UserInformation.province = this.saveUserChiooseCity.real_code
						// 用户分数
						this.UserInformation.score = this.UserFraction
						// 普通文理科
						this.UserInformation.subType = this.LiberalArts[this.current].code
						// 特殊高考科目
						this.UserInformation.mySub = `${this.SpecialFraction.leftSub}${this.SpecialFraction.rightSub}`
						// 特殊高考成绩
						this.UserInformation.chooseLevel = `${this.SpecialFraction.leftScore}${this.SpecialFraction.rightScore}`
						// 考生所在省
						this.UserInformation.userPro = this.saveUserChiooseCity.code

						console.log("普通特殊高考", this.UserInformation)

						break;
				}


				if (getApp().globalData.status.hasOwnProperty("identity")) {
					console.log("更新用户数据")

					// 如果用户登录了
					if (this.$utils.getLocalStorage("user_message")) {

						let params = {
							token: this.$utils.getLocalStorage("user_message").token,
							subType: this.UserInformation.subType,
							score: this.UserInformation.score,
							mySub: this.UserInformation.mySub,
							province: this.UserInformation.province,
							chooseLevel: this.UserInformation.chooseLevel
						}


						let res = await this.$http.startUpService.modifyUser(params);

						if(res.status == 1) {

							console.log("++++++++++++++++++++++++ this.UserInformation： ++++++++++++++++++: ", this.UserInformation)

							this.$utils.setLocalStorage("user_input", this.UserInformation)
							this.$utils.setLocalStorage("user_message", res.data)
							this.$utils.closedEnterPage("../index/index")
						}

					// 如果用户未登录
					} else {
						console.log("用户未登录：---------，更新本地user_input: ")
						let input = this.$utils.getLocalStorage('user_input')
						input.chooseLevel =  this.UserInformation.chooseLevel
						input.mySub = this.UserInformation.mySub
						input.province = this.UserInformation.province
						input.score = this.UserInformation.score
						input.subType = this.UserInformation.subType
						input.userPro = this.UserInformation.userPro
						input.title = this.saveUserChiooseCity.title

						let [a,b,c] = this.newTestItemIndex
						input.wenli = `${this.NewExamination[a]}/${this.NewExamination[b]}/${this.NewExamination[c]}`

						this.$utils.setLocalStorage("user_input", input)
						this.$utils.enterPage("../index/index")
					}

				} else {
					// 本地保存数据
					if (this.isShowExam == 2) {
						this.UserInformation.title = this.saveUserChiooseCity.title
						let [a,b,c] = this.newTestItemIndex
						this.UserInformation.wenli = `${this.NewExamination[a]}/${this.NewExamination[b]}/${this.NewExamination[c]}`
					}

					this.$utils.setLocalStorage("user_input", this.UserInformation)
					if(this.$utils.getLocalStorage("user_input")) {
						this.$utils.closedEnterPage("../index/index")
					}
				}
			},

			/**
			 * 程序运行后自动保存新高考文理科的默认选中数据
			 * @constructor
			 */
			SaveSubOrScore() {
				this.SpecialFraction.leftSub = this.currentProject.needNum[0].id
				this.SpecialFraction.leftScore = this.achievementGrade[this.leftRadioFractionIndex].id

				this.SpecialFraction.rightSub = this.currentProject.optionNum[this.rightRadioSubjectIndex].id
				this.SpecialFraction.rightScore = this.achievementGrade[this.rightRadioFractionIndex].id

				console.log("新高考分数为：", this.SpecialFraction)
			},
			openAddress() {
				this.$refs.AddressPopup.open()
			},
			bindPickerChange(e) {
				this.index = e.target.value
			}
		}
	}
</script>

<style scoped lang="less">
	@import url("../../common/less/page/startUp.less");

</style>
