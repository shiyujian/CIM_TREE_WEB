import React, {Component} from 'react';

export default class Pretaxinfo extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<iframe src="http://xaweb.simulate.com:8080/eccms/theme/ecidi/StandardUniform.html?_objName=CONT_VATINFO&_viewId=CONT_VATINFO_list&_menuId=34fb6603-3a3d-4ece-b7bc-0aa58897c642" frameBorder="0"
						style={{width: '100%', height: '100%'}}></iframe>
		)
	}
}
