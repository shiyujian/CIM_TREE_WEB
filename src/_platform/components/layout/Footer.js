import React, {Component} from 'react';
import './Footer.less';
import copyright from './copyright.png';
import {loadFooterYear, loadFooterCompany} from 'APP/api';

export default class Footer extends Component {
    render () {
        const {
            location: {pathname = ''} = {},
            match: {params: {module = ''} = {}} = {}
        } = this.props;
        console.log('module', module);
        console.log('this.props', this.props);
        console.log('pathname', pathname);
        const ignore = Footer.ignoreModules.some(m => m === module);
        if (ignore) {
            return null;
        }
        return (
            <footer className='footer'>
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

	static ignoreModules = ['login', 'curing', 'dashboard', 'checkwork'];
	// static ignoreModules = ['login', 'dashboard'];
}
