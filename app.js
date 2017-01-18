var serport;
var lhelper = require('./modules/llap_helper');
var serial_processor = require('./modules/serial_processor');
var serialport = require('serialport');
var exec = require('child_process').exec;

var sensor_types = ["temperature", "humidity", "tilt", "button1", "button2", "button3", "button4", "button5", "battery", "light"];
var registered_sensor_types = [];

var databox_directory = require('./utils/databox_directory');

exports.getPath = function()
{
	if(serport) {
		return serport.path;
	} else {
		return "not connected";
	}
}

var detectSerialOnMac = function()
{
	var port;
	console.log('* attempting to detect a serial port on mac osx *');
	exec('ls /dev/tty.*', function(error, stdout, stderr){
		if (stdout){
			console.log("*got list of ports*");
			var ports = stdout.split('\n');
			for (var i = ports.length - 1; i >= 0; i--){
				console.log(ports[i]);
				if (ports[i].search('usbmodem') != -1 || ports[i].search('usbserial') != -1 || ports[i].search('ACM0') != -1) 
					port = ports[i];
			}
		}
		if (port){
			attemptConnection(port);
		}	else{
			console.log('failed to connect to serial port');
		}
	});
}

var detectSerialOnDatabox = function()
{
	/*var port;
	console.log('* attempting to connect to a serial port on data box*');
	serialport.list(function (e, ports) {
		ports.forEach(function(obj) {
			if (obj.hasOwnProperty('pnpId')){
		// CC1111 captures the URF stick //
				if (obj.pnpId.search('CC1111') != -1) {
					attemptConnection(obj.comName);
				}
			}
		});
	});*/
	attemptConnection('/dev/ttyACM0');
}

var llapParser = function(emitter, buffer){
	var incomingData = "";
	incomingData += buffer.toString();
	incomingData = incomingData.replace(/^[^]*?a/,'a');
	while (incomingData.length >= 12) {
		emitter.emit('data',incomingData.substr(0,12));
		incomingData = incomingData.substr(12).replace(/^[^]*?a/,'a');
	}
}

var attemptConnection = function(port)
{
	console.log('* attempting to connect to serial at :', port, ' *');
	serport = new serialport.SerialPort(port, { baudrate: 9600, parser: llapParser });
	serport.on("open", function () {
		console.log('* connection to a serial port successful ! *');
		serport.on('data', function(data){
			serial_processor.onDataOverSerial(data);
		});
	});
}



detectSerialOnDatabox();
var loop = function() {console.log("Looping")}
//setInterval(loop, 10000)


