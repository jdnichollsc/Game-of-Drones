(function () {
	'use strict';

	angular
		.module('App')
		.factory('Game', Game);

	Game.$inject = ['$http', 'myConfig', '$window', 'Move', '$filter', '$q'];
	function Game($http, myConfig, $window, Move, $filter, $q) {
		
		var Player = function (obj) {			
			var self = this;
			self.moves = [];

			for (var prop in obj){
				if(obj.hasOwnProperty(prop)){
					self[prop] = obj[prop];
				}
			} 
		};

		Player.prototype.setName = function(name){
			this.name = name;
			_updateStoredData();
		};

		Player.prototype.setMove = function(move){
			this.moves[myGame.score.length] = move;
			_updateStoredData();
		};

		var _updateStoredData = function(){
			$window.localStorage.setItem(myConfig.localGameData, angular.toJson(myGame));
		};

		var _getStoredData = function(){
			var storedGame = angular.fromJson($window.localStorage.getItem(myConfig.localGameData));
			if(storedGame){
				if(storedGame.firstPlayer){
					storedGame.firstPlayer = new Player(storedGame.firstPlayer);
				}
				if(storedGame.secondPlayer){
					storedGame.secondPlayer = new Player(storedGame.secondPlayer);
				}
				storedGame.score = storedGame.score || [];
				_checkWinner(storedGame);
			}
			return storedGame || {
				firstPlayer : new Player(),
				secondPlayer : new Player(),
				score: [],
				winner: null,
				saved: false
			};
		};

		var _checkWinner = function(storedGame){
			var myGameData = storedGame || myGame;
			if(myGameData.score && myGameData.score.length){
				var rounds = $filter('groupBy')(myGameData.score, 'winner');
				for (var player in rounds) {
					if (player && rounds.hasOwnProperty(player) && rounds[player].length >= 3) {
						myGameData.winner = player;
						break;
					}
				}
			}
		};

		var myGame = _getStoredData();

		return {
			getAll: function(){
				return $http.get(myConfig.backEndUrl + '/game');
			},
			getInstance: function(){
				return myGame;
			},
			checkWinner: _checkWinner,
			saveRound: function(){
				var moveFirstPlayer = myGame.firstPlayer.moves[myGame.score.length];
				var moveSecondPlayer = myGame.secondPlayer.moves[myGame.score.length];
				var winner = '';
				return Move.compareMoves(moveFirstPlayer, moveSecondPlayer).then(function(winningMove){
					if(moveFirstPlayer === winningMove){
						winner = myGame.firstPlayer.name;
					}
					else if(moveSecondPlayer === winningMove){
						winner = myGame.secondPlayer.name;
					}			
					myGame.score.push({
						round: myGame.score.length + 1,
						winner: winner,
						moveFirstPlayer: moveFirstPlayer,
						moveSecondPlayer: moveSecondPlayer
					});
					return winner;
				});
			},
			saveGame: function(){
				var deferred = $q.defer();
				if(myGame.saved){
					deferred.resolve();
				}
				else{
					$http.post(myConfig.backEndUrl + '/game', {
						firstPlayer: myGame.firstPlayer.name,
						secondPlayer: myGame.secondPlayer.name,
						score: myGame.score,
						winner: myGame.winner
					}).then(function(){
						myGame.saved = true;
						_updateStoredData();
						deferred.resolve();
					}).catch(function(err){
						deferred.reject(err.data);
					});
				}
				return deferred.promise;
			},
			destroy: function(){
				$window.localStorage.removeItem(myConfig.localGameData);
				myGame = _getStoredData();
			}
		};
	}
})();