import React, {Component} from 'react';

export default class Deposit extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<iframe src="http://xaweb.simulate.com:8080/eccms/theme/ecidi/StandardUniform.html?_objName=CONT_GUARANTEEMONEY&_viewId=CONT_GUARANTEEMONEY_list&_menuId=80142a4f-a349-4c2a-b8ea-8d158c84b67b" frameBorder="0"
					style={{width: '100%', height: '100%'}}></iframe>
		)
	}
}
