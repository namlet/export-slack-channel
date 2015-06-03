var express = require('express');
var app = express();
var request = require('request');

app.get('/channel/:channel', function(req, res, next){
  var api_key = process.env.IH_API_KEY;

  request({
    uri: 'https://slack.com/api/channels.history',
    qs: {
      token: api_key,
      channel: req.params.channel,
      count: 100,
      pretty: 1
    }
  }, function(err, response, body){
    var payload = JSON.parse(body);

    var result = payload.messages.map(function(obj){
      return obj.text;
    });
    res.send(result.join('<br><br>'));
  });

});

app.listen(4000);
