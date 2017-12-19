import React, {Component} from 'react';

export default class Topographicmaplist extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
				<iframe src="http://xaweb.simulate.com:8080/eccms/theme/ecidi/StandardUniform.html?_objName=FIX_MAP_INFO&_viewId=maplist&_menuId=f8c1691c-3e50-4cd8-b1e4-dd7f165fdba5" frameBorder="0"
						style={{width: '100%', height: '100%'}}></iframe>
		)
	}
}
