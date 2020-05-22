export const config = {

	// 测试地址
	// baseUrl: 'http://www.zyhelp.test/index.php/api',

	// 正式地址
	baseUrl: 'http://www.zhiyuanhelp.com/index.php/api',

	// 支付回调页面
	PayResultUrl: 'http://www.zhiyuanhelp.com/#/pages/payResult/payResult',
	apiList: {
		appLogin: '/appLogin',  // 用户登录
		sendCode: '/sendCode',  // 发送验证码
		getArea: '/getArea',    // 获取省份
		getSchoolType: '/getSchoolType', //获取院校类型查询
		provinceSubject: '/provinceSubject', // 根据省份获取高考科目
		proScoreRank: '/proScoreRank',       // 查询分数在省份里面的排名
		modifyUser: '/modifyUser',           // 修改用户信息
		getSchools: '/getSchools',           // 查询学校
		checkAuth: '/checkAuth',              // 用户权限查询
		getProvinceBatch: '/getProvinceBatch', // 获取省份批次
		createOrder: '/createOrder',  					// 用户下单接口
		payOrder: '/payOrder',   								// 调用支付接口
		checkPay: '/checkPay',							   // 查询支付是否成功
		myOrders: '/myOrders',								  // 我的订单
		getMesType: '/getMesType',							  // 获取联系客服类型
		addMessage: '/addMessage',           // 添加用户留言
		addUserCollectSch: '/addUserCollectSch',    // 收藏学校
		myCollectSch: '/myCollectSch',  			  // 获取所有的收藏院校
		delUserCollect: '/delUserCollect',     // 移除我的收藏
		defaultMajor: '/defaultMajor',				 // 专业筛选首页默认显示数据
		getPullDown: '/getPullDown',           // 搜索下拉
		getMajorAbout: '/getMajorAbout',			 // 根据标题查询专业
		majorSchool: '/majorSchool',           //外省向本省招收专业的学校
		addUserCollectMajor: '/addUserCollectMajor',  //收藏专业
		myCollectMajor: '/myCollectMajor',    // 查询我的收藏专业
		delUserMajor: '/delUserMajor',					// 移除我收藏的专业
		getSchMajor: '/getSchMajor',						// 获取院校专业
		uploads: '/uploads',										// 上传图片接口
		getSchEnroll: '/getSchEnroll',				  // 查询学校往年招生情况
		getUserMes: '/getUserMes',     					// 查询我的工单
		getSchCount: '/getSchCount',						// 根据条件查询院校数量
		getMajorSch: '/getMajorSch',						// 新高考院校查询
		getNewMajor: '/getNewMajor',						// 新高考专业查询接口
		getNewMajorCount: '/getNewMajorCount',  // 按专业查询数量
		getNewSchCount: '/getNewSchCount',			// 按学校查询数量
		addUserNewMajor: '/addUserNewMajor',    // 新高考专业收藏
		addUserNewSch: '/addUserNewSch',			  // 新高考收藏院校
		myNewSch: '/myNewSch',                  // 新高考查看收藏的院校
		myNewMajor: '/myNewMajor',							// 新高考查看收藏的专业
		delNewSch: '/delNewSch',								// 移除 新高考收藏院校
		delNewMajor: '/delNewMajor',						// 移除 新高考收藏专业
		getNewSchMajor: '/getNewSchMajor',  		// 新高考查询院校的专业（弹窗）
		newMajorSch: '/newMajorSch',						// 新高考专业筛选查学校
		getScoreGrade: '/getScoreGrade',				// 查询收藏表分数段（新高考和普通高考）
	},
	AlertText: {
		// 概率弹窗
		probability: `由于你没有购买当前分数下所有<b style="color: #1aa3fa;">展示院校数据权限</b>，暂且无法使用筛选功能，请购买后重试！`,
		// 筛选
		screen: `由于你仅获当前分数院校<b style="color: #1aa3fa;">测算概率</b>权限，但暂未获得<b style="color: #1aa3fa;">筛选权限</b>，如需筛选院校功能，请购买筛选权限！`,
		// 专业
		major: `由于你仅获当前分数院校<b style="color: #1aa3fa;">测算概率</b>权限，但暂未获得<b style="color: #1aa3fa;">查看专业分数权限</b>，如需查阅，请购买该权限！`

	},
	loginViewPage: [
		'pages/me/me',
		'pages/orderStatus/orderStatus',
		'pages/feedback/feedback',
		'pages/mySchool/mySchool'
	],    // 需要登录的页面
	publicKey: `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCN7ijw6NrCLMhOC1pjkL8XdhXX
QfXASfU32f1UhvMSuPg05shdGMaQx5l1MmR8MznzA9WBwUQ1yII0ZH28j0LUprGq
IUmnSU/8Ujg9GXU+IDZ5+S4tLXMsBoLeizRKt5uugyptuZ6+GXCy+F2NAhD2caH0
8itmDTyOr4Hg/itXYwIDAQAB
-----END PUBLIC KEY-----`
}