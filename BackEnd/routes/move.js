var express = require('express');
var router = express.Router();
var Move = require('../models/move');
var utilities = require('../services/utilities');

var validateMovement = function(newMovement){
    return Move.findOne({
        move: newMovement.kills.toLowerCase(),
        kills: newMovement.move.toLowerCase()
    }).then(function (reverse) {
        if(reverse){
            throw Error(['The rule is not allowed because', newMovement.kills, 'beats', newMovement.move].join(' '));
        }
    });
};

router.get('/', function (req, res) {
    Move.find({}).exec().then(function (moves) {
        res.status(200).send(moves);
    }).catch(function (err) {
        res.status(500).send(err);
    });
});

router.post('/', function (req, res) {
    var newMovement = req.body;
    if (newMovement && newMovement.move && newMovement.kills) {
        validateMovement(newMovement).then(function () {
            return Move.create(newMovement);
        }).then(function () {
            res.sendStatus(200);
        }).catch(function (err) {
            var errorMsg = utilities.getErrorMsg(err);
            res.status(500).send(errorMsg);
        });
    } else {
        res.status(500).send("The data is required");
    }
});

router.put('/', function (req, res) {
    var updateMovement = req.body;
    if (updateMovement && updateMovement.id && updateMovement.move && updateMovement.kills) {
        validateMovement(updateMovement).then(function () {
            return Move.findByIdAndUpdate(updateMovement.id, updateMovement, { runValidators: true }).exec();
        }).then(function () {
            res.sendStatus(200);
        }).catch(function (err) {
            var errorMsg = utilities.getErrorMsg(err);
            res.status(500).send(errorMsg);
        });
    } else {
        res.status(500).send("The data is required");
    }
});

router.delete('/', function (req, res) {
    var moveId = req.query.moveId;
    if (moveId) {
        Move.findByIdAndRemove(moveId).exec().then(function () {
            res.sendStatus(200);
        }).catch(function (err) {
            res.status(500).send(err);
        });
    } else {
        res.status(500).send("The data is required");
    }
});

router.get('/compareMoves', function (req, res) {
    var moveFirstPlayer = req.query.moveFirstPlayer;
    var moveSecondPlayer = req.query.moveSecondPlayer;

    if (!moveFirstPlayer) {
        res.status(500).send("The first player's movement is required");
    }
    else if (!moveSecondPlayer) {
        res.status(500).send("The second player's movement is required");
    }
    else{
        Move.findOne({
            $or: [
                { move: moveFirstPlayer, kills: moveSecondPlayer },
                { move: moveSecondPlayer, kills: moveFirstPlayer },
            ]
        }).then(function(winningMoveRule){
            res.status(200).send(winningMoveRule ? winningMoveRule.move : '');
        }).catch(function (err) {
            res.status(500).send(err);
        });
    }
});

module.exports = router;