import { createAction, handleActions, combineActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import { capitalize } from '../util';
import { SERVICE_API } from '../../api';

const setProjectTree = createAction(`${ID}_SET_PROJECTS`);
const getProjectTree = createFetchAction(
    `${SERVICE_API}/project-tree/?depth=3`,
    [setProjectTree]
);

export default (ID, service = '') => {
    const suffix = service.toUpperCase();
    const SERVICE = capitalize(service);

    const workPackageReducer = handleActions(
        {
            [setProjectTree]: (state, { payload }) => ({
                ...state,
                projectTree: formatProject(payload)
            })
        },
        {}
    );

    workPackageReducer.getProjectTree = getProjectTree;
    workPackageReducer.setProjectTree = setProjectTree;
};

const formatProject = ({ children = [] }) => {
    return children.map((project = {}) => {
        const { name, code } = project;
        return {
            label: name,
            value: code,
            children: formatProject(project)
        };
    });
};
