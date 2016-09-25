var mongoose = require('mongoose');

//MODELS
var Move = require('../models/move');

//DATA
var rules = require('./rules.json');
var moves = rules.moves;

/**
 * Initialize the migrations to insert the default data into database
 */
var _initialize = function(){

    Move.count({}).exec().then(function(count){
        if(!count){
            return Promise.map(moves, function(moveRule) {
                return Move.create({
                    move: moveRule.move,
                    kills: moveRule.kills
                });
            });
        }
    }).then(function() {
        console.log("The default data is successfully migrated.");
    }).catch(function(err){
        console.log(err);
    });
};

module.exports = {
    initialize : _initialize
};