import { createAction, handleActions, combineActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import { capitalize } from '../util';
import { SERVICE_API } from '../../api';

export default (ID, service = '') => {
    const suffix = service.toUpperCase();
    const SERVICE = capitalize(service);
    const setProject = createAction(`${ID}_SET_PROJECT_${suffix}`);
    const setUnit = createAction(`${ID}_SET_UNIT_WORK_PACKAGE_${suffix}`);
    const setSubunit = createAction(`${ID}_SET_SUBUNIT_WORK_PACKAGE_${suffix}`);
    const setSection = createAction(`${ID}_SET_SECTION_WORK_PACKAGE_${suffix}`);
    const setSubsection = createAction(
        `${ID}_SET_SUBSECTION_WORK_PACKAGE_${suffix}`
    );
    const setItem = createAction(`${ID}_SET_ITEM_WORK_PACKAGE_${suffix}`);

    const setProjectTree = createAction(`${ID}_SET_PROJECTS_${suffix}`);
    const setUnits = createAction(`${ID}_SET_UNIT_WORK_PACKAGES_${suffix}`);
    const setSubunits = createAction(
        `${ID}_SET_SUBUNIT_WORK_PACKAGES_${suffix}`
    );
    const setSections = createAction(
        `${ID}_SET_SECTION_WORK_PACKAGES_${suffix}`
    );
    const setSubSections = createAction(
        `${ID}_SET_SUBSECTION_WORK_PACKAGES_${suffix}`
    );
    const setItems = createAction(`${ID}_SET_ITEM_WORK_PACKAGES_${suffix}`);

    const getProjectTree = createFetchAction(`${SERVICE_API}/project-tree/`, [
        setProjectTree
    ]);
    const getUnits = createFetchAction(
        `${SERVICE_API}/projects/code/{{code}}/?all=true`,
        [setUnits]
    );
    const getSubunits = createFetchAction(
        `${SERVICE_API}/workpackages/code/{{code}}/?all=true`,
        [setSubunits]
    );
    const getSections = createFetchAction(
        `${SERVICE_API}/workpackages/code/{{code}}/?all=true`,
        [setSections]
    );
    const getSubsections = createFetchAction(
        `${SERVICE_API}/workpackages/code/{{code}}/?all=true`,
        [setSubSections]
    );
    const getItems = createFetchAction(
        `${SERVICE_API}/workpackages/code/{{code}}/?all=true`,
        [setItems]
    );

    const postProject = createFetchAction(`${SERVICE_API}/projects/`, 'POST');
    const postWorkPackage = createFetchAction(
        `${SERVICE_API}/workpackages/`,
        'POST'
    );

    const putProject = createFetchAction(
        `${SERVICE_API}/projects/code/{{code}}/?this=true`,
        'PUT'
    );
    const putWorkPackage = createFetchAction(
        `${SERVICE_API}/workpackages/code/{{code}}/?this=true`,
        'PUT'
    );

    const deleteProject = createFetchAction(
        `${SERVICE_API}/projects/code/{{code}}/?this=true`,
        'DELETE'
    );
    const deleteWorkPackage = createFetchAction(
        `${SERVICE_API}/workpackages/code/{{code}}/?this=true`,
        'DELETE'
    );

    const workPackageReducer = handleActions(
        {
            // [setProjectTree]: (state, {payload: {children: [first = {}] = []} = {}}) => ({
            // 	...state,
            // 	root: first,
            // 	projectTree: formatProject(first),
            // }),
            [setProjectTree]: (state, { payload }) => ({
                ...state,
                root: payload,
                projectTree: formatProject(payload)
            }),
            [setUnits]: (state, { payload: { workpackages = [] } = {} }) => ({
                ...state,
                units: workpackages
            }),
            [setSubunits]: (state, { payload: { children_wp = [] } = {} }) => ({
                ...state,
                subunits: children_wp
            }),
            [setSections]: (state, { payload: { children_wp = [] } = {} }) => ({
                ...state,
                sections: children_wp
            }),
            [setSubSections]: (
                state,
                { payload: { children_wp = [] } = {} }
            ) => ({
                ...state,
                subsections: children_wp
            }),
            [setItems]: (state, { payload: { children_wp = [] } = {} }) => ({
                ...state,
                items: children_wp,
                item: undefined
            }),
            [setProject]: (state, { payload }) => ({
                ...state,
                units: [],
                subunits: [],
                sections: [],
                subsections: [],
                items: [],

                project: payload,
                unit: undefined,
                subunit: undefined,
                section: undefined,
                subsection: undefined,
                item: undefined
            }),
            [setUnit]: (state, { payload }) => ({
                ...state,
                subunits: [],
                sections: [],
                subsections: [],
                items: [],

                unit: payload,
                subunit: undefined,
                section: undefined,
                subsection: undefined,
                item: undefined
            }),
            [setSubunit]: (state, { payload }) => ({
                ...state,
                sections: [],
                subsections: [],
                items: [],

                subunit: payload,
                section: undefined,
                subsection: undefined,
                item: undefined
            }),
            [setSection]: (state, { payload }) => ({
                ...state,
                subsections: [],
                items: [],

                section: payload,
                subsection: undefined,
                item: undefined
            }),
            [setSubsection]: (state, { payload }) => ({
                ...state,
                items: [],

                subsection: payload,
                item: undefined
            }),
            [setItem]: (state, { payload }) => ({
                ...state,
                item: payload
            })
        },
        {}
    );

    workPackageReducer[`get${SERVICE}ProjectTree`] = getProjectTree;
    workPackageReducer[`get${SERVICE}Units`] = getUnits;
    workPackageReducer[`get${SERVICE}Subunits`] = getSubunits;
    workPackageReducer[`get${SERVICE}Sections`] = getSections;
    workPackageReducer[`get${SERVICE}Subsections`] = getSubsections;
    workPackageReducer[`get${SERVICE}ProjectTree`] = getProjectTree;
    workPackageReducer[`get${SERVICE}Items`] = getItems;

    workPackageReducer[`set${SERVICE}ProjectTree`] = setProjectTree;
    workPackageReducer[`set${SERVICE}Units`] = setUnits;
    workPackageReducer[`set${SERVICE}Subunits`] = setSubunits;
    workPackageReducer[`set${SERVICE}Sections`] = setSections;
    workPackageReducer[`set${SERVICE}SubSections`] = setSubSections;
    workPackageReducer[`set${SERVICE}Items`] = setItems;

    workPackageReducer[`set${SERVICE}Project`] = setProject;
    workPackageReducer[`set${SERVICE}Unit`] = setUnit;
    workPackageReducer[`set${SERVICE}Subunit`] = setSubunit;
    workPackageReducer[`set${SERVICE}Section`] = setSection;
    workPackageReducer[`set${SERVICE}Subsection`] = setSubsection;
    workPackageReducer[`set${SERVICE}Item`] = setItem;

    workPackageReducer[`post${SERVICE}Project`] = postProject;
    workPackageReducer[`post${SERVICE}WorkPackage`] = postWorkPackage;

    workPackageReducer[`put${SERVICE}Project`] = putProject;
    workPackageReducer[`put${SERVICE}WorkPackage`] = putWorkPackage;

    workPackageReducer[`delete${SERVICE}Project`] = deleteProject;
    workPackageReducer[`delete${SERVICE}WorkPackage`] = deleteWorkPackage;
    return workPackageReducer;
};

const formatProject = ({ children = [] }) => {
    return children.map((project = {}) => {
        const { name, code } = project;
        return {
            ...project,
            label: name,
            value: code,
            children: formatProject(project)
        };
    });
};
