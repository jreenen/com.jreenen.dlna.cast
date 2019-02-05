'use strict';
const BaseClient = require('./BaseClient.js');
const parse = require('url').parse;

class ConnectionManager extends BaseClient {
    constructor(device){
        super();
        this.service = device.getService('urn:schemas-upnp-org:service:ConnectionManager:1');
        this.controlUrl = `http://${this.service.baseurl}/${this.service.controlURL}`;
    }
}
module.exports = ConnectionManager;