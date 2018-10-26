import React, { Component } from 'react';
import {
    Table,
    Modal,
    Row,
    Button
} from 'antd';
import { FOREST_API } from '../../../_platform/api';
import moment from 'moment';

export default class CountTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            seeVisible: false, // 查看弹框
            record: null // 行数据
        };
    }

    render () {
        const { seeVisible, record } = this.state;
        let allcheckrecord = this.props.allcheckrecord;
        let dataSource = allcheckrecord;
        let imgs = null;
        if (record) {
            imgs = record.checkin_record.imgs;
        }

        const pagination = { // 设置每页显示的页数
            pageSize: 10
        };

        return (
            <div>
                <div>此次查询人数:</div>
                <Table
                    rowSelection={this.rowSelection}
                    dataSource={dataSource}
                    columns={this.columns}
                    pagination={pagination}
                    className='foresttables'
                    bordered
                    rowKey='code'
                />
                <Modal title='查看' visible={seeVisible}
                    onCancel={this.handleCancel}
                    style={{ textAlign: 'center' }}
                    footer={null}
                >
                    <img src={FOREST_API + '/' + imgs} width='100%' height='100%' alt='图片找不到了' />
                </Modal>
            </div>

        );
    }

    columns = [
        {
            title: '部门',
            dataIndex: 'extra_params.projectName',
            key: 'extra_params.projectName'
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '账号',
            dataIndex: 'extra_params.type',
            key: 'extra_params.type'
        },
        {
            title: '角色',
            dataIndex: 'extra_params.role',
            key: 'extra_params.role'
        },
        {
            title: '职务',
            dataIndex: 'extra_params.duty',
            key: 'extra_params.duty'
        },
        {
            title: '考勤群体',
            dataIndex: 'extra_params.group',
            key: 'extra_params.group'
        },
        {
            title: '上班时间',
            dataIndex: 'extra_params.starttime',
            key: 'extra_params.starttime'
        },
        {
            title: '下班时间',
            dataIndex: 'extra_params.endtime',
            key: 'extra_params.endtime'
        },
        {
            title: '出勤情况',
            dataIndex: 'extra_params.checkin',
            key: 'extra_params.checkin'
        },
        {
            title: '状态',
            dataIndex: 'extra_params.status',
            key: 'extra_params.status'
        },
        {
            title: '照片',
            render: (record, index) => {
                return (
                    <div>
                        <a onClick={this.previewFile.bind(this, record)}>
                            查看
                        </a>
                    </div>
                );
            }
        }
    ];

    previewFile (record) {
        this.setState({
            seeVisible: true,
            record: record
        });
    }

    handleCancel () {
        this.setState({
            seeVisible: false
        });
    }
}
