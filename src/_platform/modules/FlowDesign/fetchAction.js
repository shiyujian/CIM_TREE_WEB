/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

require('es6-promise').polyfill();
require('whatwg-fetch');

let headers = {
    'Content-Type': 'application/json'
    // 'cache-control': 'no-cache',
    // 'pragma': 'no-cache',
};

export default (url, [successAction, failAction], method = 'GET', defaultParams = {}, defaultHeaders = {}) => {
    method = method.toUpperCase();
    return (pathnames = {}, data = {}, innerDefaultHeaders = {}, refresh = true) => {
        data = Object.assign({}, defaultParams, data);

        return dispatch => {
            const headersDef = Object.assign({}, headers, defaultHeaders);
            const headersInner = Object.assign({}, headersDef, innerDefaultHeaders);
            const params = {
                headers: headersInner,
                method
            };

            let u = getUrl(url, pathnames);

            if ((method === 'POST' || method === 'PATCH' || method === 'PUT') && Object.keys(data).length !== 0) {
                params.body = JSON.stringify(data);
            } else if (method === 'GET' || method === 'DELETE') {
                const search = serialize(data);
                if (search) {
                    if (url.indexOf('?') > 0) {
                        u = `${u}&${serialize(data)}`;
                    } else {
                        u = `${u}?${serialize(data)}`;
                    }
                }
            }
            return fetch(u, params)
                .then(response => {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.indexOf('application/json') !== -1) {
                        return response.json();
                    } else {
                        return response.text();
                    }
                })
                .then(result => {
                    refresh && successAction && dispatch(successAction(result));
                    return result;
                }, result => {
                    refresh && failAction && dispatch(failAction(result));
                });
        };
    };
};

const getUrl = (template, pathnames = {}) => {
    return template.replace(/\{\{(\w+)}}/g, (literal, key) => {
        if (key in pathnames) {
            return pathnames[key];
        } else {
            return '';
        }
    });
};

export const serialize = (params) => {
    return Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
};
