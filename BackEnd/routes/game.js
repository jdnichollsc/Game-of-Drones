var express = require('express');
var router = express.Router();
var Game = require('../models/game');
var utilities = require('../services/utilities');

router.get('/', function (req, res) {
  Game.find({}).exec().then(function (games) {
    res.status(200).send(games);
  }).catch(function (err) {
    res.status(500).send(err);
  });
});

router.post('/', function (req, res) {
  var newGame = req.body;
  if (newGame) {
    Game.create(newGame).then(function () {
      res.sendStatus(200);
    }).catch(function (err) {
      var errorMsg = utilities.getErrorMsg(err);
      res.status(500).send(errorMsg);
    });
  } else {
    res.status(500).send("The data is required");
  }
});

module.exports = router;