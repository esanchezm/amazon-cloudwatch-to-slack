Amazon CloudWatch to HipChat
============================

Relay alerts from Amazon CloudWatch to a HipChat room

Setup
=====

Requirements:
* A [Heroku](http://heroku.com) account
* A [HipChat](http://hipchat.com) Account
* A HipChat [Notification Token](https://www.hipchat.com/docs/api/auth)
* The HipChat [Room ID](https://hipchat.com/admin/rooms) where you want to send alerts
* An Amazon AWS account with [Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) and [Amazon SNS](https://aws.amazon.com/sns/) setup and enabled

Deploy your application to to Heroku:
```bash
cd /path/to/wherever
git clone https://github.com/blackline/amazon-cloudwatch-to-hipchat.git

cd amazon-cloudwatch-to-hipchat
heroku apps:create
heroku config:set HIPCHAT_API_TOKEN=secret \
                  HIPCHAT_ROOM_ID=12345 \
                  HIPCHAT_FROM_NAME="AWS CloudWatch"
# Note that your HIPCHAT_FROM_NAME must be no more than 15 characters long: https://www.hipchat.com/docs/api/method/rooms/message
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
