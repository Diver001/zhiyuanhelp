import { Http } from "../../http/http.js";
import { config } from "../../config/config.js";


export class indexService extends Http {
	
	constructor() {
		super()
	}

	async getCityList(params) {
		return await this.get({
			url: config.apiList.getArea,
			data: params
		});
	}

	async getSchoolType(params) {
		return await this.get({
			url: config.apiList.getSchoolType,
			data: params
		});
	}

	async getSchools(params) {
		return await this.post({
			url: config.apiList.getSchools,
			data: params
		});
	}

	async checkAuth(params) {
		return await this.post({
			url: config.apiList.checkAuth,
			data: params
		});
	}

	async getProvinceBatch(params) {
		return await this.get({
			url: config.apiList.getProvinceBatch,
			data: params
		});
	}

	async defaultMajor(params) {
		return await this.post({
			url: config.apiList.defaultMajor,
			data: params
		});
	}

	async getPullDown(params) {
		return await this.get({
			url: config.apiList.getPullDown,
			data: params
		});
	}

	async getMajorAbout(params) {
		return await this.post({
			url: config.apiList.getMajorAbout,
			data: params
		});
	}

	async majorSchool(params) {
		return await this.post({
			url: config.apiList.majorSchool,
			data: params
		});
	}

	async addUserCollectMajor(params) {
		return await this.post({
			url: config.apiList.addUserCollectMajor,
			data: params
		});
	}

	async getSchMajor(params) {
		return await this.post({
			url: config.apiList.getSchMajor,
			data: params
		});
	}

	async getSchEnroll(params) {
		return await this.post({
			url: config.apiList.getSchEnroll,
			data: params
		});
	}

	async getSchCount(params) {
		return await this.post({
			url: config.apiList.getSchCount,
			data: params
		});
	}

	async getMajorSch(params) {
		return await this.post({
			url: config.apiList.getMajorSch,
			data: params
		});
	}

	async getNewMajor(params) {
		return await this.post({
			url: config.apiList.getNewMajor,
			data: params
		});
	}

	async getNewMajorCount(params) {
		return await this.post({
			url: config.apiList.getNewMajorCount,
			data: params
		});
	}

	async getNewSchCount(params) {
		return await this.post({
			url: config.apiList.getNewSchCount,
			data: params
		});
	}

	async addUserNewMajor(params) {
		return await this.post({
			url: config.apiList.addUserNewMajor,
			data: params
		});
	}

	async addUserNewSch(params) {
		return await this.post({
			url: config.apiList.addUserNewSch,
			data: params
		});
	}

	async getNewSchMajor(params) {
		return await this.post({
			url: config.apiList.getNewSchMajor,
			data: params
		});
	}

	async newMajorSch(params) {
		return await this.post({
			url: config.apiList.newMajorSch,
			data: params
		});
	}
	
}