/**
 * Created by shenxiaofa.
 */
;(function(window, undefined) {
	'use strict';

	hiocsApp.service("choose_publicElectiveCourseService", ['$http', '$log', 'app', function($http, $log, app) {
		
        // 校公选课
        this.add = function(param,callback) {
            $http.put(app.api.address + '/choose/monitor/capacity?id='+param.id+'&capacity='+param.capacity)
            .then(function successCallback(response) {
                if (response.data.code == app.api.code.success) {
                    callback();
                } else {
                    callback(true, response.data.message);
                }
            }, function errorCallback(response) {
                callback(true, response.data.message);
            });
        }
        
        //获取当前学年学期
        this.getCurrentSemester = function(callback) {
            $http({
				method: 'GET',
				url: app.api.address + '/base-info/acadyearterm/showNewAcadlist'
	      	}).then(function successCallback(response) {
	      		callback(null, null, response.data);
                }, function errorCallback(response) {
                	$log.debug(response);
                }
            );
        };
	}]);

})(window);