import React, {Component} from 'react';

export default class Maininvoice extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<iframe src="http://xaweb.simulate.com:8080/eccms/theme/ecidi/StandardUniform.html?_objName=CONT_CONTINFO_EPCINVOICE&_viewId=CONT_CONTINFO_EPCINVOICE_list&_menuId=6ff10857-bfa4-48ce-9b30-7c4b6039d819" frameBorder="0"
						style={{width: '100%', height: '100%'}}></iframe>
		)
	}
}
