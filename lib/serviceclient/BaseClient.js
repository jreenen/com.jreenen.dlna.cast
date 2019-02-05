'use strict';
const EventEmitter = require('events');
const http = require('http');

class BaseClient extends EventEmitter {
    constructor(){
        super();
    }

    SendRequest(requestOptions, envelope) {
        return new Promise((resolve, reject) => {
            let request = http.request(requestOptions, (response) => {
                let data = '';
                response.on('data', (chunk) => {
                    data += chunk;
                });
                response.on('end', () => {
                    let result = {};
                    console.log(data);
                    resolve(result);
                });
                response.on('error', (error) => {
                    console.log(`ERROR sending request ${error}`);
                    reject(error);
                });
            });
            request.end(envelope);
            request.on('error', err => {
                console.log(err);
            })
        });
    }
}
module.exports = BaseClient;