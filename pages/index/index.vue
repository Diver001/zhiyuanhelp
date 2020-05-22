<template>
	<view class="container">

		<!--顶部标题和导航区域-->
		<div class="header">
			<!--头部登录转态和分数编辑-->
			<div class="login">
				<!--
				未登录的情况，显示 我的 图标 和 登录 的字
				如果已经登录，显示 我的 和 分数
				-->
				<span>
					<span class="login_message iconfont">&#xe610;</span>
					<text v-if="!UserMessage" @click="$utils.enterPage('../login/login')">登录</text>
					<navigator v-else url="../me/me">个人中心</navigator>
				</span>


				<view class="edit">
					<view @click="editScore(true)" class="message" v-if="UserMessage">
						{{UserMessage.proName }} {{UserMessage.subTypeName || UserMessage.subName}} {{UserMessage.score}}分
					</view>

					<view @click="editScore(false)" class="message" v-else-if="UserInput">
						{{UserInput.title }} {{UserInput.wenli}} {{UserInput.score}}分
					</view>

					<view class="message" v-else>添加高考成绩</view>
					<span class="iconfont">&#xe603;</span>
				</view>

			</div>
			<!--下拉菜单区域-->
			<div class="menu">
				<ms-dropdown-menu>

					<!--省份的下拉-->
					<ms-dropdown-item :hasSlot="true" :title="tabCityTitle" ref="dropdownItemProvince">
						<view class="dropdown-item-content city">
							<ul>
								<li v-for="(item, index) in CityList"
										:key="index"
										@click="cityClick(item.real_code)"
										:class="{ on: ChoiceList.includes(item.real_code) }">
									{{ item.title }}
								</li>
							</ul>
							<TabsItem @Closed="clearChoiceType('sf')"
												@Clear="clearYouChoice('sf')"
												:submitTitle="submitTitle"
												@Submit="provinceChiooseSubmit()">
							</TabsItem>
						</view>
					</ms-dropdown-item>

					<!--院校类型-->
					<ms-dropdown-item :hasSlot="true" :title="tabSchoolTitle" ref="dropdownItemType">
						<view class="dropdown-item-content type_school">

							<!--院校类型-->
							<div class="type_school_item city">
								<h2>院校类型</h2>
								<ul>
									<li v-for="(it,index) in SchoolType"
											:key="index"
											:class="{ on: SchoolTypeNewList.includes(it.id) }"
											@click="SchoolTypeClick(it.id)">
										{{ it.title }}
									</li>
								</ul>
							</div>

							<!--院校特色-->
							<div class="type_school_item city">
								<h2>院校特色</h2>
								<ul class="school_ts">
									<li v-for="(item,index) in schoolFeature"
											:key="index"
											@click="schoolFeatureClick(item)"
											:class="{ on: schoolFeatureNewList.hasOwnProperty(`${item.id}`) }">
										{{ item.title }}
									</li>
								</ul>
							</div>


							<!--院校性质-->
							<div class="type_school_item city">
								<h2>院校性质</h2>
								<ul>
									<li v-for="(item,index) in schoolNature"
											:key="index"
											:class="{ on: schoolNatureNewList.includes(item.id) }"
											@click="schoolNatureClick(item)">
										{{item.title}}
									</li>
								</ul>
							</div>

							<TabsItem @Closed="clearChoiceType('lx')"
												@Clear="clearYouChoice('lx')"
												:submitTitle="submitTitle"
												@Submit="SchoolTypeSubmit">
							</TabsItem>

						</view>
					</ms-dropdown-item>

					<!--院校批次-->
					<ms-dropdown-item v-if="!showNewTabs" :hasSlot="true" :title="tabBatchesTitle" ref="dropdownBatchItem">
						<view class="dropdown-item-content">

							<div class="batch_content">
								<div v-if="ProfessionalBatches.length != 0">
									<div class="batch_item"
											 v-for="(item,index) in ProfessionalBatches"
											 :class="{ on: item.batch == currentBatch }"
											 @click="ProfessionalNewBatchesClick(item.batch)"
											 :key="index">
										{{ item.batchName }}
									</div>
								</div>

								<view class="nodata" v-else>
									<Loading></Loading>
								</view>
							</div>

							<TabsItem
									closed-class="100%"
									@Clear="clearYouChoice('pc')"
									@Submit="ProfessionalNewBatchesSubmit()"
									:submitTitle="submitBatchesTitle"
									@Closed="clearChoiceType('pc')">
							</TabsItem>

						</view>
					</ms-dropdown-item>

					<!--专业筛选-->
					<ms-dropdown-item :hasSlot="true" title="专业筛选" ref="dropdownMajorItem">
						<view class="dropdown-item-content">
							<div class="professional_screening">

								<scroll-view scroll-y="true">
									<!--搜索框-->
									<div class="search">

										<input @input="getPullDown"
													 @focus="ShwoProposaList = true"
													 v-model="ProposaInput"
													 type="text" placeholder="输入意向专业名称">

										<div class="proposal" v-if="ShwoProposaList && ProposaList.length != 0">
											<div class="item"
													 @click="ProposaListClick(item.title)"
													 v-for="(item,index) in ProposaList"
													 :key="index">{{item.title}}
											</div>
										</div>

										<text class="line"></text>
										<div class="right_search" @click="ProposaListClick(false)">
											<view class="iconfont">&#xe606;</view>
											<text>搜索</text>
										</div>

									</div>

									<!--热门搜索-->
									<div class="hot_list">
										<div class="title">热门搜索专业：</div>
										<div class="list">
											<div class="item"
													 v-for="(item,index) in DefaultMajor.majorTitle"
													 @click="ProposaListClick(item)"
													 :key="index">
												{{item}}
											</div>
										</div>
									</div>

									<!--热门搜索-->
									<div class="major_list">
										<div class="major_header">
											<img src="http://static.geekhelp.cn/hot.jpg" alt="">
											<text>大家都在看</text>
										</div>

										<!--数据列表-->
										<MajorItem
												@showPopup="showSchoolPopup"
												v-for="(item,index) in DefaultMajor.majorContent"
												:item="item" :key="index">

											<template v-slot:action>
												<text>招生院校{{item.countSch}}所</text>
												<text class="iconfont">&#xe611;</text>
											</template>

											<template v-slot:shctitle>
												<div class="m_school_title">{{item.sch_name}}</div>
											</template>

										</MajorItem>


									</div>
								</scroll-view>

							</div>
						</view>
					</ms-dropdown-item>

					<!--排名-->
					<ms-dropdown-item :showOtherIcon="true"
														:hasSlot="true"
														:title="tabRankingTitle"
														ref="dropdownRankingItem">
						<view class="dropdown-item-content">

							<div class="batch_content">
								<div class="batch_item"
										 :class="{ on: index == currentRankingIndex }"
										 @click="RankingTabBarClick(index)"
										 :key="index"
										 v-for="(item,index) in RankingTabBar">
									{{item.text}}
								</div>
							</div>

							<TabsItem
									closed-class="100%"
									@Clear="clearYouChoice('pm')"
									@Submit="RankingTabBarSubmit()"
									:submitTitle="submitRankingTitle"
									@Closed="clearChoiceType('pm')">
							</TabsItem>

						</view>
					</ms-dropdown-item>

				</ms-dropdown-menu>
			</div>

			<!--tabs切换的标题-->
			<div class="t_title" :style="{ height: showNewTabs && currentNewsIndex == 0 ? '180.84rpx' : '90rpx' }">
				<!--新高考的tabs切换标题-->
				<div class="new_tabs_title" v-if="showNewTabs">
					<div :class="index == currentNewsIndex ? 'title on' : 'title' "
							 @click="NewsExaminationClick(item,index)"
							 v-for="(item,index) in NewsTabsList"
							 :key="index">
						{{item.name}}
					</div>
				</div>

				<!--普通高考的tabs切换标题-->
				<div class="tabs_title" v-if="currentNewsIndex == 0" :style="{ top: showNewTabs ? '117.928rpx' : '36.231rpx' }">
					<div v-for="(item,index) in tabBars"
							 @click="ontabtap(item,index)"
							 :key="index" :class="index == tabIndex ? 'title_item active' : 'title_item' ">
						{{item.name}}
					</div>
				</div>

			</div>

		</div>

		<!--中间内容区域-->
		<scroll-view :scroll-y="true"
								 @scrolltolower="lower"
								 class="content"
								 v-if="Object.keys(countSchool).length != 0"
								 :style="UserMessage && countSchool.bottomNumCount.hasOwnProperty('1')
								 					? `height: calc(100% - 181.559rpx - 106.984rpx`
								 					: 'height: calc(100% - 181.559rpx)' ">

			<div class="tabs">



				<!--tabs切换的内容-->
				<div class="tabs_content"
						 :style="{ 'margin-top': showNewTabs && currentNewsIndex == 0  ? '208.3333rpx' : '116.942rpx' }">

					<!--新高考的 列表的内容区域-->
					<div class="new_test" v-if="showNewTabs">

						<div v-for="(item,index) in NewsTabsList"
								 :key="index"
								 :class="index == currentNewsIndex ? 'show content_item ' : 'hidden content_item' ">

							<div v-if="currentNewsIndex == 0 && Object.keys(countSchool).length != 0">
								<!--每个列表顶部的提示信息-->
								<view class="tip" v-if="tabIndex == 0">
									推测能就读专业共{{ OtherCountSchool[0] }}
								</view>
								<view class="tip" v-else-if="tabIndex == 1">
									推测能就读专业共{{ countSchool.topNumCount[0] }}，其中可保底{{OtherCountSchool[3]}}
								</view>
								<view class="tip" v-else-if="tabIndex == 2">
									推测能就读专业共{{ countSchool.topNumCount[0] }}，其中较稳妥{{OtherCountSchool[2]}}
								</view>
								<view class="tip" v-else="tabIndex == 3">
									推测能就读专业共{{ countSchool.topNumCount[0] }}，其中可冲击{{OtherCountSchool[1]}}
								</view>
							</div>

							<div v-if="currentNewsIndex == 1">
								<div class="tip" v-if="newSchoolCount.hideCount == 0">
									共查询到{{ newSchoolCount.count }}所院校
								</div>

								<div class="tip" :data="newSchoolCount.hideCount" v-else-if="item.content.length != 0">
									已隐藏{{ newSchoolCount.hideCount }}所院校
								</div>
							</div>

							<ListItem
								@AddUserLike="addNewSchoolLike"
								@recruit="getNewSchMajor"
								:list=" index == 0 ? item.content[tabIndex].list : item.content">
							</ListItem>

						</div>

					</div>

					<!--旧高考的 列表的内容区域-->
					<div class="old_test" v-else>
						<div v-for="(item,index) in tabBars"
								 :key="index"
								 :class=" index == tabIndex ? 'show content_item ' : 'hidden content_item' ">

							<!--中间的列表内容-->
							<view v-if="item.content.length != 0">

								<!--每个列表顶部的提示信息-->
								<view class="tip" v-if="item.id == 0">
									推测能就读院校共{{ OtherCountSchool[0] }}所
								</view>
								<view class="tip" v-else-if="item.id == 3">
									推测能就读院校共{{ countSchool.topNumCount[0] }}所，其中可保底{{OtherCountSchool[3]}}所
								</view>
								<view class="tip" v-else-if="item.id == 2">
									推测能就读院校共{{ countSchool.topNumCount[0] }}所，其中较稳妥{{OtherCountSchool[2]}}所
								</view>
								<view class="tip" v-else="item.id == 1">
									推测能就读院校共{{ countSchool.topNumCount[0] }}所，其中可冲击{{OtherCountSchool[1]}}所
								</view>

								<ListItem @AddUserLike="AddSchoolUserLike"
													@recruit="Recruit"
													@titleClick="SchoolTitleClick"
													:list="item.content">
								</ListItem>

							</view>

							<view class="nodata" v-else>
								<Loading></Loading>
							</view>

						</div>
					</div>

					<!--列表底部的提示信息-->
					<div class="bottom_tips" v-if="countSchool.hasOwnProperty('bottomNumCount')">

						<!--新高考-->
						<div v-if="showNewTabs">
							<!--按专业查询-->
							<div v-if="currentNewsIndex == 0">
								<div v-if="countSchool.bottomNumCount.hasOwnProperty('1')">
									已隐藏冲<text>{{countSchool.bottomNumCount[1]}}</text>个专业、稳
									<text>{{countSchool.bottomNumCount[2]}}</text>个专业、保
									<text>{{countSchool.bottomNumCount[3]}}</text>个专业
									<view style="margin-top: 5px">支付后查看全部</view>
								</div>
							</div>
						</div>

						<!--普通高考-->
						<div v-else>
							<div v-if="countSchool.bottomNumCount.hasOwnProperty('1')">
								已隐藏冲
								<text>{{countSchool.bottomNumCount[1]}}</text>
								所、稳
								<text>{{countSchool.bottomNumCount[2]}}</text>
								所、保
								<text>{{countSchool.bottomNumCount[3]}}</text>
								所，支付后查看全部
							</div>
						</div>

						<!--未登录的时候显示，登录后隐藏-->
						<div v-if="!UserMessage"
								 @click="$utils.enterPage('../login/login')"
								 class="loginViewSchool">
							登录后查看更多院校
						</div>

						<div v-if="countSchool.hasOwnProperty('bottomNumCount')">
							<!--登录成功后显示，购买所有院校-->
							<div @click="downOrder(1)" v-if="UserMessage && countSchool.bottomNumCount.hasOwnProperty('1')"
									 class="loginSuccessViePay loginViewSchool">
								购买全部院校
							</div>
						</div>

					</div>

				</div>

			</div>

		</scroll-view>

		<!--登录成功后显示，底部固定的购买所有院校的导航-->
		<div v-if="Object.keys(countSchool).length != 0">
			<div class="loginBuy" @click="downOrder(1)"
					 v-if="UserMessage && countSchool.bottomNumCount.hasOwnProperty('1')">
				<div class="left_monkey">￥29.9</div>
				<div class="right_buy">
					<span class="iconfont">&#xe613;</span>
					<text>立即购买</text>
				</div>
			</div>
		</div>

		<!--权限的弹窗-->
		<JurisdictionAlert ref="jurisdiction"
											 @clearChoice="clearChoiceType"
											 :text="JurisdictionAlertMessage.text"
											 :vip-type="JurisdictionAlertMessage.type"
											 :show-cancel="JurisdictionAlertMessage.showCancel">
		</JurisdictionAlert>

		<!--普通高考 专业筛选的弹窗-->
		<uni-popup class="major_dd" ref="popup" type="bottom">

			<scroll-view scroll-y="true" style="height: 905.797rpx">
				<div class="top_title">
					<text class="iconfont">&#xe88d;</text>
					该校2019年面向本省共计招生
				</div>
				<div v-if="majorSchoolList.length != 0">
					<MajorItem v-for="(item,index) in majorSchoolList" :item="item" :key="index">

