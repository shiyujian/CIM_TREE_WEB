import React, {Component} from 'react';
import './Footer.less';
import copyright from './copyright.png';
export default class Footer extends Component {
	render() {
		const {match: {params: {module = ''} = {}} = {}} = this.props;
		const ignore = Footer.ignoreModules.some(m => m === module);
		if (ignore) {
			return null;
		}
		return (
			<footer className="footer">
				<span>&copy;2017</span>
				<span>
					<a>
						中国雄安建设投资集团有限公司
						{/* <img src={copyright}/> */}
					</a>
				</span>
			</footer>
		);
	}

	static ignoreModules = ['login'];
	// static ignoreModules = ['login', 'dashboard'];
}
