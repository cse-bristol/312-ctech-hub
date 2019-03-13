var lhelper = require('./llap_helper');
var request = require('request');

var DATASTORE_TIMESERIES_ENDPOINT = process.env.DATASTORE_TIMESERIES_ENDPOINT;

var vendor_id;
var driver_id;
var datastore_id;
var sensor_types = [];
var registered_sensors = [];
var all_registered = false;
var base_url = "http://egenie.r.cse.org.uk/";
var magic_key = "05e7d19a6d002118deef70d21ff4226e";

function saveReading(device_id,value) {
  var theurl = base_url + "sd_store/rawinput/sensor/" + device_id + "/TEMP/data/";
  var thebody = "key=" + magic_key + "&value=" + value;
  console.log(thebody);
  try{
  	request.post({
  		headers: {'content-type' : 'application/x-www-form-urlencoded'},
  		url:     theurl,
  		body:    thebody
	}, 	function(error, response, body){
  			console.log(body);
		});

  }

  catch (err) {

  	console.log(err)
  }
  
}

exports.onDataOverSerial = function(data){
		var payload = data.toString();
		console.log(payload);
		if (lhelper.isValid(payload)) {
			var message = lhelper.message(payload);
			var device_id = lhelper.deviceName(payload);
			var llap_code = message.substring(0,4);
			var sensor_value = message.substring(4);

			switch(llap_code) {
				case "TMPA":
					saveReading(device_id,sensor_value);
					break;

				case "TEMP":
					saveReading(device_id,sensor_value);
					break;

				default: 
					break;
			}
		}
			
};


