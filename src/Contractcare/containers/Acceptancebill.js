import React, {Component} from 'react';

export default class Acceptancebill extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<iframe src="http://xaweb.simulate.com:8080/eccms/theme/ecidi/StandardUniform.html?_objName=CONT_BILL&_viewId=cont_bill_list&_menuId=1b83298b-a8d2-43e5-af99-007984410fdb" frameBorder="0"
						style={{width: '100%', height: '100%'}}></iframe>
		)
	}
}
