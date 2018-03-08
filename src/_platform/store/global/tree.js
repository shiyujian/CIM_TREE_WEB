import {createAction, handleActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {FOREST_API} from '../../api';

export const getTreeNodeListOK = createAction('获取森林大数据树节点')
export const getTreeNodeList = createFetchAction(`${FOREST_API}/tree/wpunittree`, [getTreeNodeListOK]); //    √
export const getLittleClassOK = createAction('获取森林大数据树小班细班信息')
export const getLittleClass = createFetchAction(`${FOREST_API}/tree/wpunitsbysuffixno?no={{no}}`,[getLittleClassOK])


export default handleActions({
    [getTreeNodeListOK]: (state, {payload}) => {
		let nodeLevel = [];
		let root = [];
		if (payload instanceof Array && payload.length > 0) {
			let level2 = [];
			root = payload.filter(node => {
				return node.Type === '项目工程' && nodeLevel.indexOf(node.No)===-1 && nodeLevel.push(node.No);
			})
			level2 = payload.filter(node => {
				return node.Type === '子项目工程' && nodeLevel.indexOf(node.No)===-1 && nodeLevel.push(node.No);
			})
			for (let i = 0; i<root.length; i++){
				root[i].children = level2.filter(node => {
					return node.Parent === root[i].No;
				})
			}
		}
		return {
			...state,
			treeList: root
		}
	},
	[getLittleClassOK]: (state, {payload}) => {
	    return {
	    	...state,
	    	littleClass: payload
	    }
    }
}, []);
