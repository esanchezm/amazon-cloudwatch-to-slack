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
        var payload = {
            "subtype": "bot_message",
            "text": ""
        };
        if (sns.Subject === undefined) {
            message = JSON.stringify(sns.Message);
        } else {
            message = sns.Subject;
        }

        var attachments;
        var json_message = JSON.parse(sns.Message);
        if (json_message.AlarmName) {
            attachments = [
                {
                    "fallback": message,
                    "text" : message,
                    "color": json_message.NewStateValue == "ALARM" ? "warning" : "good",
                    "fields": [
                        {
                            "title": "Alarm",
                            "value": json_message.AlarmName,
                            "short": true
                        },
                        {
                            "title": "Status",
                            "value": json_message.NewStateValue,
                            "short": true
                        },
                        {
                            "title": "Reason",
                            "value": json_message.NewStateReason,
                            "short": false
                        }
                    ]
                }
            ];
        } else if (json.notificationType == "Bounce") {
            message = "SES email bounced";
            var bounce = json_message.bounce;
            var recipients = [];
            bounce.bouncedRecipients.forEach(function(recipient) {
                recipients.push(recipient.emailAddress);
            });

            attachments = [
                {
                    "fallback": message,
                    "text" : message,
                    "color": "warning",
                    "fields": [
                        {
                            "title": "Recipients",
                            "value": recipients.join(", "),
                            "short": true
                        },
                        {
                            "title": "Sender",
                            "value": bounce.source,
                            "short": true
                        },
                        {
                            "title": "Bounce type",
                            "value": bounce.bounceType + " - " + bounce.bounceSubType,
                            "short": false
                        }
                    ]
                }
            ];
        } else if (json.notificationType == "Complaint") {
            message = "SES email complaint";
            var complaint = json_message.complaint;
            var recipients = [];
            complaint.complainedRecipients.forEach(function(recipient) {
                recipients.push(recipient.emailAddress);
            });

            attachments = [
                {
                    "fallback": message,
                    "text" : message,
                    "color": "warning",
                    "fields": [
                        {
                            "title": "Recipients",
                            "value": recipients.join(", "),
                            "short": true
                        },
                        {
                            "title": "Sender",
                            "value": complaint.source,
                            "short": true
                        },
                        {
                            "title": "Bounce type",
                            "value": complaint.complaintType + " - " + complaint.bounceSubType,
                            "short": false
                        }
                    ]
                }
            ];

            if (complaint.complaintFeedbackType) {
                attatchments[0]["fields"].push(
                    {
                        "title": "Complain type",
                        "value": complaint.complaintFeedbackType,
                        "short": true
                    }
                );
            }
        } else if (json.notificationType == "Delivery") {
            message = "SES email delivery";
            var mail = json_message.mail;
            attachments = [
                {
                    "fallback": message,
                    "text" : message,
                    "color": "good",
                    "fields": [
                        {
                            "title": "Recipients",
                            "value": mail.destination.join(", "),
                            "short": true
                        },
                        {
                            "title": "Sender",
                            "value": mail.source,
                            "short": true
                        },
                        {
                            "title": "Result",
                            "value": json_message.delivery.smtpResponse,
                            "short": false
                        }
                    ]
                }
            ];
        }

        var slackUrl =
            'https://' +
            process.env.SLACK_COMPANY_NAME +
            '.slack.com/services/hooks/incoming-webhook?token=' +
            process.env.SLACK_TOKEN;

        if (typeof process.env.SLACK_USERNAME != "undefined") {
            payload["username"] = process.env.SLACK_USERNAME;
        }

        if (typeof process.env.SLACK_ICON_URL != "undefined") {
            payload["icon_url"] = process.env.SLACK_ICON_URL;
        }

        if (typeof process.env.SLACK_CHANNEL != "undefined") {
            payload["channel"] = process.env.SLACK_CHANNEL;
        }

        if (attachments) {
            payload["attachments"] = attachments;
        }
        payload['text'] = message;

        console.log("Sending message to Slack", message, slackUrl);
        request.post(
            slackUrl,
            {
                form: {
                    "payload": JSON.stringify(payload)
                }
            },
            function (err, result, body) {
                if (err) {
                    console.log("Error sending message to Slack", err, slackUrl, body);
                    return res.send('Error', 500);
                }

                console.log("Sent message to Slack", slackUrl);

                res.send('Ok');
            }
        );
    }
};
