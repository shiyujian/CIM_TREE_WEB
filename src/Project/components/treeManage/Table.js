import React, { Component } from 'react';
import {
    Input,
    Button,
    Row,
    Col,
    Modal,
    Avatar,
    Table,
    Notification,
    Popconfirm,
    Divider
} from 'antd';
import XLSX from 'xlsx';
import { getForestImgUrl, getUser, trim } from '_platform/auth';
import { TREETYPENO } from '_platform/api';
import Addition from './Addition';
import Edit from './Edit';
import View from './View';
import './index.less';

export default class Tablelevel extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            searchList: [],
            searchVisible: false,
            record: {},
            imgvisible: false,
            imgSrc: false,
            pagination: {},
            searchTreeName: ''
        };
    }
    columns = [
        {
            title: '树种ID',
            key: '1',
            dataIndex: 'ID',
            width: '5%'
        },
        {
            title: '树种名称',
            key: '2',
            dataIndex: 'TreeTypeName',
            width: '10%'
        },
        {
            title: '类别',
            key: 'TreeType',
            dataIndex: 'TreeType',
            width: '10%',
            render: (text, record, index) => {
                let typeName = '';
                if (record && record.TreeTypeNo) {
                    let no = record.TreeTypeNo;
                    let bigType = no.slice(0, 1);
                    TREETYPENO.map((type) => {
                        if (bigType === type.id) {
                            typeName = type.name;
                        }
                    });
                }
                return typeName;
            }
        },
        {
            title: '科属',
            key: '3',
            dataIndex: 'TreeTypeGenera',
            width: '10%'
        },
        {
            title: '编码',
            key: '4',
            dataIndex: 'TreeTypeNo',
            width: '5%'
        },
        {
            title: '习性',
            key: '5',
            dataIndex: 'GrowthHabit',
            width: '40%'
        },
        {
            title: 'Pics',
            key: '6',
            dataIndex: 'Pics',
            width: '5%',
            render: (text, record) => {
                if (record.Pics) {
                    let img = getForestImgUrl(record.Pics);
                    return (
                        <div style={{ textAlign: 'center', height: '32px' }}>
                            <a
                                disabled={!record.Pics}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.Pics
                                )}
                            >
                                <img
                                    id='TreeImg'
                                    src={img}
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '4px'
                                    }}
                                />
                            </a>
                        </div>
                    );
                } else {
                    return (
                        <div style={{ textAlign: 'center', height: '32px' }}>
                            <Avatar shape='square' icon='picture' />
                        </div>
                    );
                }
            }
        },
        {
            title: '操作',
            key: '7',
            dataIndex: 'operate',
            width: '15%',
            render: (text, record, index) => {
                return (
                    <div>
                        <a onClick={this.view.bind(this, record)}>查看</a>
                        <Divider type='vertical' />
                        <a onClick={this.edite.bind(this, record)}>修改</a>
                        <Divider type='vertical' />
                        <Popconfirm
                            title='是否要删除该树种?'
                            onConfirm={this.delet.bind(this, record)}
                            okText='是'
                            cancelText='否'
                        >
                            <a>删除</a>
                        </Popconfirm>
                    </div>
                );
            }
        }
    ];
    columns1 = [
        {
            title: '树种ID',
            key: '1',
            dataIndex: 'ID',
            width: '5%'
        },
        {
            title: '树种名称',
            key: '2',
            dataIndex: 'TreeTypeName',
            width: '10%'
        },
        {
            title: '类别',
            key: 'TreeType',
            dataIndex: 'TreeType',
            width: '10%',
            render: (text, record, index) => {
                let typeName = '';
                if (record && record.TreeTypeNo) {
                    let no = record.TreeTypeNo;
                    let bigType = no.slice(0, 1);
                    TREETYPENO.map((type) => {
                        if (bigType === type.id) {
                            typeName = type.name;
                        }
                    });
                }
                return typeName;
            }
        },
        {
            title: '科属',
            key: '3',
            dataIndex: 'TreeTypeGenera',
            width: '10%'
        },
        {
            title: '编码',
            key: '4',
            dataIndex: 'TreeTypeNo',
            width: '5%'
        },
        {
            title: '习性',
            key: '5',
            dataIndex: 'GrowthHabit',
            width: '40%'
        },
        {
            title: 'Pics',
            width: '5%',
            key: '6',
            render: (text, record) => {
                if (record.Pics) {
                    let img = getForestImgUrl(record.Pics);
                    return (
                        <div style={{ textAlign: 'center', height: '30px' }}>
                            <a
                                disabled={!record.Pics}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.Pics
                                )}
                            >
                                <Avatar shape='square' src={img} />
                            </a>
                        </div>
                    );
                } else {
                    return (
                        <div style={{ textAlign: 'center', height: '30px' }}>
                            <Avatar shape='square' icon='picture' />
                        </div>
                    );
                }
            }
        },
        {
            title: '操作',
            key: '7',
            dataIndex: 'operate',
            width: '15%',
            render: (text, record, index) => {
                return (
                    <div>
                        <a onClick={this.view.bind(this, record)}>查看</a>
                        <Divider type='vertical' />
                        <a onClick={this.edite.bind(this, record)}>修改</a>
                    </div>
                );
            }
        }
    ];

    columns2 = [
        {
            title: '树种ID',
            key: '1',
            dataIndex: 'ID',
            width: '5%'
        },
        {
            title: '树种名称',
            key: '2',
            dataIndex: 'TreeTypeName',
            width: '10%'
        },
        {
            title: '类别',
            key: 'TreeType',
            dataIndex: 'TreeType',
            width: '10%',
            render: (text, record, index) => {
                let typeName = '';
                if (record && record.TreeTypeNo) {
                    let no = record.TreeTypeNo;
                    let bigType = no.slice(0, 1);
                    TREETYPENO.map((type) => {
                        if (bigType === type.id) {
                            typeName = type.name;
                        }
                    });
                }
                return typeName;
            }
        },
        {
            title: '科属',
            key: '3',
            dataIndex: 'TreeTypeGenera',
            width: '10%'
        },
        {
            title: '编码',
            key: '4',
            dataIndex: 'TreeTypeNo',
            width: '5%'
        },
        {
            title: '习性',
            key: '5',
            dataIndex: 'GrowthHabit',
            width: '40%'
        },
        {
            title: 'Pics',
            width: '5%',
            key: '6',
            render: (text, record) => {
                if (record.Pics) {
                    let img = getForestImgUrl(record.Pics);
                    return (
                        <div style={{ textAlign: 'center', height: '30px' }}>
                            <a
                                disabled={!record.Pics}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.Pics
                                )}
                            >
                                <Avatar shape='square' src={img} />
                            </a>
                        </div>
                    );
                } else {
                    return (
                        <div style={{ textAlign: 'center', height: '30px' }}>
                            <Avatar shape='square' icon='picture' />
                        </div>
                    );
                }
            }
        },
        {
            title: '操作',
            key: '7',
            dataIndex: 'operate',
            width: '15%',
            render: (text, record, index) => {
                return (
                    <div>
                        <a onClick={this.view.bind(this, record)}>查看</a>
                    </div>
                );
            }
        }
    ];

    componentDidMount = async () => {
        const {
            actions: { getTreeTypeList }
        } = this.props;
        try {
            let treeTypeList = await getTreeTypeList();
            if (treeTypeList && treeTypeList instanceof Array) {
                let pagination = {};
                pagination.current = 1;
                pagination.pageSize = 10;
                pagination.total = treeTypeList && treeTypeList.length;
                this.setState({
                    pagination,
                    searchVisible: false
                });
            }
        } catch (e) {

        }
    }

    componentWillReceiveProps = async (nextProps) => {
        const {
            changeTreeTypeStatus = false,
            actions: {
                handleChangeTreeTypeStatus
            }
        } = this.props;
        console.log('nextProps.changeTreeTypeStatus', nextProps.changeTreeTypeStatus);
        if (nextProps.changeTreeTypeStatus && nextProps.changeTreeTypeStatus !== changeTreeTypeStatus) {
            await handleChangeTreeTypeStatus(false);
            await this.search();
        }
    }

    handleExport = async () => {
        const { treeTypeList = [] } = this.props;
        const {
            searchVisible,
            searchList
        } = this.state;
        let dataSource = [];
        if (searchVisible) {
            dataSource = searchList;
        } else {
            dataSource = treeTypeList;
        }
        let _headers = ['ID', '树种', '苗圃测量参数', '进场抽检测量参数', '现场测量参数', '编码', '是否挂二维码'];
        let headers = _headers.map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
            .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
        let tblData = [];
        dataSource.map(item => {
            let obj = {};
            obj['ID'] = item.ID;
            obj['树种'] = item.TreeTypeName;
            obj['苗圃测量参数'] = item.NurseryParam;
            obj['进场抽检测量参数'] = item.TreeParam;
            obj['现场测量参数'] = item.SamplingParam;
            obj['编码'] = item.TreeTypeNo;
            if (item.IsLocation === 1) {
                obj['是否挂二维码'] = '是';
            } else {
                obj['是否挂二维码'] = '否';
            }
            tblData.push(obj);
        });
        let tableData = tblData.map((data, i) =>
            _headers.map((k, j) =>
                Object.assign(
                    {},
                    {
                        v: data[k],
                        position: String.fromCharCode(65 + j) + (i + 2)
                    }))).reduce((prev, next) =>
            prev.concat(next)).reduce((prev, next) =>
            Object.assign(
                {}, prev, {
                    [next.position]: { v: next.v }
                }),
        {});
        let output = Object.assign({}, headers, tableData);
        // 获取所有单元格的位置
        let outputPos = Object.keys(output);
        // 计算出范围
        let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
        // 构建 workbook 对象
        let wb = {
            SheetNames: ['mySheet'],
            Sheets: {
                'mySheet': Object.assign({}, output, { '!ref': ref })
            }
        };
        XLSX.writeFile(wb, `树种表.xlsx`);
    }

    handleTableChange (pagination) {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager
        });
    }

    handleSearchTreeNameChange = async (value) => {
        this.setState({
            searchTreeName: value.target.value
        });
    }

    search () {
        const {
            pagination,
            searchTreeName
        } = this.state;
        let value = '';
        value = trim(searchTreeName);
        let searchList = [];
        const { treeTypeList = [] } = this.props;
        if (value) {
            treeTypeList.map(item => {
                if (item && item.TreeTypeName) {
                    if (item.TreeTypeName.indexOf(value) > -1) {
                        searchList.push(item);
                    }
                }
            });
            pagination.current = 1;
            pagination.total = searchList && searchList.length;
            pagination.pageSize = 10;
            this.setState({
                searchVisible: true,
                pagination,
                searchList
            });
        } else {
            let current = pagination.current;
            if (treeTypeList && treeTypeList instanceof Array) {
                // 删除最后一页数据，需要重新设置页数
                if (treeTypeList.length > 0) {
                    if (Math.ceil(treeTypeList.length / 10) >= current) {
                        pagination.current = current;
                    } else {
                        pagination.current = current - 1;
                    }
                } else {
                    pagination.current = 0;
                }
                pagination.total = treeTypeList && treeTypeList.length;
                pagination.pageSize = 10;
                this.setState({
                    pagination
                });
            }
        }
    }

    clear () {
        const {
            pagination
        } = this.state;
        const { treeTypeList = [] } = this.props;
        pagination.current = 1;
        pagination.total = treeTypeList && treeTypeList.length;
        pagination.pageSize = 10;
        this.setState({
            searchVisible: false,
            pagination,
            searchTreeName: ''
        });
    }

    edite (record) {
        const {
            actions: { changeEditVisible }
        } = this.props;
        this.setState(
            {
                record: record
            },
            () => {
                changeEditVisible(true);
            }
        );
    }
    view = (record) => {
        const {
            actions: { changeViewVisible }
        } = this.props;
        this.setState(
            {
                record: record
            },
            () => {
                changeViewVisible(true);
            }
        );
    }
    delet = async (record) => {
        const {
            actions: { deleteTreeType, getTreeTypeList }
        } = this.props;
        let deleteID = {
            ID: record.ID
        };
        let rst = await deleteTreeType(deleteID);
        if (rst && rst.code && rst.code === 1) {
            Notification.success({
                message: '树种删除成功',
                duration: 3
            });
        } else {
            Notification.error({
                message: '树种删除失败',
                duration: 3
            });
        }
        await getTreeTypeList();
        await this.search();
    }
    onImgClick (src) {
        src = getForestImgUrl(src);
        this.setState({ src }, () => {
            this.setState({ imgvisible: true });
        });
    }
    handleCancel () {
        this.setState({ imgvisible: false });
    }
    render () {
        const { treeTypeList = [], editVisible = false, viewVisible = false } = this.props;
        const {
            searchVisible,
            searchList,
            searchTreeName
        } = this.state;
        let dataSource = [];
        if (searchVisible) {
            dataSource = searchList;
        } else {
            dataSource = treeTypeList;
        }

        const user = getUser();
        let permission = false;
        let superUser = false;
        if (user && user.username && user.username === 'admin') {
            superUser = true;
        }
        let userRoles = user.roles || '';
        if (userRoles && userRoles.RoleName && userRoles.RoleName.indexOf('业主文书') !== -1) {
            permission = true;
        }
        return (
            <div>
                <div>
                    <Row>
                        <Col span={6}>
                            <h3>树种列表</h3>
                        </Col>
                        <Col span={12}>
                            <label
                                style={{
                                    minWidth: 60,
                                    display: 'inline-block'
                                }}
                            >
                                树种名称:
                            </label>
                            <Input
                                id='TreeData'
                                value={searchTreeName}
                                onChange={this.handleSearchTreeNameChange.bind(this)}
                                className='search_input' />
                            <Button
                                type='primary'
                                onClick={this.search.bind(this)}
                                style={{
                                    minWidth: 30,
                                    display: 'inline-block',
                                    marginRight: 20
                                }}
                            >
                                查询
                            </Button>
                            <Button
                                onClick={this.clear.bind(this)}
                                style={{
                                    minWidth: 30,
                                    display: 'inline-block',
                                    marginRight: 20
                                }}
                            >
                                清空
                            </Button>
                            {
                                superUser
                                    ? <Button
                                        onClick={this.handleExport.bind(this)}
                                        type='danger'
                                        style={{
                                            minWidth: 30,
                                            display: 'inline-block'
                                        }}
                                    >
                                    导出
                                    </Button> : ''
                            }
                        </Col>
                        <Col span={6}>
                            {
                                superUser || permission ? <Addition {...this.props} {...this.state} /> : ''
                            }
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 5 }}>
                        <Col span={24}>
                            <Table
                                dataSource={dataSource}
                                columns={
                                    superUser ? this.columns : (permission ? this.columns1 : this.columns2)
                                }
                                bordered
                                key='ID'
                                pagination={this.state.pagination}
                                onChange={this.handleTableChange.bind(this)}
                            />
                            {editVisible ? <Edit {...this.props} {...this.state} /> : ''}
                            {viewVisible ? <View {...this.props} {...this.state} /> : ''}
                        </Col>
                    </Row>
                    <Modal
                        width={522}
                        title='Picture'
                        style={{ textAlign: 'center' }}
                        visible={this.state.imgvisible}
                        footer={null}
                        onCancel={this.handleCancel.bind(this)}
                    >
                        <img
                            style={{ width: '490px' }}
                            src={this.state.src}
                            alt='图片'
                        />
                    </Modal>
                </div>
            </div>
        );
    }
}
