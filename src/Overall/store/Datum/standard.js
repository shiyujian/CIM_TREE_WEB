import { createAction, handleActions } from 'redux-actions';

const ID = 'OVERALL_STANDARD';
// 获取目录状态
export const setGetDirStatus = createAction(`${ID}是否对目录进行修改，是否需要获取目录树`);
// 获取文档状态
export const setGetDocsStatus = createAction(`${ID}是否对文档进行修改，是否需要获取文档列表`);

export const actions = {
    setGetDirStatus,
    setGetDocsStatus
};

export default handleActions(
    {
        [setGetDirStatus]: (state, { payload }) => ({
            ...state,
            getDirStatus: payload
        }),
        [setGetDocsStatus]: (state, { payload }) => ({
            ...state,
            getDocsStatus: payload
        })
    },
    {}
);
