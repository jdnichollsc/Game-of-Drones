describe('Clicking on the start button ', function(){  
    var firstPlayerName, secondPlayerName, startButton;

    beforeEach(function() {
        browser.get('/#/tab/home');
        firstPlayerName = element(by.model('home.firstPlayerName'));
        secondPlayerName = element(by.model('home.secondPlayerName'));
        startButton = element(by.buttonText('Start'));
    });

    it('should validate the fields and redirect to the Game view', function() {
        firstPlayerName.clear().sendKeys('Valentina');
        secondPlayerName.clear().sendKeys('Juan David');

        startButton.click().then(function() {
            expect(browser.getLocationAbsUrl()).toMatch('/app/game');

            var moves = element.all(by.repeater('move in currentGame.moves'));
            expect(moves.count()).toBeGreaterThan(0);
        });
    });

    it('should display a popup for an unsuccessful validation of required fields', function() {
        firstPlayerName.clear().sendKeys('Valentina');
        secondPlayerName.clear().sendKeys('Valentina');

        startButton.click().then(function() {
            expect(browser.getLocationAbsUrl()).toMatch('/tab/home');

            var popup = element(by.css('.popup-container'));
            expect(popup.isDisplayed()).toBeTruthy();
        });
    });
});