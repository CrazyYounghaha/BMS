'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(){
    //auto render template file middle.html
    if(this.isPost()){
      console.log(this.post());
      return this.display();
    }
    else{
      return this.error("You hadn't login!!!");
    }
  }

  loginAction(){
    return this.display();
  }
}