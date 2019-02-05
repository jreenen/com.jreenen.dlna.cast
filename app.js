'use strict';

const Homey = require('homey');
const Discovery = require('../../lib/discovery.js');
const MediaRenderer = require('../../lib/mediarenderer.js');

class App extends Homey.App {

	onInit() {
		this.log(`${Homey.manifest.id} running...`);
		this.devices = {};

		this.registerActions();

		let discovery = new Discovery();

		for (var i = 0; i < 30; i++) {
			setTimeout(function () {
				for (var i = 0; i < 5; i++) {
					discovery.search('ssdp:all');
					// discovery.search('urn:myharmony-com:device:harmony:1');
				}
			}, Math.random() * 1000);
		}

		discovery.on('device_discovered', device => {
			this.devices[device.UDN + device.deviceType] = device;
			this.emit(device.UDN + device.deviceType);
		});
	}

	registerActions() {
		let castMediaAction = new Homey.FlowCardAction('cast_media').register();
		castMediaAction
		.registerRunListener((args, state) => {
			let cast_device = args.cast_device;
			let cast_device_data = cast_device.getData();
			let mediaUrl = args.media_url;

			console.log(`Casting ${mediaUrl}`);

			let mediaRenderer = new MediaRenderer(cast_device_data);
			mediaRenderer.autoPlay(mediaUrl);
		});

	}

	getDevice(deviceId, deviceType){
		return this.devices[deviceId + deviceType];
	}

	getDevices(serviceType) {
		var foundDevices = [];
		var discoveredDevices = this.devices;
		return new Promise((resolve, reject) => {
			Object.keys(this.devices).forEach(function (deviceId) {
				let device = discoveredDevices[deviceId];
				console.log(device);

				if (device.getService(serviceType)) {
					var foundDevice = {
						name: device.friendlyName,
						data: {
							"id": device.UDN,
							"deviceType": device.deviceType,
							"iconlist": device.iconList
						}
					};
					foundDevices.push(foundDevice);
				}
			});

			resolve(foundDevices);
		});
	}
}

module.exports = App;