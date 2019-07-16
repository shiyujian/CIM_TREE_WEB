import 'whatwg-fetch';
import { getUser } from '_platform/auth';
require('es6-promise').polyfill();
/**
 *
 * @param url
 * @param successAction
 * @param failAction
 * @param method
 * @param defaultParams
 * @returns {function(*=, *=)}
 */
export default (
    url,
    [successAction, failAction],
    method = 'GET',
    defaultParams = {}
) => {
    method = method.toUpperCase();
    return (pathnames = {}, data = {}) => {
        return dispatch => {
            const params = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization:
                        'Basic ' +
                        btoa(getUser().username + ':' + getUser().password)
                },
                credentials: 'same-origin',
                method,
                mode: 'cors'
            };
            let u = getUrl(url, pathnames);
            if (
                (method === 'POST' ||
                    method === 'PATCH' ||
                    method === 'DELETE' ||
                    method === 'PUT') &&
                Object.keys(data).length !== 0
            ) {
                params.body = JSON.stringify(data);
            } else if (method === 'GET') {
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
                    // 未授权的跳转登录页面
                    if (response.status === 401) {
                    //     window.location.href = '/login';
                        return;
                    }
                    const contentType = response.headers.get('content-type');
                    if (
                        contentType &&
                        contentType.indexOf('application/json') !== -1
                    ) {
                        return response.json();
                    } else {
                        return response.text();
                    }
                })
                .then(
                    result => {
                        successAction && dispatch(successAction(result));
                        return result;
                    },
                    result => {
                        failAction && dispatch(failAction(result));
                    }
                );
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

export const serialize = params => {
    return Object.keys(params)
        .map(
            key =>
                `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
        )
        .join('&');
};
