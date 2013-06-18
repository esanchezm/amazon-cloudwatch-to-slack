/**
 * Recieve a POST from Amazon SNS
 */
exports.index = function(req, res){
    console.log("Got Amazon SNS Message: " + req.body);
};
