(function() {
'use strict';

    angular
        .module('App')
        .factory('Move', Move);

    Move.$inject = ['$q', '$http', 'myConfig'];
    function Move($q, $http, myConfig) {
        
        return {
            add: function(moveRule){
                return $http.post(myConfig.backEndUrl + '/move', moveRule);
            },
            update: function(moveRule){
                return $http.put(myConfig.backEndUrl + '/move', moveRule);
            },
            remove: function(moveRule){
                return $http.delete(myConfig.backEndUrl + '/move?moveId=' + moveRule.id);
            },
            getMoves: function(){
                var deferred = $q.defer();
                $http.get(myConfig.backEndUrl + '/move').then(function(response){
                    deferred.resolve(response.data);
                }).catch(function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            compareMoves: function(moveFirstPlayer, moveSecondPlayer){
                var deferred = $q.defer();
                var urlParts = [
					'/move/compareMoves?moveFirstPlayer=',
					moveFirstPlayer,
					'&moveSecondPlayer=',
					moveSecondPlayer
				];
                $http.get(myConfig.backEndUrl + urlParts.join('')).then(function(response){                    
                    deferred.resolve(response.data);
                }).catch(function (err) {
                    deferred.reject(err.data);
                });
                return deferred.promise;
            }
        };
    }
})();