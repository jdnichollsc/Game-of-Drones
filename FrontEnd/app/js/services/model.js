(function () {
	'use strict';

	angular
		.module('App')
		.factory('Model', Model);

	Model.$inject = ['Game', 'Move', 'Loader', 'Popup', 'Modals'];
	function Model(Game, Move, Loader, Popup, Modals) {

		return {
			Game: Game,
			Move: Move,
			Loader: Loader,
			Popup: Popup,
			Modals: Modals
		};
	}
})();