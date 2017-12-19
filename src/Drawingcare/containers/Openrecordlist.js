import React, {Component} from 'react';

export default class Openrecordlist extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<iframe src="http://xaweb.simulate.com:8080/eccms/theme/ecidi/StandardUniform.html?_objName=FIX_DOC_INFO&_viewId=gwlist&_menuId=c888c0f4-53ff-48a5-82a9-8a4eb0482252" frameBorder="0"
						style={{width: '100%', height: '100%'}}></iframe>
		)
	}
}
