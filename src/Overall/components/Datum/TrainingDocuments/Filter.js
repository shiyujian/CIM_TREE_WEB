import React, { Component } from 'react';
import {
    Button,
    Row,
    Col,
    Notification,
    Popconfirm
} from 'antd';

export default class Filter extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    handleAddDoc () {
        this.props.handleAddDoc();
    }

    handleCancelDelete () {

    }

    // 删除
    handleDeleteDoc = async () => {
        const {
            dataSourceSelected
        } = this.props;
        this.props.handleDeleteDocs(dataSourceSelected);
    }

    render () {
        const {
            dataSourceSelected,
            leftKeyCode,
            operatePermission,
            isLeaf
        } = this.props;
        return (
            <div>
                {
                    operatePermission
                        ? <Row gutter={24} style={{marginBottom: 20}}>
                            <Col span={24}>
                                <Button
                                    disabled={!(leftKeyCode && isLeaf && operatePermission)}
                                    style={{ marginRight: 10 }}
                                    type='primary'
                                    onClick={this.handleAddDoc.bind(this)}
                                >
                                新增
                                </Button>
                                {
                                    dataSourceSelected.length === 0 ? (
                                        <Button
                                            style={{ marginRight: 10 }}
                                            disabled
                                            type='danger'
                                        >
                                    删除
                                        </Button>
                                    ) : (
                                        <Popconfirm
                                            title='确定要删除文件吗？'
                                            onConfirm={this.handleDeleteDoc.bind(this)}
                                            onCancel={this.handleCancelDelete.bind(this)}
                                            okText='Yes'
                                            cancelText='No'
                                        >
                                            <Button
                                                style={{ marginRight: 10 }}
                                                type='danger'
                                            >
                                        删除
                                            </Button>
                                        </Popconfirm>
                                    )
                                }
                            </Col>
                        </Row> : ''
                }
            </div>

        );
    }
}
