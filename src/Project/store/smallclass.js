import {handleActions, combineActions,createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API} from '_platform/api';
export const ID = 'smallclass';
export const getFieldAcOK = createAction(`${ID}FIELD获取区域地块列表`);
export const getFieldAc = createFetchAction(`${SERVICE_API}/loc-tree/code/LOC_ROOT/`, [getFieldAcOK]);
//新增区域地块
export const postFieldAc = createFetchAction(`${SERVICE_API}/locations/`, [],'POST');
//编辑区域地块
export const putFieldAc = createFetchAction(`${SERVICE_API}/locations/code/{{code}}/`, [],'PUT');
//删除区域地块
export const deleteFieldAc = createFetchAction(`${SERVICE_API}/locations/code/{{code}}/?this=true`, [],'DELETE');
//FIELD设置当前选中的区域地块
export const setSelectFieldAc = createAction(`${ID}FIELD设置当前选中的区域地块`);
//FIELD新建或编辑区域的modal
export const toggleModalAc = createAction(`${ID}FIELD新建或编辑区域的modal`);
//FIELD设置上传的文件列表
export const postUploadFilesAc = createAction(`${ID}FIELD设置上传的文件列表`);
//FIELD设置上传的文件列表
export const setBuildCodeAc = createAction(`${ID}FIELD设置编码系统相关的信息`);
export const actions = {
	getFieldAc,
	getFieldAcOK,
	postFieldAc,
	putFieldAc,
	deleteFieldAc,
	setSelectFieldAc,
	toggleModalAc,
	postUploadFilesAc,
	setBuildCodeAc,
};
export default handleActions({
	[getFieldAcOK]: (state, {payload}) => {
		let fields = _getFieldFunc(payload.children) || {};
		let newfields = fields.filter(item => {
			return item.code.indexOf("_LOC") === -1;
		})
		fields = [...newfields];
		const [{code}={}] = fields;
		return {
			...state,
			fieldList: fields,
			selectField:!state.selectField ? code: state.selectField,
			fieldGroup:_getGroupFunc(payload.children) || [],
			relation:_getRelationFunc(payload.children) || [],
		}
	},
	[setSelectFieldAc]: (state, {payload}) => ( {
		...state,
		selectField: payload
	}),
	[toggleModalAc]: (state, {payload}) => ( {
		...state,
		toggleData: payload
	}),
	[postUploadFilesAc]: (state, {payload}) => ( {
		...state,
		fileList: payload
	}),
	[setBuildCodeAc]: (state, {payload}) => ( {
		...state,
		buildCode: payload
	}),
}, {});


export function _getGroupFunc(children){
	let group=[];
	// 过滤掉项目loc里面的数据
	let newArr = children.filter(item => {
		return item.code.indexOf("_LOC") === -1;
	})
	children = newArr;
	children.map((one)=>{
		group.push({
			name:one.name,
			obj_type:one.obj_type,
			pk:one.pk,
			code:one.code
		})
	});
	return group
}
export function _getFieldFunc(children = []){
	let fieldList=[];
	children.map((field)=>{
		fieldList=fieldList.concat(field.children)
	});
	return fieldList
}
export function _getRelationFunc(children = []){
	let relation=[];
	children.map((field)=>{
		let obj={
			code:field.code,
			name:field.name,
			children:[],
		};
		field.children.map((fd)=>{
			obj.children.push(fd.code)
		});
		relation.push(obj)
	});
	return relation
}
