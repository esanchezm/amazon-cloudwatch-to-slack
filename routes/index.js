/**
 * Recieve a POST from Amazon SNS
 */
exports.index = function(req, res){
    console.log(req.body);
    res.send('ok');
};
