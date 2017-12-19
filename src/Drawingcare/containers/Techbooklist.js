import React, {Component} from 'react';

export default class Techbooklist extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<iframe src="http://xaweb.simulate.com:8080/eccms/theme/ecidi/StandardUniform.html?_objName=FIX_BOOKS_INFO&_viewId=bookslist&_menuId=bcadd00a-9b25-4b76-9817-875b6724d0df" frameBorder="0"
						style={{width: '100%', height: '100%'}}></iframe>
		)
	}
}
