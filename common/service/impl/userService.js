import { Http } from "../../http/http.js";
import { config } from "../../config/config.js";


export class userService extends Http {

  constructor() {
    super()
  }

  async createOrder(params) {
    return await this.post({
      url: config.apiList.createOrder,
      data: params
    });
  }

  async payOrder(params) {
    return await this.post({
      url: config.apiList.payOrder,
      data: params
    });
  }

  async checkPay(params) {
    return await this.post({
      url: config.apiList.checkPay,
      data: params
    });
  }

  async myOrders(params) {
    return await this.post({
      url: config.apiList.myOrders,
      data: params
    });
  }

  async getMesType(params) {
    return await this.get({
      url: config.apiList.getMesType,
      data: params
    });
  }

  async addMessage(params) {
    return await this.post({
      url: config.apiList.addMessage,
      data: params
    });
  }

  async addUserCollectSch(params) {
    return await this.post({
      url: config.apiList.addUserCollectSch,
      data: params
    });
  }

  async myCollectSch(params) {
    return await this.post({
      url: config.apiList.myCollectSch,
      data: params
    });
  }

  async delUserCollect(params) {
    return await this.post({
      url: config.apiList.delUserCollect,
      data: params
    });
  }

  async myCollectMajor(params) {
    return await this.post({
      url: config.apiList.myCollectMajor,
      data: params
    });
  }

  async delUserMajor(params) {
    return await this.post({
      url: config.apiList.delUserMajor,
      data: params
    });
  }

  async getUserMes(params) {
    return await this.post({
      url: config.apiList.getUserMes,
      data: params
    });
  }

  async myNewSch(params) {
    return await this.post({
      url: config.apiList.myNewSch,
      data: params
    });
  }

  async myNewMajor(params) {
    return await this.post({
      url: config.apiList.myNewMajor,
      data: params
    });
  }

  async delNewSch(params) {
    return await this.post({
      url: config.apiList.delNewSch,
      data: params
    });
  }

  async delNewMajor(params) {
    return await this.post({
      url: config.apiList.delNewMajor,
      data: params
    });
  }

  async getScoreGrade(params) {
    return await this.post({
      url: config.apiList.getScoreGrade,
      data: params
    });
  }

}