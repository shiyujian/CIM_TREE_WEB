import React, {Component} from 'react';
import {Modal} from 'antd'
import styles from './style.css';
import {Video360_API} from '_platform/api';

export default class PanoramaManage extends Component {

	static propTypes = {};

	render() {
		let height=  document.querySelector('html').clientHeight - 80 - 36 - 52;
		return (
			<iframe id="overall-view" src={Video360_API}
					style={{position:'absolute',width:'100%',height:height+'px'}}
					className={styles.overall}></iframe>
		);
	}
}


