import {injectReducer} from '../store';
import React, {Component} from 'react';

export default class ModelDown extends Component {

	async componentDidMount() {
		const {default: reducer} = await import('./store');
		const Containers = await import('./containers');
		injectReducer('down', reducer);
		console.log('------------------------------ModelDown');
		this.setState({
			...Containers,
		})
	}

	render() {
		const {ModelDown = null} = this.state || {};
		return (
			<div style={{ height: 'calc( 100% - 80px )'}}>
				{ModelDown && <ModelDown {...this.props}/>}
			</div>
		);
	}
};