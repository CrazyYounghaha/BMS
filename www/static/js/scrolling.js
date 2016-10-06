/**
 * Created by zhangyang on 16/9/23.
 */
$(function () {

		//导航切换
		$(".menuson li").click(function () {
				$(".menuson li.active").removeClass("active")
				$(this).addClass("active");
		});

		$('.title').click(function () {
				var $ul = $(this).next('ul');
				$('dd').find('ul').slideUp();
				if ($ul.is(':visible')) {
						$(this).next('ul').slideUp();
				} else {
						$(this).next('ul').slideDown();
				}
		});
		//提示弹出框
		$(".click").click(function () {
				$(".tip").fadeIn(200);
		});

		$(".tiptop a").click(function () {
				$(".tip").fadeOut(200);
		});

		$(".sure").click(function () {
				$(".tip").fadeOut(100);
		});

		$(".cancel").click(function () {
				$(".tip").fadeOut(100);
		});
		//提示弹出框


		//导航切换
		$(".imglist li").click(function () {
				$(".imglist li.selected").removeClass("selected")
				$(this).addClass("selected");
		})
});
