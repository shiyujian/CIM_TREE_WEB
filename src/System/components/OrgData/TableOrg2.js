import React, { Component } from 'react';
import {
    Table,
    Button,
    Popconfirm,
    notification,
    Input,
    Progress,
    Icon
} from 'antd';
import { getUser } from '_platform/auth';
import {
    NODE_FILE_EXCHANGE_API
} from '_platform/api.js';
import './TableOrg.less';
const Search = Input.Search;
export default class TableOrg extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataSource: [],
            selectData: [],
            tempData: [],
            spinning: true,
            percent: 0,
            excelData: [],
            update: 0
        };
    }

    render () {
        const loop = data =>
            data.map(item => {
                if (item.children && item.children.length > 0) {
                    return loop(item.children);
                } else {
                    delete item.children;
                }
            });

        let painationInfo = {
            showQuickJumper: true,
            showSizeChanger: true
        };
        console.log('this.state.tempData', this.state.tempData);
        return (
            <div>
                <div>
                    <Button className='button' onClick={this.sendCJ.bind(this)}>
                        新增参建单位
                    </Button>
                    <Button className='button' onClick={this.send.bind(this)}>
                        新增部门
                    </Button>
                    {/* <Button className="button" onClick={this.update.bind(this)}>申请变更</Button> */}
                    {/* <Button className="button" onClick={this.delete.bind(this)}>申请删除</Button> */}
                    <Button
                        className='button'
                        onClick={this.getExcel.bind(this)}
                    >
                        导出表格
                    </Button>
                    <Search
                        // enterButton
                        className='button'
                        onSearch={this.searchOrg.bind(this)}
                        style={{ width: '200px' }}
                        placeholder='输入部门编码或部门名称'
                    />
                </div>
                {loop(this.state.tempData)}
                <Table
                    columns={this.columns}
                    bordered
                    // rowSelection={this.rowSelection}
                    dataSource={this.state.tempData}
                    rowKey='code'
                    pagination={painationInfo}
                    loading={{
                        tip: (
                            <Progress
                                style={{ width: 200 }}
                                percent={this.state.percent}
                                status='active'
                                strokeWidth={5}
                            />
                        ),
                        spinning: this.state.spinning
                    }}
                />
            </div>
        );
    }
    searchOrg (value) {
        let searchData = [];
        if (value === '') {
            searchData = [...this.state.dataSource];
            searchData.map((item, index) => {
                delete item.index;
                item.index = index + 1;
            });
            this.setState({
                tempData: searchData
            });
            return;
        }
        this.state.dataSource.map(item => {
            if (
                item.name.indexOf(value) !== -1 ||
                item.code.indexOf(value) !== -1
            ) {
                searchData.push(item);
            }
            if (item.children && item.children.length > 0) {
                item.children.map(it => {
                    if (
                        it.name.indexOf(value) !== -1 ||
                        it.code.indexOf(value) !== -1
                    ) {
                        searchData.push(it);
                    }
                });
            }
        });
        searchData.map((item, index) => {
            item.index = index + 1;
        });
        this.setState({ tempData: searchData });
    }
    update (record) {
        const {
            actions: { ModalVisibleUpdate, EditOriginData }
        } = this.props;
        EditOriginData(record);
        ModalVisibleUpdate(true);
    }
    // 导出excel表格
    getExcel () {
        if (this.state.excelData.length === 0) {
            notification.warn({
                message: '请先选择数据！'
            });
            return;
        }
        let exhead = [
            '组织机构编码',
            '组织机构类型',
            '参建单位名称',
            '组织机构部门',
            '直属部门',
            '备注'
        ];
        let rows = [exhead];
        let getcoordinate = param => {
            if (typeof param !== 'string') {
                return '';
            }
            if (!param || param.length <= 0) {
                return '';
            } else {
                return param;
            }
        };
        let excontent = this.state.excelData.map(data => {
            return [
                data.code || '',
                data.extra_params.org_type || '',
                data.extra_params.canjian || '',
                data.name || '',
                data.extra_params.direct || '',
                data.extra_params.remarks || ''
            ];
        });
        rows = rows.concat(excontent);
        const {
            actions: { jsonToExcel }
        } = this.props;
        jsonToExcel({}, { rows: rows }).then(rst => {
            this.createLink(
                '单位工程信息导出表',
                NODE_FILE_EXCHANGE_API + '/api/download/' + rst.filename
            );
        });
    }

    send () {
        const {
            actions: { ModalVisible }
        } = this.props;
        ModalVisible(true);
    }
    sendCJ () {
        const {
            actions: { ModalVisibleCJ }
        } = this.props;
        ModalVisibleCJ(true);
    }
    delete (index, record) {
        const {
            actions: { deleteOrgList, deleteOrgListChild }
        } = this.props;
        let executor = {};
        let person = getUser();

        if (!record.children) {
            executor.id = person.id;
            executor.username = person.username;
            executor.person_name = person.name;
            executor.person_code = person.code;
            let data_list = [];
            data_list[0] = {
                code: '' + record.code,
                parent: {
                    pk: '' + record.pk,
                    code: '' + record.code,
                    obj_type: record.obj_type
                },
                version: 'A'
            };
            // return;
            deleteOrgList({}, { data_list: data_list }).then(rst => {
                notification.success({
                    message: '删除成功'
                });
                deleteOrgListChild({ code: record.code }).then(rst => {
                    this.fetchData();
                });
            });
        }
    }
    // 下载
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
    componentDidMount () {
        this.fetchData();
    }

    componentWillReceiveProps (nextProps) {
        let { update } = nextProps;
        if (update !== this.state.update) {
            this.fetchData();
            this.setState({ update });
        }
    }
    async fetchData () {
        let dataSource = [];
        const {
            actions: { getOrgTree }
        } = this.props;
        await getOrgTree().then(rst => {
            if (rst && rst.children) {
                rst.children.map((item, index) => {
                    dataSource.push(...item.children);
                });
            }
        });
        // return
        dataSource.map((item, index) => {
            item.index = index + 1;
        });
        this.setState({
            spinning: false,
            percent: 100
        });
        this.setState({ dataSource, tempData: dataSource });
    }
    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {},
        onSelect: (record, selected, selectedRows) => {
            this.setState({
                selectData: selectedRows,
                excelData: selectedRows
            });
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            this.setState({
                selectData: selectedRows,
                excelData: selectedRows
            });
        }
    };

    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'Index'
        },
        {
            title: '编码',
            dataIndex: 'code',
            key: 'Code'
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'Name'
        },
        {
            title: '直属部门',
            dataIndex: 'extra_params.direct',
            key: 'Direct'
        },
        {
            title: '参建单位',
            dataIndex: 'extra_params.canjian',
            key: 'Canjian'
        },
        {
            title: '机构类型',
            dataIndex: 'extra_params.org_type',
            key: 'Type'
        },
        {
            title: '备注',
            dataIndex: 'extra_params.remarks',
            key: 'Remarks'
        },
        {
            title: '操作',
            render: (text, record, index) => {
                return (
                    <span>
                        {record.editing || (
                            <span>
                                <a>
                                    <Icon
                                        type='edit'
                                        onClick={e => {
                                            // record.editing = true
                                            this.update(record);
                                            // this.forceUpdate();
                                        }}
                                    />
                                </a>
                                <Popconfirm
                                    title='确认删除吗'
                                    onConfirm={this.delete.bind(
                                        this,
                                        record.index - 1,
                                        record
                                    )}
                                    okText='确认'
                                    onCancel='取消'
                                >
                                    <span style={{ margin: '7px' }}>|</span>
                                    <a>
                                        <Icon type='delete' />
                                    </a>
                                </Popconfirm>
                            </span>
                        )}
                        {/* {record.editing &&
                            <a onClick={(e) => {
                                record.editing = false
                                this.forceUpdate();
                            }}>完成</a>
                        } */}
                    </span>
                );
            }
        }
    ];
}
