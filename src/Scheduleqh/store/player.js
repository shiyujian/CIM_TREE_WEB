import {createAction, handleActions} from 'redux-actions';

export const play = createAction('PLAY_DGN');
export const stop = createAction('STOP_DGN');
export const step = createAction('SET_STEP');
export const range = createAction('SET_RANGE');
export default handleActions({
	[play]: (state) => {
		const {progress = 0, step} = state;
		return {
			...state,
			progress: progress + step,
			playing: true
		};
	},
	[stop]: (state, {payload}) => ({
		...state,
		progress: 0,
		playing: false
	}),
	[step]: (state, {payload}) => ({
		...state,
		step: payload
	}),
	[range]: (state, {payload}) => ({
		...state,
		range: payload
	})
}, {progress: 0, step: 1});