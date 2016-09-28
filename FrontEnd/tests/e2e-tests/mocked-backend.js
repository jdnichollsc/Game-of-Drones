exports.run = function(browser) {
    browser.addMockModule('httpMocker', function() {
        angular.module('httpMocker', ['App', 'ngMockE2E'])
        .run(function($httpBackend, myConfig) {
            
            $httpBackend.whenGET(myConfig.backEndUrl + '/move')
            .respond([
                { "move": "paper", "kills": "rock"},
                { "move": "rock", "kills": "scissors"},
                { "move": "scissors", "kills": "paper"}
            ]);

            $httpBackend.whenPOST(myConfig.backEndUrl + '/move').respond(200);
            $httpBackend.whenPUT(myConfig.backEndUrl + '/move').respond(200);
            $httpBackend.whenDELETE(myConfig.backEndUrl + '/move').respond(200);

            $httpBackend.whenGET(/.*/).passThrough();
        });
    });
};