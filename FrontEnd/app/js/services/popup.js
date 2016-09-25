(function() {
'use strict';

    angular
        .module('App')
        .factory('Popup', Popup);

    Popup.$inject = ['$ionicPopup'];
    function Popup($ionicPopup) {
        
        return {
            alert : function(title, description, okText, animation){
                return $ionicPopup.alert({
					title: title || 'Alert',
					template: description,
                    okText: okText || 'OK',
					cssClass: 'animated ' + (animation || 'bounceIn')
				});
            },
            confirm: function(title, description, animation){
                return $ionicPopup.confirm({
                    title: title,
                    template: description,
					cssClass: 'animated ' + (animation || 'bounceIn')
                });
            }
        };
    }
})();