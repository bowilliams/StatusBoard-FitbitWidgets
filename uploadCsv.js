var _oauth = require('oauth').OAuth;
var fs = require('fs');

var FITBIT_CONSUMER_KEY = "ea158702d2e94420b65e20c5283a0c05"
var FITBIT_CONSUMER_SECRET = "304a23dedacd4eb18c737fc6c3fe1f3e";
var FITBIT_TOKEN = "7274ae89f942f499f091d7a7753d14fd";
var FITBIT_TOKEN_SECRET = "1daf91825b23bec324e1ec109b518c10";
var FITBIT_UID = "25HRPM";

function pad(str) {
  return str.length > 1 ? str : "0" + str;
}

function postWeight(body) {
  var post_content_type = "application/json";
  // post record to FITBIT_UID
  oauth.post(
    'https://api.fitbit.com//1/user/-/body/log/weight.json',
    FITBIT_TOKEN, //test user token
    FITBIT_TOKEN_SECRET, //test user secret
    body,
    post_content_type,            
    function (e, data, res){
      if (e) console.error(e);        
      console.log(require('util').inspect(data));     
    }
  );
}

// auth
var oauth = new _oauth(
  'https://api.fitbit.com/oauth/request_token',
  'https://api.fitbit.com/oauth/access_token',
  FITBIT_CONSUMER_KEY,
  FITBIT_CONSUMER_SECRET,
  '1.0',
  null,
  'HMAC-SHA1',
  null,
  {'Accept-Language':'en_US'}
);

// loop through CSV data

fs.readFile('fitnessLog.csv', 'utf8', function(err, data) {
  var lines = data.split('\r\n');
  //console.log(lines);
  // skip header line
  for (var i = 1; i < lines.length; i++)
  {
    var rowData = lines[i].split(',');
    if (rowData.length > 1) {
      var date = rowData[0].trim().replace(/"/g,'');
      date = date.split('/');
      date = date[2] + '-' + pad(date[0]) + '-' + pad(date[1]);
      postWeight({'weight':rowData[1].trim(),
                      'date':date});
    }
    //console.log(lines[i].split(','));
  }
});

// var post_body = {'weight':'238','date':'2013-01-28'};
// var post_content_type = "application/json";
// // post record to FITBIT_UID
// oauth.post(
//   'https://api.fitbit.com//1/user/-/body/log/weight.json',
//   FITBIT_TOKEN, //test user token
//   FITBIT_TOKEN_SECRET, //test user secret
//   post_body,
//   post_content_type,            
//   function (e, data, res){
//     if (e) console.error(e);        
//     console.log(require('util').inspect(data));     
//   }
// );