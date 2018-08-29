import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import { WORKFLOW_API } from '../../api';
import { capitalize } from '../util';
import TaskFactory from './task';

export default (ID, service = '') => {
    const suffix = service.toUpperCase();
    const SERVICE = capitalize(service);
    const taskReducer = TaskFactory(ID);
    const getTasksOK = createAction(`${ID}_GET_TASKS_OK_${suffix}`);
    const getTasks = createFetchAction(`${WORKFLOW_API}/participant-task/`, [
        getTasksOK
    ]);
    const tasksReducer = handleActions(
        {
            [getTasksOK]: (state, { payload = [] }) => {
                return payload.map(task =>
                    taskReducer(task, { type: taskReducer.addTask })
                );
            }
        },
        []
    );

    tasksReducer[`get${SERVICE}Tasks`] = getTasks;
    tasksReducer[`get${SERVICE}TasksOK`] = getTasksOK;
    return tasksReducer;
};
