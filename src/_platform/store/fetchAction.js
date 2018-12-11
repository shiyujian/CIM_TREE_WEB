/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import 'whatwg-fetch';
import { encrypt } from './secrect';
require('es6-promise').polyfill();

const headers = {
    'Content-Type': 'application/json'
    // 'cache-control': 'no-cache',
    // 'pragma': 'no-cache',
};

export const forestFetchAction = (url, [successAction, failAction], method = 'GET', defaultParams = {}) => {
    method = method.toUpperCase();
    return (pathnames = {}, data = {}, refresh = true) => {
        data = data instanceof Array ? data : Object.assign({}, defaultParams, data);
        let forestLoginUserData = window.localStorage.getItem('FOREST_LOGIN_USER_DATA');
        forestLoginUserData = JSON.parse(forestLoginUserData) || {};
        if (forestLoginUserData && forestLoginUserData.ID && forestLoginUserData.Token) {
            let token = forestLoginUserData.Token;
            let ID = forestLoginUserData.ID;
            let secrectData = encrypt(ID, token);
            console.log('secrectData', secrectData);
            let headData = {
                'Content-Type': 'application/json',
                'USERID': `${ID}`,
                'SINGNINFO': secrectData
            };
            // console.log('headData', headData);
            return dispatch => {
                const params = {
                    headers: headData,
                    method
                };
                let u = encodeURI(getUrl(url, pathnames));
                if ((method === 'POST' || method === 'PATCH') && Object.keys(data).length !== 0) {
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
                console.log('params', params);
                return fetch(u, params)
                    .then(response => {
                        console.log('response', response);
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
        } else {
            console.log('aaaaaaaaaaaaaaa');
        }
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

export const createFetchActionWithHeaders = (url, [successAction, failAction], method = 'POST') => {
    method = method.toUpperCase();
    return (pathnames = {}, data = {}, headers = {}, refresh = true) => {
        return dispatch => {
            const params = {
                headers: headers,
                method
            };

            let u = getUrl(url, pathnames);

            params.body = data;
            console.log('fwh', params);
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
