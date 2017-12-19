import React, {Component} from 'react';

export default class Client extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<iframe src="http://xaweb.simulate.com:8080/eccms/theme/ecidi/StandardUniform.html?_objName=CONT_RIGHT&_viewId=Cont_Right_list&_menuId=e2227db9-8227-4054-881c-33eac4d67425" frameBorder="0"
						style={{width: '100%', height: '100%'}}></iframe>
		)
	}
}
