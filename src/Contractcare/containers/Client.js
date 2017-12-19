import React, {Component} from 'react';

export default class Client extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<iframe src="http://xaweb.simulate.com:8080/eccms/theme/ecidi/StandardUniform.html?_objName=COST_CONTACTINFO&_viewId=ProprietorList&_menuId=95bce18d-bf37-4554-ade9-3f8d5272f03c" frameBorder="0"
						style={{width: '100%', height: '100%'}}></iframe>
		)
	}
}
