import React, {Component} from 'react';
import './Footer.less';
import {loadFooterYear, loadFooterCompany} from 'APP/api';

export default class Footer extends Component {
    render () {
        const {
            location: {pathname = ''} = {},
            match: {params: {module = ''} = {}} = {}
        } = this.props;
        const ignore = Footer.ignoreModules.some(m => m === module);
        if (ignore) {
            return null;
        }
        if (pathname === '/project/auxiliaryacceptance' || pathname === '/project/projectimage') {
            return null;
        }
        return (
            <footer className='footer'>
                <span>&copy;{loadFooterYear}</span>
                <span>
                    <a>
                        {loadFooterCompany}
                    </a>
                </span>
                <div>
                    <a href='http://www.beian.miit.gov.cn/' target='_Blank'>
                        浙ICP备18040969号-4
                    </a>
                </div>
            </footer>
        );
    }

	static ignoreModules = ['login', 'conservation', 'dashboard', 'checkwork', 'dipping'];
	// static ignoreModules = ['login', 'dashboard'];
}
