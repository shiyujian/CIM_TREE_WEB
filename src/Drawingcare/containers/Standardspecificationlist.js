import React, {Component} from 'react';

export default class Standardspecificationlist extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<iframe src="http://xaweb.simulate.com:8080/eccms/theme/ecidi/StandardUniform.html?_objName=FIX_STANDARD_INFO&_viewId=gflist&_menuId=a3396ef3-3467-4c46-91c4-e31d472ee42c" frameBorder="0"
						style={{width: '100%', height: '100%'}}></iframe>
		)
	}
}
