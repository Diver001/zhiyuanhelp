import { config } from "../config/config.js";
import store from "../../store";

export class Http {
	/**
	 * @param {Object} params
	 */
	async get (params) {
		return new Promise(function(resolve, reject) {
			uni.request({
				method: 'GET',
			    url: config.baseUrl + params.url,
			    data: params.data,
			    header: params.header ? params.header : {},
			    success: (res) => {
						if (res.data.status !== 1) {
							uni.hideLoading();
							uni.showToast({
								title: res.data.msg,
								duration: 2000,
								icon: 'none'
							});
						} else {
							uni.hideLoading();
							resolve(res.data);
						}
			    },
				fail: (res => {
					uni.hideLoading();
					reject(res.data)
				})
			});
		})
	}

	
	/**
	 * @param {Object} params
	 */
	async post (params) {

		store.state.showStatus = 1
		// uni.showLoading({ title: '请求中...' });
		// 设请求头
		let header = {
			'content-type': 'application/x-www-form-urlencoded'
		};

		// 请求参数中如果有token，那么设置请求头token后删除请求参数中多余的token
		if (params.data.hasOwnProperty('token')) {
			header.token = params.data.token
			delete params.data['token']
		}

		return new Promise(function(resolve, reject) {
			uni.request({
				method: 'POST',
			    url: config.baseUrl + params.url,
			    data: params.data,
					header: header,
			    success: (res) => {
						if (res.data.status !== 1) {
							switch (res.data.error_code) {
								case 10001:
									uni.showModal({
										title: '温馨提示',
										content: res.data.msg,
										showCancel: false,
										success: (res) => {
											if (res.confirm) {
												// uni.removeStorageSync('user_input');
												uni.removeStorageSync('user_message');

												uni.navigateTo({
													url: '/pages/startUp/startUp'
												});

											}
										}
									});
									break;

								case 10000:
									uni.showToast({
                    title: res.data.msg,
                    duration: 2000,
										icon: 'none'
									})
									break;

								case 999:
									uni.showToast({
										title: '后端'+res.data.msg,
										duration: 2000,
										icon: 'none'
									})
									break;
							}

						} else {
							if (res.data.msg != '暂无数据！') {
								store.state.showStatus = 2
								resolve(res.data);
							} else {
								store.state.showStatus = 3
							}
						}
			    },
				fail: (res => {
					// uni.hideLoading();
					reject(res)
				})
			});
		})
	}
}