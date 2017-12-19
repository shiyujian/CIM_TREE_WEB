import React, {Component} from 'react';

export default class Drawinglist extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<iframe src="http://xaweb.simulate.com:8080/eccms/theme/ecidi/StandardUniform.html?_objName=FIX_DOC_PRINT&_viewId=printlist&_menuId=a545c018-3940-43c2-9561-a3b2ba29d15a" frameBorder="0"
						style={{width: '100%', height: '100%'}}></iframe>
		)
	}
}
