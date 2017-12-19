import React, {Component} from 'react';

export default class Contractchange extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<iframe src="http://xaweb.simulate.com:8080/eccms/theme/ecidi/StandardUniform.html?_objName=CONT_CONTCHANGE&_viewId=CONT_CONTCHANGE_list&_menuId=ba35ece0-ce76-4b16-89c8-5271e9ad90d5" frameBorder="0"
						style={{width: '100%', height: '100%'}}></iframe>
		)
	}
}
