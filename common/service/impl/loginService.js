import { Http } from "../../http/http.js";
import { config } from "../../config/config.js";


export class loginService extends Http {

  constructor() {
    super()
  }

  /**
   * 用户登录接口
   * @param params
   * @returns {Promise<unknown>}
   */
  async appLogin(params) {
    return await this.post({
      url: config.apiList.appLogin,
      data: params
    });
  }

  /**
   * 发送短息验证码
   * @param params
   * @returns {Promise<unknown>}
   */
  async sendCode(params) {
    return await this.post({
      url: config.apiList.sendCode,
      data: params
    });
  }

}