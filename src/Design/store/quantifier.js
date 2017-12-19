import {createAction, handleActions} from 'redux-actions';

export default (ID) => {
	const deleteQuantifier = createAction(`${ID}_DELETE_QUANTIFIER`);
	const addQuantifier = createAction(`${ID}_ADD_QUANTIFIER`);
	const editQuantifier = createAction(`${ID}_EDIT_QUANTIFIER`);
	const saveQuantifier = createAction(`${ID}_SAVE_QUANTIFIER`);
	const fillQuantifier = createAction(`${ID}_FILL_QUANTIFIER`);
	const reloadQuantifier = createAction(`${ID}_RELOAD_QUANTIFIER`);

	const quantifierReducer = handleActions({
		[reloadQuantifier]: (state) => [...state],
		[addQuantifier]: (state, {payload}) => {
			return [...state, payload];
		},
		[deleteQuantifier]: (state, {payload}) => {
			return state.filter(q => q !== payload);
		},
		[editQuantifier]: (state, {payload}) => {
			payload.editing = true;
			return [...state];
		},
		[saveQuantifier]: (state) => {
			return [...state];
		},
		[fillQuantifier]: (state, action) => {
			const items = action.payload;
			return items.map(item => {
				return {
					code: item.code,
					item: item.name,
				};
			});
		},
	}, []);

	quantifierReducer.deleteQuantifier = deleteQuantifier;
	quantifierReducer.addQuantifier = addQuantifier;
	quantifierReducer.editQuantifier = editQuantifier;
	quantifierReducer.saveQuantifier = saveQuantifier;
	quantifierReducer.fillQuantifier = fillQuantifier;
	quantifierReducer.reloadQuantifier = reloadQuantifier;

	return quantifierReducer;
};
