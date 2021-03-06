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

function saveReading(device_id,llap_code, value) {
  var theurl = base_url + "sd_store/rawinput/sensor/" + device_id + "/" + llap_code + "/data/";
  var thebody = "key=" + magic_key + "&value=" + value;
  try{
    request.post({
      headers: {'content-type' : 'application/x-www-form-urlencoded'},
      url:     theurl,
      body:    thebody
    }, 	function(error, response, body){
      console.log("Response for", device_id, llap_code, value, "=", body);
    });

  }

  catch (err) {
    console.log("Error posting", device_id, value);
    console.log(err);
  }
  
}

exports.onDataOverSerial = function(data){
  var payload = data.toString();
  console.log("Serial received: ", payload);
  if (lhelper.isValid(payload)) {
    var message = lhelper.message(payload);
    var device_id = lhelper.deviceName(payload);
    var llap_code = message.substring(0,4);
    var sensor_value = message.substring(4);
    console.log("Message:", message);
    console.log("Device ID:", device_id);
    console.log("LLAP code:", llap_code);
    console.log("Sensor value:", sensor_value);
    saveReading(device_id, llap_code, sensor_value);
  } else {
    console.log("  Payload invalid");
  }
  
};


