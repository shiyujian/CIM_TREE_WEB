import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import {CODE_API} from '_platform/api';
import {SERVICE_API,base} from '_platform/api';

export const ID = 'RIGISTER';

//获取树
export const getTreeOK = createAction('${ID}_获取项目结构树');

//安全事故
const postAccident = createFetchAction(`${base}/main/api/accident/`,[],'POST');
const putAccident = createFetchAction(`${base}/main/api/accident/{{pk}}/`,[],'PUT');
const getAccident = createFetchAction(`${base}/main/api/accident/?project_code={{projectCode}}&project_unit_code={{unitCode}}`,[],'GET');
const deleteAccident = createFetchAction(`${base}/main/api/accident/{{pk}}`,[],'DELETE');

const getAccidentLevel = createFetchAction(`${base}/main/api/accident-level/`,[],'GET');
const getAccidentType = createFetchAction(`${base}/main/api/accident-type/`,[],'GET');
const getWorkpackagesByCode = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/`, [], 'GET');

//事故报告  事故调查   事故处理
const patchAccidentReport = createFetchAction(`${base}/main/api/accident/{{pk}}/`,[],'PATCH');

export const actions = {
	postAccident,
	getAccident,
	putAccident,
    deleteAccident,
    getAccidentLevel,
    getAccidentType,
    getWorkpackagesByCode,
    patchAccidentReport
};

export default handleActions({
	[getTreeOK]: (state, {payload: {children}}) => ({
		...state,
		tree: children
	})
}, {});
