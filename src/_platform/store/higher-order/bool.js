import {createAction, handleActions} from 'redux-actions';

export default (ID, service = '') => {
    const suffix = service.toUpperCase();
    service = capitalize(service);
    const toggle = createAction(`${ID}_TOGGLE_${suffix}`);
    const booleanReducer = handleActions({
        [toggle]: (state, {payload}) => (payload),
    }, false);
    booleanReducer[`toggle${service}`] = toggle;
    return booleanReducer;
};

const capitalize = (string = '') => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
