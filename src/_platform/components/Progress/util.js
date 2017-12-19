/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */


export const ecidiEncodeURI = (to) =>{
	if(!to)
		return '';
	const index = to.indexOf('?name=');
	const index2 = to.indexOf('&');
	let string = '';
	if(index >=0 ){
		if(index2 >=0){
			string = to.substring(index+6,index2);
			string = encodeURIComponent(string);
			string = to.substring(0,index+6) + string + to.substring(index2);
		}else{
			string = to.substring(index+6);
			string = encodeURIComponent(string);
			string = to.substring(0,index+6) + string;
		}
	}
	return string;
}

export const actionsMap = (actions = {}) => {
	return Object.keys(actions).map(key => {
		return actions[key];
	});
};



//根据当前节点获取流程下一步节点集合
export function getNextStates(flowDetail,stateID) {
	let states = flowDetail.workflow.states;
	let transitions = flowDetail.workflow.transitions;
	let participants = [];
	//当前节点的action
	let currentActions = [];
	//各个节点的id和name的对应
	let stateRespond = [];
	//结束节点
	let endState = {};
	let currentId = '';
	let currentName = '';
	for(var i=0;i<states.length;i++) {
		//stateID是为了防止同时有多个state在执行中，而且执行的人和登录用户为一个人，从流程信息中无法进行判断
		if(states[i].status === 'processing' && states[i].id === stateID){
			//两个同时执行的流程的人都为登陆用户时，先把action清空，防止存入两个states的action
			currentActions = []
			currentId = states[i].id;
			currentName = states[i].name;
			for(var a=0;a<states[i].actions.length;a++){
				currentActions.push(states[i].actions[a])
			}
			console.log('currentActions',currentActions)

		}
		//找到结束节点
		if(states[i].state_type === 0){
			endState = {
				id: states[i].id,
				name: states[i].name
			}
		}
		//获取各个id对应的state情况
		stateRespond.push({
			id: states[i].id,
			name: states[i].name,
			roles: states[i].roles,
			orgs: states[i].orgs
		})
	}

	let nextStates = [];
	let action_name = '';
	let member_number = 0;
	let to_state = [];
	for(var c=0;c<currentActions.length;c++){
		//在新一个的action来之前，对数组进行清空
		member_number = 0;
		to_state = [];

		action_name = currentActions[c];

		for(var t=0;t<transitions.length;t++){
			if( (transitions[t].from_state === currentId) && (transitions[t].name === action_name) ){
				//结束节点不需要人员
				if(transitions[t].to_state === endState.id){
					member_number = 0;
				}else{
					//某个action对应的人员数
					member_number++;
					for(var s=0;s<stateRespond.length;s++){
						if(transitions[t].to_state === stateRespond[s].id ){
							to_state.push({
								id:transitions[t].to_state,
								name:stateRespond[s].name,
								roles: stateRespond[s].roles,
								orgs: stateRespond[s].orgs
							});
						}
					}
				}
			}
		}

		nextStates.push({
			member_number:member_number,
			to_state:to_state,
			action_name:action_name
		})
	}

	return nextStates;
}
