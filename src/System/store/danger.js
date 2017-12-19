import {createAction,handleActions,combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import {SERVICE_API} from '_platform/api';
import booleanFactory from '_platform/store/higher-order/bool';

export const ID = 'danger';
export const getWxlistOK = createAction(`${ID}_wxlist`);
export const getWxlist =createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, [getWxlistOK]);
export const getwxtypeOK = createAction(`${ID}_wxtypelist`);
export const getwxtype =createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, [getwxtypeOK]);
const newwxlist = createAction(`${ID}_newwxlist`);
const newtypelist = createAction(`${ID}_newtypelist`);
const addvisible =createAction(`${ID}_addvisible`);
export const visibleReducer = booleanFactory(ID, 'addition');
export const followReducer = booleanFactory(ID, 'follow');
const setfile =createAction(`${ID}_setfile`);
const setnewcode = createAction(`${ID}_newcode`);
const setname= createAction(`${ID}_name`);
const setnames = createAction(`${ID}_names`);
const levelAdding = createAction(`${ID}_levelAdd`);
const setdocs = createAction(`${ID}_setdocs`);
const savetypecode = createAction(`${ID}_savetypecode`);
const levelEditVisible = createAction(`${ID}_levelEditVisible`);
const levelfile = createAction(`${ID}_levelfile`);
const setleveldocs = createAction(`${ID}_setleveldocs`);
export const patchdocument = createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, 'PATCH');
export const putdocument =createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, 'PUT');
export const deletedocument = createFetchAction(`${SERVICE_API}/metalist/{{code}}/?index={{dex}}`, 'DELETE');
export const postdocument = createFetchAction(`${SERVICE_API}/metalist/`, 'POST');

export const actions = {
        setdocs,
        setleveldocs,
        getWxlistOK,
        levelEditVisible,
	    postdocument,
        levelfile,
        getWxlist,
        newwxlist,
        getwxtypeOK,
        getwxtype,
        newtypelist,
        addvisible,
        setnewcode,
        savetypecode,
        setname,
        setfile,
        setnames,
        patchdocument,
        deletedocument,
        levelAdding,
        putdocument,
        ...visibleReducer,
        ...followReducer,
};

export default handleActions({
    [setleveldocs]: (state, {payload}) => ({
        ...state,
        levelfile: payload
    }),
    [levelfile]: (state, {payload}) => ({
        ...state,
        levelfile: payload
    }),
    [levelEditVisible]: (state, {payload}) => ({
        ...state,
        levelEditVisible: payload
    }),
    [savetypecode]: (state, {payload}) => ({
        ...state,
        typecode: payload
    }),
    [setdocs]: (state, {payload}) => ({
        ...state,
        docs: payload
    }),
    [setfile]: (state, {payload}) => ({
        ...state,
        file: payload
    }),
    [levelAdding]: (state, {payload}) => ({
        ...state,
        levelAddVisible: payload
    }),
    [addvisible]: (state, {payload}) => ({
        ...state,
        addVisible: payload
    }),
    [getWxlistOK]: (state, {payload}) => ({
        ...state,
        wxlist: payload
    }),
    [getwxtypeOK]: (state, {payload}) => ({
        ...state,
        wxtype: payload
    }),
    [newwxlist]: (state, {payload}) => ({
        ...state,
        newwxlist: payload
    }),
    [newtypelist]: (state, {payload}) => ({
        ...state,
        newtypelist: payload
    }),
    [setnewcode]: (state, {payload}) => ({
        ...state,
        newcoded: payload
    }),
    [setname]: (state, {payload}) => ({
        ...state,
        name: payload
    }),
    [setnames]: (state, {payload}) => ({
        ...state,
        file: payload
    }),
    [combineActions(...actionsMap(visibleReducer))]: (state, action) => ({
        ...state,
        additionVisible: visibleReducer(state.additionVisible, action),
    }),
    [combineActions(...actionsMap(followReducer))]: (state, action) => ({
        ...state,
        follow: followReducer(state.follow, action),
    }),
}, {});
