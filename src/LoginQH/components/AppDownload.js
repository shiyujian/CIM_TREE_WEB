import React, { Component } from 'react';
import {
    Form
} from 'antd';
import QRCode from 'qrcodejs2';
import {
    clearUser
} from '_platform/auth';
import './Login.less';
import returnIcon from './loginImages/arrow1.png';

class AppDownload extends Component {
    static propTypes = {};

    constructor (props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount () {
        const {
            APKUpdateInfo
        } = this.props;
        let qrcode = new QRCode(document.getElementById('qrcode'), {
            text: APKUpdateInfo.url,
            width: 210,
            height: 210,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
        console.log('qrcode', qrcode);
    }
    // 返回登录
    handleAppDownloadCancel = () => {
        this.props.handleAppDownloadCancel();
    }
    render () {
        const {
            APKUpdateInfo
        } = this.props;

        return (
            <div className='main-box'>
                <div className='main-img'>
                    <div style={{marginLeft: 31}}>
                        <div className='appDownload-title'>
                            雄安森林APP下载：
                        </div>
                        <div>
                            <span className='appDownloadTips' >
                                请用浏览器打开
                            </span>
                        </div>
                        <div id='qrcode' className='QRCodeLayout' />
                        <div className='appDownload-edition'>
                            {APKUpdateInfo.versionName}版本
                        </div>
                        <a key='返回'
                            title='返回'
                            id='frogetPasswordReturnButton'
                            className='froget-password-return-button'
                            onClick={this.handleAppDownloadCancel.bind(this)}
                        >
                            <span className='froget-password-return-button-text'>
                                            返回
                            </span>
                            <img src={returnIcon} />
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default Form.create()(AppDownload);
