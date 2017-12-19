import {createAction, handleActions} from 'redux-actions';
import {capitalize} from '../util';

export default (ID, service = '') => {
    const suffix = service.toUpperCase();
    service = capitalize(service);
    const push = createAction(`${ID}_PUSH_${suffix}`);
    const setItem = createAction(`${ID}_SET_ITEM_${suffix}`);
    const remove = createAction((`${ID}_REMOVE_ITEM_${suffix}`));
    const clear = createAction((`${ID}_CLEAR_ITEM_${suffix}`));

    const listReducer = handleActions({
        [push]: (state, {payload}) => ([...state, payload]),
        [setItem]: (state, {payload = {}}) => {
            return state.map(item => {
                if (payload.uid && item.uid === payload.uid) {
                    return payload;
                } else {
                    return item;
                }
            });
        },
        [remove]: (state, {payload}) => {
            return state.filter(item => item !== payload);
        },
        [clear]: () => ([]),
    }, []);

    listReducer[`push${service}`] = push;
    listReducer[`set${service}`] = setItem;
    listReducer[`remove${service}`] = remove;
    listReducer[`clear${service}`] = clear;
    return listReducer;
};
