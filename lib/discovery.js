'use strict';

const EventEmitter = require('events');
const dgram = require('dgram');
const httpHeaders = require('http-headers')
const os = require('os');
const DeviceDescription = require('../../lib/devicedescription.js')

class Discovery extends EventEmitter {
    constructor() {
        super();
        this.MULTICAST_ADDR = '239.255.255.250';
        this.MULTICAST_PORT = 1900;
        this.devices = {};
        this.locations = {};

        this.on('error', (err) => {
            console.log(err)
        });

        this.initializeSocket();
    }

    initializeSocket() {
        this.socket = dgram.createSocket('udp4');

        this.socket.on('listening', () => {
            this.socket.setBroadcast(true);
        });

        this.socket.on('message', (msg) => {
            let method = this._getMethod(msg.toString());
            switch (method) {
                case 'notify':
                    this._notify(msg);
                    break;
                case 'http/1.1':
                    // Harmony hub will respond here 
                    this._notify(msg);
                    break;
                case 'm-search':
                    break;
                default:
                    console.log(`RETREIVED unknown method: ${method}`);
            }
        });

        this.socket.bind(1900, () => {
            this.socket.addMembership(this.MULTICAST_ADDR);
        });
    }
    
    search(serviceType) {
        return new Promise((resolve, reject) => {
            var data = 'M-SEARCH * HTTP/1.1\r\n' +
                'Host: ' + this.MULTICAST_ADDR + ':' + this.MULTICAST_PORT + '\r\n' +
                'ST: ' + serviceType + '\r\n' +
                'MAN: \"ssdp:discover\"\r\n' +
                'MX: 4\r\n' +
                '\r\n';

            var search = new Buffer(data, 'ascii');

            try {
                this.socket.send(search, 0, search.length, this.MULTICAST_PORT, this.MULTICAST_ADDR);
            }
            catch (ex) {
            }

            resolve();
        });
    }

    _notify(msg) {
        let message = httpHeaders(msg);

        if(message.headers.nts === 'ssdp:byebye'){
            console.log(`Bye bye!! ${message.headers.host} see you next time!`);
            return;
        }

        let existingLocation = this.locations[message.headers.location];
        if (!existingLocation) {
            this.locations[message.headers.location] = message.headers.location;
            let deviceDescription = new DeviceDescription(message.headers.location);

            deviceDescription.getRootDevice().then(device => {
                let existingDevice = this.devices[device.UDN];
                if (existingDevice) {
                    console.log(`Device ${message.headers.usn} is already existing.`);
                }
                else {
                    this.devices[device.UDN] = device;
                    this.emit('device_discovered', device);
                    console.log(device);
                }
            })

        }

        // console.log(this.locations);

        // console.log(message.headers['cache-control']);
        // if (!message.headers.nt) {
        //     console.log(message);
        // }
        // else{
        //     console.log(message.headers.nt);
        // }
    }

    _getMethod(msg) {
        var lines = msg.split("\r\n")
            , type = lines.shift().split(' ') // command, such as "NOTIFY * HTTP/1.1"
            , method = (type[0] || '').toLowerCase()

        return method
    }

    _getLocalIp() {
        var ifaces = os.networkInterfaces();
        let address = '0.0.0.0';

        Object.keys(ifaces).forEach(function (ifname) {
            ifaces[ifname].forEach(function (iface) {
                if (iface.family === 'IPv4' && iface.internal === false) {
                    address = iface.address;
                }
            });
        });

        return address;
    }
}
module.exports = Discovery;