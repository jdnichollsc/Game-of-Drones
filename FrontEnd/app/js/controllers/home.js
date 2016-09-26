(function () {
	'use strict';

	angular
		.module('App')
		.controller('HomeController', HomeController);

	HomeController.$inject = ['$scope', '$ionicPopup', 'Model', '$state', '$ionicHistory'];
	function HomeController($scope, $ionicPopup, Model, $state, $ionicHistory) {
		
		var myGame;
		$scope.home = {
			firstPlayerName  : null,
			secondPlayerName : null
		};
		
		$scope.startGame = function(){
			var fieldRequired = null;
			fieldRequired = $scope.home.secondPlayerName ? fieldRequired : "second Player";
			fieldRequired = $scope.home.firstPlayerName ? fieldRequired : "first Player";
			if(fieldRequired){
				$ionicPopup.alert({
					title: 'Field Required',
					template: ['The field', fieldRequired, 'is required'].join(' '),
					cssClass: 'animated rollIn'
				});
			}
			else if ($scope.home.firstPlayerName === $scope.home.secondPlayerName){				
				$ionicPopup.alert({
					title: 'Error',
					template: 'the name of the players must be different',
					cssClass: 'animated rollIn'
				});
			}
			else{
				myGame.firstPlayer.setName($scope.home.firstPlayerName);
				myGame.secondPlayer.setName($scope.home.secondPlayerName);
				$ionicHistory.nextViewOptions({
					disableBack: true,
					disableAnimate : true,
					historyRoot  : true
				});
				$state.go('app.game', {}, {location:'replace'});
			}
		};

		$scope.$on('$ionicView.enter', function(){
			myGame = Model.Game.getInstance();
			$scope.home.firstPlayerName = myGame.firstPlayer.name;
			$scope.home.secondPlayerName = myGame.secondPlayer.name;
		});
	}
})();