(function () {
    'use strict';

    angular
        .module('App')
        .controller('AppController', AppController);

    AppController.$inject = ['$scope', 'Model'];
    function AppController($scope, Model) {

        var myGame;
        $scope.score = [];

        $scope.exitApp = function () {
            ionic.Platform.exitApp();
        };

        $scope.cancelGame = function(){
            Model.Game.destroy();
        };

        $scope.$on('$ionicView.beforeEnter', function(){
			myGame = Model.Game.getInstance();
            $scope.score = myGame.score;
		});
    }
})();