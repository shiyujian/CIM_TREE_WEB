import React, {Component} from 'react';

export default class Subinvoice extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<iframe src="http://xaweb.simulate.com:8080/eccms/theme/ecidi/StandardUniform.html?_objName=CONT_CONTINFO_SUBINVOICE&_viewId=CONT_CONTINFO_SUBINVOICE_list&_menuId=570955ec-364f-485e-b8d7-bbaec7b3b3a2" frameBorder="0"
						style={{width: '100%', height: '100%'}}></iframe>
		)
	}
}
