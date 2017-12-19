import React, {Component} from 'react';

export default class Audiovisualrecordlist extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<iframe src="http://xaweb.simulate.com:8080/eccms/theme/ecidi/StandardUniform.html?_objName=FIX_MEDIA_DATA&_viewId=medialist&_menuId=3a1ef4e7-d017-45dd-83ee-06b8ddea5e47" frameBorder="0"
						style={{width: '100%', height: '100%'}}></iframe>
		)
	}
}
