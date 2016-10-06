/**
 * Created by zhangyang on 16/10/4.
 */
/**
 * Created by 张扬 on 2016/9/1.
 */
'use strict';

import Base from './base.js';

export default class extends Base {
		/**
		 * index action
		 * @return {Promise} []
		 */
		* indexAction() {
				yield this.weblogin();
				let userInfo = yield this.model("Member_login").join({
						table: "Member",
						join: "left",
						on: ["mem_name", "mem_name"]
				}).find(this.user.id);

				this.assign("title", "个人主页");
				this.assign("userInfo", userInfo);
				//let province, city, county;
				//province = yield this.model("area").where({parent_id: 0}).select();
				//city = yield this.model("area").where({parent_id: userInfo.province}).select();
				//county = yield this.model("area").where({parent_id: userInfo.city}).select();
				//
				//this.assign("province", province);
				//this.assign("city", city);
				//this.assign("county", county);
				return this.display();
		}

		* getareaAction() {
				let pid = this.get("pid");
				let area = yield this.model("area").where({parent_id: pid}).select();
				return this.json(area);
		}

		* identityAction(){
				this.assign("title","personal");
				yield this.weblogin();
				return this.display();
		}
}