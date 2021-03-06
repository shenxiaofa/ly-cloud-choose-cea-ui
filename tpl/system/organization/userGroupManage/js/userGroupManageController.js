;(function (window, undefined) {
    'use strict';

    window.system_userGroupManageController = function ($compile, $scope, $uibModal, $rootScope, $window, system_userGroupManageService, alertService, app) {
        // 初始化表格
        initIndexTable($scope, $window, $rootScope, $compile, app);
        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.table_height = $scope.table_height + 75;
            } else {
                $scope.table_height = $scope.table_height - 75;
            }
            angular.element('#userGroupTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        };
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#userGroupTable').bootstrapTable('selectPage', 1);
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.userGroup = {};
            // 重新初始化下拉框
            angular.element('form[name="userGroupSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#userGroupTable').bootstrapTable('selectPage', 1);
        };
        // 打开新增面板
        $scope.openAdd = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/organization/userGroupManage/add.html',
                size: '',
                controller: openAddController
            });
        };
        // 打开修改面板
        $scope.openModify = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/organization/userGroupManage/modify.html',
                size: '',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: openModifyController
            });
        };
        // 打开成员管理
        $scope.openUserManage = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/organization/userGroupManage/user/index.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: openUserManageController
            });
        };
        // 打开成员管理
        $scope.openRoleManage = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/organization/userGroupManage/role/index.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: openRoleManageController
            });
        };

        // 打开删除面板
        $scope.openDelete = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/organization/userGroupManage/delete.html',
                size: '',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: openDeleteController
            });
        };
    };
    system_userGroupManageController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window', 'system_userGroupManageService', 'alertService', 'app'];

    // 添加控制器
    var openAddController = function ($rootScope, $timeout, $compile, $scope, $uibModalInstance, $uibModal, system_userGroupManageService, formVerifyService, alertService) {
        // 初始化数据
        $scope.userGroup = {};
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true; // 开启加载提示
            system_userGroupManageService.add($scope.userGroup, 'userGroup:insert', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#userGroupTable').bootstrapTable('refresh');
                alertService('success', '新增成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openAddController.$inject = ['$rootScope', '$timeout', '$compile', '$scope', '$uibModalInstance', '$uibModal', 'system_userGroupManageService', 'formVerifyService', 'alertService'];

    // 修改控制器
    var openModifyController = function ($rootScope, $timeout, $compile, $scope, $uibModalInstance, $uibModal, item, system_userGroupManageService, alertService, formVerifyService) {
        // 数据初始化
        $scope.userGroup = item;
        // system_userGroupManageService.findUserGroupById(item.yhzbh, function (error, message, data) {
        //     if (error) {
        //         alertService(message);
        //         return;
        //     };
        //     $scope.userGroup = data;
        // });
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true; // 开启加载提示
            system_userGroupManageService.update($scope.userGroup, 'userGroup:update', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#userGroupTable').bootstrapTable('refresh');
                alertService('success', '修改成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openModifyController.$inject = ['$rootScope', '$timeout', '$compile', '$scope', '$uibModalInstance', '$uibModal', 'item', 'system_userGroupManageService', 'alertService', 'formVerifyService'];

    var openUserManageController = function ($rootScope, $timeout, $compile, $scope, $uibModalInstance, $uibModal, item, system_userGroupManageService, alertService, formVerifyService, $window, app) {
        // 数据初始化
        $scope.userGroup = item;
        // 初始化userTable表格
        initUserTable($scope, $window, $rootScope, $compile, app ,item);
        // 打开新增面板
        $scope.openAdd = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/organization/userGroupManage/user/add.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return item;
                    }
                },
                controller: openUserAddController
            });
        };
        // 打开删除面板
        $scope.openDelete = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/organization/userGroupManage/delete.html',
                size: '',
                controller: openUserDeleteController
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openUserManageController.$inject = ['$rootScope', '$timeout', '$compile', '$scope', '$uibModalInstance', '$uibModal', 'item', 'system_userGroupManageService', 'alertService', 'formVerifyService', '$window', 'app'];

    var openRoleManageController = function ($rootScope, $timeout, $compile, $scope, $uibModalInstance, $uibModal, item, system_userGroupManageService, alertService, formVerifyService, $window, app) {
        // 数据初始化
        $scope.userGroup = item;

        initServerMetaData($scope, system_userGroupManageService, alertService, $compile);
        // 初始化userTable表格
        initRoleTable($scope, $window, $rootScope, $compile, app ,item);

        // 打开新增面板
        $scope.openAdd = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/organization/userGroupManage/role/add.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return item;
                    }
                },
                controller: openRoleAddController
            });
        };
        // 打开删除面板
        $scope.openDelete = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/organization/userGroupManage/delete.html',
                size: '',
                controller: openRoleDeleteController
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openRoleManageController.$inject = ['$rootScope', '$timeout', '$compile', '$scope', '$uibModalInstance', '$uibModal', 'item', 'system_userGroupManageService', 'alertService', 'formVerifyService', '$window', 'app'];

    var openUserAddController = function ($rootScope, $timeout, $compile, $scope, $uibModalInstance, $uibModal, item, system_userGroupManageService, alertService, formVerifyService, $window, app) {
        // 初始化userTable表格
        initUserCanSelectTable($scope, $window, $rootScope, $compile, app, item);
        $scope.ok = function () {
            var rows = angular.element('#userCanSelectTable').bootstrapTable('getSelections');
            var yhbhArray=[];
            rows.forEach (function(row) {
                yhbhArray.push(row.yhbh);
            });
            system_userGroupManageService.addUser(item.yhzbh,rows, 'userGroup:insert', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#userTable').bootstrapTable('refresh');
                alertService('success', '新增成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openUserAddController.$inject = ['$rootScope', '$timeout', '$compile', '$scope', '$uibModalInstance', '$uibModal', 'item', 'system_userGroupManageService', 'alertService', 'formVerifyService', '$window', 'app'];

    var openRoleAddController = function ($rootScope, $timeout, $compile, $scope, $uibModalInstance, $uibModal, item, system_userGroupManageService, alertService, formVerifyService, $window, app) {
        initServerMetaData($scope, system_userGroupManageService, alertService, $compile);
        // 初始化userTable表格
        initRoleCanSelectTable($scope, $window, $rootScope, $compile, app, item);
        $scope.ok = function () {
            var rows = angular.element('#roleCanSelectTable').bootstrapTable('getSelections');
            var jsbhArray=[];
            rows.forEach (function(row) {
                jsbhArray.push(row.jsbh);
            });
            system_userGroupManageService.addRole(item.yhzbh,rows, 'userGroup:insert', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#roleTable').bootstrapTable('refresh');
                alertService('success', '新增成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openRoleAddController.$inject = ['$rootScope', '$timeout', '$compile', '$scope', '$uibModalInstance', '$uibModal', 'item', 'system_userGroupManageService', 'alertService', 'formVerifyService', '$window', 'app'];

    // 删除控制器
    var openDeleteController = function ($rootScope, $scope, $uibModalInstance, item, system_userGroupManageService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            $rootScope.showLoading = true; // 开启加载提示
            system_userGroupManageService.delete(item.yhzbh, 'userGroup:delete', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#userGroupTable').bootstrapTable('refresh');
                alertService('success', '删除成功');
            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openDeleteController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'item', 'system_userGroupManageService', 'alertService'];

    // 删除控制器
    var openUserDeleteController = function ($rootScope, $scope, $uibModalInstance, system_userGroupManageService, alertService) {
        var rows = angular.element('#userTable').bootstrapTable('getSelections');
        if(rows.length == 0){
            alertService('请先选择要删除的项');
            return;
        }
        var yhbhs=[];
        rows.forEach(function (row) {
            yhbhs.push(row.yhbh);
        });
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            $rootScope.showLoading = true; // 开启加载提示
            system_userGroupManageService.deleteUser(yhbhs, 'userGroup:delete', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#userTable').bootstrapTable('refresh');
                alertService('success', '删除成功');
            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openUserDeleteController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'system_userGroupManageService', 'alertService'];

    // 删除控制器
    var openRoleDeleteController = function ($rootScope, $scope, $uibModalInstance, system_userGroupManageService, alertService) {
        var rows = angular.element('#roleTable').bootstrapTable('getSelections');
        if(rows.length == 0){
            alertService('请先选择要删除的项');
            return;
        }
        var jsbhs=[];
        rows.forEach(function (row) {
            jsbhs.push(row.jsbh);
        });
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            $rootScope.showLoading = true; // 开启加载提示
            system_userGroupManageService.deleteRole(jsbhs, 'userGroup:delete', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#roleTable').bootstrapTable('refresh');
                alertService('success', '删除成功');
            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openRoleDeleteController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'system_userGroupManageService', 'alertService'];

    // 初始化表格
    var initIndexTable = function($scope, $window, $rootScope, $compile, app) {
        // 表格的高度
        $scope.table_height = $window.innerHeight - 213;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var userGroupQuery = {};
            angular.forEach($scope.userGroup, function (data, index, array) {
                if (data) {
                    userGroupQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, userGroupQuery));
            return angular.extend(pageParam, userGroupQuery);
        };
        $scope.userGroupTable = {
            //url: 'data_test/system/tableview_userGroup.json',
            url: app.api.address + '/system/userGroup',
            headers: {
                permission: "userGroup:query"
            },
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber: 1,
            pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'yhzbm', // 默认排序字段
            sortOrder: 'asc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField: "yhzbh", // 指定主键列
            uniqueId: "yhzbh", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            search: false,
            showColumns: true,
            showRefresh: true,
            responseHandler: function (response) {
                return {
                    total: response.data.total,
                    rows: response.data.list
                };
            },
            onLoadSuccess: function () {
                $compile(angular.element('#userGroupTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#userGroupTable').contents())($scope);
            },
            columns: [
                {field: "yhzbh", title: "用户组编号", visible: false},
                {field: "yhzbm", title: "用户组编码", align: "left", valign: "middle"},
                {field: "yhzmc", title: "用户组名称", align: "left", valign: "middle"},
                {field: "ms", title: "描述", align: "left", valign: "middle"},
                {
                    field: "operation", title: "操作", align: "center", valign: "middle",
                    formatter: function (value, row, index) {
                        var modifyBtn = "<button has-permission='userGroup:update' type='button' class='btn btn-sm btn-default' ng-click='openModify(" + angular.toJson(row) + ")'><span class='fa fa-edit toolbar-btn-icon'></span>修改</button>";
                        var userManageBtn = "<button  type='button' class='btn btn-default add_btn' ng-click='openUserManage(" + angular.toJson(row) + ")'><span class='fa fa-plus toolbar-btn-icon'></span>成员管理</button>";
                        var roleManageBtn = "<button  type='button' class='btn btn-default add_btn' ng-click='openRoleManage(" + angular.toJson(row) + ")'><span class='fa fa-plus toolbar-btn-icon'></span>权限管理</button>";
                        var deleteBtn = "<button has-permission='userGroup:delete' type='button' class='btn btn-sm btn-default del-btn' ng-click='openDelete(" + angular.toJson(row) + ")'><span class='fa fa-times toolbar-btn-icon'></span>删除</button>";
                        return modifyBtn + "&nbsp;" + userManageBtn+ "&nbsp;" + roleManageBtn+ "&nbsp;" + deleteBtn;
                    }
                }
            ]
        };
    }

    var initUserTable = function ($scope, $window, $rootScope, $compile, app , item) {
        // 表格的高度
        $scope.table_height = $window.innerHeight - 420;
        // 查询参数
        $scope.user={};
        $scope.user.yhzbh = item.yhzbh;
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            // var userQuery = {};

            // angular.forEach($scope.user, function(data, index, array){
            //     if (data) {
            //         userQuery[index] = data;
            //     }
            // });
            $rootScope.$log.debug(angular.extend(pageParam, $scope.user));
            return angular.extend(pageParam, $scope.user);
        };
        $scope.userTable = {
            //url: 'data_test/system/tableview_user.json',
            url: app.api.address + '/system/user/userGroup',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#childToolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber: 1,
            pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'yhbh', // 默认排序字段
            sortOrder: 'asc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField: "yhbh", // 指定主键列
            uniqueId: "yhbh", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            search: false,
            showColumns: true,
            showRefresh: true,
            responseHandler: function (response) {
                return {
                    total: response.data.total,
                    rows: response.data.list
                };
            },
            onLoadSuccess: function () {
                $compile(angular.element('#userTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#userTable').contents())($scope);
            },
            clickToSelect: true,
            columns: [
                {checkbox: true, width: "5%"},
                {field: "yhbh", title: "用户账号",},
                {field: "xm", title: "姓名", align: "left", valign: "middle"},
                {field: "lx", title: "类型", align: "left", valign: "middle",
                    formatter: function (value, row, index) {
                        var data = "";
                        switch(value) {
                            case "1":
                                data = "教职工";
                                break;
                            case "2":
                                data = "学生";
                                break;
                            default:
                                data;
                        };
                        return data;
                    }
                },
                {field: "dwmc", title: "所属部门", align: "center", valign: "middle"}
            ]
        };
        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.table_height = $scope.table_height + 75;
            } else {
                $scope.table_height = $scope.table_height - 75;
            }
            angular.element('#userTable').bootstrapTable('resetView', {height: $scope.table_height});
        }
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#userTable').bootstrapTable('refresh');
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.user = {
                yhzbh: $scope.user.yhzbh
            };
            // 重新初始化下拉框
            angular.element('form[name="userGroupSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#userTable').bootstrapTable('refresh');
        }


    }

    var initRoleTable = function ($scope, $window, $rootScope, $compile, app , item) {
        // 表格的高度
        $scope.table_height = $window.innerHeight - 460;
        // 查询参数
        $scope.role={};
        $scope.role.yhzbh = item.yhzbh;
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            // var userQuery = {};

            // angular.forEach($scope.user, function(data, index, array){
            //     if (data) {
            //         userQuery[index] = data;
            //     }
            // });
            $rootScope.$log.debug(angular.extend(pageParam, $scope.role));
            return angular.extend(pageParam, $scope.role);
        };
        $scope.roleTable = {
            //url: 'data_test/system/tableview_user.json',
            url: app.api.address + '/system/role/groupPermission',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#childToolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber: 1,
            pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'yhbh', // 默认排序字段
            sortOrder: 'asc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField: "yhbh", // 指定主键列
            uniqueId: "yhbh", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            search: false,
            showColumns: true,
            showRefresh: true,
            responseHandler: function (response) {
                return {
                    total: response.data.total,
                    rows: response.data.list
                };
            },
            onLoadSuccess: function () {
                $compile(angular.element('#roleTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#roleTable').contents())($scope);
            },
            clickToSelect: true,
            columns: [
                {checkbox: true, width: "5%"},
                {field: "jsbh", title: "角色编号",},
                {field: "jsmc", title: "名称", align: "left", valign: "middle"},
                {field: "ssxt", title: "所属系统", align: "left", valign: "middle"},
                {field: "ms", title: "描述", align: "left", valign: "middle"}
            ]
        };
        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.table_height = $scope.table_height + 75;
            } else {
                $scope.table_height = $scope.table_height - 75;
            }
            angular.element('#roleTable').bootstrapTable('resetView', {height: $scope.table_height});
        }
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#roleTable').bootstrapTable('refresh');
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.user = {
                yhzbh: $scope.user.yhzbh
            };
            // 重新初始化下拉框
            angular.element('form[name="roleSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#roleTable').bootstrapTable('refresh');
        }


    }

    // 初始化主页下拉框数据
    var initServerMetaData = function($scope, system_userGroupManageService, alertService, $compile) {
        $scope.fwbhData = [
            {
                bh: '',
                mc: '== 请选择 =='
            }
        ];
        system_userGroupManageService.findServing({pageNum: 1, pageSize: 0}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.length > 0) {
                $scope.fwbhData = $scope.fwbhData.concat(data);
            }
            var html = '' +
                '<select ng-model="role.fwbh" id="fwbh" name="fwbh" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="fwbhItem in fwbhData" value="{{fwbhItem.bh}}">{{fwbhItem.mc}}</option>' +
                '</select>';
            angular.element("#fwbh").parent().empty().append(html);
            $compile(angular.element("#fwbh").parent().contents())($scope);
        });
    }
    
    var initUserCanSelectTable = function ($scope, $window, $rootScope, $compile, app ,item) {
        // 表格的高度
        $scope.table_height = $window.innerHeight - 400;
        // 查询参数
        $scope.user={};
        $scope.user.yhzbh = item.yhzbh;
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            // var userQuery = {};
            // angular.forEach($scope.user, function(data, index, array){
            //     if (data) {
            //         userQuery[index] = data;
            //     }
            // });
            $rootScope.$log.debug(angular.extend(pageParam, $scope.user));
            return angular.extend(pageParam, $scope.user);
        };
        $scope.userCanSelectTable = {
            //url: 'data_test/system/tableview_user.json',
            url: app.api.address + '/system/user/userForGroup',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber: 1,
            pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'yhbh', // 默认排序字段
            sortOrder: 'asc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField: "yhbh", // 指定主键列
            uniqueId: "yhbh", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            search: false,
            showColumns: false,
            showRefresh: false,
            responseHandler: function (response) {
                return {
                    total: response.data.total,
                    rows: response.data.list
                };
            },
            onLoadSuccess: function () {
                $compile(angular.element('#userTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#userTable').contents())($scope);
            },
            clickToSelect: true,
            columns: [
                {checkbox: true, width: "5%"},
                {field: "yhbh", title: "用户账号",},
                {field: "xm", title: "姓名", align: "left", valign: "middle"},
                {field: "lx", title: "类型", align: "left", valign: "middle",
                    formatter: function (value, row, index) {
                        var data = "";
                        switch(value) {
                            case "1":
                                data = "教职工";
                                break;
                            case "2":
                                data = "学生";
                                break;
                            default:
                                data;
                        };
                        return data;
                    }
                },
                {field: "dwmc", title: "所属部门", align: "center", valign: "middle"}
            ]
        };
        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.table_height = $scope.table_height + 75;
            } else {
                $scope.table_height = $scope.table_height - 75;
            }
            angular.element('#userCanSelectTable').bootstrapTable('resetView', {height: $scope.table_height});
        }
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#userCanSelectTable').bootstrapTable('refresh');
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.user = {
                yhzbh: $scope.user.yhzbh
            };
            // 重新初始化下拉框
            angular.element('form[name="userSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#userCanSelectTable').bootstrapTable('refresh');
        }


    }

    var initRoleCanSelectTable = function ($scope, $window, $rootScope, $compile, app ,item) {
        // 表格的高度
        $scope.table_height = $window.innerHeight - 400;
        // 查询参数
        $scope.role={};
        $scope.role.yhzbh = item.yhzbh;
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            // var userQuery = {};
            // angular.forEach($scope.user, function(data, index, array){
            //     if (data) {
            //         userQuery[index] = data;
            //     }
            // });
            $rootScope.$log.debug(angular.extend(pageParam, $scope.role));
            return angular.extend(pageParam, $scope.role);
        };
        $scope.roleCanSelectTable = {
            //url: 'data_test/system/tableview_user.json',
            url: app.api.address + '/system/role/roleForGroup',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber: 1,
            pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'jsbh', // 默认排序字段
            sortOrder: 'asc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField: "jsbh", // 指定主键列
            uniqueId: "jsbh", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            search: false,
            showColumns: true,
            showRefresh: true,
            responseHandler: function (response) {
                return {
                    total: response.data.total,
                    rows: response.data.list
                };
            },
            onLoadSuccess: function () {
                $compile(angular.element('#roleCanSelectTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#roleCanSelectTable').contents())($scope);
            },
            clickToSelect: true,
            columns: [
                {checkbox: true, width: "5%"},
                {field: "jsbh", title: "角色编号",},
                {field: "jsmc", title: "名称", align: "left", valign: "middle"},
                {field: "ssxt", title: "所属系统", align: "left", valign: "middle"},
                {field: "ms", title: "描述", align: "left", valign: "middle"}
            ]
        };
        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.table_height = $scope.table_height + 75;
            } else {
                $scope.table_height = $scope.table_height - 75;
            }
            angular.element('#roleCanSelectTable').bootstrapTable('resetView', {height: $scope.table_height});
        }
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#roleCanSelectTable').bootstrapTable('refresh');
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.role = {
                yhzbh: $scope.role.yhzbh
            };
            // 重新初始化下拉框
            angular.element('form[name="roleSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#roleCanSelectTable').bootstrapTable('refresh');
        }


    }
})(window);
