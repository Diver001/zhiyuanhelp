<template>
	<view class="MySchool">
		<Header :title="NavTitle">
			<view  v-if="ScoreList.length != 0" class="select_score" slot="action">
				<picker @change="bindPickerChange" :value="currentSelectScore" :range="ScoreList">
					<view class="uni-input">{{ScoreList[currentSelectScore]}}</view>
				</picker>
				<span class="iconfont">&#xe611;</span>
			</view>
		</Header>
		<div class="MySchool_content">

			<!--院校: 普通高考院校 & 新高考院校-->
			<div class="school" v-if="type == 1">
				<!--新高考院校-->
				<ListItem v-if="$utils.checkNewTest()"
									:list="myNewSchList"
									@RemoveLike="removeMyNewSch"
									:showDown="false">

				</ListItem>

				<!--普通高考院校-->
				<ListItem v-else
									:list="SchoolList"
									:showDown="false"
									@RemoveLike="RemoveLike">

				</ListItem>


			</div>


			<!--我的专业-->
			<div v-else-if="type == 2">

				<!--新高考专业-->
				<ListItem v-if="$utils.checkNewTest()"
									@RemoveLike="removeNewMajor"
									:list="myNewMajorList">
				</ListItem>

				<!--普通高考专业-->
				<div v-else>
					<div v-if="MajorList.length != 0">
						<MajorItem v-for="(item,index) in MajorList" :item="item" :key="index">

							<template v-slot:action>
								<view :class="item.is_collect == 1 ? 'yj_like like' : 'like' "
											@tap="removeMajorLike(item)">
									<span v-if="item.is_collect == 0" class="iconfont">&#xe626;</span>
									<text> {{ item.is_collect == 1 ? '已收藏' : item.is_collect == 2 ? '移除' : '收藏' }}</text>
								</view>
							</template>

							<template v-slot:shctitle>
								<div class="m_school_title">{{item.sch_name}}</div>
							</template>

						</MajorItem>
					</div>

					<NoData v-else>
						<Loading></Loading>
					</NoData>
				</div>

			</div>


		</div>
	</view>
</template>

