process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'
var request = require('request');
var options = {
    'method': 'GET',
    'url': 'https://10.42.57.37:9440/PrismGateway/services/rest/v2.0/alerts/?alert_type_uuid=A1069',
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': 'Basic aHBvYzpocDBjVXMzcg=='    
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
  // alerts = JSON.stringify(response.body)
  alerts = JSON.parse(response.body)
  //  for (var i = 0)
//    alertentities = alerts.entities;
//    for (var i = 0; i < alertentities.length; i++) {
//      console.log(alertentities[i].message)
//    }
console.log(alerts)
  
  });