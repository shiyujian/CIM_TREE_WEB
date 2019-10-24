import React, { Component } from 'react';
import { Table, Divider, Notification } from 'antd';
import moment from 'moment';
import Filter from './Filter';
import {getUser} from '_platform/auth';

export default class GeneralTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            addVisible: false,
            docList: [],
            selectedRowKeys: [],
            dataSourceSelected: [] // 这个不设置不影响正常使用
        };
    }
    columns = [
        {
            title: '类别',
            dataIndex: 'DirName',
            key: 'DirName'
        },
        {
            title: '名称',
            dataIndex: 'DocName',
            key: 'DocName'
        },
        {
            title: '发布时间',
            dataIndex: 'CreateTime',
            key: 'CreateTime'
        },
        {
            title: '发布单位',
            dataIndex: 'DocAbstract',
            key: 'DocAbstract',
            render: (text, record, index) => {
                if (text) {
                    let docCompanyMessage = JSON.parse(text);
                    return <span>
                        {(docCompanyMessage && docCompanyMessage.OrgName) || '/'}
                    </span>;
                } else {
                    return '/';
                }
            }
        },
        {
            title: '发布人',
            dataIndex: 'CreaterObj',
            key: 'CreaterObj',
            render: (text, record, index) => {
                if (text && text.Full_Name) {
                    return <span>{text.Full_Name}</span>;
                } else if (text && text.User_Name) {
                    return <span>{text.User_Name}</span>;
                } else {
                    return '/';
                }
            }
        },
        {
            title: '备注',
            dataIndex: 'DocDescribe',
            key: 'DocDescribe'
        },
        {
            title: '操作',
            render: (record, index) => {
                const {
                    isPermission
                } = this.props;
                const user = getUser();
                let deletePermission = false;
                if (isPermission) {
                    deletePermission = true;
                }
                if (user.ID && user.ID === record.Creater) {
                    deletePermission = true;
                }
                return (
                    <div>
                        {/* <a onClick={this.previewFile.bind(this, record)}>
                            预览
                        </a> */}
                        <a
                            type='primary'
                            onClick={this.download.bind(this, record)}
                        >
                            下载
                        </a>
                        {
                            deletePermission
                                ? <span>
                                    <Divider type='vertical' />
                                    <a onClick={this.handleDeleteFile.bind(this, record)}>
                                        删除
                                    </a>
                                </span> : ''
                        }
                    </div>
                );
            }
        }
    ];
    componentWillReceiveProps = async (nextProps) => {
        const {
            getDocsStatus,
            leftKeyCode
        } = nextProps;
        const {
            actions: {
                getDocsList
            }
        } = this.props;
        if (leftKeyCode && leftKeyCode !== this.props.leftKeyCode) {
            // 获取目录树
            let data = await getDocsList({}, {
                dirid: leftKeyCode
            });
            console.log('data', data);
            let docList = [];
            if (data && data.content && data.content instanceof Array) {
                docList = data.content;
            }
            this.setState({
                docList
            });
        }
        if (getDocsStatus && getDocsStatus !== this.props.getDocsStatus) {
            // 获取目录树
            let data = await getDocsList({}, {
                dirid: leftKeyCode
            });
            console.log('data', data);
            let docList = [];
            if (data && data.content && data.content instanceof Array) {
                docList = data.content;
            }
            this.setState({
                docList
            });
        }
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        // selectedRowKeys为选中行的index数组，例如[1,2,3,4]
        console.log('selectedRowKeys', selectedRowKeys);
        // selectedRows为选中行的具体数据，是每一个选中行的record数组
        console.log('selectedRows', selectedRows);
        this.setState({
            selectedRowKeys,
            dataSourceSelected: selectedRows
        });
    }
    // 批量删除
    handleDeleteDocs = () => {
        this.setState({
            selectedRowKeys: [],
            dataSourceSelected: []
        });
    }
    // 删除文档
    handleDeleteFile = async (record) => {
        const {
            actions: {
                deleteDoc,
                setGetDocsStatus
            }
        } = this.props;
        let postData = {
            id: record.ID
        };
        const data = await deleteDoc(postData);
        console.log('data', data);
        if (data && data.code && data.code === 1) {
            Notification.success({
                message: '删除文档成功',
                duration: 3
            });
            // 在删除之后需要将选中数组清空
            this.handleDeleteDocs();
            setGetDocsStatus(moment().unix());
        } else {
            Notification.error({
                message: '删除文档失败',
                duration: 3
            });
        }
    }
    download (record) {
        this.createLink(this, record.DocEnclosure);
    }
    createLink = (name, url) => {
        // 下载
        let link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', this);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    previewFile (file) {

    }

    render () {
        const {
            docList = [],
            selectedRowKeys = []
        } = this.state;
        // 设置多选框
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange // 这个为多选框的选中函数
        };
        return (
            <div>
                <Filter
                    {...this.state}
                    {...this.props}
                    handleDeleteDocs={this.handleDeleteDocs.bind(this)}
                />
                <Table
                    rowSelection={rowSelection}
                    dataSource={docList}
                    columns={this.columns}
                    className='foresttables'
                    bordered
                    rowKey='code'
                />
            </div>

        );
    }
}
