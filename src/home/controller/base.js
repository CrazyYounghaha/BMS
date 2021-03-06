'use strict';

export default class extends think.controller.base {
  /**
   * some base method in here
   */
  init(http) {
    super.init(http);
  }

  * __before() {
    this.islogin = yield this.is_login();//返回用户是否登录true or false
    this.user = yield this.session('loginlib');//获取缓存文件
  }

  * is_login() {
    //前台判断是否登录
    let user = yield this.session('loginlib');
    let res = think.isEmpty(user) ? false : user;
    //console.log(res);
    return res;
  }

  * weblogin() {
    let islogin = yield this.is_login();
    if (!islogin) {//未登录
      //pc端跳转到错误页面
      return think.statusAction(404, this.http);
    }
  }
}