'use strict';

const EventEmitter = require('events');
const http = require('http');
const parse = require('url').parse;
const Device = require('./device.js');
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ explicitArray: false });
var xmlStringParser = parser.parseString;

class DeviceDescription extends EventEmitter {
    constructor(location) {
        super();
        this.location = location;
    }

    getRootDevice() {
        return new Promise((resolve, reject) => {
            const url = parse(this.location);
            url.method = 'GET';

            let request = http.request(url, (response) => {
                let data = '';

                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('error', (err) => {
                    console.log(err);
                });

                response.on('end', () => {
                    xmlStringParser(data, (err, result) => {
                        if (err) {
                            console.log('------------------ PARSER ERROR -----------------------------');
                            console.log(`XML parser error: ${err} \r\n ${data}`);
                            console.log(`Location ${this.location}`);
                            console.log('-------------------------------------------------------------');
                            reject(err);
                        }

                        if (result.root) {
                            this.data = result.root;
                            let device = new Device(this.data.device, this.location);
                            resolve(device);
                        }
                        else {
                            console.log('--------------------- CANT FIND ---------------------------');
                            console.log(result);
                            console.log('--------------------- CANT FIND ---------------------------');
                            reject(result);
                        }
                    });
                });
            });
            request.end();
            request.on('error', err => {
                console.log(err);
            });
        });
    }

}
module.exports = DeviceDescription;