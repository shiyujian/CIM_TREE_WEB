/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 * 
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
 
import {handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '../util';
import workflowActions from './workflow';

export default handleActions({
	[combineActions(...actionsMap(workflowActions))]: (state = {}, action) => {
		return {
			...state, 
			flowdesign: action.payload
		};
	}
}, {});