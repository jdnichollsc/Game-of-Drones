(function() {
'use strict';

    angular
        .module('App')
        .factory('Loader', Loader);

    Loader.$inject = ['$ionicLoading', '$q'];
    function Loader($ionicLoading, $q) {
        
        return {
            show: function(){
                $ionicLoading.show({
                    template: '<ion-spinner class="smallLoading spinner-energized" icon="lines"></ion-spinner>',
                    hideOnStageChange: true
                });
            },
            hide: function(){
                $ionicLoading.hide();
            },
            hideTimeout: function(timeout){
                var deferred = $q.defer();
                setTimeout(function() {
                    $ionicLoading.hide();
                    deferred.resolve();
                }, timeout || 500);
                return deferred.promise;
            }
        }
    }
})();