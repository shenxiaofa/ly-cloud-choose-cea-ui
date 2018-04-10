;(function (window, undefined) {
    'use strict';

    hiocsApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        .state('home.common.publicElectiveCourse', {	// 校公选课模块
            url: '/publicElectiveCourse',
            templateUrl: 'tpl/home/publicElectiveCourse/index.html',
            controller: index_publicElectiveCourseController
        })
        .state('home.common.deptElectiveCourse', {		// 院系选修课
            url: '/deptElectiveCourse',
            templateUrl: 'tpl/home/deptElectiveCourse/index.html',
            controller: index_deptElectiveCourseController
        })
//      .state('home.common.deptClassChoose', {			// 院系选修课班级选择
//          url: '/deptClassChoose',
//          templateUrl: 'tpl/home/deptElectiveCourse/deptClassChoose/index.html',
//          controller: index_deptClassChooseController
//      })
        .state('home.common.physicalEducationClass', {	// 体育课
            url: '/physicalEducationClass',
            templateUrl: 'tpl/home/physicalEducationClass/index.html',
            controller: index_physicalEducationClassController
        });
//      .state('home.common.physicalClassChoose', {			// 体育课班级选择
//          url: '/physicalClassChoose',
//          templateUrl: 'tpl/home/physicalEducationClass/physicalClassChoose/index.html',
//          controller: index_physicalClassChooseController
//      })
    }]);
    
})(window);

