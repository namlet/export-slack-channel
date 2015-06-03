var express = require('express');
var app = express();
var request = require('request');

app.get('/channel/:channel', function(req, res, next){
  var api_key = process.env.IH_API_KEY;
  var channels = {};

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

      var result = payload.messages.map(function(obj){
        var parsed_text = obj.text.replace(/<#([^>]+)>/g, function(m,sub1){ return "<a href='https://invisionheart.slack.com/messages/"+channels[sub1]+"/'>#"+channels[sub1]+"</a>"; });
        return parsed_text;
      });
      res.send(result.join('<br><br>'));
    });

  });

});

app.listen(4000);
