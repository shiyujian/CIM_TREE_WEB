/**
 * Created by tinybear on 17/6/6.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

@connect(
	state => {
		return {aside: state.aside};
	},
	dispatch => ({
		actions: bindActionCreators({}, dispatch),
	}),
)
class AsideRight extends Component {
	constructor(props) {
		super(props);
	}

	static propTypes = {};

	render() {
		const {aside} = this.props;
		return (
			<div className={{
				position: 'absolute',
				top: 0,
				right: 0,
				left: 178,
				transition: 'left 0.3s',
				height: 'calc(100% - 53px)'
			}} style={!aside ? {'left': '48px'} : {}}>
				{this.props.children}
			</div>);
	}
}

export default AsideRight;
