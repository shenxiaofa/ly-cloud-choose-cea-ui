;(function (window, undefined) {
    'use strict';
    window.index_homeIndexController = function ($scope, $http, $timeout, $state, $uibModal, $compile, $rootScope, $localStorage, $cookies, $interval, $window, alertService, app) {
			
		// 获取cookies
		$scope.user = {};
		var cookieasJson = {};
		if($cookies.getObject("user") != null){
			cookieasJson = JSON.parse($cookies.getObject("user"));
		}
		
    	$scope.agreement = true;
    	
		// 跳转到校公选课
		$scope.jumpToPublicElectiveCourse = function () {
			if($scope.agreement != null && $scope.agreement == false){
                alertService("请先同意并勾选协议！");
                return;
			}
			$("body").fadeOut();
			$timeout(function(){
				$state.go("home.common.publicElectiveCourse");
            },500);
			$("body").fadeIn(800);
		};
		
		// 获取右侧学生基本信息
		$http({
			method: "get",
			url: app.api.address + "/student/studentBaseInfo/" + cookieasJson.userName
		}).then(function(response) {
			$scope.student = response.data.data;
		}, function(response) {
		});

		// 获取学分情况
		$http({
			method: "get",
			url: app.api.address + "/scheme/studentQuery/creditCount",
			params: {
				studentId: cookieasJson.userName
			}
		}).then(function(response) {
			$scope.showProgressCount = false;
			var count1 = 0;	// 累计总学分获取情况	
			var count2 = 0;	// 累计总学分
			angular.forEach(response.data.data, function(creditResult) {
				if(creditResult.credit != null){
					$scope.showProgressCount = true;			// 只要有一个当前除数成绩为空，则展示真实数据
					count1 += parseInt(creditResult.credit);	// 累计所有的已获得学分
				}
				if(creditResult.modularCredit != null){
					count2 += parseInt(creditResult.modularCredit);	// 累计所有的毕业总学分
				}
			});
			// 毕业总学分
			$scope.student.totalNum = 0;
			$scope.student.totalNum = count2;
			// 毕业已完成学分
			$scope.student.alreadyFinishNum = 0;
			$scope.student.alreadyFinishNum = count1;
			// 毕业已选学分
			$scope.student.alreadyChooseNum = 0;
			// 总学分已完成度
			$scope.student.alreadyFinish = 0;
			$scope.student.alreadyFinish = parseInt((count1/count2)*100);
			$scope.student.alreadyFinish2 = 0;
			// 已获学分+已选学分
			$scope.student.totalAlreadyFinish = $scope.student.alreadyFinish + $scope.student.alreadyFinish2;

			/* 转盘进度开始 */
	        if($scope.student.alreadyFinish <= 50){	// 右半部分
	            $('.circle_right1').css('transform','rotate('+($scope.student.alreadyFinish*3.6)+'deg)');
	        }else{									// 左半部分
	            $('.circle_right1').css({
	                'transform':'rotate(0deg)',
	                "background":"#00ff50"
	            });
	            $('.circle_left1').css('transform','rotate('+(($scope.student.alreadyFinish-50)*3.6)+'deg)');
	        }
	        
	        if($scope.student.totalAlreadyFinish <= 50){	// 右半部分
	            $('.circle_right2').css('transform','rotate('+($scope.student.totalAlreadyFinish*3.6)+'deg)');
	        }else{									// 左半部分
	            $('.circle_right2').css({
	                'transform':'rotate(0deg)',
	                "background":"#fb6911"
	            });
	            $('.circle_left2').css('transform','rotate('+(($scope.student.totalAlreadyFinish-50)*3.6)+'deg)');
	        }
			/* 转盘进度结束 */
			
		}, function(response) {
			console.log(response);
		});

		// 获取当前学年学期
		var academicYear = "";
		$http({
			method: "get",
			url: app.api.address + "/arrange/teacherSchedule/selectCurrentSemester"
		}).then(function(response) {
			academicYear = response.data.data;
			$scope.academicYear = academicYear;
		}, function(response) {
			console.log(response);
		});
		
	};
	index_homeIndexController.$inject = ['$scope', '$http', '$timeout', '$state', '$uibModal', '$compile', '$rootScope', '$localStorage', '$cookies', '$interval', '$window', 'alertService', 'app'];
})(window);


