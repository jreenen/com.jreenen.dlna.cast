'use strict';
const Homey = require('homey');
const EventEmitter = require('events');
const AVTransport = require('../../lib/serviceclient/AVTransport.js');
const xml2js = require('xml2js');
const http = require('http');
const https = require('https');
const parse = require('url').parse;

const UPNP_CLASSES = {
    'audio': 'object.item.audioItem.musicTrack',
    'video': 'object.item.videoItem.movie',
    'image': 'object.item.imageItem.photo'
}

class MediaRenderer extends EventEmitter {
    constructor(deviceData) {
        super();
        this._deviceData = deviceData;
    }

    autoPlay(fileUrl) {
        let device = Homey.app.getDevice(this._deviceData.id, this._deviceData.deviceType);
        let transport = new AVTransport(device);

        this.getMetaData(fileUrl).then(metaData => {
            transport.setAVTransportURI(fileUrl, metaData).then(setUri => {
                console.log(setUri);
                transport.play().then(play => {
                    console.log(play);
                });
            });
        });
    }

    getMetaData(fileUrl) {
        let url = String(fileUrl);
        return new Promise((resolve, reject) => {
            this.getContentType(fileUrl).then(contentType => {
                let mediaType = contentType.split('/')[0];
                let upnpClass = UPNP_CLASSES[mediaType];

                let obj = {
                    $: {
                        "xmlns": "urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/",
                        "xmlns:dc": "http://purl.org/dc/elements/1.1/",
                        "xmlns:upnp": "urn:schemas-upnp-org:metadata-1-0/upnp/"
                    },
                    item: {
                        $: {
                            "id": 0,
                            "parentID": mediaType,
                            "restricted": 0
                        },
                        "dc:title": "UNKNOWN",
                        "dc:creator": "UNKNOWN",
                        res: {
                            $: {
                                "protocolInfo": `http-get:*:${contentType}:*`,
                                "duration": "0:00:00"
                            },
                            _: url
                        },
                        "upnp:class": upnpClass
                    }
                }
                var builder = new xml2js.Builder({ explicitRoot: false, rootName: 'DIDL-Lite', 'headless': true, renderOpts: { 'pretty': false } });
                var xml = builder.buildObject(obj);

                resolve(this.escapeXml(xml));
            });
        });
    }

    getContentType(fileUrl) {
        return new Promise((resolve, reject) => {
            let requestOptions = parse(fileUrl);
            requestOptions.method = 'HEAD';

            if (requestOptions.protocol === 'http:') {
                var req = http.request(requestOptions, res => {
                    resolve(res.headers['content-type']);
                });
                
                req.on('error', err => {
                    reject(err);
                });

                req.end();
            }

            if (requestOptions.protocol === 'https:') {
                var req = https.request(requestOptions, res => {
                    resolve(res.headers['content-type']);
                }
                );
                req.on('error', err => {
                    reject(err);
                });

                req.end();
            }
        });
    }

    escapeXml(unsafe) {
        return unsafe.replace(/[<>&'"]/g, function (c) {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
            }
        });
    }
}
module.exports = MediaRenderer;