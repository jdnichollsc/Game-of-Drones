(function() {
'use strict';

    angular
        .module('App')
        .controller('GameController', GameController);

    GameController.$inject = ['$scope', '$ionicHistory', 'Model', '$filter', '$state'];
    function GameController($scope, $ionicHistory, Model, $filter, $state) {
        
        var myGame = null;
        $scope.currentGame = {
            round: 0,
            currentPlayer: null,
            moves: [],
            selectedMove: null,
            winner: null
        };

        var showWinner = function(){
            Model.Loader.show();
            Model.Game.saveGame().then(function(){
                Model.Popup.alert('We have a winner!!', 
                    $scope.currentGame.winner + ' is the new EMPEROR!',
                    'Play again'
                ).then(function(){
                    $ionicHistory.nextViewOptions({
                        disableBack: true,
                        disableAnimate : true,
                        historyRoot  : true
                    });
                    $state.go('tabs.home', {}, {location:'replace'});
                    $scope.cancelGame();
                });
            }).catch(function(err){
                Model.Popup.alert('Error :(', err);
            }).finally(function(){
                Model.Loader.hide();
            });
        };

        $scope.$on('$ionicView.enter', function(){
            $ionicHistory.clearHistory();
            $scope.currentGame.selectedMove = null;
            myGame = Model.Game.getInstance();
            $scope.currentGame.round = myGame.score.length;
            if(!myGame.firstPlayer.moves[$scope.currentGame.round]){
                $scope.currentGame.currentPlayer = myGame.firstPlayer;
            }
            else{
                $scope.currentGame.currentPlayer = myGame.secondPlayer;
            }
            Model.Move.getMoves().then(function(moves){
                $scope.currentGame.moves = Object.keys($filter('groupBy')(moves, 'move'));
                $scope.currentGame.selectedMove = $scope.currentGame.moves[0];
            });
            Model.Game.checkWinner();
            if(myGame.winner){
                $scope.currentGame.winner = myGame.winner;
                showWinner();
            }
        });

        $scope.saveMove = function(){
            Model.Loader.show();
            $scope.currentGame.currentPlayer.setMove($scope.currentGame.selectedMove);
            if($scope.currentGame.currentPlayer.name === myGame.firstPlayer.name){
                Model.Loader.hideTimeout().then(function(){
                    $scope.currentGame.currentPlayer = myGame.secondPlayer;
                    $scope.currentGame.selectedMove = null;
                });
            }
            else{
                var winnerPlayerName;
                Model.Game.saveRound().then(function(winner){
                    winnerPlayerName = winner;
                    return Model.Loader.hideTimeout();
                }).then(function(){
                    if(winnerPlayerName){
                        return Model.Popup.alert('Winning move!', 
                            [
                                'The winner of the round #'+ ($scope.currentGame.round + 1),
                                'is',
                                winnerPlayerName + "!"
                            ].join(' ')
                        );
                    }
                    else{
                        return Model.Popup.alert('Tie!', 'Keep trying to conquer your enemy!');
                    }
                }).then(function(){
                    $state.go($state.current, {}, {reload: true});
                }).catch(function(err){
                    Model.Loader.hide();
                    Model.Popup.alert('Error :(', err.data);
                });
            }
        };
    }
})();