import { handleActions, combineActions } from 'redux-actions';
import { actionsMap } from '_platform/store/util';
import taskTeamReducer, { actions as taskTeamActions } from './taskTeam';
import taskCreateReducer, { actions as taskCreateActions } from './taskCreate';
// import taskReportReducer, { actions as taskReportActions } from './taskReport';
// import taskStatisReducer, { actions as taskStatisActions } from './taskStatis';

export default handleActions(
    {
        [combineActions(...actionsMap(taskTeamActions))]: (
            state = {},
            action
        ) => ({
            ...state,
            taskTeam: taskTeamReducer(state.taskTeam, action)
        }),
        [combineActions(...actionsMap(taskCreateActions))]: (
            state = {},
            action
        ) => ({
            ...state,
            taskCreate: taskCreateReducer(state.taskCreate, action)
        })
        // [combineActions(...actionsMap(taskReportActions))]: (
        //     state = {},
        //     action
        // ) => ({
        //     ...state,
        //     taskReport: taskReportReducer(state.taskReport, action)
        // }),
        // [combineActions(...actionsMap(taskStatisActions))]: (
        //     state = {},
        //     action
        // ) => ({
        //     ...state,
        //     taskStatis: taskStatisReducer(state.taskStatis, action)
        // })
    },
    {}
);
