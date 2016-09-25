(function() {
'use strict';

    angular
        .module('App')
        .controller('GamesController', GamesController);

    GamesController.$inject = ['$scope', 'Model', '$filter'];
    function GamesController($scope, Model, $filter) {

        $scope.games = {
            players: [],
            allGames: []
        };

        $scope.$on('$ionicView.beforeEnter', function(){
			Model.Game.getAll().then(function(response){
                $scope.games.allGames = response.data;
                
                var players = $filter('groupBy')(response.data, 'winner');
                var gamesByPlayer = [];
                for (var player in players) {
                    if (players.hasOwnProperty(player)) {
                        var games = players[player];
                        gamesByPlayer.push({
                            name: player,
                            games: games
                        });
                    }
                }
                $scope.games.players = gamesByPlayer;
            });
		});
    }
})();