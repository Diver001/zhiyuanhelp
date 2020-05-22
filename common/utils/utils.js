import JSEncrypt from "../../static/js/wx_rsa.js"
import  querystring from "querystring";
import { config } from "../config/config";
import { userService } from "../service/impl/userService";

export class Utils {

	constructor() {
		this.userService = new userService();
		this.jse = new JSEncrypt();
		this.jse.setPublicKey(config.publicKey)
	}

	/**
	 * 跳转页面
	 * @param path
	 */
	enterPage(path) {
		uni.navigateTo({
		    url: path
		});
	}

	/**
	 * 从所有地址中获取当前用户地址的下标
	 */
	getCurrentCity(city) {
		let address = this.getLocalStorage("address");
		for (let i = 0; i < address.length; i++) {
			if (address[i].title == city) {
				return i
			}
		}
	}


	/**
	 * 返回 user_input
	 * @returns {boolean|*}
	 */
	getUserInput() {
		if (this.getLocalStorage("user_input")) {
			return this.getLocalStorage("user_input")
		} else {
			return false
		}
	}

	/**
	 * 判断是否为新高考
	 */
	 checkNewTest() {
		let status = "";
		// 如果登录了
		if (this.checkLogin()) {

			// 如果两个同时有数值，那么以 user_message 数值为准
			if (this.getLocalStorage("user_message") && this.getLocalStorage("user_input")) {
				// 如果权限等于 2 表示新高考
				if (this.getLocalStorage("user_message").provinceType == 2) {
					status = true
				} else {
					status = false
				}

			// 如果两个不是同时有数值
			} else {
				// 如果只有 user_input 那么判断 user_input mySub 是否选过新高考
				if (this.getLocalStorage("user_input")) {
					if (this.getLocalStorage("user_input").mySub.length == 3) {
						status = true
					} else {
						status = false
					}
				// 如果登录但是未填智能表单，那么获取本地的账户类型 	provinceType
				} else if (this.getLocalStorage("user_message")) {
					// 如果权限等于 2 新高考
					if (this.getLocalStorage("user_message").provinceType == 2) {
						status = true
					} else {
						status = false
					}
				}
			}

		// 未登录情况，本地只可能有	 user_input，所以根据 user_input 来判断显示什么布局
		} else if (this.getLocalStorage("user_input")) {
			if (this.getLocalStorage("user_input").mySub.length == 3) {
				status = true
			} else {
				status = false
			}

		// 如果是未登录，未填智能表单的情况（直接通过地址栏进入index）
		// 那么展示默认的布局。
		} else {
			status = false
		}

		return status
	}

	/**
	 * 关闭并跳转页面
	 * @param path
	 */
	closedEnterPage(path) {
		uni.redirectTo({
			url: path
		});
	}

	/**
	 * 返回
	 */
	backPage() {
		uni.navigateBack()
	}

	/**
	 * 是否需要登录，如果需要跳转去登陆
	 * @returns {Promise<void>}
	 */
	async isLogin() {
		let token = this.getLocalStorage("user_message")
		let pages = getCurrentPages();
		let route = pages[pages.length - 1].route;

		if(config.loginViewPage.includes(route)) {
			if (!token) {
				uni.showModal({
					title: '提示',
					content: '未登录，请先登录再使用',
					showCancel: false,
					success: function (res) {
						if (res.confirm) {
							uni.navigateTo({
								url: `/pages/startUp/startUp`
							})
						}
					}
				});
			}
		}
	}

	/**
	 * 是否已经登录成功
	 * @returns {Promise<void>}
	 */
	checkLogin() {
		if (this.getLocalStorage("user_message")) {
			return true
		} else {
			return false
		}
	}

	isPcClient() {
		var u = navigator.userAgent;
		if (!u.match(/AppleWebKit.*Mobile.*/)) {
			return true
		} else {
			return false
		}
	}
	/**
	 * 保存数据
	 * @param name
	 * @param key
	 */
	setLocalStorage (name, key) {
		uni.setStorageSync(name, key);
	}

	/**
	 * 读取数据
	 * @param key
	 * @returns {boolean|*}
	 */
	getLocalStorage (key) {
		try {
		    const value = uni.getStorageSync(key);
		    if (value) {
		        return value
		    } else {
		    	return false
				}
		} catch (e) {
		    console.log("缓存读取失败：", e)
		}
	}

	/**
	 * 序列化并加密前端需要传递给后端的参数
	 * @param url
	 * @returns {*}
	 * @constructor
	 */
	QueryString(url) {
		return this.JSEncrypts(querystring.stringify(url))
	}

	/**
	 * 创建订单
	 * @param params
	 * @constructor
	 */
	async CreatedOrder(params) {
		return await this.userService.createOrder(params);
	}

	/**
	 * 调起支付接口
	 * @constructor
	 */
	async PlayOrder(parmas) {
		return await this.userService.payOrder(parmas)
	}

	async Pay(params) {
		// #ifdef H5
		location.href = location.href = params.data
		// #endif

		//#ifdef APP-PLUS || MP-WEIXIN
		// #endif

	}

	/**
	 * 解密后端给的数据
	 * @param str
	 * @returns {PromiseLike<ArrayBuffer>}
	 * @constructor
	 */
	JSEncrypts(str) {
		return this.jse.encrypt(str);
	}
}