import { createAction, handleActions } from 'redux-actions';
// 查询当前单位下的所有人员信息
const getCheckListAcOK = createAction('QUERY查询当前单位下人员信息考勤记录');
export const actions = {
    getCheckListAcOK
};
export default handleActions({
    [getCheckListAcOK]: (state, { payload }) => ({
        ...state,
        checkList: payload
    })
}, {});
