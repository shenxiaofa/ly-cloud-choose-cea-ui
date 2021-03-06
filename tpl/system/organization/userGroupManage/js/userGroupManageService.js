;(function (window, undefined) {
    'use strict';

    hiocsApp.service("system_userGroupManageService", ['$http', '$log', 'app', function($http, $log, app) {
        // 添加
        this.add = function(userGroup, permission, callback) {
            $log.debug("system_userGroupManageService userGroup run ...");
            $log.debug(userGroup);
            $http.post(app.api.address + '/system/userGroup', userGroup, {
                    headers : {permission: permission}
                })
                .then(function successCallback(response) {
                    if (response.data.meta.success) {
                        callback();
                    } else {
                        callback(true, response.data.meta.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };

        // 添加
        this.addUser = function(yhzbh, rows, permission,  callback) {
            $log.debug("system_userGroupManageService userGroup run ...");
            $log.debug(yhzbh);
            $log.debug(rows);
            $http.post(app.api.address + '/system/userGroupMiddle/'+yhzbh+'/user', rows, {
                    headers : {permission: permission}
                })
                .then(function successCallback(response) {
                    if (response.data.meta.success) {
                        callback();
                    } else {
                        callback(true, response.data.meta.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };

        // 添加
        this.addRole = function(yhzbh, rows, permission,  callback) {
            $log.debug("system_userGroupManageService userGroup run ...");
            $log.debug(yhzbh);
            $log.debug(rows);
            $http.post(app.api.address + '/system/roleUserGroupMiddle/'+yhzbh+'/role', rows, {
                    headers : {permission: permission}
                })
                .then(function successCallback(response) {
                    if (response.data.meta.success) {
                        callback();
                    } else {
                        callback(true, response.data.meta.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };

        // 修改
        this.update = function(userGroup, permission, callback) {
            $log.debug("system_userGroupManageService update run ...");
            $log.debug(userGroup);
            $http.put(app.api.address + '/system/userGroup', userGroup, {
                    headers : {permission: permission}
                })
                .then(function successCallback(response) {
                    if (response.data.meta.success) {
                        callback();
                    } else {
                        callback(true, response.data.meta.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        // 删除
        this.delete = function(yhzbh, permission, callback) {
            $log.debug("system_userGroupManageService delete run ...");
            $log.debug(yhzbh);
            $http.delete(app.api.address + '/system/userGroup/' + yhzbh, {
                    headers : {permission: permission}
                })
                .then(function successCallback(response) {
                    if (response.data.meta.success) {
                        callback();
                    } else {
                        callback(true, response.data.meta.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        }

        // 删除用户
        this.deleteUser = function(yhbhs, permission, callback) {
            $log.debug("system_userGroupManageService delete run ...");
            $log.debug(yhbhs);
            $http.delete(app.api.address + '/system/userGroupMiddle/user/'+yhbhs, {
                    headers : {permission: permission}
                })
                .then(function successCallback(response) {
                    if (response.data.meta.success) {
                        callback();
                    } else {
                        callback(true, response.data.meta.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        }

        // 删除角色
        this.deleteRole = function(yhbhs, permission, callback) {
            $log.debug("system_userGroupManageService delete run ...");
            $log.debug(yhbhs);
            $http.delete(app.api.address + '/system/roleUserGroupMiddle/role/'+yhbhs, {
                    headers : {permission: permission}
                })
                .then(function successCallback(response) {
                    if (response.data.meta.success) {
                        callback();
                    } else {
                        callback(true, response.data.meta.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        }

        // 获取服务
        this.findServing = function(serving, callback) {
            $log.debug("system_userGroupManageService findServing run ...");
            $log.debug(serving);
            $http.get(app.api.address + '/system/serving', {params: serving})
                .then(function successCallback(response) {
                    if (response.data.meta.success) {
                        callback(null, null, response.data.data.list);
                    } else {
                        callback(true, response.data.meta.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };

        // 根据主键查询
        this.findUserGroupById = function(yhzbh, callback) {
            $log.debug("system_userGroupManageService finduserGroupById run ...");
            $log.debug(yhzbh);
            //$http.get(app.api.address + '/system/userGroup/' + yhzbh)
            $http.get('data_test/system/tableview_userGroup_findById.json')
                .then(function successCallback(response) {
                    if (response.data.meta.success) {
                        callback(null, null, response.data.data);
                    } else {
                        callback(true, response.data.meta.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        }
    }]);

})(window);