var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require("bluebird");
mongoose.Promise = Promise;

var moveSchema = new Schema({
    move: { 
        type: String, 
        trim: true, 
        required: [true, 'The name of the movement is required'],
        lowercase: true
    },
    kills: { 
        type: String, 
        trim: true, 
        required: [true, 'The name of the movement is required'],
        lowercase: true
    },
    createdAt: Date,
    updatedAt: Date
},
{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

moveSchema.virtual('id').get(function () {
    return this._id;
});

moveSchema.pre('save', function (next) {    
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }
    next();
});

moveSchema.index({ move: 1, kills: 1 }, { unique: true });

module.exports = mongoose.model('Move', moveSchema);