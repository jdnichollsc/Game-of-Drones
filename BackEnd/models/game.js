var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require("bluebird");
mongoose.Promise = Promise;

var gameSchema = new Schema({
    firstPlayer: { 
        type: String, 
        trim: true, 
        required: [true, "The first player's name is required"]
    },
    secondPlayer: { 
        type: String, 
        trim: true, 
        required: [true, "The second player's name is required"] 
    },
    score: [
        {
            round: { 
                type: Number,
                required: [true, 'The number of the round is required'] 
            },
            winner: { 
                type: String, 
                trim: true
            },
            moveFirstPlayer: { 
                type: String, 
                trim: true, 
                required: [true, 'Movement of the first player is required']
            },
            moveSecondPlayer: { 
                type: String, 
                trim: true, 
                required: [true, 'Movement of the second player is required']
            }
        }
    ],
    winner: { 
        type: String, 
        trim: true, 
        required: [true, "The winning player's name is required"] 
    },
    createdAt: Date,
    updatedAt: Date
},
{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

gameSchema.virtual('id').get(function () {
    return this._id;
});

gameSchema.pre('save', function (next) {    
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }
    next();
});

module.exports = mongoose.model('Game', gameSchema);