<!--						<template v-slot:action>-->

<!--							<view :class="item.is_collect == 1 ? 'yj_like like' : 'like' "-->
<!--										@tap="item.is_collect === 0 ? addUserCollectMajor(item) : '' ">-->
<!--								<span v-if="item.is_collect == 0" class="iconfont">&#xe626;</span>-->
<!--								<text> {{ item.is_collect == 1 ? '已收藏' : item.is_collect == 2 ? '移除' : '收藏' }}</text>-->
<!--							</view>-->

<!--						</template>-->

						<template v-slot:shctitle>
							<div class="m_school_title">{{item.sch_name}}</div>
						</template>

						<template v-slot:footer>
							<div> 2020年在本省招生该专业人数共{{item.planNum}}人</div>
						</template>

					</MajorItem>
				</div>

				<div v-else class="nodata">
					<Loading></Loading>
				</div>
			</scroll-view>

		</uni-popup>

		<!--新高考 专业筛选的弹窗-->
		<uni-popup class="major_dd" ref="newMajorSchListRef" type="bottom">
			<scroll-view scroll-y="true" style="height: 905.797rpx">
				<div class="top_title">
					<text class="iconfont">&#xe88d;</text>
					该校2019年面向本省共计招生
				</div>
				<div v-if="newMajorSchList.length != 0">
					<ListItem
							@AddUserLike="addNewSchoolLike"
							@recruit="getNewSchMajor"
							:list="newMajorSchList">
					</ListItem>
				</div>

				<div v-else class="nodata">
					<Loading></Loading>
				</div>
			</scroll-view>
		</uni-popup>

		<!--tabs 下大学点击的弹窗-->
		<uni-popup class="school_major" ref="schoolMajorPopup" type="bottom">
			<scroll-view class="school_scroll" scroll-y="true" style="height: 905.797rpx">
				<div class="top_title">
					<div class="t_t">
						<text>{{majorSchoolTitle.alias}}</text>
						<span @click="$refs.schoolMajorPopup.close()" class="iconfont">&#xe615;</span>
					</div>
					<div class="tips">
						<text class="left_3">院校概率：</text>
						<text class="left_2">{{majorSchoolTitle.probability || '-'}}</text>
						<text class="left_1">招生人数：</text>
						<text class="left_2">{{majorSchoolTitle.enterNum}}</text>
					</div>
					<div class="info">
						<span class="iconfont">&#xe88d;</span>
						<text>该校2020年面向本省共计招生{{majorSchoolTotal.length}}个专业</text>
					</div>
				</div>

				<MajorItem v-for="(item,index) in majorSchoolTotal" :item="item" :key="index">
          <template v-slot:shctitle>
            <div class="m_school_title">{{item.title}}</div>
          </template>
					<template v-slot:action v-if="UserMessage">

						<view :class="item.is_collect == 1 ? 'yj_like like' : 'like' "
									@tap="item.is_collect === 0 ? addUserCollectMajor(item, majorSchoolTitle) : '' ">
							<span v-if="item.is_collect == 0" class="iconfont">&#xe626;</span>
							<text> {{ item.is_collect == 1 ? '已收藏' : item.is_collect == 2 ? '移除' : '收藏' }}</text>
						</view>

					</template>
				</MajorItem>

			</scroll-view>
		</uni-popup>

		<!--大学标题的点击弹窗-->
		<uni-popup class="school_major" ref="SchoolTitlePopup" type="bottom">
			<scroll-view class="school_scroll" scroll-y="true" style="height: 905.797rpx">
				<div class="top_title">
					<div class="t_t">
						<text>{{SchoolTitleOther.alias}}</text>
						<span @click="$refs.SchoolTitlePopup.close()" class="iconfont">&#xe615;</span>
					</div>
					<div class="tips">
						<text class="left_1">录取概率：</text>
						<text class="left_2">{{SchoolTitleOther.probability}}%</text>
					</div>
				</div>
				<div class="bottom_table">
					<div class="table_header back">
						<div class="item">年份</div>
						<div class="item">批次</div>
						<div class="item">录取人数</div>
						<div class="item">最低分</div>
						<div class="item">最低位次</div>
					</div>

					<div class="table_header"
							 v-for="(item,index) in SchoolTitle"
							 :key="index">
						<div class="item border">{{item.year}}</div>
						<div class="item border">{{item.batchName}}</div>
						<div class="item border">{{item.enterNum}}</div>
						<div class="item border">{{item.minScore}}</div>
						<div class="item border">{{item.lowSort}}</div>
					</div>

				</div>
			</scroll-view>
		</uni-popup>

		<!--新高考 按院校查询 的弹窗-->
		<uni-popup class="school_major new_school_major" ref="newSchoolPopup" type="bottom">
			<scroll-view class="school_scroll" scroll-y="true" style="height: 905.797rpx">
				<div class="top_title">
					<div class="t_t">
						<text>{{newSchoolTitle.collegeName}}</text>
						<span @click="$refs.newSchoolPopup.close()" class="iconfont">&#xe615;</span>
					</div>
					<div class="tips">
						<text class="left_1">院校代码：</text>
						<text class="left_2">{{newSchoolTitle.collegeCode}}</text>
						<text class="left_3">招生人数：</text>
						<text class="left_4">{{newSchoolTitle.planNum}}</text>
					</div>
					<div class="info">
						<span class="iconfont">&#xe88d;</span>
						<text>该校2020年面向本省共计招生{{newSchoolPopupList.length}}个专业</text>
					</div>
				</div>

				<ListItem
						@AddUserLike="addNewSchoolFz"
						:list="newSchoolPopupList">
				</ListItem>

			</scroll-view>
		</uni-popup>

	</view>
