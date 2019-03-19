'use strict';
const BaseClient = require('./BaseClient.js');
const parse = require('url').parse;

class ConnectionManager extends BaseClient {
    constructor(device) {
        super();
        this.service = device.getService('urn:schemas-upnp-org:service:ConnectionManager:1');
        this.controlUrl = `http://${this.service.baseurl}/${this.service.controlURL}`;
    }

    prepareForConnection(contentType) {
        let protocolInfo = `http-get:*:${contentType}:*`

        let envelope =
            `<?xml version="1.0"?>
            <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
            <s:Body>
                <u:PrepareForConnection xmlns:u="urn:schemas-upnp-org:service:ConnectionManager:1">
                    <RemoteProtocolInfo>${protocolInfo}</RemoteProtocolInfo>
                    <PeerConnectionManager></PeerConnectionManager>
                    <PeerConnectionID>-1</PeerConnectionID>
                    <Direction>Input</Direction>
                </u:PrepareForConnection>
            </s:Body>
            </s:Envelope>`;

        let requestOptions = parse(this.controlUrl);
        requestOptions.method = 'POST';
        requestOptions.headers = {
            'Content-Type': 'text/xml; charset="utf-8"',
            'Content-Length': Buffer.byteLength(envelope, 'utf8'),
            'Soapaction': '"urn:schemas-upnp-org:service:ConnectionManager:1#PrepareForConnection"',
            'Accept-Charset': 'utf-8'
        };

        return this.SendRequest(requestOptions, envelope);
    }
}
module.exports = ConnectionManager;