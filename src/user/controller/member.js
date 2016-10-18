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
				let userInfo = yield this.model("Member").where({mem_id: this.user.id}).find();
				let appInfo = yield this.model("Issuance_VIP").where({mem_id: this.user.id}).find();
				//console.log(userInfo);
				this.assign("MemberStyle", userInfo.mem_style);
				if(appInfo.status){
						this.assign("IssDetail", appInfo.status);
				}else{
						this.assign("IssDetail", 1);
				}
				return this.display();
		}
		* applyvipAction(){
				if(this.isGet()) {//提交VIP申请，数据库插入该条数据
						yield this.model("Issuance_VIP").add({
								mem_id: this.user.id,
								apply_date: dateformat("Y-m-d", Date()),
								status: 0
						});
						return this.success(this.user.id);//申请提交完毕
				}
		}
}