<script>
	import Header from '@/components/tpl/Header.vue'
	import ListItem from '@/components/tpl/ListItem.vue'
	import MajorItem from '@/components/tpl/Major.vue'
	import NoData from '@/components/tpl/NoData.vue'
	import Loading from "@/components/tpl/Loading.vue"

	export default {
		components: {
			Header,
			ListItem,
			MajorItem,
			NoData,
			Loading
		},
		data() {
			return {
				currentSelectScore: 0,
				ScoreList: [],
				NavTitle: '',   //网页标题
				myNewSchList: [],
				myNewMajorList: [],
				SchoolListPage: 1,
				MajorListPage: 1,
				SchoolList: [], // 保存院校数据
				MajorList: [],  // 保存专业数据
				type: 1,    // 1 查看我的院校   2 查看我的专业
			};
		},
		async onLoad(option) {
			await this.$utils.isLogin();
			// 顶部的标题
			this.NavTitle = option.title
			this.type = option.type
			this.getScoreGradeList()
			// 院校
			if (this.type == 1) {
				//  新高考的院校
				if (this.$utils.checkNewTest()) {
					this.myNewSch()

				// 普通高考的院校
				} else {
					this.myCollectSch()
				}

			// 专业
			} else {
				//  新高考的专业
				if (this.$utils.checkNewTest()) {
					this.myNewMajor()

				// 普通高考的专业
				} else {
					this.myCollectMajor()
				}
			}
		},
		async onShow(){
			await this.$utils.isLogin();
		},
		methods: {

			async getScoreGradeList() {
				let res = await this.$http.userService.getScoreGrade({
					token: this.$utils.getLocalStorage("user_message").token,
					is_sch: this.type == 1 ? 1 : 0,
					provinceType: this.$utils.getLocalStorage("user_message").provinceType,
					userPro: this.$utils.getLocalStorage("user_message").userPro
				});
				// 将对象转换为数组保存
				res.data.forEach(val => this.ScoreList.push(val.score))
				res.data.length != 0 ? this.ScoreList.unshift("全部分数") : 0

			},

			/**
			 * 下拉选择分数，查询对应分数段的成绩
			 */
			bindPickerChange(e) {
				this.currentSelectScore = e.target.value
				let currentScore = this.ScoreList[this.currentSelectScore];
				// 表示查询全部数据
				if (this.currentSelectScore == 0) {
					this.type == 1
							? this.$utils.checkNewTest() ? this.myNewSch(0) : this.myCollectSch(0)
							: this.$utils.checkNewTest() ? this.myNewMajor(0) : this.myCollectMajor(0)
				} else {
					this.type == 1
							? this.$utils.checkNewTest() ? this.myNewSch(currentScore) : this.myCollectSch(currentScore)
							: this.$utils.checkNewTest() ? this.myNewMajor(currentScore) : this.myCollectMajor(currentScore)
				}

			},

			/**
			 * 获取 新高考收藏的院校
			 */
			async myNewSch(score = 0) {
				let res = await this.$http.userService.myNewSch({
					token: this.$utils.getLocalStorage("user_message").token,
					userPro: this.$utils.getLocalStorage("user_message").userPro,
					score: score,
					page: 1
				});
				res.data.res.forEach(val => val.is_collect = 2)
				res.data.res.forEach(val => val.tags = val.tags.split(","))
				this.myNewSchList = res.data.res
			},
			/**
			 * 移除 新高考收藏的院校
			 */
			async removeMyNewSch(item,index) {
				let res = await this.$http.userService.delNewSch({
					token: this.$utils.getLocalStorage("user_message").token,
					id: item.id
				});

				console.log("移除 新高考收藏的院校: ", res);
				this.myNewSchList.splice(index,1)
				uni.showToast({
					title: res.msg,
					duration: 2000,
					icon: 'none'
				});
			},


			// TODO ----------------------------------------------------------------------------------------------------------

			/**
			 * 获取 新高考收藏的专业
			 */
			async myNewMajor(score = 0) {
				let res = await this.$http.userService.myNewMajor({
					token: this.$utils.getLocalStorage("user_message").token,
					userPro: this.$utils.getLocalStorage("user_message").userPro,
					score: score,
					page: 1
				});
				res.data.res.forEach(val => val.is_collect = 2)
				res.data.res.forEach(val => val.tags = val.tags.split(","))
				this.myNewMajorList = res.data.res
			},
			/**
			 * 移除 新高考收藏的专业
			 */
			async removeNewMajor(item,index) {
				let res = await this.$http.userService.delNewMajor({
					token: this.$utils.getLocalStorage("user_message").token,
					id: item.id
				});

				console.log("移除 新高考收藏的院校: ", res);
				this.myNewMajorList.splice(index,1)
				uni.showToast({
					title: res.msg,
					duration: 2000,
					icon: 'none'
				});
			},

			// TODO ----------------------------------------------------------------------------------------------------------

			/**
			 * 获取 普通高考收藏的院校
			 * @returns {Promise<void>}
			 */
			async myCollectSch(score = 0) {
				let res = await this.$http.userService.myCollectSch({
					token: this.$utils.getLocalStorage("user_message").token,
					userPro: this.$utils.getLocalStorage("user_message").userPro,
					score: score,
					page: this.SchoolListPage
				});

				this.SchoolList = res.data.data
				this.SchoolList.forEach(val => val.is_collect = 2)
				this.SchoolList.forEach(val => val.tags = val.tags.split(" "))
			},
			/**
			 * 移除 普通高考收藏的院校
			 * @param item
			 * @constructor
			 */
			async RemoveLike(item,index) {
				let res = await this.$http.userService.delUserCollect({
					token: this.$utils.getLocalStorage("user_message").token,
					id: item.id
				});

				this.SchoolList.splice(index,1)

				uni.showToast({
					title: res.msg,
					duration: 2000,
					icon: 'none'
				});
			},


			// TODO ----------------------------------------------------------------------------------------------------------


			/**
			 * 获取 普通高考收藏的专业
			 * @returns {Promise<void>}
			 */
			async myCollectMajor(score = 0) {
				let res = await this.$http.userService.myCollectMajor({
					token: this.$utils.getLocalStorage("user_message").token,
					userPro: this.$utils.getLocalStorage("user_message").userPro,
					score: score,
					page: this.MajorListPage
				});

				this.MajorList = res.data.res
				console.log("this.MajorList: ", this.MajorList)
				this.MajorList.forEach(val => val.is_collect = 2)
			},
			/**
			 * 移除 普通高考收藏的专业
			 */
			async removeMajorLike(item,index) {
				let res = await this.$http.userService.delUserMajor({
					token: this.$utils.getLocalStorage("user_message").token,
					id: item.id
				});

				this.MajorList.splice(index,1)

				uni.showToast({
					title: res.msg,
					duration: 2000,
					icon: 'none'
				});
			}

		}
	}
</script>

<style lang="less" scoped>
	@import "../../common/less/page/mySchool.less";
</style>