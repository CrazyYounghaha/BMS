'use strict';

import Base from './base.js';

export default class extends Base {
		/**
		 * index action
		 * @return {Promise} []
		 */
		* indexAction() {
				//auto render template file middle.html
				yield this.weblogin();
				return this.display();
		}

		loginAction() {
				return this.display();
		}

		* checkloginAction() {
				if (this.isPost()) {
						let data = this.post();
						data.password = encryptPassword(data.password);
						data.login_time = new Date().valueOf();
						let user = yield this.model('Librarian').where({Lib_name: data.username}).find();
						if (think.isEmpty(user)) {
								return this.success(-1);
						} else {
								if (data.password == user.password) {
										console.log("login success");
										let userInfo = {
												'id': user.Lib_id,
												'username': data.username,
												'last_login_time': data.login_time
										};
										yield this.session('loginlib', userInfo);
										return this.success(1);
								} else {
										console.log("password error!");
										return this.success(-2);
								}
						}
				}
				else {
						return this.error("You hadn't login!!!");
				}
		}

		registerAction() {
				return this.display();
		}

		* checkregisterAction() {
				if (this.isPost()) {
						let data = this.post();
						console.log(data);
						if (think.isEmpty(data.username)) {
								return this.success(-1);//"UserName not null ！"
						} else {
								let res = yield this.model("Librarian").where({Lib_id: ltrim(data.username)}).find();
								if (!think.isEmpty(res)) {
										return this.success(-2);//"用户昵称已存在，请重新填写！"
								}
						}
						if (think.isEmpty(data.password)) {
								return this.success(-3);//"密码不能为空！"
						}
						data.reg_time = new Date().valueOf();
						data.password = encryptPassword(data.password);
						let reg = yield this.model("Librarian").add({Lib_name: data.username, password: data.password});
						let userInfo = {
								'id': reg,
								'username': data.username,
								'last_login_time': data.reg_time
						};
						yield this.session('loginlib', userInfo);
						return this.success(1);
				} else {
						return this.error(404);
				}
		}

		* logoutAction() {
				if (this.islogin) {
						yield this.session('loginlib', null);
						return this.redirect('index');
				}
		}

		* crudAction() {
				yield this.weblogin();
				return this.display();
		}

		* addbookAction() {
				if (this.isPost()) {
						let data = this.post();
						//console.log(data);
						let number = 0;
						while (data['ISBN_' + number]) {
								let ISBN = yield this.model("Books").where({ISBN: ltrim(data['ISBN_' + number])}).find();
								if (!think.isEmpty(ISBN)) {
										return this.success(-2);
								}
								let Book = {
										ISBN: data['ISBN_' + number],
										Title: data['title_' + number],
										Edition: data['edition_' + number],
										cat_id: data['cat_id_' + number],
										description: data['description_' + number],
										book_type: data['book_type_' + number],
										author: data['author_' + number]
								};
								yield this.model("Books").add(Book);
								number++;
						}
						return this.success(1);
				}
		}

		* readbookdetailAction(){
				if(this.isPost()){
						let data = this.post();
						for(var i in data){
								//console.log(i+ " "+ data[i]);
								let read = yield this.model("Books").where({[i]: data[i]}).select();
								console.log(read);
								return this.success(read);
						}
				}
		}

		* rightAction() {
				yield this.weblogin();
				let issuance = yield this.model("Issuance").join({
						table: "Member",
						join: "left",
						on: ["mem_id", "mem_id"]
				}).select();
				//console.log(issuance);
				this.assign("issuance",issuance);
				return this.display();
		}

		* confirmAction(){
				if(this.isPost()){
						let data = this.post();
						let book = yield this.model("Issuance").where({ ISBN: data.bookID}).update({book_status: 2});
						if(think.isEmpty(book)){
								return this.success(1);
						}else {
								return this.success(-1);
						}
				}
		}

		imgtableAction() {
				return this.display();
		}

		formAction() {
				return this.display();
		}

		imglistAction() {
				return this.display();
		}

		imglist1Action() {
				return this.display();
		}

		toolsAction() {
				return this.display();
		}

		filelistAction() {
				return this.display();
		}

		tabAction() {
				return this.display();
		}

		errorAction() {
				return this.display();
		}

		pagedefaultAction() {
				return this.display();
		}

		computerAction() {
				return this.display();
		}
}