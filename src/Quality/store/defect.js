import { createAction, handleActions, combineActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import { SERVICE_API, MAIN_API, WORKFLOW_API } from '_platform/api';

export const getAreaOK = createAction('获取组织机构树');
export const getArea = createFetchAction(`${SERVICE_API}/loc-tree/code/LOC_ROOT/`, [getAreaOK]);
export const getTrack = createFetchAction(`${MAIN_API}/user/{{ID}}/location/`, []);
export const getRisk = createFetchAction(`${MAIN_API}/potential-risk/?status=1`, []);
export const setDefectData = createAction('设置质量缺陷详情数据');
export const getProjectTree = createFetchAction(`${SERVICE_API}/project-tree/?depth=4`, []);
export const getProjectDetail = createFetchAction(`${SERVICE_API}/projects/{{pk}}/`, []);
export const getWorkpackagesDetail = createFetchAction(`${SERVICE_API}/workpackages/{{pk}}/?parent=true&children=true`, []);
export const fetchDefectDataByLoc = createFetchAction(`${MAIN_API}/quality-defect/?project_location={{keyword}}`, []);
export const fetchDefectDetail = createFetchAction(`${MAIN_API}/quality-defect/{{id}}/`, []);
export const fetchDefectContactSheet = createFetchAction(`${MAIN_API}/quality-defect/{{id}}/contact-sheet/`, []);
export const fetchDefectResponseSheet = createFetchAction(`${MAIN_API}/quality-defect/{{id}}/response-sheet/`, []);
// 搜索得到流程
export const getWorkflowInstance = createFetchAction(`${WORKFLOW_API}/instance/?code=TEMPLATE_020&subject_id={{id}}`, []);
export const getWorkflowDetail = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}`, []);
// export const htmlToPdf = createFetchAction(`${}`);
export const actions = {
    getAreaOK,
    getArea,
    getTrack,
    getRisk,
    setDefectData,
    getProjectTree,
    getProjectDetail,
    getWorkpackagesDetail,
    fetchDefectDataByLoc,
    fetchDefectDetail,
    fetchDefectContactSheet,
    fetchDefectResponseSheet,
    getWorkflowInstance,
    getWorkflowDetail
};
export default handleActions({
    [getAreaOK]: (state, { payload }) => {
        return {
            ...state,
            areaLists: payload.children
        };
    },
    [setDefectData]: (state, { payload }) => {
        return {
            ...state,
            defectData: payload.defectData
        };
    }
}, {});
