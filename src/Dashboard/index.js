import {injectReducer} from '../store';
import React, {Component} from 'react';

export default class Dashboard extends Component {

	async componentDidMount() {
		const {default: reducer} = await import('./store');
		const Containers = await import('./containers');
		injectReducer('dashboard', reducer);
		this.setState({
			...Containers
		});
	}

	render() {
		const {Map = null} = this.state || {};
		return (
			<div style={{position: 'relative', width: '100%', height: 'calc( 100% - 80px )'}}>
				{Map && <Map {...this.props}/>}
			</div>)
	}
};
