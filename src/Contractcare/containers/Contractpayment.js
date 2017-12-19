import React, {Component} from 'react';

export default class Contractpayment extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<iframe src="http://xaweb.simulate.com:8080/eccms/theme/ecidi/StandardUniform.html?_objName=CONT_PAY&_viewId=CONT_PAY_list&_menuId=26d3d856-06a2-4361-a510-5c4194c0634a" frameBorder="0"
						style={{width: '100%', height: '100%'}}></iframe>
		)
	}
}
