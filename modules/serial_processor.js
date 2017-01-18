var lhelper = require('./llap_helper');
var request = require('request');
var databox_directory = require('../utils/databox_directory.js');

var DATASTORE_TIMESERIES_ENDPOINT = process.env.DATASTORE_TIMESERIES_ENDPOINT;

var vendor_id;
var driver_id;
var datastore_id;
var sensor_types = [];
var registered_sensors = [];
var all_registered = false;

function saveReading(llap_code,value) {
  var theurl = "https://e-genie.co.uk/sd_store/rawinput/sensor/" + llap_code + "/TEMP/data/";
  var thebody = "key=05e7d19a6d002118deef70d21ff4226e&value=" + value;
  console.log(thebody);

  request.post({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     theurl,
  body:    thebody
}, function(error, response, body){
  console.log(body);
});
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
					break
				default: 
					break;
			}
		}
			
};


