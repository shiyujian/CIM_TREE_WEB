import React, { Component } from 'react';
import { Table } from 'antd';
import './index.less';

export default class GeneralTable extends Component {
    render () {
        const { Doc = [] } = this.props;
        return (
            <div>
                <Table
                    rowSelection={this.rowSelection}
                    dataSource={Doc}
                    columns={this.columns}
                    className='foresttables'
                    bordered rowKey='code' />
            </div>

        );
    }

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            const { actions: { selectDocuments } } = this.props;
            selectDocuments(selectedRows);
        }
    };

    columns = [
        {
            title: '工程名称',
            dataIndex: 'extra_params.engineer',
            key: 'extra_params.engineer'
        }, {
            title: '主题',
            dataIndex: 'extra_params.theme',
            key: 'extra_params.theme'
        }, {
            title: '文档类型',
            dataIndex: 'extra_params.style',
            key: 'extra_params.style'
        }, {
            title: '编号',
            dataIndex: 'extra_params.number',
            key: 'extra_params.number'
        }, {
            title: '提交人',
            dataIndex: 'submitPerson',
            key: 'submitPerson'
        }, {
            title: '提交时间',
            dataIndex: 'submitTime',
            key: 'submitTime'
        }, {
            title: '流程状态',
            dataIndex: 'flowStyle',
            key: 'flowStyle'
        }, {
            title: '操作',
            render: (text, record, index) => {
                const { Doc = [] } = this.props;

                let nodes = [];
                nodes.push(
                    <div>
                        <a onClick={this.previewFile.bind(this, Doc[index])}>预览</a>
                        <a style={{ marginLeft: 10 }}
                            href={Doc[index].basic_params.files[0].a_file}>下载
                        </a>
                    </div>
                    // )
                );
                return nodes;
            }
        }
    ];

    // 文件预览
    previewFile (file) {
        const { actions: { openPreview } } = this.props;
        if (JSON.stringify(file.basic_params) == '{}') {

        } else {
            const filed = file.basic_params.files[0];
            openPreview(filed);
        }
    }

    static layoutT = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };
}
