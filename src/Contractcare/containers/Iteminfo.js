import React, {Component} from 'react';

export default class Iteminfo extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<iframe src="http://xaweb.simulate.com:8080/eccms/theme/ecidi/StandardUniform.html?_objName=CONT_PRJINFO&_viewId=CONT_PRJINFO_list&_menuId=c9cb545e-3ed6-473a-8cbf-d8538eb053c2" frameBorder="0"
						style={{width: '100%', height: '100%'}}></iframe>
		)
	}
}
