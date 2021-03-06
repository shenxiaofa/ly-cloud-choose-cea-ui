;(function (window, undefined) {
    'use strict';
    hiocsApp.controller('hiocsCtr', ['$rootScope', '$cookies', '$scope', '$interval', '$q', '$timeout', '$state', '$localStorage', '$stateParams', function ($rootScope, $cookies, $scope, $interval, $q, $timeout, $state, $localStorage, $stateParams) {

		/*************************开始*************************/
		// 获取当前登录用户名
		$scope.user = {};
		var cookieasJson = {};
		if($cookies.getObject("user") != null) {
			cookieasJson = JSON.parse($cookies.getObject("user"));
			$scope.user.name = cookieasJson.name;
		}
		
		// 回到首页，如果cookie为空，则直接回到首页
		$scope.switchIndexPage = function(){
			$("body").fadeOut();
			$timeout(function () {
				if($cookies.getObject("user") != null && $cookies.getObject("user") != undefined){
			        $state.go('homeIndex');
				}else{	// 登出
	            	$rootScope.showLoading = false; // 关闭加载提示
	            	$localStorage.$reset();
	            	$interval.cancel($rootScope.stopSessionCheck);
		            $state.go('login');
				}
            }, 500);
			$("body").fadeIn(800);
		};
		
		// 下拉菜单
		$(".studentList li").each(function() {
			$(this).hover(function() {
				$(this).addClass("active");
				$(this).siblings().removeClass("active");
				if($(this).hasClass("active")) {
					$(this).find('.list-all').css('display', 'block');
					$(this).siblings().find('.list-all').css('display', 'none');
				} else {
					$(this).find('.list-all').css('display', 'none');
					$(this).siblings().find('.list-all').css('display', 'block');
				}
			})
		})

		//隐藏帮助和服务列表
		$("*").click(function(e) {
			if($scope.helpList == false) {
				if($(e.target).parent().prop('class') != 'helpListA') {
					$scope.helpList = true
					$scope.$apply($scope.helpList);
				}
			}
			if($scope.teachList == false) {
				if($(e.target).parent().prop('class') != 'teachListA') {
					$scope.teachList = true
					$scope.$apply($scope.teachList);
				}
			}
		})

		//帮助列表
		$scope.helpList = true;
		$scope.showHideHelpList = function() {
			$scope.helpList = !$scope.helpList;
		};

		//服务列表
		$scope.teachList = true;
		$scope.imgsFlag = "img/up.png";
		$scope.showHideTeachList = function() {
			$scope.teachList = !$scope.teachList;
			if(!$scope.teachList) {
				$scope.imgsFlag = "img/down.png";
			} else {
				$scope.imgsFlag = "img/up.png";
			}
		};
        
		// 跳转到校公选课
		$scope.jumpToPublicElectiveCourse = function () {
			console.log("123");
			$("body").fadeOut();
			$timeout(function(){
				$state.go("home.common.publicElectiveCourse");
            },500);
			$("body").fadeIn(800);
		};
		
		// 跳转到院系选修课
		$scope.jumpToDeptElectiveCourse = function () {
			$("body").fadeOut();
			$timeout(function(){
				$state.go("home.common.deptElectiveCourse");
            },500);
			$("body").fadeIn(800);
		};
		
		// 跳转到体育课选课
		$scope.jumpToPhysicalEducationClass = function () {
			$("body").fadeOut();
			$timeout(function(){
				$state.go("home.common.physicalEducationClass");
            },500);
			$("body").fadeIn(800);
		};
		
    }]);

})(window);
