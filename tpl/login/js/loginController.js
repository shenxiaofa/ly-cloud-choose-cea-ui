;(function (window, undefined) {
    'use strict';

    window.loginController = function ($interval, $scope, $timeout, $rootScope, $cookies, $localStorage, $state, $uibModal, loginService, logoutService, alertService, app) {
		
        // 登录模块
        $scope.teacherModule = 'teacher-login';
        $scope.managerModule = 'manager-login';
        $scope.studentModule = 'student-login';

		// 默认协议多选框为否
    	$scope.student = {
    		agreement: false,
    		situation: '',
    		day: '',
    		hour: '',
    		minute: ''
    	};
    	
	    // 获取选课信息
//		$http({
//			method: "get",
//			url: app.api.address + '/arrange/teacherTimeDemand',
//			params: {
//				type : 'selectSection',
//				semesterId : '2017-2018-1'
//			}
//		}).then(function(response) {
//			$scope.chooseInfo = response.data.data.rows;
			$scope.chooseInfo = {
				"id":"960701952593952767",
				"semesterId":"2017-2018-1",
				"semester":"2017-2018-1",
				"roundName":"补选",
				"startTime":"2018-02-01",
				"endTime":"2018-02-28",
				"releaseSign":"0",
				"everyDayStartTime":"01:00",
				"everyDayEndTime":"09:00",
				"chosenControl":"1",
				"teachingNumControl":"1",
				"perCourseRetreatSign":"1",
				"allowConflictSign":"1",
				"way":"1",
				"mark":"1,2,3"
			};
//		}, function(response) {
//			console.log(response);
//		});
		
		// 获取传过来的年月日时分	2018-02-01 01-00
		var completeStartTime = $scope.chooseInfo.startTime + " "+ $scope.chooseInfo.everyDayStartTime.replace(/:/g,"\-");
				
        // 让时间在页面显示
        var now1 = new Date();		//获取当前时间
        $scope.Now = now1.getFullYear()+'-'+(now1.getMonth()+1)+'-'+now1.getDate()+' '+now1.getHours()+'-'+now1.getMinutes();
        
    	$scope.SetTimer = function(){
            $scope.$apply(function(){
				var now=new Date();
				console.log(completeStartTime);
//				console.log($scope.chooseInfo.startTime.replace(/-/g,"\/"));
//				console.log( (new Date($scope.chooseInfo.startTime.replace(/-/g,"\/"))) > (new Date($scope.chooseInfo.endTime.replace(/-/g,"\/"))) );
				
		    	$scope.student.day = '04';
		    	$scope.student.hour = '01';
		    	$scope.student.minute = '25';
		    	
		    	var y = now1.getFullYear();
		    	var m = "0"+(now1.getMonth()+1);
		    	var d = "0"+now1.getDate();
		    	
		    	if( (($scope.chooseInfo.startTime.replace(/-/g,"")) > (y+m.substring(m.length-2,m.length)+d.substring(d.length-2,d.length)) )){	// 【年月日】比现在的时间大，未开始
			    	if( $scope.chooseInfo.everyDayStartTime.replace(/:/g,"") > (now.getHours()+ "" +now.getMinutes())){							// 【时分】 
			    		$scope.student.situation = "进行中";
			    	}else{
			    		$scope.student.situation = "未开始";
			    	}
		    	}else{
		    		$scope.student.situation = "未开始";
		    	}
		    	
//              console.log(new Date($scope.Now));
                $scope.Now = now.getFullYear()+'-'+(now1.getMonth()+1)+'-'+now.getDate()+' '+now.getHours()+'-'+now.getMinutes();
            });
        };
        
        // 每隔1秒刷新一次时间
        $scope.SetTimerInterval = setInterval($scope.SetTimer, 1000);
        
        // 更新登录验证码
        $scope.teacherVrifyCode = app.api.address + "/api/verificationCode?pattern=" + $scope.teacherModule + "&d=" + new Date()*1;
        $scope.managerVrifyCode = app.api.address + "/api/verificationCode?pattern=" + $scope.managerModule + "&d=" + new Date()*1;
        $scope.studentVrifyCode = app.api.address + "/api/verificationCode?pattern=" + $scope.studentModule + "&d=" + new Date()*1;
        $scope.updateVrifyCode = function (pattern) {
            switch (pattern) {
                case $scope.teacherModule:
                    $scope.teacherVrifyCode = app.api.address + "/api/verificationCode?pattern=" + $scope.teacherModule + "&d=" + new Date()*1;
                    break;
                case $scope.managerModule:
                    $scope.managerVrifyCode = app.api.address + "/api/verificationCode?pattern=" + $scope.managerModule + "&d=" + new Date()*1;
                    break;
                case $scope.studentModule:
                    $scope.studentVrifyCode = app.api.address + "/api/verificationCode?pattern=" + $scope.studentModule + "&d=" + new Date()*1;
            }
        }

        $scope.teacherCaptcha;
        $scope.managerCaptcha;
        var timeDiff = 0; // 服务器与本地时间差(此处忽略请求时间的误差)

        // 重定向页面
        var redirectPage = function (user){
            if (!user || !user.userName) {
                return;
            }
            $rootScope.user = user;
			$rootScope.photoPath = $scope.prefix + "/student-status/student-info/photo";
            // 若本来是登录页面，则跳转到首页
            if ($rootScope.returnState && $rootScope.returnState.name && $rootScope.returnState.name.indexOf('login') == 0) {
                $rootScope.returnState = {
                    name: 'home.index',
                    params: {}
                }
            }
            if(user.userType == app.user.type.teacher){
                switch(user.loginPattern) {
                    case $scope.teacherModule:
                        if(!$rootScope.returnState){
							$("body").fadeOut();
							$timeout(function(){
               	            	$state.go('teacher.index');
				            },500);  
							$("body").fadeIn(800);
                        } else {
                            $state.go($rootScope.returnState.name, $rootScope.returnState.params);
                        }
                        break;
                    case $scope.managerModule:
                        if(!$rootScope.returnState){
							$("body").fadeOut();
							$timeout(function(){
                            	$state.go('home.index');
				            },500);  
							$("body").fadeIn(800);
                        } else {
                            $state.go($rootScope.returnState.name, $rootScope.returnState.params);
                        }
                        break;
                };
                return;
            } else{ 	//学生
                switch(user.loginPattern) {
                    case $scope.studentModule:
                        if(!$rootScope.returnState){
							$("body").fadeOut();
							$timeout(function(){
	                            $state.go('homeIndex');
				            },500);  
							$("body").fadeIn(800);
                        } else {
                            $state.go($rootScope.returnState.name, $rootScope.returnState.params);
                        }
                        break;
            	}
            }
        }

        // 检测登录状态
        loginService.checkLoginStatus(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if(data == app.user.loginStatus.login){
                // 若登录为登录状态,将自动跳转到首页
                var user = angular.fromJson(angular.fromJson($cookies.getObject("user")));
                redirectPage(user);
                return;
            }
            // 初始化验证码
            initGeetestCode(loginService, $scope, alertService);
        });

        //普通登录
        $scope.simpleLogin= function(userName, password, vrifyCode, valid, loginPattern){
            $scope.loginPattern = loginPattern;
            if(!valid){
                return;
            }
            var param = {
                userName: userName,
                timestamp: new Date().getTime() + timeDiff,
                token: $.base64.encode(password),
                vrifyCode: vrifyCode,
                pattern: loginPattern
            };
            if($scope.student.agreement == false){
                alertService("请先同意并勾选协议！");
                return;
            }
            $rootScope.showLoading = true; // 开启加载提示
            loginService.login(param, function (error, message, data) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    // 更新验证码
                    $scope.updateVrifyCode(loginPattern);
                    return;
                }
                // 清除 $localStorage 数据
                $localStorage.$reset();
                // 返回的是角色编号列表，将存入根作用域
                if (data) {
                    $localStorage.__roles__by = data;
                }
                // 定时判断 session 是否过期，若过期，则跳到登录页
                $rootScope.$emit('sessionCheck');
                // 跳转到首页
                var user = angular.fromJson(angular.fromJson($cookies.getObject("user")));
                $rootScope.$log.debug(user);
                redirectPage(user);
            });
        }
    };
    loginController.$inject = ['$interval', '$scope', '$timeout', '$rootScope', '$cookies', '$localStorage', '$state', '$uibModal', 'loginService', 'logoutService', 'alertService', 'app'];

})(window);
