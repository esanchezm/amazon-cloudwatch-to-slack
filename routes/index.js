/**
 * Recieve a POST from Amazon SNS
 */
exports.index = function(req, res){
    var request = require('request');

    var sns = JSON.parse(req.text);
    console.log(req.text);

    // Is this a subscribe message?
    if (sns.Type == 'SubscriptionConfirmation') {
        request(sns.SubscribeURL, function (err, result, body) {
            if (err || body.match(/Error/)) {
                console.log("Error subscribing to Amazon SNS Topic", body);
                return res.send('Error', 500);
            }

            console.log("Subscribed to Amazon SNS Topic: " + sns.TopicArn);
            res.send('Ok');
        });
    } else if (sns.Type == 'Notification') {
        var message = '';
        if (sns.Subject === undefined) {
            message = JSON.stringify(sns.Message);
        } else {
            message = sns.Subject;
        }

        var slackUrl =
            'https://' +
            process.env.SLACK_COMPANY_NAME +
            '.slack.com/services/hooks/incoming-webhook?token=' +
            process.env.SLACK_TOKEN;

        request(
            {
                url: slackUrl,
                method: 'POST',
                form: {
                    "payload": {
                        "text": body,
                        "subtype": "bot_message",
                        "username": process.env.SLACK_USERNAME
                    }
                }
            },
            function (err, result, body) {
                if (err) {
                    console.log("Error sending message to HipChat", err, slackUrl, body);
                    return res.send('Error', 500);
                }

                console.log("Sent message to HipChat", slackUrl);

                res.send('Ok');
            }
        );
    }
};
