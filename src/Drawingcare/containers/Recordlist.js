import React, {Component} from 'react';

export default class Recordlist extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<iframe src="http://xaweb.simulate.com:8080/eccms/theme/ecidi/StandardUniform.html?_objName=FIX_DOC_FILE&_viewId=filelist&_menuId=8297bf31-8834-47b9-bb3b-0175963b49b7" frameBorder="0"
						style={{width: '100%', height: '100%'}}></iframe>
		)
	}
}
