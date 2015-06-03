var express = require('express');
var app = express();
var request = require('request');

app.get('/channel', function(req, res, next){
  var api_key = process.env.IH_API_KEY;

  request({
    uri: 'https://slack.com/api/channels.list',
    qs: {
      token: api_key
    }
  }, function(err, response, body){
    console.log(response);
  });

});

app.listen(4000);
