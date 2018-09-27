import React, { Component } from 'react';
import {
    Table,
    Modal,
    Row,
    Button
} from 'antd';
import { STATIC_DOWNLOAD_API } from '../../../_platform/api';
import moment from 'moment';

export default class CountTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }


    render () {

        let allcheckrecord = this.props.allcheckrecord;
        let dataSource = allcheckrecord;  

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
            dataIndex: 'extra_params.qinkuang',
            key: 'extra_params.qinkuang'
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

    previewFile(){

    }
}
