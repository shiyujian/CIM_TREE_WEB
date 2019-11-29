import React, { Component } from 'react';
import { Row, Button, Modal } from 'antd';
import { getForestImgUrl } from '_platform/auth';

export default class RiskDetail extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    // 树节点信息查看图片时格式转换
    _onImgClick (data) {
        let srcs = [];
        try {
            if (data) {
                let arr = data.split(',');
                arr.map(rst => {
                    let src = getForestImgUrl(rst);
                    srcs.push(src);
                });
            }
        } catch (e) {
            console.log('处理图片', e);
        }
        return srcs;
    }

    handleImgViewModalCancel = () => {
        this.props.onCancel();
    }

    render () {
        const { deviceMess } = this.props;
        // 照片
        let imgViewSrc = this._onImgClick(deviceMess.images);
        return (
            <Modal
                title='图片详情'
                visible
                footer={null}
                width={495}
                onOk={this.handleImgViewModalCancel.bind(this)}
                onCancel={this.handleImgViewModalCancel.bind(this)}
            >
                <div>
                    {
                        imgViewSrc.map((img, index) => {
                            return (
                                <img
                                    key={index}
                                    style={{ width: '450px', height: '450px' }}
                                    src={img}
                                    alt='图片' />
                            );
                        })
                    }
                    <Row style={{ marginTop: 10 }}>
                        <Button
                            onClick={this.handleImgViewModalCancel.bind(this)}
                            style={{ float: 'right' }}
                            type='primary'
                        >
                                关闭
                        </Button>
                    </Row>
                </div>

            </Modal>
        );
    }
}
