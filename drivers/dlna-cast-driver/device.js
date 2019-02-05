'use strict';

const Homey = require('homey');
const AVTransport = require('../../lib/serviceclient/AVTransport.js');

class DLNACastDevice extends Homey.Device {

	onInit() {
		this._deviceData = this.getData();
		this.log(`Device ${this._deviceData.id} initializing`);

		if (!Homey.app.getDevice(this._deviceData.id, this._deviceData.deviceType)) {
			this.setUnavailable(`Device is not available (yet)`);
		}
		
		Homey.app.on(this._deviceData.id + this._deviceData.deviceType, () => {
			this.setAvailable();
			
			let device = Homey.app.getDevice(this._deviceData.id, this._deviceData.deviceType);
			let transport = new AVTransport(device);
			this.registerCapabilityListener('speaker_playing',async (playing) => {
				if(playing){
					transport.play();
				}
				else{
					transport.pause();
				}
			});
		})
	}
}

module.exports = DLNACastDevice;