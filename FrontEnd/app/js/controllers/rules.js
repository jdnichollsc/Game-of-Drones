(function() {
'use strict';

    angular
        .module('App')
        .controller('RulesController', RulesController);

    RulesController.$inject = ['$scope', 'Model'];
    function RulesController($scope, Model) {
        
        $scope.rules = {
            moves : [],
            currentRule: {}
        };

        var getMoves = function(){
            return Model.Move.getMoves().then(function(moves){
                $scope.rules.moves = moves;
            });
        };

        $scope.$on('$ionicView.beforeEnter', function(){
            getMoves();
        });

        $scope.closeModal = function(){
            Model.Modals.closeModal();
        };

        $scope.addRule = function(){
            $scope.rules.currentRule = {};
            Model.Modals.openModal($scope, 'templates/modals/editRule.html');
        };

        $scope.editRule = function(moveRule){
            $scope.rules.currentRule.id = moveRule.id;
            $scope.rules.currentRule.move = moveRule.move;
            $scope.rules.currentRule.kills = moveRule.kills;
            Model.Modals.openModal($scope, 'templates/modals/editRule.html');
        };

        $scope.deleteRule = function(moveRule){
            Model.Popup.confirm('Remove rule', 'Are you sure you want to remove this rule?').then(function(res){
                if(res){
                    Model.Move.remove(moveRule).then(function(){
                        getMoves();
                        Model.Popup.alert('Rule removed!', 'The rule was removed successfully');
                    });
                }
            });
        };

        $scope.saveRule = function(){
            var refreshMoves = function(){
                
            };
            Model.Loader.show();
            var promise;
            if($scope.rules.currentRule.id){
                promise = Model.Move.update($scope.rules.currentRule).then(function(){
                    refreshMoves();
                    Model.Popup.alert('Rule updated!', 'The rule was updated successfully');
                });
            }
            else{
                promise = Model.Move.add($scope.rules.currentRule).then(function(){
                    refreshMoves();
                    Model.Popup.alert('Rule added!', 'The rule was added successfully');
                });
            }

            promise.then(function(){
                getMoves();
                Model.Modals.closeModal();
            }).catch(function(err){
                Model.Popup.alert('Error :(', err.data);
            }).finally(function(){
                Model.Loader.hide();
            });
        };
    }
})();