'use strict';

const EventEmitter = require('events');

class Service extends EventEmitter {
    constructor(service, baseurl) {
        super();
        this.baseurl = baseurl;
        //  Required. UPnP service type. MUST NOT contain a hash character (#, 23 Hex in UTF8). Single URI.
        // • For standard service types defined by a UPnP Forum working committee, MUST
        // begin with “urn:schemas-upnp-org:service:” followed by the standardized
        // service type suffix, colon, and an integer service version i.e. urn:schemasupnp-org:device:serviceType:ver. The highest supported version of the service
        // type MUST be specified.
        // • For non-standard service types specified by UPnP vendors, MUST begin with
        // “urn:”, followed by a Vendor Domain Name, followed by “:service:”, followed
        // by a service type suffix, colon, and an integer service version, i.e.,
        // “urn:domain-name:service:serviceType:ver”. Period characters in the Vendor
        // Domain Name MUST be replaced with hyphens in accordance with RFC 2141.
        // The highest supported version of the service type MUST be specified.
        // The service type suffix defined by a UPnP Forum working committee or specified by
        // a UPnP vendor MUST be <= 64 characters, not counting the version suffix and
        // separating colon. 
        this.serviceType = service.serviceType;

        // REQUIRED. Service identifier. MUST be unique within this device description. Single URI.
        // • For standard services defined by a UPnP Forum working committee, MUST begin
        // with “urn:upnp-org:serviceId:” followed by a service ID suffix i.e. urn:upnporg:serviceId:serviceID. If this instance of the specified service type (i.e. the
        // <serviceType> element above) corresponds to one of the services defined by
        // the specified device type (i.e. the <deviceType> element above), then the
        // value of the service ID suffix MUST be the service ID defined by the device
        // type for this instance of the service. Otherwise, the value of the service ID
        // suffix is vendor defined. (Note that upnp-org is used instead of schemas-upnporg in this case because an XML schema is not defined for each service ID.)
        // • For non-standard services specified by UPnP vendors, MUST begin with “urn:”,
        // followed by a Vendor Domain Name, followed by “:serviceId:”, followed by a
        // service ID suffix, i.e., “urn:domain-name:serviceId:serviceID”. If this instance
        // of the specified service type (i.e. the <serviceType> element above)
        // corresponds to one of the services defined by the specified device type (i.e.
        // the <deviceType> element above), then the value of the service ID suffix
        // MUST be the service ID defined by the device type for this instance of the
        // service. Period characters in the Vendor Domain Name MUST be replaced with
        // hyphens in accordance with RFC 2141.
        // The service ID suffix defined by a UPnP Forum working committee or specified by a
        // UPnP vendor MUST be <= 64 characters. 
        this.serviceId = service.serviceId;

        // REQUIRED. URL for service description. (See section 2.5, “Service description”
        // below.) MUST be relative to the URL at which the device description is located in
        // accordance with section 5 of RFC 3986. Specified by UPnP vendor. Single URL. 
        this.SCPDURL = service.SCPDURL;

        // REQUIRED. URL for control (see section 3, “Control”). MUST be relative to the URL
        // at which the device description is located in accordance with section 5 of RFC 3986.
        // Specified by UPnP vendor. Single URL. 
        this.controlURL = service.controlURL;

        // REQUIRED. URL for eventing (see section 4, “Eventing”). MUST be relative to the
        // URL at which the device description is located in accordance with section 5 of RFC 3986.
        // MUST be unique within the device; any two services MUST NOT have the same
        // URL for eventing. If the service has no evented variables, this element MUST be
        // present but MUST be empty (i.e., <eventSubURL></eventSubURL>.) Specified by
        // UPnP vendor. Single URL. 
        this.eventSubURL = service.eventSubURL;

        this.on(this.serviceId, (message) => {

        });
    }
}
module.exports = Service;