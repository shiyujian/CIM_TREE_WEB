/**
*
* Copyright (c) 2016-present, ecidi.
* All rights reserved.
* 
* This source code is licensed under the GPL-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/
import {modelServerAddress,DGNAddress,USER,PASSWORD} from '_platform/api'
const $=window.$;
const pp = window.config.STATIC_FILE_USER + ':' + window.config.STATIC_FILE_PASSWORD;
(function checkWindowBtoaCompatibility() {
	if ('btoa' in window) {
		return;
	}

	var digits =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

	window.btoa = function windowBtoa(chars) {
		var buffer = '';
		var i, n;
		for (i = 0, n = chars.length; i < n; i += 3) {
			var b1 = chars.charCodeAt(i) & 0xFF;
			var b2 = chars.charCodeAt(i + 1) & 0xFF;
			var b3 = chars.charCodeAt(i + 2) & 0xFF;
			var d1 = b1 >> 2, d2 = ((b1 & 3) << 4) | (b2 >> 4);
			var d3 = i + 1 < n ? ((b2 & 0xF) << 2) | (b3 >> 6) : 64;
			var d4 = i + 2 < n ? (b3 & 0x3F) : 64;
			buffer += (digits.charAt(d1) + digits.charAt(d2) +
			digits.charAt(d3) + digits.charAt(d4));
		}
		return buffer;
	};
})();

class DataService  {
    constructor() {

    }
    getModelList(){
        $.support.cors = true;
        return new Promise(function(resolve, reject){
            $.ajax({
                "async": true,
                "crossDomain": true,
                "url": modelServerAddress,
                "method": "GET",
                beforeSend: function auth(xhr) {
                    xhr.setRequestHeader('Authorization', `Basic ${btoa(USER+':'+PASSWORD)}`);
                },
                success: function successCallback(data) {
                    resolve(data);
                },
                error: function errorCallback(xhr) {
                    reject(xhr);
                },
            });
        });
    }
    getDGN(){
        $.support.cors = true;
        return new Promise(function(resolve, reject){
            $.ajax({
                "async": true,
                "crossDomain": true,
                "url": DGNAddress,
                "method": "GET",
                beforeSend: function auth(xhr) {
                    xhr.setRequestHeader('Authorization', `Basic ${btoa(USER+':'+PASSWORD)}`);
                },
                success: function successCallback(data) {
                    resolve(data);
                },
                error: function errorCallback(xhr) {
                    reject(xhr);
                },
            });
        });
    }
}

export default DataService;