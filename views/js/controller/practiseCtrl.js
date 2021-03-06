angular.module('quizApp').controller('practiseCtrl', function($scope, $http, $interval, $location, $anchorScroll, $routeParams, $rootScope) {
	$rootScope.displayDBoard = false;
	var BOK = "";
	switch ($routeParams.category){
		case 'GKModel':
			BOK =  "General";
			break;
		case 'ANGModel':
			BOK = 'AngularJS';
			break;
		case 'HTMLModel':
			BOK = 'HTML';
			break;
		case 'CSSModel':
			BOK = 'CSS';
			break;
		case 'JSModel':
			BOK = 'JavaScript';
			break;
		case 'BOOTModel':
			BOK = 'BootStrap';
			break;
		case 'JQModel':
			BOK = 'jQuery';
			break;
	}
	$scope.Mode = "Practice Mode" + " (" + BOK + ")";
	$rootScope.report = {type:'practise',wrong:[]};
	$rootScope.wrong = 0;
	$http.post('/practise', [$routeParams.category]).success(function (response) {
		console.log(response);
		$scope.questions = response;
	});

	$scope.labels = [];

	$scope.addLabels = function (id) {
		$scope.labels.push(id);
		$scope.labels.sort()
	};

	$scope.popLabels = function (id) {
		$scope.labels.pop(id);
		$scope.labels.sort()
	};

	$scope.gotoAnchor = function(id) {
		var old = $location.hash();
		$location.hash(id);
		$anchorScroll();
		$location.hash(old)
	};

	$scope.submit = function () {
		var postData = {
			"username":$rootScope.currentUser.username,
			"mode": "practise",
			"time": new Date(),
			"category": $routeParams.category,
			"score": 0
		};
		$scope.questions.forEach(function (value, index, array) {
			if (value.answer != value.correctChoice){
				$rootScope.wrong ++;
				$rootScope.report.wrong.push(value)
			}

			if (index == array.length - 1){
				postData.score = Math.ceil((1-($rootScope.wrong/5))*100);
				$rootScope.report.score = postData.score;
				$rootScope.report.category = $routeParams.category;
				$http.post('/saveRecord', postData).success(function () {
					$location.url('/report')
				});
			}
		});
	};
	$scope.cancel = function () {
		$location.url('/dashboard');
	};
});