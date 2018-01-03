import React, {Component} from 'react';
import './Footer.less';
import copyright from './copyright.png';
import {loadFooterYear,loadFooterCompany} from 'APP/api';

export default class Footer extends Component {
	render() {
		const {match: {params: {module = ''} = {}} = {}} = this.props;
		const ignore = Footer.ignoreModules.some(m => m === module);
		if (ignore) {
			return null;
		}
		return (
			<footer className="footer">
				<span>&copy;{loadFooterYear}</span>
				<span>
					<a>
						{loadFooterCompany}
						{/* <img src={copyright}/> */}
					</a>
				</span>
			</footer>
		);
	}

	static ignoreModules = ['login'];
	// static ignoreModules = ['login', 'dashboard'];
}
