import {createAction, handleActions} from 'redux-actions';

export default (ID) => {
	const fillContrast = createAction(`${ID}_FILL_CONTRAST`);
	const reloadContrast = createAction(`${ID}_RELOAD_CONTRAST`);
	const contrastReducer = handleActions({
		[reloadContrast]: (state) => [...state],
		[fillContrast]: (state, {payload}) => {
			const quantifiers = payload;
			const tagMap = {};
			quantifiers.forEach(quantifier => {
				const tag = quantifier.tag;
				if (tag) {
					if (!tagMap[tag]) {
						tagMap[tag] = [quantifier];
					} else {
						tagMap[tag].push(quantifier);
					}
				}
			});
			return Object.keys(tagMap).map(key => {
					const qs = tagMap[key];
					let quantity = 0;
					let techQuantity = 0;
					let name = '';
					let unit = '';
					let unit_price = '';
					qs.forEach(q => {
						name = q.tag;
						unit = q.unit;
						unit_price = q.unit_price;
						if (+q.quantity) quantity += +q.quantity;
						if (+q.techQuantity) techQuantity += +q.techQuantity;
					});
					return {
						key,
						name,
						unit,
						unit_price,
						quantity,
						techQuantity,
					};
				}) || [];
		},
	}, []);

	contrastReducer.fillContrast = fillContrast;
	contrastReducer.reloadContrast = reloadContrast;

	return contrastReducer;
};
