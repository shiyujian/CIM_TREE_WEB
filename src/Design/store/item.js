import {createAction, handleActions} from 'redux-actions';

export default (ID) => {
	const fillItem = createAction(`${ID}_FILL_ITEM`);
	const deleteItem = createAction(`${ID}_DELETE_ITEM`);
	const appendItem = createAction(`${ID}_APPEND_ITEM`);
	const changeItemSuffix = createAction(`${ID}_CHANGE_ITEM_SUFFIX`);
	const itemReducer = handleActions({
		[fillItem]: (state, {payload = []}) => {
			return [...payload];
		},
		[deleteItem]: (state, action) => {
			state = state.filter(item => item !== action.payload);
			return [...state];
		},
		[appendItem]: (state, {payload}) => {
			return [
				...state,
				payload,
			];
		},
		[changeItemSuffix]: (state) => {
			return [...state];
		},
	}, []);

	itemReducer.fillItem = fillItem;
	itemReducer.deleteItem = deleteItem;
	itemReducer.appendItem = appendItem;
	itemReducer.changeItemSuffix = changeItemSuffix;

	return itemReducer;
};
