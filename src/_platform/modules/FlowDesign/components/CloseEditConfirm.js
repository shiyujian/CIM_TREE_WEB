import React from 'react';
import { bool, func, string } from 'prop-types';
import { Modal, Input } from 'antd';

class CloseEditConfirm extends React.Component {
    static propTypes = {
        title: string,
        visible: bool,
        content: string,
        onOk: func,
        onExit: func,
        onCancel: func
    };

    handleOk = () => {
        if (typeof this.props.onOk === 'function') {
            this.props.onOk();
        }
    };

    handleExit = () => {
        if (typeof this.props.onExit === 'function') {
            this.props.onExit();
        }
    };

    handleCancel = () => {
        if (typeof this.props.onCancel === 'function') {
            this.props.onCancel();
        }
    };

    render () {
        const {
            title,
            visible,
            content,
            onOk,
            onExit,
            onCancel,
            ...props
        } = this.props;

        return (
            <Modal visible={visible} footer={null}>
                <div className='ant-modal-body'>
                    <div className='ant-confirm-body-wrapper'>
                        <div className='ant-confirm-body'>
                            <i className='anticon anticon-question-circle' />
                            <span className='ant-confirm-title'>{title}</span>
                            <div className='ant-confirm-content'>{content}</div>
                        </div>

                        <div className='ant-confirm-btns'>
                            <button
                                type='button'
                                className='ant-btn ant-btn-danger ant-btn-lg'
                                onClick={this.handleOk}
                            >
                                <span>是</span>
                            </button>
                            <button
                                type='button'
                                className='ant-btn ant-btn-lg'
                                onClick={this.handleExit}
                            >
                                <span>否</span>
                            </button>
                            <button
                                type='button'
                                className='ant-btn ant-btn-lg'
                                onClick={this.handleCancel}
                            >
                                <span>取消</span>
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default CloseEditConfirm;
