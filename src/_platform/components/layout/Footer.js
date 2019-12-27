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
                <span>Copyright</span>
                <span>&copy;{loadFooterYear}</span>
                <span>
                    <a>
                        {loadFooterCompany}&nbsp; |
                    </a>
                </span>
                <span>
                    <a href='http://www.beian.miit.gov.cn/' target='_Blank'>
                        浙ICP备18040969号-4
                    </a>
                </span>
            </footer>
        );
    }

	static ignoreModules = ['login', 'conservation', 'dashboard', 'checkwork', 'dipping'];
	// static ignoreModules = ['login', 'dashboard'];
}
