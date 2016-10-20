'use strict';

import Base from './base.js';

export default class extends Base {
		/**
		 * index action
		 * @return {Promise} []
		 */
		* indexAction() {
				//auto render template file index_index.html
				if (yield this.is_login()) {
						//检查该用户有没有超过时间没有还的书
						let issue_date = yield this.model('Issuance').where({mem_id: this.user.id}).select();
						//console.log(issue_date);
						let newArray = [];
						let date = dateformat("Y-m-d",Date());
						for (let index in issue_date) {
								let days = getDays(issue_date[index].issue_date, date);
								if ( days > 7){
										newArray.push(issue_date[index].ISBN);
								}
						}
						this.assign("checkBooks", newArray);
						this.assign("title", "Mini Eyes");
						//delete global.hadLogin;
						return this.display();
				} else {
						this.assign("title", "Mini Eyes");
						this.assign("checkBooks", 0);
						return this.display();
				}

		}

		* loginAction() {
				if (this.isPost()) {
						let data = this.post();
						//console.log(data);
						data.pwd = encryptPassword(data.pwd);
						data.login_time = new Date().valueOf();
						let user = yield this.model('Member_login').where({mem_name: data.name}).find();
						if (think.isEmpty(user)) {
								return this.success(-1);
						} else {
								if (data.pwd == user.user_pwd) {
										console.log("Login success");
										let userInfo = {
												'id': user.user_id,
												'username': data.name,
												'mem_type': data.memberType,
												'last_login_time': data.login_time
										};
										yield this.session('loginuser', userInfo);
										//登陆过后添加global一个属性
										//global.hadLogin = 1;
										return this.success(1);
								} else {
										console.log("password error");
										return this.success(-2);
								}
						}
				}
		}

		* registerAction() {
				if (this.isAjax('post')) {
						let data = this.post();
						console.log(data);
						if (think.isEmpty(data.r_name)) {
								return this.success(-1);//"用户昵称不能为空！"
						} else {
								let res = yield this.model("Member_login").where({mem_name: ltrim(data.r_name)}).find();
								if (!think.isEmpty(res)) {
										return this.success(-2);//"用户昵称已存在，请重新填写！"
								}
						}
						if (think.isEmpty(data.r_pwd) && think.isEmpty(data.pwdConfirm)) {
								return this.success(-3);//"密码不能为空！"
						} else {
								if (data.r_pwd != data.pwdConfirm) {
										return this.success(-4);//"两次输入的密码不一致，请重新填写！"
								}
						}
						data.reg_time = new Date().valueOf();
						data.r_pwd = encryptPassword(data.r_pwd);
						//let email = data.r_name + "@qq.com";
						let reg = yield this.model("Member_login").add({
								mem_name: data.r_name,
								user_pwd: data.r_pwd,
								mem_type: data.memberType
						});
						yield this.model("Member").add({mem_name: data.r_name});
						let userInfo = {
								'id': reg,
								'username': data.r_name,
								'mem_type': data.memberType,
								'last_login_time': data.reg_time
						};
						yield this.session('loginuser', userInfo);
						return this.success(1);
				} else {
						return this.display();
				}
		}

		* logoutAction() {
				if (this.islogin) {
						yield this.session('loginuser', null);
						return this.redirect('index');
				}
		}

		* userAction() {
				yield this.weblogin();
				this.assign("title", "Personal Page");
				//this.assign("last_login_time",dateformat('Y-m-d H:i:s', this.user.last_login_time));
				//console.log(dateformat('Y-m-d H:i:s', this.user.last_login_time));
				return this.display();
		}

		* bookstoreAction() {
				yield this.weblogin();
				let books = yield this.model("Books").join({
						table: "Issuance_detail",
						join: "left",
						on: ["ISBN", "book_id"]
				}).select();
				//console.log(books);
				this.assign("title", "Borrow Book Page");
				this.assign("books", books);
				return this.display();
		}

		* checkAction() {
				if (this.isPost()) {
						let member = yield this.model('Member').where({mem_id: this.user.id}).find();
						if (member.mem_style == "normal") {
								let number = yield this.model('Issuance').where({mem_id: this.user.id}).count();
								console.log(number);
								if (number >= 4) {
										return this.success(-1);
								} else {
										return this.success(1);
								}
						} else {
								let number = yield this.model('Issuance').where({mem_id: this.user.id}).count();
								console.log(number);
								if (number >= 10) {
										return this.success(-1);
								} else {
										return this.success(1);
								}
						}
						//return this.success(1);
				}
		}

		* borrowAction() {
				if (this.isPost()) {
						let data = this.post();
						//console.log(data);
						let ISBN = yield this.model("Books").where({Title: data.Title}).find();
						data.ISBN = ISBN.ISBN;
						data.issue_date = dateformat("Y-m-d", Date());
						//console.log(data.issue_date);
						yield this.model("Issuance").add({
								issue_date: data.issue_date,
								ISBN: data.ISBN,
								book_status: 1,
								mem_id: this.user.id
						});
						yield this.model("Issuance_detail").where({book_id: data.ISBN}).update({book_status: 1});
						return this.success({ISBN: data.ISBN, userID: this.user.id});
				}
		}

		* returnbookAction() {
				let returnBook = yield this.model('Issuance').join({
						table: "Issuance_detail",
						join: "left",
						on: ["ISBN", "book_id"]
				}).join({
						table: "Books",
						join: "left",
						on: ["ISBN", "ISBN"]
				}).where({mem_id: this.user.id}).select();
				//console.log(returnBook);
				this.assign("title", "Return Book Page");
				this.assign("books", returnBook);
				return this.display();
		}

		* backbookAction() {
				if (this.isPost()) {
						let data = this.post();
						data.return_date = dateformat("Y-m-d", Date());
						data.fine = 0;
						//	console.log(data.return_date);
						let days = getDays(data.bor_date, data.return_date);
						//	console.log(days);
						if (days >= 7 && days < 14) {//七天内
								data.fine = 50;
						} else if (days >= 14) {//超过14天的
								data.fine = 50 + (days - 7) * 5;
						}
						yield this.model("Issuance").where({ISBN: data.bookID}).delete();
						yield this.model("Issuance_detail").where({book_id: data.bookID}).update({book_status: 3});
						yield this.model("Receiving_Detail").add({
								book_id: data.bookID,
								fine: data.fine,
								return_date: data.return_date,
								return_by: this.user.id
						});
						return this.success(data.fine);
				}
		}
}