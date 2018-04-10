;
(function(window, undefined) {
	'use strict';

	/* echart初始化
	 * 示例：
	 * <div e-chart ui-options="{tooltip: {show: true},
            legend: {
                data: ['销量']
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
            }
            ],
            yAxis: [
            {
            type: 'value'
            }
            ],
            series: [
            {
            'name': '销量',
            'type': 'bar',
            'data': {{data}}
            }
            ]}" style="height: 400px;width: 100%;"></div>
				</div>
	 * */
	hiocsApp.directive('eChart', [function() {
		function link($scope, element, attrs) {

			// 基于准备好的dom，初始化echarts图表
			var myChart = echarts.init(element[0]);

			//监听options变化
			if(attrs.uiOptions) {
				attrs.$observe('uiOptions', function() {
					var options = $scope.$eval(attrs.uiOptions);
					if(angular.isObject(options)) {
						myChart.setOption(options);
					}
				}, true);
			}

		}

		return {
			restrict: 'A',
			link: link
		};
	}]);

})(window);