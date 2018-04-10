;(function(window, undefined) {
	'use strict';

	window.index_publicElectiveCourseController = function($scope, $state, $timeout, $cookies, $http, $uibModal, $compile, $rootScope, $window, choose_publicElectiveCourseService, alertService, app) {

		$scope.isShowAllRight = false;
		$scope.personInfo = false;
		$scope.selectedCourse = false;
		$scope.unsuccessfulResult = false;
		$scope.refreshTable = true;

		$scope.publicElectiveCourse = {};
		// 表格的高度
        $scope.table_height = $window.innerHeight - 115;
        $scope.deleteDataIsExist = true;	// 检测删除部分的数据是否存在
    	
		// 获取cookies
		$scope.user = {};
		var cookieasJson = {};
		if($cookies.getObject("user") != null){
			cookieasJson = JSON.parse($cookies.getObject("user"));
		}
		
	    //获取当前学年学期
		choose_publicElectiveCourseService.getCurrentSemester(function (error, message, data){
			if (error) {
                alertService(message);
                return;
            }
            $scope.semesterId = data.data.acadYearSemester;
		});
		
		// 查询参数
	    $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize : params.pageSize,   //页面大小
                pageNo : params.pageNumber  //页码
            };
            return angular.extend(pageParam, $scope.publicElectiveCourse);
	    };
	    
		$scope.publicElectiveCourseTable = {
//			url: app.api.address + '/choose/publicElectiveCourse',
        	url: 'data_test/index/tableview_publicElectiveCourse.json',
			method: 'get',
			cache: false,
            height: $scope.table_height, //使高度贴底部
			toolbar: '#toolbar', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			striped: true,
			pagination: true,
			pageSize: 10,
			pageNumber: 1,
			pageList: [5, 10, 20, 50], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
        	queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
			queryParams: $scope.queryParams,//传递参数（*）
			search: false,
			onLoadSuccess: function() {
				$compile(angular.element('#publicElectiveCourseTable').contents())($scope);
				if($scope.refreshTable){
					$timeout(function(){
	        			angular.element('#publicElectiveCourseTable').bootstrapTable('selectPage', 1);
		            },800);
					$scope.refreshTable = false;
				}
			},
			clickToSelect: true,
			responseHandler: function(data) {
				// 若传回来的数据不为空
//          	if(data.data.rows.length !== 0){
//          		$scope.deleteDataIsExist = true;
//          	}
            	// 若传回来的数据为空，则清空时显示“当前没数据可清空”
//          	if(data.data.rows.length == 0){
//          		$scope.deleteDataIsExist = false;
//          	}
                return {
                    "total": data.total,//总页数
                    "rows": data.rows   //数据
                };
        	},
			columns: [
				{field:'number',title :'序号',align:"center",valign:"middle",width:"5%",
                    formatter : function(value, row, index) {  
                        var page = angular.element('#publicElectiveCourseTable').bootstrapTable("getPage");  
                        return page.pageSize * (page.pageNumber - 1) + index + 1;  
                    }  
                },
				{field: "courseNum",title: "课程编号",align: "center",valign: "middle",width:"10%"},
				{field: "courseName",title: "课程名称",align: "center",valign: "middle",width:"10%"},
				{field: "teacher",title: "上课教师",align: "center",valign: "middle",width:"10%"},
				{field: "timeAndPlace",title: "上课时间地点",align: "center",valign: "middle",width:"15%"},
				{field: "teachingTaskMax",title: "课程容量",align: "center",valign: "middle",width:"10%"},
				{field: "beChoosedNum",title: "已报人数",align: "center",valign: "middle",width:"10%"},
				{field: "courseType",title: "课程类别",align: "center",valign: "middle",width:"10%"},
				{field: "credit",title: "学分",align: "center",valign: "middle",width:"10%"},
				{title: "操作",align: "center",valign: "middle",width:"5%",
					formatter: function(value, row, index) {
					    var chooseBut = "<button type='button' has-permission='' ng-click='chooseButton(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>选择</button>";
						return chooseBut;
					}
				}
			]
		};
		
		// 点击选择按钮进行选课
		$scope.chooseButton = function(){
			$rootScope.showLoading = true; // 加载提示
			var param = {
				id: items.id,
				capacity: $scope.data.teachingTaskMax
			}
			choose_publicElectiveCourseService.add(param, function (error, message) {
				$rootScope.showLoading = false; // 关闭加载提示
				if (error) {
					alertService(message);
					return;
				}
				angular.element('#publicElectiveCourseTable').bootstrapTable('refresh');
				alertService('success', '操作成功');
			});
		};
		
        // 查询
		$scope.searchSubmit = function () {
			$rootScope.showLoading = true; // 加载提示
            angular.element('#publicElectiveCourseTable').bootstrapTable('selectPage', 1);
			$rootScope.showLoading = false; // 关闭加载提示
		};
		
		// 显示节次信息
		$scope.sectionList = {};
		$http({
			method: "get",
			url: app.api.address + '/arrange/teacherTimeDemand',
			params: {
				type : 'selectSection',
				semesterId : '2017-2018-1'
			}
		}).then(function(response) {
			$scope.sectionList = response.data.data.rows;
		}, function(response) {
			console.log(response);
		});
		
		// 获取周次的信息并刷新数据，每次点击重新请求数据【参数：当前学年学期    & 所选周次】
		$scope.getCourse = function(weekly) {
			$scope.weekly = weekly;
			var academicYear = $scope.academicYear;
			//课程信息
			//加载动画
			$scope.showLoading = true;
			$http({
				method: "get",
				url: app.api.address + "/arrange/studentSchedule",
				params: {
					type: 'selectStudentStateSchedule',
					teacherNum: '201702060320',
					weekly: weekly,
					semesterId: '2017-2018-1'
				}
			})
			.then(function(response) {
				var data = response.data.data.rows;
				var j = 0;
				$scope.courseList = [];
				for(var i = 0; i < $scope.sectionList.length; i++) {
					if(data[j] != undefined && "" + (i + 1) == data[j].section) {
						$scope.courseList[i] = data[j];
						j++;
					} else {
						$scope.courseList[i] = {};
					}
				}
				$scope.showLoading = false;
			}, function(response) {
				console.log(response);
			});
			
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
			url: app.api.address + "/choose/chooseCourseRStates/selectAlreadyChoosedCredit",
			params: {
				studentId: cookieasJson.userName
			}
		}).then(function(response) {
			$scope.creditResults = response.data.data;	// 获取到请求结果
			$scope.showProgressCount = false;
			var count1 = 0;	// 累计总学分获取情况	
			var count2 = 0;	// 累计总学分
			var count3 = 0;	// 累计已选学分
			angular.forEach(response.data.data, function(creditResult) {
				if(creditResult.credit != null){
					$scope.showProgressCount = true;			// 只要有一个当前除数成绩为空，则展示真实数据
					count1 += parseInt(creditResult.credit);	// 累计所有的已获得学分
				}
				if(creditResult.modularCredit != null){
					count2 += parseInt(creditResult.modularCredit);	// 累计所有的毕业总学分
				}
				if(creditResult.choosePoint != null){
					count3 += parseInt(creditResult.choosePoint);	// 累计所有的毕业总学分
				}
			});
			// 毕业全部总学分
			$scope.student.totalNum = 0;
			$scope.student.totalNum = count2;
			// 毕业全部已完成学分
			$scope.student.alreadyFinishNum = 0;
			$scope.student.alreadyFinishNum = count1;
			// 当前学期全部已选学分
			$scope.student.choosePointNum = 0;
			$scope.student.choosePointNum = count3;
			// 总学分已完成度
			$scope.student.alreadyFinish = 0;
			$scope.student.alreadyFinish = parseInt(((count1+count3)/count2)*100);

			/* 转盘进度开始 */
	        if($scope.student.alreadyFinish <= 50){
	            $('.circle_right').css('transform','rotate('+($scope.student.alreadyFinish*3.6)+'deg)');
	        }else{
	            $('.circle_right').css({
	                'transform':'rotate(0deg)',
	                "background":"#60A8DA"
	            });
	            $('.circle_left').css('transform','rotate('+(($scope.student.alreadyFinish-50)*3.6)+'deg)');
	        }
			/* 转盘进度结束 */
			
		}, function(response) {
			console.log(response);
		});

		// 右侧动画效果【个人信息】
		$scope.clickRightPersonInfo = function() {
			$scope.isShowAllRight = true;
			if(($scope.selectedCourse || $scope.unsuccessfulResult) && !$scope.personInfo){	
				$scope.personInfo = true;
				$scope.selectedCourse = false;
				$scope.unsuccessfulResult = false;
				$(".all-right .fa-indent").removeClass('fa-indent').addClass('fa-outdent')
				$('.all-right').css('width', "45%");
				$('.all-left').css('width', "calc(100% - 50px)");
				$('.all-right_wrap').css('display', "");
				clearTimeout(rur);
				var rur = setTimeout(function() {
					$('.all-left_wrap').fadeIn();
				}, 500)
			}else{
				if($('.all-right').width() > 50) {	// 小
					$scope.personInfo = false;
					$scope.selectedCourse = false;
					$scope.unsuccessfulResult = false;
					$(".all-right .fa-outdent").removeClass('fa-outdent').addClass('fa-indent')
					$('.all-right').css('width', "50px");
					$('.all-left').css('width', "calc(100% - 50px)");
					$('.all-right_wrap').css('display', "none");
				} else {												// 大
					$scope.personInfo = true;
					$scope.selectedCourse = false;
					$scope.unsuccessfulResult = false;
					$(".all-right .fa-indent").removeClass('fa-indent').addClass('fa-outdent')
					$('.all-right').css('width', "45%");
					$('.all-left').css('width', "calc(100% - 50px)");
					$timeout(function(){
						$('.all-right_wrap').fadeOut();
						$('.all-right_wrap').css('display', "");
						$('.all-right_wrap').fadeIn(800);
		            },500);
					clearTimeout(rur);
					var rur = setTimeout(function() {
						$('.all-left_wrap').fadeIn();
					}, 500)
				}
			}
		};

		// 右侧动画效果【已选课表】
		$scope.clickRightSelectedCourse = function() {
			$scope.isShowAllRight = true;
			if(($scope.personInfo || $scope.unsuccessfulResult) && !$scope.selectedCourse){	
				$scope.personInfo = false;
				$scope.selectedCourse = true;
				$scope.unsuccessfulResult = false;
				$(".all-right .fa-indent").removeClass('fa-indent').addClass('fa-outdent')
				$('.all-right').css('width', "82%");
				$('.all-left').css('width', "calc(100% - 50px)");
				$('.all-right_wrap').css('display', "");
				clearTimeout(rur);
				var rur = setTimeout(function() {
					$('.all-left_wrap').fadeIn();
				}, 500)
			}else{
				if($('.all-right').width() > 50) {	// 小
					$scope.personInfo = false;
					$scope.selectedCourse = false;
					$scope.unsuccessfulResult = false;
					$(".all-right .fa-outdent").removeClass('fa-outdent').addClass('fa-indent')
					$('.all-right').css('width', "50px");
					$('.all-left').css('width', "calc(100% - 50px)");
					$('.all-right_wrap').css('display', "none");
				} else {
					$scope.personInfo = false;
					$scope.selectedCourse = true;
					$scope.unsuccessfulResult = false;
					$(".all-right .fa-indent").removeClass('fa-indent').addClass('fa-outdent')
					$('.all-right').css('width', "82%");
					$('.all-left').css('width', "calc(100% - 50px)");
					$timeout(function(){
						$('.all-right_wrap').fadeOut();
						$('.all-right_wrap').css('display', "");
						$('.all-right_wrap').fadeIn(800);
		            },500);
					clearTimeout(rur);
					var rur = setTimeout(function() {
						$('.all-left_wrap').fadeIn();
					}, 500)
				}
			}
		};

		// 右侧动画效果【落选结果】
		$scope.clickRightUnsuccessfulResult = function() {
			$http({
				method: "get",
				url: app.api.address + "/choose/chooseResult/findResult",
				params: {
					type: 'selectByStudentId',
					semesterId: $scope.semesterId
				}
			})
			.then(function(response) {
				$scope.chooseResult = response.data.data.rows;
				if(response.data.data && response.data.data.rows.length>0){
					angular.forEach($scope.chooseResult, function(data) {
						data.timeAddress = data.timeAddress.replace(/(\s+)?<br(\s+)?\/?>(\s+)?/gi,',');
					});
				}
			},function(response){
				alertService(response.data.message);
			});
			$scope.isShowAllRight = true;
			if(($scope.personInfo || $scope.selectedCourse) && !$scope.unsuccessfulResult){	
				$scope.personInfo = false;
				$scope.selectedCourse = false;
				$scope.unsuccessfulResult = true;
				$(".all-right .fa-indent").removeClass('fa-indent').addClass('fa-outdent')
				$('.all-right').css('width', "384px");
				$('.all-left').css('width', "calc(100% - 50px)");
				$('.all-right_wrap').css('display', "");
				clearTimeout(rur);
				var rur = setTimeout(function() {
					$('.all-left_wrap').fadeIn();
				}, 500)
			}else{
				if($('.all-right').width() > 50) {	// 小
					$scope.personInfo = false;
					$scope.selectedCourse = false;
					$scope.unsuccessfulResult = false;
					$(".all-right .fa-outdent").removeClass('fa-outdent').addClass('fa-indent')
					$('.all-right').css('width', "50px");
					$('.all-left').css('width', "calc(100% - 50px)");
					$('.all-right_wrap').css('display', "none");
				} else {
					$scope.personInfo = false;
					$scope.selectedCourse = false;
					$scope.unsuccessfulResult = true;
					$(".all-right .fa-indent").removeClass('fa-indent').addClass('fa-outdent')
					$('.all-right').css('width', "384px");
					$('.all-left').css('width', "calc(100% - 50px)");
					$timeout(function(){
						$('.all-right_wrap').fadeOut();
						$('.all-right_wrap').css('display', "");
						$('.all-right_wrap').fadeIn(800);
		            },500);
					clearTimeout(rur);
					var rur = setTimeout(function() {
						$('.all-left_wrap').fadeIn();
					}, 500)
				}
			}
		};







		
		
		
		
		
		$scope.getCourse(2);		// 临时执行
	};
	index_publicElectiveCourseController.$inject = ['$scope', '$state', '$timeout', '$cookies', '$http', '$uibModal', '$compile', '$rootScope', '$window', 'choose_publicElectiveCourseService', 'alertService', 'app'];

})(window);