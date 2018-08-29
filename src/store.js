/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import {routerMiddleware} from 'react-router-redux';
import platformReducer from './_platform/store/global';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';

// chrome redux-develop-tool
const composeEnhancers = composeWithDevTools({
    // options like actionSanitizer, stateSanitizer
});

// 创建公共的reducers
const makeRootReducer = (asyncReducers) => {
    return combineReducers({
        platform: platformReducer,
        ...asyncReducers
    });
};

// 初始化store数据对象
const initialState = window.___INITIAL_STATE__;
// 将store和history进行关联，支持history对象，方便修改url
const history = createHistory();
const middleware = [thunk, routerMiddleware(history)];
const enhancers = [];
const store = createStore(
    makeRootReducer({}),
    initialState,
    composeEnhancers(
        compose(
            applyMiddleware(...middleware),
            ...enhancers
        )
    )
);
// 存放异步新增的reducer
store.asyncReducers = {};
// 异步reducer注入方式
export const injectReducer = (key, reducer) => {
    if (Object.hasOwnProperty.call(store.asyncReducers, key)) return;

    store.asyncReducers[key] = reducer;
    store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default store;
