import React, { Component } from 'react';
import { Button, Modal, Row } from 'antd';

export default class PicViewModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: true,
            fileList: []
        };
    }

    render () {
        const {
            imgSrcs
        } = this.props;
        return (
            <Modal
                width={522}
                title='图片详情'
                style={{ textAlign: 'center' }}
                visible
                onOk={this.handleCancel.bind(this)}
                onCancel={this.handleCancel.bind(this)}
                footer={null}
            >
                {
                    imgSrcs.map((img) => {
                        return (
                            <img style={{ width: '490px' }} src={img} alt='图片' />
                        );
                    })
                }
                <Row style={{ marginTop: 10 }}>
                    <Button
                        onClick={this.handleCancel.bind(this)}
                        style={{ float: 'right' }}
                        type='primary'
                    >
                        关闭
                    </Button>
                </Row>
            </Modal>
        );
    }

    handleCancel = () => {
        this.props.onCancel();
    }
}
