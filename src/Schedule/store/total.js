/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { combineReducers } from 'redux';
import { createAction, handleActions } from 'redux-actions';

export const makeRootReducer = asyncReducers => {
    return combineReducers({
        location: locationReducer,
        tabList: tabsReducer,
        ...asyncReducers
    });
};

export const shieldUnderlineParamsInUrl = url => {
    // 将传入url的形如 &_xx=yy 或 _xx=yy 的参数删除，返回一个新的字符串
    if (typeof url !== 'string') {
        return;
    }
    return url.replace(/&?_\w+=\w+/g, '');
};

export const injectReducer = (store, { key, reducer }) => {
    if (Object.hasOwnProperty.call(store.asyncReducers, key)) return;

    store.asyncReducers[key] = reducer;
    store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export const locationChange = createAction('LOCATION_CHANGE');

const locationReducer = handleActions(
    {
        [locationChange]: (state, action) => {
            return action.payload;
        }
    },
    '/'
);

export const openTab = createAction('create tab');

export const actions = {
    openTab
};

export const tabsReducer = handleActions(
    {
        [openTab]: (state, action) => {
            // const tab = action.payload;
            const tab = action.payload;
            const tabs = state.tabs || [];
            const some = tabs.some(
                t =>
                    shieldUnderlineParamsInUrl(t.to) ===
                    shieldUnderlineParamsInUrl(tab.to)
            );
            if (some) {
                return {
                    tabs: [...tabs],
                    changeTab: state.changeTab ? ++state.changeTab : 1
                };
            } else {
                return {
                    tabs: [...tabs, tab],
                    changeTab: state.changeTab ? ++state.changeTab : 1
                };
            }
        }
    },
    []
);

export default makeRootReducer;
