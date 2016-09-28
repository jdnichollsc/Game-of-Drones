describe('rulesView', function() {    
    var addRuleButton;
    var httpBackendMock = require('./mocked-backend.js');

    beforeAll(function() {
        
        httpBackendMock.run(browser);
        
        browser.get('/#/tab/rules');
        addRuleButton = element(by.buttonText('Add rule'));
    });

    it('should have some rules', function() {
        var moves = element.all(by.repeater('moveRule in rules.moves'));
        expect(moves.count()).toBeGreaterThan(0);
    });

    var getRandomString = function(length) {
        var string = '';
        var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        for (i = 0; i < length; i++) {
            string += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        return string;
    };

    describe('Clicking on the add rule button ', function(){ 

        it('should validate the fields, create a new rule and close the popup', function() {

            addRuleButton.click().then(function() {

                var moveRule = element(by.model('rules.currentRule.move'));
                var killsRule = element(by.model('rules.currentRule.kills'));
                var saveButton = element(by.buttonText('Save'));

                moveRule.sendKeys(getRandomString(8));
                killsRule.sendKeys(getRandomString(8));

                saveButton.click().then(function() {

                    var popup = element(by.css('.popup-container'));
                    expect(popup.isDisplayed()).toBeTruthy();
                });                
            });
        });
    });
});