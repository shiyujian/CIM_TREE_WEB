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
