var express = require('express');
var app = express();
var request = require('request');

var api_key = process.env.IH_API_KEY;
var slack_team = process.env.IH_SLACK_TEAM;
var channels = {};
var users = {};

// Get channels
request({
  uri: 'https://slack.com/api/channels.list',
  qs: {
    token: api_key,
    pretty: 1
  }
}, function(err, response, body){
  var payload = JSON.parse(body);

  payload.channels.map(function(obj){
    channels[obj.id] = obj.name;
  });
});

// Get users
request({
  uri: 'https://slack.com/api/users.list',
  qs: {
    token: api_key,
    pretty: 1
  }
}, function(err, response, body){
  var payload = JSON.parse(body);

  payload.members.map(function(obj){
    users[obj.id] = obj.name;
  });
});


app.get('/channel/:channel', function(req, res, next){

  request({
    uri: 'https://slack.com/api/channels.history',
    qs: {
      token: api_key,
      channel: req.params.channel,
      count: 200,
      pretty: 1
    }
  }, function(err, response, body){
    var payload = JSON.parse(body);

    var result = payload.messages.filter(function(obj){
      // If user doesn't exist in map, it's slackbot (or some bot) - remove these entries
      return users[obj.user];
    }).map(function(obj){
      var parsed_text = obj.text.replace(/<#([^>]+)>/g, function(m,sub1) {
        return "<a href='https://"+slack_team+".slack.com/messages/"+channels[sub1]+"/'>#"+channels[sub1]+"</a>";
      });
      parsed_text = users[obj.user] + ': ' + parsed_text.replace(/<\@[^>]+>/g, '');
      return parsed_text;
    });
    res.send(result.join('|'));
  });

});

app.listen(4000);
