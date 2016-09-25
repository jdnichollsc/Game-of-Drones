(function() {
    'use strict';

    angular
        .module('App')
    .constant('myConfig', {
        localGameData: 'myLocalData',
        backEndUrl: 'http://localhost:3000'
    });
})();