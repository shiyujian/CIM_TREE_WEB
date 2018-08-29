import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import { WORKFLOW_API } from '../../api';
import { capitalize } from '../util';

const STATUS = {
    0: '编辑中',
    1: '已提交',
    2: '执行中',
    3: '已完成',
    4: '已废止',
    5: '异常'
};

export default (ID, service = '') => {
    const suffix = service.toUpperCase();
    const SERVICE = capitalize(service);
    const addTask = createAction(`${ID}_ADD_MY_TASK_${suffix}`);
    const getTaskOK = createAction(`${ID}_GET_MY_TASK_OK_${suffix}`);
    const getTask = createFetchAction(`${WORKFLOW_API}/instance/{{task_id}}/`, [
        getTaskOK
    ]);
    const taskReducer = handleActions(
        {
            [addTask]: (task = {}) => {
                const { state = {}, workflowactivity = {} } = task;
                const { participants: [{ executor }] = [] } = state; // todo 多个执行人
                const {
                    id,
                    name,
                    description,
                    status,
                    plan_start_time,
                    real_start_time,
                    deadline,
                    creator,
                    subject
                } = workflowactivity;
                const { username: creatorUsername, person_name: creatorName } =
                    creator || {};
                // const {person_name: executorName, username: executorUsername} = executor || {};
                const [{ id: subject_id, name: subject_name } = {}] = subject;
                const {
                    workflow: { name: type, code } = {}
                } = workflowactivity;
                const { current = [] } = workflowactivity;
                console.log('_platform task', task);
                let exeName =
                    task.state.participants && task.state.participants[0]
                        ? task.state.participants[0].executor.person_name
                        : ' ';
                if (current) {
                    exeName = '';
                    current.map(cur => {
                        let participant = cur.participants;
                        participant.map(par => {
                            if (par.executor) {
                                exeName +=
                                    (par.executor.person_name ||
                                        par.executor.username) + '  ';
                            }
                        });
                    });
                }
                return {
                    id,
                    name,
                    type,
                    description,
                    status: STATUS[status] || '',
                    creatorName: creatorName || creatorUsername,
                    executorName: exeName,
                    creator,
                    subject_id,
                    subject_name,
                    subject,
                    real_start_time,
                    plan_start_time,
                    deadline,
                    state
                };
            },
            [getTaskOK]: (state, { payload = {} }) => {
                const {
                    id,
                    name,
                    description,
                    status,
                    plan_start_time,
                    real_start_time,
                    deadline,
                    creator,
                    current = {},
                    workflow = {},
                    subject = [],
                    history = []
                } = payload;

                const { participants = [] } = current || {}; // todo 多个执行人
                const { username: creatorUsername, person_name: creatorName } =
                    creator || {};
                const [{ id: subject_id, name: subject_name } = {}] = subject;
                const { name: type, states = [], transitions = [] } = workflow;
                return {
                    id,
                    name,
                    type,
                    description,
                    status: STATUS[status] || '',
                    creatorName: creatorName || creatorUsername,
                    creator,
                    subject_id,
                    participants,
                    subject_name,
                    subject,
                    real_start_time,
                    plan_start_time,
                    deadline,
                    current,
                    history,
                    states,
                    transitions,
                    workflow
                };
            }
        },
        {}
    );
    taskReducer[`add${SERVICE}Task`] = addTask;
    taskReducer[`get${SERVICE}Task`] = getTask;
    taskReducer[`get${SERVICE}TaskOK`] = getTaskOK;
    return taskReducer;
};
