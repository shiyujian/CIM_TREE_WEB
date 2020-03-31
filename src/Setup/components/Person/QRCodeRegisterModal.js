import React, { Component } from 'react';
import { Modal, Form, Input, Notification } from 'antd';
import QRCode from 'qrcodejs2';
import './QRCodeRegisterModal.less';
export default class QRCodeRegisterModal extends Component {
    componentDidMount () {
        const {
            QRCodeRegisterValue
        } = this.props;
        // 设置参数方式
        let qecode = new QRCode(document.getElementById('qrcode'), {
            text: QRCodeRegisterValue,
            width: 560,
            height: 560,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
        console.log('qecode', qecode);
    }
    render () {
        return (
            <Modal
                title='二维码注册'
                visible
                width={600}
                footer={null}
                maskClosable={false}
                onOk={this.cancel.bind(this)}
                onCancel={this.cancel.bind(this)}
            >
                <div className='QRCodeRegisterModal-layout'>
                    <div className='QRCodeRegisterModal-title'>
                    请在雄安森林app注册界面扫码注册模块打开:
                    </div>
                    <div id='qrcode' />
                </div>
            </Modal>
        );
    }

    cancel () {
        this.props.handleCloseQRCodeRegisterModal();
    }
}
