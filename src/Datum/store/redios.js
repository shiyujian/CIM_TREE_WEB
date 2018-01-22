import {createAction,handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import {SERVICE_API} from '_platform/api';
import booleanFactory from '_platform/store/higher-order/bool';
import documentFactory from '_platform/store/higher-order/doc';

export const ID = 'redios_redios';
export const getTreeOK = createAction(`${ID}_工程施工包`);
export const getTree =createFetchAction(`${SERVICE_API}/dir-tree/code/{{code}}/`, [getTreeOK]);
export const getdirtreeOK = createAction(`${ID}_剩余DIR包`);
export const getdirtree = createFetchAction(`${SERVICE_API}/dir-tree/code/{{code}}/`, [getdirtreeOK]);
export const getkeyOK = createAction(`${ID}_关键字`);
export const getkey = createFetchAction(`${SERVICE_API}/directories/code/{{code}}/`, [getkeyOK]);
export const putdocument =createFetchAction(`${SERVICE_API}/documents/code/{{code}}/`, 'PUT');
export const setstas = createAction(`${ID}_改变stas`);
export const setnewdirtree = createAction(`${ID}_保存newdirtree`);
export const settablevisible = createAction(`${ID}_settablevisible`);
export const setnewkey = createAction(`${ID}_setnewkey`);
export const setcurrentcode = createAction(`${ID}_CURRENTDODE`);
export const changeupdoc = createAction(`${ID}_changeupdoc`);
const visibleReducer = booleanFactory(ID, 'addition');
const followReducer = booleanFactory(ID, 'follow');
const changeDocs = createAction(`${ID}_CHANGE_DOCS`);
const documentReducer = documentFactory(ID);
export const getdocumentOK = createAction(`${ID}_搜索目录文档`);
export const getdocument = createFetchAction(`${SERVICE_API}/doc_searcher/dir_code/{{code}}/`, [getdocumentOK]);
export const getprofessionlistOK =createAction(`${ID}_获取专业列表`);
export const getprofessionlist = createFetchAction(`${SERVICE_API}/metalist/professionlist/`, [getprofessionlistOK]);
export const selectDocuments = createAction(`${ID}_SELECTDOUMENT`);
export const savenewshuzu = createAction(`${ID}_savenewshuzu`);
// export const getdocumentOK = createAction(`${ID}_搜索目录文档`);
// export const getdocument = createFetchAction(`${SERVICE_API}/doc_searcher/dir_code/{{code}}/`, [getdocumentOK]);
export const deletedoc = createFetchAction(`${SERVICE_API}/documents/code/{{code}}/?this=true`, 'DELETE');
export const setkeycode =createAction(`${ID}_setkeycode`);
const updatevisible = createAction(`${ID}_updatevisible`);
const setoldfile = createAction(`${ID}setoldfile`);
//处理文件类型
const judgeFile = createAction(`${ID}judgeFile`);
// export const SearchOK = createAction(`${ID}_高级搜索`);
// export const Search = createFetchAction(`${SERVICE_API}/searcher/`, [SearchOK]);
// export const getprofessionlistOK =createAction(`${ID}_获取专业列表`);
// export const getprofessionlist = createFetchAction(`${SERVICE_API}/metalist/professionlist/`, [getprofessionlistOK]);

export const getDesignUnitOK =createAction(`${ID}_获取设计单位列表`);
export const getDesignUnit = createFetchAction(`${SERVICE_API}/org-tree/code/D/`, [getDesignUnitOK]);
export const getProjectAcOK = createAction('PROJECT获取项目列表');
export const getProjectAc = createFetchAction(`${SERVICE_API}/project-tree/?depth=2`, [getProjectAcOK]);

//设计阶段名称
const getDesignStageOK =createAction(`${ID}_获取设计阶段名称`);
const getDesignStage = createFetchAction(`${SERVICE_API}/metalist/designstage/`,[getDesignStageOK]);

// 操作更新弹出框状态
const getModalUpdate =createAction(`${ID}操作更新弹出框状态`);

// 操作预览弹出框状态
const getPreviewModal =createAction(`${ID}操作更新弹出框状态`);

export const actions = {
	getDesignStageOK,
	getDesignStage,
    judgeFile,
    getTreeOK,
    getTree,
	getdirtreeOK,
	getdirtree,
    setstas,
	setnewdirtree,
	settablevisible,
    getkeyOK,
    getkey,
	setnewkey,
	changeDocs,
	setcurrentcode,
	changeupdoc,
	getdocumentOK,
	getdocument,
	...visibleReducer,
	...followReducer,
	...documentReducer,
	getprofessionlistOK,
	getprofessionlist,
	selectDocuments,
	deletedoc,
	setkeycode,
	updatevisible,
	setoldfile,
	putdocument,
	savenewshuzu,

	getDesignUnitOK,
	getDesignUnit,
	getProjectAcOK,
	getProjectAc,
	getModalUpdate,
	getPreviewModal
};

export default handleActions({
	[getDesignStageOK]:(state, {payload}) => ({
		...state,
		designstage:payload
	}),
	[judgeFile]:(state, {payload}) => ({
		...state,
		judgeFile:payload
	}),
	[getDesignUnitOK]: (state, {payload:{children}}) => ({
		...state,
		designUnitList: children
	}),
	[getProjectAcOK]: (state, {payload:{children}}) => ({
		...state,
		projectList: children
	}),
    [getTreeOK]: (state, {payload: {children}}) => {
        return {
            ...state,
            tree: children
        }
    },
    [getdirtreeOK]: (state, {payload:{children}}) => ({
        ...state,
        dirtree: children
    }),
    [setstas]: (state, {payload}) => ({
	    ...state,
	    stas: payload
    }),
	[getdocumentOK]: (state, {payload}) => ({
		...state,
		Doc: payload.result
	}),
	[getkeyOK]: (state, {payload}) => ({
		    ...state,
		    keyd: payload.extra_params
	}),
    [setnewdirtree]: (state, {payload}) => ({
	    ...state,
	    newdirtree: payload
    }),
    [settablevisible]: (state, {payload}) => ({
	    ...state,
	    tablevisible: payload
    }),
	[setnewkey]:(state, {payload}) => {
    	console.log(payload);
    	return{
		    ...state,
		    newkey: payload === undefined?[]:payload.newdocs
	    }
	},
	[changeDocs]: (state, {payload}) => ({
		...state,
		docs: payload
	}),
	[setcurrentcode]: (state, {payload}) => ({
		...state,
		currentcode: payload
	}),
	[changeupdoc]: (state, {payload}) => ({
		...state,
		updoc: payload
	}),
	[selectDocuments]: (state, {payload}) => ({
		...state,
		selected: payload
	}),
	[getprofessionlistOK]: (state, {payload:{metalist}}) => ({
		...state,
		professionlist: metalist
	}),
	[setkeycode]: (state, {payload}) => ({
		...state,
		keycode: payload
	}),
	[updatevisible]: (state, {payload}) => ({
		...state,
		updatevisible: payload
	}),
	[setoldfile]: (state, {payload}) => ({
		...state,
		oldfile: payload
	}),
	[savenewshuzu]: (state, {payload}) => ({
		...state,
		newtree: payload
	}),
	[combineActions(...actionsMap(visibleReducer))]: (state, action) => ({
		...state,
		additionVisible: visibleReducer(state.additionVisible, action)
	}),
	[combineActions(...actionsMap(followReducer))]: (state, action) => ({
		...state,
		follow: followReducer(state.follow, action)
	}),
	[getModalUpdate]: (state, {payload}) => ({
		...state,
		getModalUpdateVisible: payload
	}),
	[getPreviewModal]: (state, {payload}) => ({
		...state,
		getPreviewModalVisible: payload
	}),
}, {});
