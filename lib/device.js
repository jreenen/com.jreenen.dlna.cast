'use strict';

const EventEmitter = require('events');
const Service = require('./service.js');
const parse = require('url').parse;

class Device extends EventEmitter {
    constructor(device, descriptionLocation) {
        super();
        this.descriptionLocation = descriptionLocation;
        this.baseurl = parse(descriptionLocation).host;

        // REQUIRED. UPnP device type. Single URI.
        // • For standard devices defined by a UPnP Forum working committee, 
        // MUST begin with “urn:schemasupnp-org:device:” followed by the standardized device type suffix, 
        // a colon, and an integer device
        // version i.e. urn:schemas-upnp-org:device:deviceType:ver. The highest supported version of the
        // device type MUST be specified.
        // • For non-standard devices specified by UPnP vendors, MUST begin with “urn:”, followed by a Vendor
        // Domain Name, followed by “:device:”, followed by a device type suffix, colon, and an integer
        // version, i.e., “urn:domain-name:device:deviceType:ver”. Period characters in the Vendor Domain
        // 44
        // Name MUST be replaced with hyphens in accordance with RFC 2141. The highest supported version
        // of the device type MUST be specified.
        // The device type suffix defined by a UPnP Forum working committee or specified by a UPnP vendor MUST
        // be <= 64 chars, not counting the version suffix and separating colon. 
        this.deviceType = device.deviceType;

        // REQUIRED. Short description for end user. 
        // MAY be localized (see ACCEPT-LANGUAGE and CONTENTLANGUAGE header fields). 
        // Specified by UPnP vendor. String. SHOULD be < 64 characters. 
        this.friendlyName = device.friendlyName;

        // REQUIRED. Manufacturer's name. MAY be localized (see ACCEPT-LANGUAGE and CONTENT-LANGUAGE
        // header fields). Specified by UPnP vendor. String. SHOULD be < 64 characters. 
        this.manufacturer = device.manufacturer;

        // OPTIONAL. Web site for Manufacturer. MAY have a different value depending on language requested
        // (see ACCEPT-LANGUAGE and CONTENT-LANGUAGE header fields). Specified by UPnP vendor. Single URL
        if (device.manufacturerURL) {
            this.manufacturerURL = device.manufacturerURL;
        }

        // RECOMMENDED. Long description for end user. MAY be localized (see ACCEPT-LANGUAGE and CONTENTLANGUAGE 
        // header fields). Specified by UPnP vendor. String. SHOULD be < 128 characters
        if (device.modelDescription) {
            this.modelDescription = device.modelDescription;
        }

        // REQUIRED. Model name. MAY be localized (see ACCEPT-LANGUAGE and CONTENT-LANGUAGE header
        // fields). Specified by UPnP vendor. String. SHOULD be < 32 characters. 
        this.modelName = device.modelName;

        // RECOMMENDED. Model number. MAY be localized (see ACCEPT-LANGUAGE and CONTENT-LANGUAGE
        // header fields). Specified by UPnP vendor. String. SHOULD be < 32 characters. 
        if (device.modelNumber) {
            this.modelNumber = device.modelNumber;
        }

        // OPTIONAL. Web site for model. MAY have a different value depending on language requested (see
        // ACCEPT-LANGUAGE and CONTENT-LANGUAGE header fields). Specified by UPnP vendor. Single URL. 
        if (device.modelURL) {
            this.modelURL = device.modelURL;
        }

        // RECOMMENDED. Serial number. MAY be localized (see ACCEPT-LANGUAGE and CONTENT-LANGUAGE
        // header fields). Specified by UPnP vendor. String. SHOULD be < 64 characters. 
        if (device.serialNumber) {
            this.serialNumber = device.serialNumber;
        }

        // REQUIRED. Unique Device Name. Universally-unique identifier for the device, whether root or embedded.
        // MUST be the same over time for a specific device instance (i.e., MUST survive reboots). MUST match the
        // field value of the NT header field in device discovery messages. MUST match the prefix of the USN
        // header field in all discovery messages. (Section 1, “Discovery” explains the NT and USN header fields.)
        // MUST begin with “uuid:” followed by a UUID suffix specified by a UPnP vendor. See section 1.1.4, “UUID
        // format and RECOMMENDED generation algorithms” for the MANDATORY UUID format.
        this.UDN = device.UDN;

        // OPTIONAL. Universal Product Code. 12-digit, all-numeric code that identifies the consumer package.
        // Managed by the Uniform Code Council. Specified by UPnP vendor. Single UPC. 
        if (device.UPC) {
            this.UPC = device.UPC;
        }

        // REQUIRED if and only if device has one or more icons
        if (device.iconList) {
            this.iconList = device.iconList.icon;
        }

        // REQUIRED if and only if root device has embedded devices.
        if (device.deviceList && device.deviceList.device) {
            this.deviceList = [];
            if (Array.isArray(device.deviceList.device)) {
                device.deviceList.device.forEach(device => {
                    this.deviceList.push(new Device(device, descriptionLocation));
                });
            }
            else {
                this.deviceList.push(new Device(device.deviceList.device, descriptionLocation));
            }
        }

        if (device.serviceList && device.serviceList.service) {
            this.serviceList = [];
            if (Array.isArray(device.serviceList.service)) {
                device.serviceList.service.forEach(service => {
                    this.serviceList.push(new Service(service, this.baseurl));
                });
            }
            else {
                this.serviceList.push(new Service(device.serviceList.service, this.baseurl));
            }
        }

        // RECOMMENDED. URL to presentation for device (see section 5, “Presentation”). MUST be relative to the
        // URL at which the device description is located in accordance with the rules specified in section 5 of         // RFC 3986. Specified by UPnP vendor. Single URL. 
        // RFC 3986. Specified by UPnP vendor. Single URL. 
        if (device.presentationURL) {
            this.presentationURL = device.presentationURL;
        }

        this.on(this.UDN, (message) => {

        });
    }

    getService(serviceType) {
        if (this.serviceList) {
            let foundService = this.serviceList.find(service => {
                return service.serviceType === serviceType;
            });

            if (foundService) {
                return foundService;
            }
        }

        let foundService;
        if (this.deviceList) {
            this.deviceList.forEach(device => {
                if (foundService) {
                    return foundService;
                }

                foundService = device.getService(serviceType);
            });
        }
    }
}
module.exports = Device;