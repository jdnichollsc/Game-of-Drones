
var _getErrorMsg = function(error) {
    var message = error.message || "Server Error";
    if (error.name == 'ValidationError') {
        var firstError = error.errors[Object.keys(error.errors)[0]];
        message = firstError.message;
    }
    return message;
};

module.exports = {
    getErrorMsg: _getErrorMsg
}