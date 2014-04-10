Amazon CloudWatch to Slack
============================

Relay alerts from Amazon CloudWatch to a Slack room.

This code is 100% based on [Amazon CloudWatch to Hipchat](https://github.com/blackline/amazon-cloudwatch-to-hipchat)
and it could not be possible without it.

Setup
=====

Requirements:
* A [Heroku](http://heroku.com) account
* A [Slack](http://slac.com) Account
* A Slac [Incoming Webook Token](https://slack.com/services/new/incoming-webhook) configured to post messages to the room you want
* An Amazon AWS account with [Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) and [Amazon SNS](https://aws.amazon.com/sns/) setup and enabled

Deploy your application to to Heroku:
```bash
cd /path/to/wherever
git clone https://github.com/esanchezm/amazon-cloudwatch-to-slack.git

cd amazon-cloudwatch-to-slack
heroku apps:create
heroku config:set SLACK_COMPANY_NAME=yourcompany \
                  SLACK_TOKEN=12345 \
                  SLACK_USERNAME="AWS CloudWatch"
git push heroku master
```

Setup Amazon SNS:
* Create a new Topic, or select an existing Topic
* Add a New Subscription to the topic
* Select HTTPS, and paste in your HTTPS URL to your Heroku application

Setup Amazon CloudWatch:
* Create or modify an alert
* Select the "Send Notification" action
* Select the SNS topic you created / updated in the previous step
