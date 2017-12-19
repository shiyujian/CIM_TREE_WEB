import {handleActions, combineActions,createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API} from '_platform/api';
import fieldFactory from '_platform/store/service/field';

export const ID = 'SYSTEM_USER';

const sidebarReducer = fieldFactory(ID, 'sidebar');
const additionReducer = fieldFactory(ID, 'addition');
export const getVideoOK = createAction('Setting_Get_Video_OK');
export const getVideo = createFetchAction(`${SERVICE_API}/loc-tree/code/CAM_ROOT/`, [getVideoOK]);
export const postVideo = createFetchAction(`${SERVICE_API}/locations/`,'POST');
export const updateVideo = createFetchAction(`${SERVICE_API}/locations/code/{{code}}/`,'PUT');
export const deleteVideo = createFetchAction(`${SERVICE_API}/locations/code/{{code}}/?this=true`,'DELETE');
export const setAcitonType = createAction('修改摄像头操作类型');

export const actions = {
	...sidebarReducer,
	...additionReducer,
	getVideo,
	getVideoOK,
	postVideo,
	updateVideo,
	deleteVideo,
	setAcitonType
};

export default handleActions({
	[combineActions(...actionsMap(sidebarReducer))]: (state, action) => ({
		...state,
		sidebar: sidebarReducer(state.sidebar, action),
	}),
	[combineActions(...actionsMap(additionReducer))]: (state, action) => ({
		...state,
		addition: additionReducer(state.addition, action),
	}),
	[getVideoOK]:(state,{payload})=>{
		return Object.assign({},state,{videos:payload.children});
	},
	[setAcitonType]:(state,{payload})=>{
		return Object.assign({},state,{action:payload});
	}
}, {});
