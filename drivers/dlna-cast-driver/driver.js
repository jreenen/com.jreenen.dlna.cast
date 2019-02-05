'use strict';

const Homey = require('homey');

class DLNACastDriver extends Homey.Driver {
	
	onInit() {
		this.log('MyDriver has been inited');
	}
	
	onPair(socket) {
		socket.on('list_devices', function (data, callback) {
			console.log('List devices started...');
			
			Homey.app.getDevices('urn:schemas-upnp-org:service:AVTransport:1').then(devices => {
				console.log(devices);
				callback(null, devices);
			});
		})
	}
}

module.exports = DLNACastDriver;