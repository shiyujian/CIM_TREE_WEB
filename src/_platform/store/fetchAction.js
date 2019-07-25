/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import 'whatwg-fetch';
import { encrypt } from './secrect';
import { Notification } from 'antd';
import {
    clearUser,
    removePermissions,
    getUser
} from '../auth';
require('es6-promise').polyfill();

const headers = {
    'Content-Type': 'application/json'
    // 'cache-control': 'no-cache',
    // 'pragma': 'no-cache',
};

export const forestFetchAction = (url, [successAction, failAction] = [], method = 'GET', defaultParams = {}) => {
    method = method.toUpperCase(); // 将字符串改为大写
    return (pathnames = {}, data = {}, refresh = true) => {
        data = data instanceof Array ? data : Object.assign({}, defaultParams, data);
        let user = getUser();
        if (user && user.ID && user.token) {
            let token = user.token;
            let ID = user.ID;
            let secrectData = encrypt(ID, token);
            let headData = {
                'Content-Type': 'application/json',
                'USERID': `${ID}`,
                'SINGNINFO': secrectData
            };
            return dispatch => {
                const params = {
                    headers: headData,
                    method
                };
                let u = encodeURI(getUrl(url, pathnames));
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
                        if (response && response.status === 403) {
                            let href = window.location.href;
                            let reg = new RegExp(/(\w+):\/\/([^/:]+)(:\d*)?/);
                            let result = href.match(reg);
                            if (result && result instanceof Array && result.length === 4) {
                                let locationStart = result[0];
                                if (result.indexOf('/login') === -1) {
                                    Notification.error({
                                        message: '请重新登录',
                                        duration: 5
                                    });
                                    clearUser();
                                    removePermissions();
                                    window.localStorage.removeItem('LOGIN_USER_DATA');
                                    let remember = window.localStorage.getItem('QH_LOGIN_REMEMBER');
                                    if (!remember) {
                                        window.localStorage.removeItem('LOGIN_USER_PASSDATA');
                                    }
                                    window.location.replace(locationStart + '/login');
                                    return;
                                }
                            }
                        }

                        const contentType = response.headers.get('content-type');
                        if (contentType && contentType.indexOf('application/json') !== -1) {
                            return response.json();
                        } else {
                            return response.text();
                        }
                    })
                    .then(result => {
                        // console.log('result', result);
                        refresh && successAction && dispatch(successAction(result));
                        return result;
                    }, result => {
                        refresh && failAction && dispatch(failAction(result));
                    });
            };
        } else {
            console.log('forestFetchAction');
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
