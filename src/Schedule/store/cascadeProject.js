import {createAction, handleActions, combineActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {SERVICE_API} from '_platform/api';

const formatProject = ({children = []}) => {
	return children.map((project = {}) => {
		const {name, code} = project;
		return {
			label: name,
			value: code,
			children: formatProject(project)
		};
	});
};

export default () => {
	const planGetProjectTreeOK = createAction('获取计划的项目Tree数据');
	const planGetProjectTree = createFetchAction(`${SERVICE_API}/project-tree/`, [planGetProjectTreeOK]);
	const planGetUnitTreeOK = createAction('获取计划的单位+子单位Tree数据');
	const planGetUnitTree = createFetchAction(`${SERVICE_API}/project-tree/code/{{code}}/?all=true`,[planGetUnitTreeOK]);
	const planGetSectionTreeOK = createAction('获取计划的分部+子分部Tree数据');
	const planGetSectionTree = createFetchAction(`${SERVICE_API}/project-tree/code/{{code}}/?root=false`,[planGetSectionTreeOK]);
	const planGetItemTreeOK = createAction('获取计划的分项Select数据');
	const planGetItemTree = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/?all=true`,[planGetItemTreeOK]);
	const planWorkPackages = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/?all=true`,[]);
	const setUnitTree = createAction('清空计划的单位+子单位Tree数据');
	const setSectionTree = createAction('清空计划的分部+子分部Tree数据');
	const setItemTree = createAction('清空计划的分项Tree数据');
	const planWorkPackageReducer = handleActions({
		[planGetProjectTreeOK]: (state, {payload}) => ({
			...state,
			planProjectTree: formatProject(payload)
		}),
		[planGetUnitTreeOK]: (state, {payload}) => {
			return{
				...state,
				planUnitTree: formatProject(payload)
			}
		},
		[planGetSectionTreeOK]: (state, {payload}) => {
			return{
				...state,
				planSectionTree: formatProject(payload)
			}
		},
		[planGetItemTreeOK]: (state, {payload}) => {
			return{
				...state,
				planItemTree: payload.children_wp
			}
		},
		[setUnitTree]: (state, action) => {
			return{
				...state,
				planUnitTree: []
			}
		},
		[setSectionTree]: (state, action) => {
			return{
				...state,
				planSectionTree: []
			}
		},
		[setItemTree]: (state, action) => {
			return{
				...state,
				planItemTree: []
			}
		}
	}, {});
	planWorkPackageReducer.planGetProjectTree = planGetProjectTree;
	planWorkPackageReducer.planGetProjectTreeOK = planGetProjectTreeOK;
	planWorkPackageReducer.planGetUnitTree = planGetUnitTree;
	planWorkPackageReducer.planGetUnitTreeOK = planGetUnitTreeOK;
	planWorkPackageReducer.planGetSectionTree = planGetSectionTree;
	planWorkPackageReducer.planGetSectionTreeOK = planGetSectionTreeOK;
	planWorkPackageReducer.planGetItemTreeOK = planGetItemTreeOK;
	planWorkPackageReducer.planGetItemTree = planGetItemTree;
	planWorkPackageReducer.planWorkPackages = planWorkPackages;
	planWorkPackageReducer.setUnitTree = setUnitTree;
	planWorkPackageReducer.setSectionTree = setSectionTree;
	planWorkPackageReducer.setItemTree = setItemTree;
	return planWorkPackageReducer;
};
