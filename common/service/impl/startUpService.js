import { Http } from "../../http/http.js";
import { config } from "../../config/config.js";


export class startUpService extends Http {

  constructor() {
    super()
  }

  async provinceSubject(params) {
    return await this.get({
      url: config.apiList.provinceSubject,
      data: params
    });
  }

  async proScoreRank(params) {
    return await this.get({
      url: config.apiList.proScoreRank,
      data: params
    });
  }

  async modifyUser(params) {
    return await this.post({
      url: config.apiList.modifyUser,
      data: params
    });
  }

}