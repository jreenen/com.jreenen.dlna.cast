'use strict';
const parse = require('url').parse;
const BaseClient = require('./BaseClient.js');

class AVTransport extends BaseClient {
    constructor(device) {
        super();
        this.service = device.getService('urn:schemas-upnp-org:service:AVTransport:1');
        let controlPath = (this.service.controlURL[0] === '/') ? this.service.controlURL.substr(1) : this.service.controlURL;
        this.controlUrl = `http://${this.service.baseurl}/${controlPath}`;
    }

    setAVTransportURI(fileUrl, metaData) {
        let envelope =
            `<?xml version="1.0"?>
            <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
            <s:Body>
                <u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1">
                    <InstanceID>0</InstanceID>
                    <CurrentURI>${fileUrl}</CurrentURI>
                    <CurrentURIMetaData>${String(metaData)}</CurrentURIMetaData>
                </u:SetAVTransportURI>
            </s:Body>
            </s:Envelope>`;

        let requestOptions = parse(this.controlUrl);
        requestOptions.method = 'POST';
        requestOptions.headers = {
            'Content-Type': 'text/xml; charset="utf-8"',
            'Content-Length': Buffer.byteLength(envelope, 'utf8'),
            'Soapaction': '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
            'Accept-Charset': 'utf-8'
        };

        return this.SendRequest(requestOptions, envelope);
    }

    play() {
        let envelope =
            `<?xml version="1.0"?>
            <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
            <s:Body>
                <u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1">
                    <InstanceID>0</InstanceID>
                    <Speed>1</Speed>
                </u:Play>
            </s:Body>
            </s:Envelope>`;

        let requestOptions = parse(this.controlUrl);
        requestOptions.method = 'POST';
        requestOptions.headers = {
            'Content-Type': 'text/xml; charset="utf-8"',
            'Content-Length': Buffer.byteLength(envelope, 'utf8'),
            'Soapaction': '"urn:schemas-upnp-org:service:AVTransport:1#Play"',
            'Accept-Charset': 'utf-8'
        };

        return this.SendRequest(requestOptions, envelope);
    }

    stop() {
        let envelope =
            `<?xml version="1.0"?>
            <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
            <s:Body>
                <u:Stop xmlns:u="urn:schemas-upnp-org:service:AVTransport:1">
                    <InstanceID>0</InstanceID>
                </u:Stop>
            </s:Body>
            </s:Envelope>`;

        let requestOptions = parse(this.controlUrl);
        requestOptions.method = 'POST';
        requestOptions.headers = {
            'Content-Type': 'text/xml; charset="utf-8"',
            'Content-Length': Buffer.byteLength(envelope, 'utf8'),
            'Soapaction': '"urn:schemas-upnp-org:service:AVTransport:1#Stop"',
            'Accept-Charset': 'utf-8'
        };

        return this.SendRequest(requestOptions, envelope);
    }

    pause() {
        let envelope =
            `<?xml version="1.0"?>
            <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
            <s:Body>
                <u:Pause xmlns:u="urn:schemas-upnp-org:service:AVTransport:1">
                    <InstanceID>0</InstanceID>
                </u:Pause>
            </s:Body>
            </s:Envelope>`;

        let requestOptions = parse(this.controlUrl);
        requestOptions.method = 'POST';
        requestOptions.headers = {
            'Content-Type': 'text/xml; charset="utf-8"',
            'Content-Length': Buffer.byteLength(envelope, 'utf8'),
            'Soapaction': '"urn:schemas-upnp-org:service:AVTransport:1#Pause"',
            'Accept-Charset': 'utf-8'
        };

        return this.SendRequest(requestOptions, envelope);
    }
}

module.exports = AVTransport;
