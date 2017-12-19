import React, {Component} from 'react';

import styles from './style.css';
import {Video360_API} from '_platform/api';

export default class Panorama extends Component {

	static propTypes = {};

	render() {
		let height =  document.querySelector('html').clientHeight - 80 - 36 - 52;
		let width =   document.querySelector('html').clientWidth - 160;
		const styleObj = {
			float: 'left',
			height,
			width,
		};
		return (
			<video loop autoPlay style={styleObj}>
				<source src={Video360_API} type="video/mp4"/>
			</video>
		);
	}
}