</template>

<script>
	import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue'
	import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue'
	import TabsItem from '@/components/tpl/TabsItem.vue'
	import JurisdictionAlert from '@/components/tpl/JurisdictionAlert.vue'
	import ListItem from '@/components/tpl/ListItem.vue'
	import NoData from '@/components/tpl/NoData.vue'
	import MajorItem from '@/components/tpl/Major.vue'
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import Loading from "@/components/tpl/Loading.vue"

	export default {
		components: {
			msDropdownMenu,
			msDropdownItem,
			TabsItem,
			JurisdictionAlert,
			ListItem,
			NoData,
			MajorItem,
			uniPopup,
			Loading
		},
		data() {
			return {
				SchoolMajoPopupTitle: {},  // 标题数据
				SchoolMajoPopup: [],     // 大学专业弹窗
				newMajorSchList: [],     // 存储新高考专业筛选的数据
				newSchoolTitle: {},      //新高考按学校查询弹窗标题
				newSchoolPopupList: [],  // 新高考按学校查询 弹窗内容
				NewsTabsList: [
					{
						name: '按专业查询',
						id: 0,
						page: 1,
						content: [
							{
								page: 1,
								loading: false,
								list: []
							},
							{
								page: 1,
								loading: false,
								list: []
							},
							{
								page: 1,
								loading: false,
								list: []
							},
							{
								page: 1,
								loading: false,
								list: []
							}
						]
					},
					{
						name: '按学校查询',
						id: 0,
						page: 1,
						content: []
					}
				], // 新高考的tabs弹窗
				currentNewsIndex: 0, //默认显示 按专业查询数据
				showNewTabs: false,  // 是否展示新高考的tabs切换
				submitTitle: '确定',  // 省份 & 类型 下拉弹窗 的确定按钮的文字,
				submitBatchesTitle: '确定', // 批次的确定按钮文字
				submitRankingTitle: '确定',
				tabCityTitle: '省份',
				tabBatchesTitle: '批次',
				tabRankingTitle: '排名',
				tabSchoolTitle: '类型',
				tabSchoolNumber: 0,  // 院校类型的选中计数
				// 当前tab的下标
				tabIndex: 0,
				// tabs 标题
				tabBars: [
						{
							name: '全部院校',
							id: 0,
							page: 1,
							content: []
					  },
						{
							name: '可保底',
							id: 3,
							page: 1,
							content: []
						},
						{
							name: '较稳妥',
							id: 2,
							page: 1,
							content: []
						},
						{
							name: '可冲击',
							id: 1,
							page: 1,
							content: []
						}
				],
				CityList: [],            // 保存所有省份数据
				SchoolType: [],          // 保存原始院校类型数据
				SchoolTypeNewList: [-1], //保存点击后新的 院校类型 数据

				schoolFeature: [],       //保存原始院校特色数据
				schoolFeatureNewList: { is_no: 0 }, //保存点击后新的 院校特色 数据

				schoolNature: [],           // 保存原始院校性质数据
				schoolNatureNewList: [ -1 ],    // 保存点击后新的 院校性质 数据
				ChoiceList: [ 0 ],   // 选中的城市
				UserMessage: {},     // 获取本地的登录信息
				UserInput: {},       // 保存用户智能填报数据
				getIndexSchoolParams: {
					is_login: 0,  // 是否登录，登录1，未登录0
					token: "",    // 用户token，登录时必传
					province: "", // 省份real_code多选用逗号隔开，如1,2,3
					reType: 0,    // 院校根据概率分级（冲击1，稳妥2，保底3）
					userPro: '',  // 考生所在省份
					chooseLevel: 0, //江苏高考需要传的科目等级，对应chooseLevel，默认0
					mySub: '',    // 考生所选科目集合
					score: '',    // 分数
					subType: 0,   // 文理科
					schoolType: 0,// 院校类型， 多个类型以逗号隔开
					is_public: 0, // 公办2，民办 1
					batch: 0,     // 批次
					page: 1,       // 分页默认1
					type: 1,       // 查询类型 概率1，院校类型2，专业3
					sort: 0        // 默认排序
				},
				JurisdictionAlertMessage: {
					text: '',
					showCancel: true,  // 是否展示 以后再说
					type: 1
				},
				countSchool: {},     // 保存列表头尾的提示信息
				newSchoolCount: '',  // 新高考按院校查询顶部提示信息
				OtherCountSchool: {},  // 保存列表头尾的提示信息
				SchoolTypeParams: {}, // 保存用户在 类型 中选中的数据
				ProfessionalBatches: [], // 保存下拉的批次
				currentBatch: 0,  // 默认批次 全部批次
				currentRankingIndex: 0, // 默认排名
				RankingTabBar: [
					{id: 0, text: '默认排序'},
					{id: 1, text: '院校排名从高到低'},
					{id: 2, text: '院校排名从低到高'},
					{id: 3, text: '概率从高到低'},
					{id: 4, text: '概率从低到高'},
				],
				DefaultMajor: {
					majorTitle: [],
					majorContent: []
				},   // 专业筛选数据
				ProposaList: [],         // 存放下拉搜索建议
				ShwoProposaList: false,  // 是否展示下拉建议的变量控制
				ProposaInput: '',       // 用户输入的关键词
				majorSchoolList: [],     // 筛选下拉点击查看学习专业
				majorSchoolTotal: [],     // 存储 首页点击招收专业
				majorSchoolTitle: {},     // 存储用户点击大学的信息
				SchoolTitle: [], 					// 存储大学批次的数据
				SchoolTitleOther: {}     // 保存大学批次其他信息
			}
		},
		async created() {
	   	// 获取所有省份
			this.getCityList()
			// 获取所有学校类型
			this.getSchoolType()
			// 获取所有批次
			this.getProvinceBatch()

			// 判断是否为新高考，然后调用对应的接口
			if (this.$utils.checkNewTest()) {
				// 如果为新高考，赋值保存参数
				this.getIndexSchoolParams.mySub = this.$utils.getUserInput().mySub || this.$utils.getLocalStorage("user_message").mykemu;
				this.getIndexSchoolList('new')
			} else {
				this.getIndexSchoolList('old')
			}

			// 获取 专业筛选 默认数据
			this.getDefaultMajor()
		},
		/**
		 * 滚动到底部进行数据的自动加载
		 */
		async onReachBottom() {
		},
		onShow() {
			// 判断是否是新高考，如果是新高考那么显示新高考的tabs切换
			if(this.$utils.checkNewTest()) {
				this.showNewTabs = true
			} else {
				this.showNewTabs = false
			}

			// 如果登录后返回回来，那么赋值UserMessage
			if (this.$utils.getLocalStorage("user_message")) {
				this.UserMessage = this.$utils.getLocalStorage("user_message")
			}

			// 如果有user_input 那么保存
			if (this.$utils.getUserInput()) {
				this.UserInput = this.$utils.getUserInput()
			}

			// 如果有
			if (this.$utils.getUserInput()) {
				// 因为 user_input 没有 文科，省份 这两个中文词，所以需要自己处理一下
				let address = this.$utils.getLocalStorage("address");
				this.UserInput.title = (address.filter(val => val.code == this.UserInput.userPro))[0].title
				this.UserInput.wenli = [ {code: "1", title: '文科'}, {code: "2", title: '理科'} ].filter(val =>  val.code == this.UserInput.subType )[0].title
				this.$utils.setLocalStorage("user_input", this.UserInput)
			}

		},
		methods: {

			async lower() {
				// 是否登录
				if (this.$utils.checkLogin()) {
					// 发送请求，获取是否有权限

					let res = await this.$http.indexService.checkAuth({
						token: this.UserMessage.token,
						type: 1,
						province: this.UserMessage.userPro,
						subType: this.UserMessage.wenli,
						mySub: this.$utils.getLocalStorage("user_input").mySub,
						score:  this.UserMessage.score
					});

					// 如果权限不足，那么什么都不干
					if (res.data == 1) {

						// 如果有权限
					} else {
						// 是否为新高考
						if (this.$utils.checkNewTest()) {
							// 如果为 按专业查询
							console.log("新高考")
							if (this.currentNewsIndex == 0) {
								console.log("按专业查询")

								this.NewsTabsList[this.currentNewsIndex].content[this.tabIndex].page += 1
								this.getIndexSchoolParams.page = this.NewsTabsList[this.currentNewsIndex].content[this.tabIndex].page += 1
								this.NewsTabsList[this.currentNewsIndex].content[this.tabIndex].loading = true
								// this.GetJudgementAuthority(2, true, )
								this.getIndexSchoolList('new')

								// 如果是 按学校查询
							} else {
								console.log("按学校查询")

								this.NewsTabsList[this.currentNewsIndex].page += 1
								this.getIndexSchoolParams.page = this.NewsTabsList[this.currentNewsIndex].page
								// this.GetJudgementAuthority(2, true, 'other')
								this.getIndexSchoolList('other')

							}

							// 如果为普通高考
						} else {
							console.log("普通高考")
							this.tabBars[this.tabIndex].page += 1
							this.getIndexSchoolParams.page = this.tabBars[this.tabIndex].page
							// this.getIndexSchoolList("old")
							this.getIndexSchoolList('old')

						}
					}
				}
			},

			/**
			 * 新高考按学校查询 点击 匹配专业 的弹窗
			 */
			async getNewSchMajor(item) {
				console.log("你点击的院校：", item)
				let params = {
					is_login: this.$utils.checkLogin() ? 1 : 0,
					token: this.$utils.checkLogin() ? this.$utils.getLocalStorage("user_message").token : '',
					id: item.id
				}
				if (this.$utils.getUserInput()) {
					params.userPro = this.$utils.getUserInput().userPro
				}
				if (this.$utils.getLocalStorage("user_message")) {
					params.userPro = this.$utils.getLocalStorage("user_message").userPro
				}
				let res = await this.$http.indexService.getNewSchMajor(params)
				console.log("请求的院校数据：",res.data)
				if (res.data.length != 0) {

					this.$refs.newSchoolPopup.open()
					this.newSchoolTitle = item
					res.data.forEach(val => val.tags = item.tags)
					res.data.forEach(val => val.rankOfCn = item.rankOfCn)
					this.newSchoolPopupList = res.data
				} else {
					uni.showToast({
						title: '没有专业数据',
						duration: 2000,
						icon: 'none'
					});
				}
			},

			/**
			 * 新高考专业 的公共代码封装
			 */
			async addNewSchoolFz(item) {
				console.log("院校弹窗收藏：",item)
				let params = {
					token: this.$utils.getLocalStorage("user_message").token,
					plan_id: item.id || item.rec_id,
					majorCode: item.majorCode,
					professionCode: item.professionCode,
					professionName: item.professionName,
					chooseCns: item.chooseCns,
					collegeName: item.collegeName,
					probability: item.probability,
					planNum: item.planNum,
					tags: item.tags.join(),
					minScore: item.minScore,
					lowestRank: item.lowestRank,
					rankOfCn: item.rankOfCn,
					recommendType: this.tabBars[this.tabIndex].id,
					userPro: this.$utils.getLocalStorage("user_message").userPro,
					score: this.$utils.getLocalStorage("user_message").score,
				}
				let res = await this.$http.indexService.addUserNewMajor(params)
				item.is_collect = 1
				uni.showToast({
					title: '专业收藏成功',
					duration: 2000,
					icon: 'none'
				});
			},

			/**
			 * 新高考专业和学校的收藏
			 */
			async addNewSchoolLike(item) {
				if (this.$utils.checkLogin()) {
					// 按专业查询 的收藏
					if (this.currentNewsIndex == 0) {
						this.addNewSchoolFz(item)
						// 按学校查询 的收藏
					} else {
						let params = {
							token: this.$utils.getLocalStorage("user_message").token,
							plan_id: item.id,
							collegeName: item.collegeName,
							logo: this.$img.url(item.collegeId),
							lowestRank: item.lowestRank,
							minScore: item.minScore,
							majorNum: item.majorNum,
							planNum: item.planNum,
							tags: item.tags.join(),
							rankOfCn: item.rankOfCn,
							collegeCode: item.collegeCode,
							userPro: this.$utils.getLocalStorage("user_message").userPro,
							score: this.$utils.getLocalStorage("user_message").score,
						};
						let res = await this.$http.indexService.addUserNewSch(params)
						item.is_collect = 1
						uni.showToast({
							title: '院校收藏成功',
							duration: 2000,
							icon: 'none'
						});
					}
				} else {
					uni.showModal({
						title: '温馨提示',
						content: '您还未登录，请先登录',
						success: res => {
							if (res.confirm) {
								this.$utils.enterPage("../login/login")
							}
						}
					});
				}
			},

			/**
			 * tabs 标题点击切换
			 * @param item
			 * @param index
			 */
			ontabtap(item,index) {
				this.tabIndex = index;
				this.getIndexSchoolParams.page = this.tabBars[this.tabIndex].page
				this.getIndexSchoolParams.reType = item.id;

				// 如果是新高考
				if (this.showNewTabs) {
					// 如果按专业查询没有数据，那么发送请求
					if (this.currentNewsIndex == 0 && this.NewsTabsList[this.currentNewsIndex].content[this.tabIndex].list.length == 0) {
						this.getIndexSchoolList("new")
					}

					// 如果按学校查询没有数据，那么发送请求
					if (this.NewsTabsList[this.currentNewsIndex].content.length == 0) {
						this.getIndexSchoolList("new")
					}

				// 如果普通高考
				} else {
					console.log("-------------- 普通高考 ---------------")
					if(this.tabBars[this.tabIndex].content.length == 0) {
						this.getIndexSchoolList("old")
					}
				}



			},

			/**
			 * 新高考的tabs点击事件，点击切换样式请求不同的数据
			 */
			NewsExaminationClick(item,index) {
				console.log("新高考的tabs点击事件 ---- : ", index,item)

				this.currentNewsIndex = index
				this.getIndexSchoolParams.page = this.NewsTabsList[this.currentNewsIndex].page
				// this.getIndexSchoolParams.reType = item.id;

				if(this.NewsTabsList[this.currentNewsIndex].content.length == 0) {
					// 新高考按专业查询数据
					if (index == 0) {
						this.getIndexSchoolList("new")
					// 新高考按学校查询数据
					} else {
						this.getIndexSchoolList("other");
					}
				}
			},

			setTopTips() {
				switch (this.tabIndex) {
					case 0:
						this.OtherCountSchool[0] = this.countSchool.topNumCount[0]
						break;
					case 1:
						this.OtherCountSchool[3] = this.countSchool.topNumCount[3]
						break;
					case 2:
						this.OtherCountSchool[2] = this.countSchool.topNumCount[2]
						break;
					case 3:
						this.OtherCountSchool[1] = this.countSchool.topNumCount[1]
						break;
				}
			},

			/**
			 * 查询普通高考院校
			 */
			async getIndexSchoolList(type) {
				this.UserMessage = this.$utils.getLocalStorage("user_message")

				// 登录成功后查看成绩
				if (this.UserMessage) {
					console.log("用户已经登录")
					this.getIndexSchoolParams.is_login = 1;
					this.getIndexSchoolParams.token = this.UserMessage.token;
					this.getIndexSchoolParams.userPro = this.UserMessage.userPro;
					this.getIndexSchoolParams.score = this.UserMessage.score;
					this.getIndexSchoolParams.subType = this.UserMessage.wenli;
					if (this.UserMessage.mykemu != 0) {
						this.getIndexSchoolParams.chooseLevel = this.UserMessage.chooseLevel
					} else {
						delete this.getIndexSchoolParams.chooseLevel
					}
					// 未登录查看成绩
				} else {
					console.log("用户没有登录")
					this.getIndexSchoolParams.is_login = 0;
					this.getIndexSchoolParams.userPro = this.$utils.getLocalStorage("user_input").userPro
					this.getIndexSchoolParams.score = this.$utils.getLocalStorage("user_input").score
					this.getIndexSchoolParams.subType = this.$utils.getLocalStorage("user_input").subType

					if (parseInt(this.$utils.getLocalStorage("user_input").mySub ) != 0) {
						this.getIndexSchoolParams.chooseLevel = this.$utils.getLocalStorage("user_input").chooseLevel
					} else {
						delete this.getIndexSchoolParams.chooseLevel
					}
					delete this.UserMessage.token;
				}

				let res = [];

				// 老高考数据
				if (type == 'old') {
					// 获取学校信息
					res = await this.$http.indexService.getSchools(this.getIndexSchoolParams)
					// 保存列表头尾的提示信息
					this.countSchool = res.data.countSchool

					this.setTopTips()

					// 转换tags为数组
					res.data.res.forEach((val)=>  val.tags = val.tags.split(" ") )

				} else if (type == 'new') {

					res = await this.$http.indexService.getNewMajor(this.getIndexSchoolParams)
					// 保存列表头尾的提示信息
					this.countSchool = res.data.countSchool

					this.setTopTips()

					// 转换tags为数组
					res.data.res.forEach((val)=>  val.tags = val.tags.split(" ") )
					console.log("新高考按专业查询：", res.data.res)

				} else if (type == 'other') {
					res = await this.$http.indexService.getMajorSch(this.getIndexSchoolParams)
					res.data.res.forEach((val)=>  val.tags = val.tags.split(" ") )
					this.newSchoolCount = {
						count: res.data.count,
						hideCount: res.data.hideCount
					}
					console.log("新高考按院校查询：", this.newSchoolCount)
				}


				// 旧高考的数据
				if (type =='old') {
					// 增加数据
					this.tabBars[this.tabIndex].content = [...this.tabBars[this.tabIndex].content, ...res.data.res]

				// 新高考按照专业查询 数据
				} else if (type == 'new'){
					// 如果是新高考，并且是按专业查询
					if (this.showNewTabs && this.currentNewsIndex == 0) {
						// 没有数据的时候
						if (this.NewsTabsList[this.currentNewsIndex].content[this.tabIndex].list.length == 0) {
							console.log("----------没有数据的时候-------------")
							this.NewsTabsList[this.currentNewsIndex].content[this.tabIndex].list =
									[...this.NewsTabsList[this.currentNewsIndex].content[this.tabIndex].list, ...res.data.res];
						} else {
							console.log("----------有数据的时候-------------")

							if (this.NewsTabsList[this.currentNewsIndex].content[this.tabIndex].loading) {
								this.NewsTabsList[this.currentNewsIndex].content[this.tabIndex].list =
										[...this.NewsTabsList[this.currentNewsIndex].content[this.tabIndex].list, ...res.data.res];
								this.NewsTabsList[this.currentNewsIndex].content[this.tabIndex].loading = false
							}

						}
					}

				// 新高考按照院校查询 数据
				} else if ( type == 'other') {
					if (this.showNewTabs && this.currentNewsIndex == 1) {
						this.NewsTabsList[this.currentNewsIndex].content = [...this.NewsTabsList[this.currentNewsIndex].content, ...res.data.res]
					}
				}

			},

			/**
			 * 学校标题点击
			 */
			async SchoolTitleClick(item) {
				this.$refs.SchoolTitlePopup.open()
				let res = await this.$http.indexService.getSchEnroll({
					userPro: this.UserInput.userPro || this.UserMessage.userPro,
					batch: item.batch,
					subType: this.UserInput.subType  || this.UserMessage.wenli,
					sch_id: item.sch_id
				})
				this.SchoolTitleOther = item
				this.SchoolTitle = res.data
				// console.log("院校标题被点击：", res.data)
			},

			/**
			 * 招收专业的弹窗
			 */
			async Recruit(item) {
				if (this.$utils.checkLogin()) {
					let data = await this.GetJudgementAuthority(3);
					if (data == 1 || data == 2 || data == 3) {

						this.$refs.schoolMajorPopup.close();

						// 判断权限给不同的弹窗文字
						data == 1
								? this.JurisdictionAlertMessage.text = this.$config.AlertText.probability
								: data == 2
								? this.JurisdictionAlertMessage.text = this.$config.AlertText.screen
								: data == 3
										? this.JurisdictionAlertMessage.text = this.$config.AlertText.major
										: ''

						this.JurisdictionAlertMessage.type = data;
						this.$refs.jurisdiction.openPopup();

						// 如果有权限，那么打开弹窗获取专业对应的学校
					} else {
						let params = {
							is_login: 1,
							token: this.$utils.getLocalStorage("user_message").token,
							id: item.id,
							sch_id: item.sch_id,
							userPro: this.$utils.getLocalStorage("user_message").userPro,
							subType: this.UserMessage.wenli,
							score: this.$utils.getLocalStorage("user_message").score,
							page: 1
						};

						let res = await this.$http.indexService.getSchMajor(params);
						this.majorSchoolTitle = item
            res.data.forEach(val => val.sch_name = "e")
						this.majorSchoolTotal = res.data;

            console.log("this.item: ", item)

            this.$refs.schoolMajorPopup.open();
					}
				} else {
					let params = {
						is_login: 0,
						id: item.id,
						sch_id: item.sch_id,
						userPro: this.$utils.getLocalStorage("user_message").userPro || this.$utils.getLocalStorage("user_input").userPro,
						subType: this.$utils.getLocalStorage("user_message").wenli || this.$utils.getLocalStorage("user_input").subType,
						score: this.$utils.getLocalStorage("user_message").score ||this.$utils.getLocalStorage("user_input").score,
						page: 1
					};

					let res = await this.$http.indexService.getSchMajor(params);
					this.majorSchoolTitle = item
					this.majorSchoolTotal = res.data;
					this.$refs.schoolMajorPopup.open();
				}

			},

			/**
			 * true 登录过 去 成绩管理
			 * false 未登录 去 startup
			 */
			editScore(status) {
				if (status) {
					uni.navigateTo({
						url: '../orderStatus/orderStatus'
					})
				} else {
					getApp().globalData.status.identity = 'new'
					getApp().globalData.status.action = 'needInput'
					uni.navigateTo({
						url: '../startUp/startUp'
					})
				}
			},
			
	   	/**
			 * 专业筛选 点击查看招收院校的弹窗控制
			 */
			async showSchoolPopup(item) {
				if (this.$utils.checkLogin()) {
					let data = await this.GetJudgementAuthority(3)
					// 如果
					if (data == 1 || data == 2 || data == 3) {

						this.$refs.dropdownMajorItem.close();

						// 判断权限给不同的弹窗文字
						data == 1
								? this.JurisdictionAlertMessage.text = this.$config.AlertText.probability
								: data == 2
								     ? this.JurisdictionAlertMessage.text = this.$config.AlertText.screen
										 : data == 3
						             ? this.JurisdictionAlertMessage.text = this.$config.AlertText.major
										     : ''

						this.JurisdictionAlertMessage.type = data;
						this.$refs.jurisdiction.openPopup();

					// 如果有权限，那么打开弹窗获取专业对应的学校
					} else {

						// 如果为新高考
						if (this.showNewTabs) {
							let res = await this.$http.indexService.newMajorSch({
								token: this.UserMessage.token,
								userPro: this.UserMessage.userPro,
								mySub: this.UserMessage.mykemu,
								score: this.UserMessage.score,
								code: item.code,
								page: 1
							});
							if (res.data.res.length != 0) {
								this.newMajorSchList = res.data.res
								res.data.res.forEach( val => val.tags = val.tags.split(" ") )
								this.$refs.newMajorSchListRef.open();
							} else {
								uni.showToast({
									title: '没有数据',
									duration: 2000,
									icon: 'none'
								});
							}


						// 如果为普通高考
						} else {
							let res = await this.$http.indexService.majorSchool({
								token: this.UserMessage.token,
								userPro: this.UserMessage.userPro,
								subType: this.UserMessage.wenli,
								score: this.UserMessage.score,
								page: 1,
								code: item.code
							})
							if (res.data.data.length != 0) {
								this.majorSchoolList = res.data.data
								this.$refs.popup.open();
							} else {
								uni.showToast({
									title: '没有数据',
									duration: 2000,
									icon: 'none'
								});
							}
						}
					}
				} else {
					this.$refs.dropdownMajorItem.close();
					// 关闭下拉弹窗
					this.NotLoggedInDefaultAlert()
				}

			},

	   	/**
			 * 搜索建议的下拉 点击事件
			 */
			async ProposaListClick(title) {
				let res = await this.$http.indexService.getMajorAbout({
					title: title ? title : this.ProposaInput,
					page: 1,
					userPro: this.UserInput.userPro ? this.UserInput.userPro : this.UserMessage.userPro,
					province:  this.getIndexSchoolParams.province ,
					subType: this.UserMessage.wenli || this.UserInput.subType,
					batch: this.getIndexSchoolParams.batch
				});

				this.ProposaInput = title ? title : this.ProposaInput
				this.DefaultMajor.majorContent = res.data.res
				this.ShwoProposaList = false
			},

	   	/**
			 * 专业筛选下拉建议
			 */
			async getPullDown(event) {
				if (event.detail.value.length != 0)  {
					let res = await this.$http.indexService.getPullDown({
						title: event.detail.value
					});
					this.ProposaList = res.data
					this.ShwoProposaList = true
				} else {
					this.ProposaList = []
					this.ShwoProposaList = false
				}
			},

	   	/**
			 * 获取专业筛选默认数据
			 */
			async getDefaultMajor() {

				let res = await this.$http.indexService.defaultMajor({
					userPro: this.UserInput.userPro ? this.UserInput.userPro : this.UserMessage.userPro,
					province:  this.getIndexSchoolParams.province ,
					subType: this.UserMessage.wenli || this.UserInput.subType,
					batch: this.getIndexSchoolParams.batch
				});

				this.DefaultMajor.majorTitle = res.data.majorTitle
				this.DefaultMajor.majorContent = res.data.majorContent

				console.log("专业筛选默认数据 this.DefaultMajor：", this.DefaultMajor)
			},

			/**
			 * 收藏专业
			 */
			async addUserCollectMajor(item, majorSchoolTitle = null) {
				console.log("收藏专业 item: ", item)
				let params = {
					token: this.$utils.getLocalStorage("user_message").token,
					subType: this.$utils.getLocalStorage("user_message").wenli,
					score: this.$utils.getLocalStorage("user_message").score,
					userPro: this.$utils.getLocalStorage("user_message").userPro,
					code: item.code,
					probability: item.probability,
					majorCode: item.majorCode,
					title: item.title,
					planNum: item.planNum,
					sch_id: item.sch_id,
					tags: typeof item.tags == "string" ? item.tags : item.tags.join(" "),
					sch_name: item.sch_name,
					minScore: item.minScore || 0,
					lowestRank: item.lowestRank || 0,
					enterNum: item.enterNum || 0,
					cost: item.cost
				};

				// 如果是首页点击过来的查看专业
				if (majorSchoolTitle != null) {
					params.sch_id = majorSchoolTitle.sch_id
					params.sch_name = majorSchoolTitle.alias
				}


				let res = await this.$http.indexService.addUserCollectMajor(params);

				item.is_collect = 1
				uni.showToast({
					title: '专业收藏成功',
					duration: 2000,
					icon: 'none'
				});
			},

			/**
			 * 添加收藏的院校
			 */
			async AddSchoolUserLike(item) {
				if (this.$utils.checkLogin()) {
					let params = {
						token: this.$utils.getLocalStorage("user_message").token,
						rec_id: item.id,
						alias: item.alias,
						logo: item.logo.length != 0 ? item.logo : 'noLogo.png',
						batch_title: item.batch_title,
						lowestRank: item.lowestRank,
						minScore: item.minScore,
						majorNum: item.majorNum,
						enterNum: item.enterNum,
						sch_id: item.sch_id,
						sch_province_title: item.sch_province_title,
						tags: item.tags.join(" "),
						rankOfCn: item.rankOfCn,
						probability: item.probability,
						recommendType: item.recommendType,
						userPro: this.$utils.getLocalStorage("user_message").userPro,
						score: this.$utils.getLocalStorage("user_message").score,
					}
					let res = await this.$http.userService.addUserCollectSch(params);
					item.is_collect = 1
					uni.showToast({
						title: '院校收藏成功',
						duration: 2000,
						icon: 'none'
					});
				} else {
					uni.showModal({
						title: '温馨提示',
						content: '您还未登录，请先登录',
						success: res => {
							if (res.confirm) {
								this.$utils.enterPage("../login/login")
							}
						}
					});
				}
			},

	   	/**
			 * 跳转到支付页面
			 */
			downOrder(type) {
				this.$utils.enterPage(`../payment/payment?type=${type}`)
			},

			/**
			 * 院校类型 多选点击事件
			 */
			SchoolTypeClick(index) {
				// 判断是否已经有
				if (index == -1) {
					console.log("清空数据")

					// 不限的时候计算个数来重新赋值 tabSchoolNumber
					this.tabSchoolNumber = this.tabSchoolNumber - this.SchoolTypeNewList.length

					if (this.tabSchoolNumber <= 0 ) {
						this.tabSchoolNumber = 0;
						this.tabSchoolTitle = '类型'
					} else {
						this.setSchoolNumbers()
					}

					this.SchoolTypeNewList = [-1];
					this.SchoolTypeParams.schoolType = 0



				} else {
					this.SchoolTypeNewList.includes(-1) ? this.SchoolTypeNewList.splice(0,1) : '';

					if (this.SchoolTypeNewList.includes(index)) {
						this.cancelSchoolNumbers()
						// 去重复
						this.SchoolTypeNewList = this.SchoolTypeNewList.filter(val => val != index);
						this.SchoolTypeNewList.length == 0 ? this.SchoolTypeNewList = [-1] : ''

					} else {
						this.SchoolTypeNewList.push(index);

						this.tabSchoolNumber += 1;
						this.setSchoolNumbers()
					}
				}
				console.log("------ 你选择的院校类型 ----- ：", this.SchoolTypeNewList)

				this.checkTypeClickNumber(2)

			},

			/**
			 * 院校特色 多选点击事件
			 */
			schoolFeatureClick(item) {
				const keys = item.id;
				if (keys == 'is_no') {

					this.tabSchoolNumber = this.tabSchoolNumber - Object.keys(this.schoolFeatureNewList).length
					if (this.tabSchoolNumber <= 0 ) {
						this.tabSchoolNumber = 0;
						this.tabSchoolTitle = '类型'
					} else {
						this.setSchoolNumbers()
					}

					// 如果用户点击了 院校特色 的不限，那么清除上次的选择
					for (const key in this.schoolFeatureNewList) {
						delete this.SchoolTypeParams[key]
						delete this.getIndexSchoolParams[key]
					}

					this.schoolFeatureNewList = { is_no: 0 }
				} else {
					this.schoolFeatureNewList.hasOwnProperty('is_no')
							? this.$delete(this.schoolFeatureNewList, 'is_no') : ''

					if (this.schoolFeatureNewList.hasOwnProperty(item.id)) {
						this.$delete(this.schoolFeatureNewList, keys)

						this.cancelSchoolNumbers()

						// 取消院校特色 的选中后从对象中分别删除
						this.$delete(this.SchoolTypeParams, keys)
						this.$delete(this.getIndexSchoolParams, keys)

						Object.keys(this.schoolFeatureNewList).length == 0
								? this.$set(this.schoolFeatureNewList, 'is_no', 0) : ''

					} else {
						this.tabSchoolNumber += 1;
						this.setSchoolNumbers()
						this.$set(this.schoolFeatureNewList, keys, 1)
					}
				}

				console.log("----- 你选择的院校特色 ------: ", this.schoolFeatureNewList)

				this.checkTypeClickNumber(2)

			},

			/**
			 * 院校性质 多选点击事件
			 */
			schoolNatureClick(item) {
				if (item.id == -1) {

					this.tabSchoolNumber = this.tabSchoolNumber - this.schoolNatureNewList.length
					if (this.tabSchoolNumber <= 0 ) {
						this.tabSchoolNumber = 0;
						this.tabSchoolTitle = '类型'
					} else {
						this.setSchoolNumbers()
					}

					this.schoolNatureNewList = [-1]
					this.SchoolTypeParams.is_public = 0;
				} else {
					this.schoolNatureNewList.includes(-1) ? this.schoolNatureNewList.splice(0,1) : '';
					if (this.schoolNatureNewList.includes(item.id)) {
						this.cancelSchoolNumbers()
						this.schoolNatureNewList = this.schoolNatureNewList.filter(val => val != item.id);
						this.schoolNatureNewList.length == 0 ? this.schoolNatureNewList = [-1] : ''
					} else {
						this.tabSchoolNumber += 1;
						this.setSchoolNumbers()
						this.schoolNatureNewList.push(item.id);
					}
				}
				console.log("------ 你选择的 院校性质 ----- ：", this.schoolNatureNewList)
				this.checkTypeClickNumber(2)

			},

			/**
			 * 取消选择的时候
			 */
			cancelSchoolNumbers() {
				this.tabSchoolNumber -= 1;
				if (this.tabSchoolNumber >= 0) {
					this.tabSchoolTitle = '类型'
				} else {
					this.setSchoolNumbers()
				}
			},
			setSchoolNumbers() {
				this.tabSchoolTitle = `类型${this.tabSchoolNumber}`
			},



			// 省份列表被点击 选中
			async cityClick(index) {
				// 如果点击不限，那么直接清空用户选中的其他城市
				if (index == 0) {
					this.ChoiceList = [0]
					this.tabCityTitle = '省份'
					// 如果不是
				} else {
					// 先清楚以前默认的0数据
					this.ChoiceList.includes(0) ? this.ChoiceList.splice(0,1) : '';
					// 判断是否已经点选过，true 选中过，false没选中 保存到数组
					if (this.ChoiceList.includes(index)) {
						// filter 遍历 用不同的数据覆盖老数据
						this.ChoiceList = this.ChoiceList.filter(ele => ele != index);
						// 如果所有城市点击取消选中后，数组为空应该默认去选中 不限
						if (this.ChoiceList.length == 0) {
							this.ChoiceList = [0]
							this.tabCityTitle = '省份'
						}
					} else {
						this.ChoiceList.push(index);
					}

					// 选择的不是 不限 后才开始计数并修改文字信息
					this.ChoiceList.length == 0
							? this.tabCityTitle = '省份'
							: this.tabCityTitle = '省份'+this.ChoiceList.length

					// 如果有权限
					if (this.$utils.getLocalStorage("user_message")) {
					}

					console.log("----- 你选择的院校特色 ------: ", this.ChoiceList)
				}

				this.checkTypeClickNumber(1)
			},


			/**
			 * 省份和类型点击后的计数统计
			 * type 1 省份
			 * type 2 类型
			 */
			async checkTypeClickNumber(type) {
				if (type == 1) {
					/**
					 * 处理省份的数据
					 * @type {*[]}
					 */
					let NewCity = []
					this.ChoiceList.forEach(val => NewCity.push(val * 10000))
					this.getIndexSchoolParams.province = NewCity.join()


				} else {

					// 将院校类型转为 [1,2,3,4] 格式
					if (!(this.SchoolTypeNewList.includes(-1))) {
						this.SchoolTypeParams.schoolType = this.SchoolTypeNewList.join();
					}

					// 将院校特色和 params 合并，转为 { is_211:1 } 格式
					if (!(this.schoolFeatureNewList.hasOwnProperty("is_no"))) {
						for (const key in this.schoolFeatureNewList) {
							this.SchoolTypeParams[key] = this.schoolFeatureNewList[key]
						}
					}

					if(!(this.schoolNatureNewList.includes(-1))) {
						if (this.schoolNatureNewList.length !== 2) {
							this.SchoolTypeParams.is_public = this.schoolNatureNewList.join()
						}
					}

					Object.assign(this.getIndexSchoolParams, this.SchoolTypeParams)

				}

				// 判断是否登录
				if (this.$utils.getLocalStorage("user_message")) {
					this.getIndexSchoolParams.token = this.UserMessage.token;
					// 获取权限数据
					// let data = await this.GetJudgementAuthority(2,false);
					// 如果权限等于0，表示有权限
					// if (data == 0) {
						// 判断是否是新高考
						if (this.$utils.checkNewTest()) {
							// 如果是 按专业查询
							if (this.currentNewsIndex == 0){
								let countSchool = (await this.$http.indexService.getNewMajorCount(this.getIndexSchoolParams)).data;
								this.submitTitle = `查看剩余${countSchool}个院校`
								console.log("按学校查询 计数：", countSchool)

								// 如果是 按学校查询
							} else if (this.currentNewsIndex == 1){

								let countSchool = (await this.$http.indexService.getNewSchCount(this.getIndexSchoolParams)).data;
								this.submitTitle = `查看剩余${countSchool}个院校`
								console.log("按学校查询 计数：")

							}
						} else {
							let countSchool = ( await this.$http.indexService.getSchCount(this.getIndexSchoolParams)).data;
							this.submitTitle = `查看剩余${countSchool}个院校`
						}
					//}
				}


			},


			/**
			 * 批次 的确定事件
			 */
			ProfessionalNewBatchesSubmit() {
				this.$refs.dropdownBatchItem.closePopup()
				if (this.$utils.checkLogin()) {
					if (this.showNewTabs) {
						if (this.currentNewsIndex == 0) {
							this.GetJudgementAuthority(2, true, 'new')
						} else {
							this.GetJudgementAuthority(2, true, 'other')
						}
					} else {
						this.GetJudgementAuthority(2,true,'old')
					}
				} else {
					// 关闭下拉弹窗
					this.NotLoggedInDefaultAlert()
				}
			},

			/**
			 * 批次的选中事件，切换激活样式，关闭弹窗，请求数据。
			 */
			async ProfessionalNewBatchesClick(batch) {
				this.currentBatch = batch
				this.getIndexSchoolParams.batch = batch;

				if (this.$utils.checkLogin()) {
					this.getIndexSchoolParams.token = this.UserMessage.token;
					let countSchool = ( await this.$http.indexService.getSchCount(this.getIndexSchoolParams)).data;
					this.submitBatchesTitle = `查看剩余${countSchool}个院校`
				}


				if (batch == 0) {
					this.tabBatchesTitle = `批次`
				} else {
					this.tabBatchesTitle = `批次1`
				}

				console.log("------ 你选择的 批次 ----- ：", this.getIndexSchoolParams.batch)
			},


			/**
			 * 院校排名确定按钮
			 */
			RankingTabBarSubmit() {
				this.$refs.dropdownRankingItem.closePopup();
				// 清除以前旧的tabBar数据
				if (this.$utils.checkLogin()) {
					if (this.showNewTabs) {
						if (this.currentNewsIndex == 0) {
							this.GetJudgementAuthority(2, true, 'new')
						} else {
							this.GetJudgementAuthority(2, true, 'other')
						}
					} else {
						this.GetJudgementAuthority(2,true,'old')
					}

				} else {
					this.NotLoggedInDefaultAlert()
				}
			},
			/**
			 * 院校排名
			 */
			async RankingTabBarClick(index) {
				this.currentRankingIndex = index;
				this.getIndexSchoolParams.sort = this.RankingTabBar[index].id;

				if (this.$utils.checkLogin()) {
					this.getIndexSchoolParams.token = this.UserMessage.token;
					let countSchool = ( await this.$http.indexService.getSchCount(this.getIndexSchoolParams)).data;
					this.submitRankingTitle = `查看剩余${countSchool}个院校`
				}
				index == 0
						? this.tabRankingTitle = '排名'
						: this.tabRankingTitle = '排名1';

			},

			/**
			 * 学校类型 下拉 确定 被点击后收集 类型的选中数据
			 */
			SchoolTypeSubmit() {

				// 将院校类型转为 [1,2,3,4] 格式
				if (!(this.SchoolTypeNewList.includes(-1))) {
					this.SchoolTypeParams.schoolType = this.SchoolTypeNewList.join();
				}

				// // 将院校特色和 params 合并，转为 { is_211:1 } 格式
				if (!(this.schoolFeatureNewList.hasOwnProperty("is_no"))) {
					for (const key in this.schoolFeatureNewList) {
						this.SchoolTypeParams[key] = this.schoolFeatureNewList[key]
					}
				}

				if(!(this.schoolNatureNewList.includes(-1))) {
					if (this.schoolNatureNewList.length !== 2) {
						this.SchoolTypeParams.is_public = this.schoolNatureNewList.join()
					}
				}
				//
				// 关闭下拉弹窗
				this.$refs.dropdownItemType.closePopup()

				if (this.$utils.checkLogin()) {
					// 如果新高考
					if (this.showNewTabs) {
						if (this.currentNewsIndex == 0) {
							this.GetJudgementAuthority(2, true, 'new')
						} else {
							this.GetJudgementAuthority(2, true, 'other')
						}
					} else {
						this.GetJudgementAuthority(2,true,'old')
					}
				} else {
					this.NotLoggedInDefaultAlert()
				}



			},

			/**
			 * 省份下拉点击 确地 按钮
			 * 如果用户登录了，点击省份的筛选需要调用
			 * 接口进行权限的验证。
			 *
			 * 如果没有登录，那么直接弹出默认的窗口
			 */
			async provinceChiooseSubmit() {
				this.$refs.dropdownItemProvince.closePopup()

				if (this.$utils.checkLogin()) {
					// 如果新高考
					if (this.showNewTabs) {
						if (this.currentNewsIndex == 0) {
							this.GetJudgementAuthority(2, true, 'new')
						} else {
							this.GetJudgementAuthority(2, true, 'other')
						}
					} else {
						this.GetJudgementAuthority(2,true,'old')

					}
				} else {
					// 未登录情况下，清空省份默认选中
					// this.ChoiceList = [0]
					// this.tabCityTitle = '省份'
					// 关闭下拉弹窗
					this.NotLoggedInDefaultAlert()
				}
			},

			/**
			 * 用户在未登录的情况下，如果使用筛选功能，直接默认弹窗
			 */
			async NotLoggedInDefaultAlert() {
				// 设置弹窗的文字
				this.JurisdictionAlertMessage.text = this.$config.AlertText.probability
				this.JurisdictionAlertMessage.type = 1;
				// 打开弹窗
				this.$refs.jurisdiction.openPopup()
			},


			/**
			 * 调用验证接口
			 */
			async GetJudgementAuthority(type, show = true, testType = "old") {
				// 请求验证接口
				let res = await this.$http.indexService.checkAuth({
					token: this.UserMessage.token,
					type: type,
					province: this.UserMessage.userPro,
					subType: this.UserMessage.wenli,
					mySub: this.$utils.getLocalStorage("user_input").mySub,
					score:  this.UserMessage.score
				});

				if (type == 3) {
					return res.data
				}

				if (show) {
					this.JudgementPayAuthority(res.data,testType)
				} else {
					return res.data
				}

			},

			/**
			 * 对传入的数据判断是否有权限
			 * 没有权限弹窗提示
			 */
			async JudgementPayAuthority(data, type = "old") {

				// 判断
				switch (data) {
					// 全部院校 概率 未购买
					case 1:
						this.JurisdictionAlertMessage.text = this.$config.AlertText.probability;
						this.JurisdictionAlertMessage.type = 1;
						this.$refs.jurisdiction.openPopup();
						break;

					// 筛选 权限未购买
					case 2:
						this.JurisdictionAlertMessage.text = this.$config.AlertText.screen;
						this.JurisdictionAlertMessage.type = 2;
						this.$refs.jurisdiction.openPopup();
						break;

					// 概率和筛选都已经购买
					case 0:

						this.getIndexSchoolParams.type = 2;

						/**
						 * 处理省份的数据
						 * @type {*[]}
						 */
						// 得到省份的 real_code
						let NewCity = []
						this.ChoiceList.forEach(val => NewCity.push(val * 10000))
						this.getIndexSchoolParams.province = NewCity.join()

						/**
						 * 处理 学校类型 的数据
						 */
						Object.assign(this.getIndexSchoolParams, this.SchoolTypeParams)

						/**
						 * 处理批次 的数据
						 */

						// 清除以前旧的tabBar数据
						this.tabBars.forEach(val => val.content = []);

						// 如果是新高考，并且是按专业查询
						if (this.showNewTabs && this.currentNewsIndex == 0) {

							this.NewsTabsList[this.currentNewsIndex].content.forEach((val,index) => {
								val.list = []
							})
						} else {
							this.NewsTabsList[this.currentNewsIndex].content
						}
						// 获取数据
						this.getIndexSchoolList(type)


					default:

						break;
				}
			},

			/**
			 * 获取所有省份的数据
			 * @returns {Promise<void>}
			 */
	   	async getCityList() {
	   		let res = this.$utils.getLocalStorage("address");
				res.unshift({ id: 0, real_code: 0, title: '不限' });
				this.CityList = res;
			},

			/**
			 * 获取 类型 的数据
			 * @returns {Promise<void>}
			 */
			async getSchoolType() {
	   		let res = await this.$http.indexService.getSchoolType({});
	   		this.SchoolType = res.data.schoolType
	   		this.schoolFeature = res.data.schoolFeature
				this.schoolNature = res.data.schoolPub;

				this.SchoolType.unshift({ id: -1, title: '不限' });
				this.schoolFeature.unshift({ id: 'is_no', title: '不限' });
				this.schoolNature.unshift({ id: -1, title: '不限' });
			},

			/**
			 * 获取所有的批次
			 * TODO subType 需要处理新高考
			 */
			async getProvinceBatch() {
				let params = {}
				if (this.$utils.getLocalStorage("user_input")) {
					params = {
						province: this.$utils.getLocalStorage("user_input").userPro,
						subType: this.$utils.getLocalStorage("user_input").subType,
						score: this.$utils.getLocalStorage("user_input").score
					}
				}

				if (this.$utils.getLocalStorage("user_message")) {
					params = {
						province: this.$utils.getLocalStorage("user_message").userPro,
						subType: this.$utils.getLocalStorage("user_message").wenli,
						score: this.$utils.getLocalStorage("user_message").score
					}
				}
				let res = await this.$http.indexService.getProvinceBatch(params);

				res.data.unshift({ batch: 0, batchName: '全部批次' })
				this.ProfessionalBatches = res.data;

			},

			choose() {
				let obj = {
					value: 'test'
				}
				this.$refs.dropdownItem.choose(obj)
			},
			close() {
				this.$refs.dropdownItem.closePopup()
			},
			/**
			 * 下拉的重置功能
			 */
			clearYouChoice(type) {
				switch (type) {
					// 省份
					case 'sf':
						uni.showModal({
							title: '温馨提示',
							content: '重置后省份将默认为不限',
							success: (res) => {
								if (res.confirm) {
									this.ChoiceList = [0]
									this.tabCityTitle = '省份'
									this.submitTitle = '确定'
									this.getIndexSchoolParams.province = ""
								}
							}
						});
						break;
						// 批次
						case 'pc':
							uni.showModal({
								title: '温馨提示',
								content: '重置后批次将默认为全部批次',
								success: (res) => {
									if (res.confirm) {
										this.currentBatch = 0
										this.getIndexSchoolParams.batch = 0
										this.tabBatchesTitle = '批次'
										this.submitBatchesTitle = `确定`
									}
								}
							});
							break;
						case 'pm':
							uni.showModal({
								title: '温馨提示',
								content: '重置后排名将默认为院校排名从高到低',
								success: (res) => {
									if (res.confirm) {
										this.currentRankingIndex = 0;
										this.getIndexSchoolParams.sort = 1;
										this.tabRankingTitle = '排名'
										this.submitRankingTitle = `确定`
									}
								}
							});
							break;
						// 类型
						case 'lx':
							uni.showModal({
								title: '温馨提示',
								content: '重置后类型都将默认为不限',
								success: (res) => {
									if (res.confirm) {

										this.SchoolTypeNewList = [-1];
										this.SchoolTypeParams.schoolType = 0
										this.getIndexSchoolParams.schoolType = 0

										console.log("学校类型："+this.SchoolTypeParams.schoolType)

										// 如果用户点击了 院校特色 的不限，那么清除上次的选择
										for (const key in this.schoolFeatureNewList) {
											delete this.SchoolTypeParams[key]
											delete this.getIndexSchoolParams[key]
										}

										this.schoolFeatureNewList = { is_no: 0 }

										this.schoolNatureNewList = [-1]
										this.SchoolTypeParams.is_public = 0
										this.getIndexSchoolParams.is_public = 0

										this.tabSchoolNumber = 0
										this.tabSchoolTitle = '类型'

										this.submitTitle = '确定'

									}
								}
							});
							break
				}
			},
			/**
			 * 没有type就是弹窗点击购买的时候关闭弹窗，清楚默认选中
			 * 如果有type，那么就是下拉窗口的关闭，关闭下拉同时清除选中
			 * @param type
			 */
			clearChoiceType(type = null) {
				if (type == null) {
					// 省份
					this.$refs.jurisdiction.cancelPopup();
					this.ChoiceList = [0]
					this.tabCityTitle = '省份'
					this.getIndexSchoolParams.province = ""

					// 批次
					this.currentBatch = 0
					this.getIndexSchoolParams.batch = 0
					this.tabBatchesTitle = '批次'
					// 排名
					this.currentRankingIndex = 0;
					this.getIndexSchoolParams.sort = 1;
					this.tabRankingTitle = '排名'
					// 类型
					this.SchoolTypeNewList = [-1];
					this.SchoolTypeParams.schoolType = 0

					// 如果用户点击了 院校特色 的不限，那么清除上次的选择
					for (const key in this.schoolFeatureNewList) {
						delete this.SchoolTypeParams[key]
						delete this.getIndexSchoolParams[key]
					}

					this.schoolFeatureNewList = { is_no: 0 }

					this.schoolNatureNewList = [-1]
					this.SchoolTypeParams.is_public = 0

					this.tabSchoolNumber = 0
					this.tabSchoolTitle = '类型'

					this.submitTitle = '确定'
				}
				else {
					switch (type) {
							// 省份
						case 'sf':
							this.$refs.dropdownItemProvince.closePopup()
							this.ChoiceList = [0]
							this.tabCityTitle = '省份'
							this.submitTitle = '确定'
							this.getIndexSchoolParams.province = ""
							break;
							// 批次
						case 'pc':
							this.$refs.dropdownBatchItem.closePopup()
							this.currentBatch = 0
							this.getIndexSchoolParams.batch = 0
							this.tabBatchesTitle = '批次'
							this.submitBatchesTitle = `确定`
							break;
						case 'pm':
							this.$refs.dropdownRankingItem.closePopup()
							this.currentRankingIndex = 0;
							this.getIndexSchoolParams.sort = 0;
							this.tabRankingTitle = '排名'
							this.submitRankingTitle = `确定`

							break;
							// 类型
						case 'lx':
							this.$refs.dropdownItemType.closePopup()
							this.SchoolTypeNewList = [-1];
							this.SchoolTypeParams.schoolType = 0
							// 如果用户点击了 院校特色 的不限，那么清除上次的选择
							for (const key in this.schoolFeatureNewList) {
								delete this.SchoolTypeParams[key]
								delete this.getIndexSchoolParams[key]
							}
							this.schoolFeatureNewList = { is_no: 0 }
							this.schoolNatureNewList = [-1]
							this.SchoolTypeParams.is_public = 0
							this.tabSchoolNumber = 0
							this.tabSchoolTitle = '类型'
							this.submitTitle = '确定'
							break
					}
				}
			},
		},
		computed: {
			CalculationSchoolType() {
				console.log(this.SchoolTypeNewList.length + this.schoolNatureNewList.length + Object.keys(this.schoolFeatureNewList).length)
			}
		}
	}
</script>

<style scoped lang="less">
	@import url("../../common/less/page/index.less");
</style>