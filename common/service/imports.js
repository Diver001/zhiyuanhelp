import { indexService } from "./impl/indexService";
import { loginService } from "./impl/loginService";
import { startUpService } from "./impl/startUpService";
import { userService } from "./impl/userService";

export class Imports {
  indexService = new indexService()
  loginService = new loginService()
  startUpService = new startUpService()
  userService = new userService()
}
