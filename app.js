var serport;
var lhelper = require('./modules/llap_helper');
var serial_processor = require('./modules/serial_processor');
var serialport = require('serialport');

var incomingData = "";
var llapParser = function(emitter, buffer){
	
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

attemptConnection('/dev/ttyAMA0');


