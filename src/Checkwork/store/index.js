import { handleActions, combineActions } from 'redux-actions';
import { actionsMap } from '_platform/store/util';
import electronicFenceReducer, { actions as electronicFenceActions } from './electronicFence';
import attendanceCountReducer, { actions as attendanceCountActions } from './attendanceCount';
import attendanceGroupReducer, { actions as attendanceGroupActions } from './attendanceGroup';

export default handleActions(
    {
        [combineActions(...actionsMap(electronicFenceActions))]: (
            state = {},
            action
        ) => ({
            ...state,
            electronicFence: electronicFenceReducer(state.electronicFence, action)
        }),
        [combineActions(...actionsMap(attendanceCountActions))]: (
            state = {},
            action
        ) => ({
            ...state,
            attendanceCount: attendanceCountReducer(state.attendanceCount, action)
        }),
        [combineActions(...actionsMap(attendanceGroupActions))]: (
            state = {},
            action
        ) => ({
            ...state,
            attendanceGroup: attendanceGroupReducer(state.attendanceGroup, action)
        })
    },
    {}
);
