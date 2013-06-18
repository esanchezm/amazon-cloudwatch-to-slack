/**
 * Recieve a POST from Amazon SNS
 */
exports.index = function(req, res){
    var request = require('request');

    var sns = JSON.parse(req.text);
    console.log(sns);

    // Is this a subscribe message?
    if (sns.SubscribeURL !== undefined) {
        request(sns.SubscribeURL, function (err, result, body) {
            if (err || body.match(/Error/)) {
                console.log("Error subscribing to Amazon SNS Topic", body);
                return res.send('Error', 500);
            }

            console.log("Subscribed to Amazon SNS Topic: " + sns.TopicArn);
            res.send('Ok');
        });
    } else {
        var hipchatUrl = 'https://api.hipchat.com/v1/rooms/message?' +
                    'auth_token=' + process.env.HIPCHAT_API_TOKEN + '&' +
                    'room_id=' + process.env.HIPCHAT_ROOM_ID + '&' +
                    'from=' + process.env.HIPCHAT_FROM_NAME + '&' +
                    'message=' + message.Subject + ' - ' + message.Message + '&' +
                    'notify=1&' +
                    'format=json';

        request(hipchatUrl, function (err, result, body) {
            if (err) {
                console.log("Error sending message to HipChat", err, hipChatUrl, body);
                return res.send('Error', 500);
            }

            console.log("Sent message to HipChat", hipChatUrl);

            res.send('Ok');
        });
    }
};
