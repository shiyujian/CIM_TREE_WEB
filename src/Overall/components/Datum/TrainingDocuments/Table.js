import React, { Component } from 'react';
import { Table, Divider, Notification } from 'antd';
import moment from 'moment';
import Filter from './Filter';
import AddDoc from './AddDoc';
import {getUser} from '_platform/auth';

export default class GeneralTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            changeTableLoading: false,
            docList: [],
            selectedRowKeys: [],
            dataSourceSelected: [], // 这个不设置不影响正常使用
            addDocVisible: false
        };
    }
    columns = [
        {
            title: '目录名',
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
        // {
        //     title: '发布单位',
        //     dataIndex: 'DocAbstract',
        //     key: 'DocAbstract',
        //     render: (text, record, index) => {
        //         if (text) {
        //             let docCompanyMessage = JSON.parse(text);
        //             return <span>
        //                 {(docCompanyMessage && docCompanyMessage.OrgName) || '/'}
        //             </span>;
        //         } else {
        //             return '/';
        //         }
        //     }
        // },
        // {
        //     title: '发布人',
        //     dataIndex: 'CreaterObj',
        //     key: 'CreaterObj',
        //     render: (text, record, index) => {
        //         return '管理员';
        //     }
        // },
        {
            title: '备注',
            dataIndex: 'DocDescribe',
            key: 'DocDescribe'
        },
        {
            title: '操作',
            render: (record, index) => {
                const {
                    operatePermission,
                    downloadPermission
                } = this.props;
                return (
                    <div>
                        {
                            downloadPermission
                                ? <a
                                    type='primary'
                                    onClick={this.download.bind(this, record)}
                                >
                                下载
                                </a> : ''
                        }
                        {
                            operatePermission
                                ? <span>
                                    <a
                                        type='primary'
                                        onClick={this.download.bind(this, record)}
                                    >
                                        下载
                                    </a>
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
    componentDidUpdate = async (prevProps, prevState) => {
        const {
            getDocsStatus,
            leftKeyCode
        } = this.props;
        if (leftKeyCode && leftKeyCode !== prevProps.leftKeyCode) {
            this.handleQueryDocsList();
        }
        if (getDocsStatus && getDocsStatus !== prevProps.getDocsStatus) {
            this.handleQueryDocsList();
        }
    }
    handleQueryDocsList = async () => {
        const {
            leftKeyCode,
            actions: {
                getDocsList
            }
        } = this.props;
        // 获取文档列表
        try {
            this.setState({
                changeTableLoading: true
            });
            let data = await getDocsList({}, {
                dirid: leftKeyCode
            });
            console.log('data', data);
            let docList = [];
            if (data && data.content && data.content instanceof Array) {
                docList = data.content;
            }
            this.setState({
                docList,
                changeTableLoading: false
            });
        } catch (e) {
            console.log('handleQueryDocsList', e);
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
    // 删除文档
    handleDeleteFile = async (record) => {
        const {
            actions: {
                deleteDoc
            }
        } = this.props;
        this.setState({
            changeTableLoading: true
        });
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
            this.handleClearSelectedKeys();
        } else {
            Notification.error({
                message: '删除文档失败',
                duration: 3
            });
            this.setState({
                changeTableLoading: false
            });
        }
    }
    // 批量删除
    handleDeleteDocs = async (dataSourceSelected = []) => {
        const {
            actions: {
                deleteDoc
            }
        } = this.props;
        if (dataSourceSelected.length === 0) {
            Notification.warning({
                message: '请先选择数据！',
                duration: 3
            });
        } else {
            this.setState({
                changeTableLoading: true
            });
            // 获取选中节点ID
            let dataList = dataSourceSelected.map((data) => {
                if (data && data.ID) {
                    return data.ID;
                }
            });
            // 请求数组
            let promises = dataList.map((detail) => {
                let data = detail;
                let postdata = {
                    id: data
                };
                return deleteDoc(postdata);
            });

            let rst = await Promise.all(promises);
            console.log('rst', rst);
            if (rst && rst instanceof Array && rst.length > 0) {
                Notification.success({
                    message: '删除文件成功！',
                    duration: 3
                });
                // 在删除之后需要将选中数组清空
                this.handleClearSelectedKeys();
            } else {
                Notification.error({
                    message: '删除文件失败！',
                    duration: 3
                });
                this.setState({
                    changeTableLoading: false
                });
            }
        }
    }
    // 清除选中节点
    handleClearSelectedKeys = async () => {
        this.setState({
            selectedRowKeys: [],
            dataSourceSelected: []
        });
        await this.handleQueryDocsList();
    }
    // 新增文档
    handleAddDoc () {
        this.setState({
            addDocVisible: true
        });
    }
    // 取消新增
    handleCloseAddDocCancel () {
        this.setState({
            addDocVisible: false
        });
    }
    // 新增文档成功
    handleAddDocOk = async (fileListNew = []) => {
        const {
            actions: {
                postAddDoc
            },
            leftKeyCode,
            userCompanyMessage
        } = this.props;
        if (fileListNew.length === 0) {
            Notification.success({
                message: '请上传文件',
                duration: 3
            });
            return;
        }
        this.setState({
            changeTableLoading: true
        });
        const user = getUser();
        const promises = fileListNew.map(doc => {
            let postData = {
                Creater: user.ID,
                DirID: leftKeyCode,
                DocAbstract: JSON.stringify(userCompanyMessage),
                DocDescribe: doc.remark,
                DocEnclosure: doc.url,
                DocFileType: 'doc',
                DocName: doc.name,
                DocPics: ''
            };
            return postAddDoc({}, postData);
        });
        Notification.warning({
            message: '新增文件中...',
            duration: 3
        });
        let rst = await Promise.all(promises);
        console.log('rst', rst);
        if (rst && rst instanceof Array && rst.length > 0) {
            Notification.success({
                message: '新增文件成功！',
                duration: 3
            });
            await this.handleQueryDocsList();
            this.setState({
                addDocVisible: false
            });
        } else {
            Notification.error({
                message: '新增文件失败！',
                duration: 3
            });
            this.setState({
                changeTableLoading: false
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
    render () {
        const {
            docList = [],
            selectedRowKeys = [],
            addDocVisible
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
                    handleAddDoc={this.handleAddDoc.bind(this)}
                />
                <Table
                    rowSelection={rowSelection}
                    dataSource={docList}
                    columns={this.columns}
                    className='foresttables'
                    bordered
                    rowKey='code'
                />
                {
                    addDocVisible
                        ? <AddDoc
                            {...this.state}
                            {...this.props}
                            handleCloseAddDocCancel={this.handleCloseAddDocCancel.bind(this)}
                            handleAddDocOk={this.handleAddDocOk.bind(this)}
                        />
                        : ''
                }
            </div>

        );
    }
}
