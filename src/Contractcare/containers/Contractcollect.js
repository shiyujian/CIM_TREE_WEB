import React, {Component} from 'react';

export default class Contractcollect extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<iframe src="http://xaweb.simulate.com:8080/eccms/theme/ecidi/StandardUniform.html?_objName=CONT_RECEIVE&_viewId=CONT_RECEIVE_list&_menuId=4c6e0e4e-70d4-4de5-bb4a-893dd78d0a65" frameBorder="0"
						style={{width: '100%', height: '100%'}}></iframe>
		)
	}
}
