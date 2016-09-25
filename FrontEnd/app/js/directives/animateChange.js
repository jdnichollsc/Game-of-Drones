(function() {
    'use strict';

    angular
        .module('App')
        .directive('animateChange', animateChange);

    animateChange.$inject = ['$timeout'];
    function animateChange($timeout) {

        return {
            restrict: 'A',
            scope:{
                animateChange: '='
            },
            link: function(scope, element, attrs) {
                scope.$watch('animateChange', function(newValue, oldValue) {
                    if(newValue && newValue !== oldValue){
                        var $element = angular.element(element);
                        var animateClass = attrs.animateClass || "swing";
                        $element.removeClass(animateClass);
                        $timeout(function () {
                            $element.addClass(animateClass);
                        }, 50);
                    }
                }, true);
            }
        }
    }
})();