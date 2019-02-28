import React, { Component } from 'react';
import {
    Input,
    Button,
    Row,
    Col,
    Modal,
    Avatar,
    Table,
    notification,
    Popconfirm,
    Divider
} from 'antd';
import { getForestImgUrl } from '_platform/auth';
import { TREETYPENO } from '../../../_platform/api';
import Addition from './Addition';
import Edite from './Edite';
import View from './View';
import './index.less';

export default class Tablelevel extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            searchList: [],
            search: false,
            record: {},
            imgvisible: false,
            imgSrc: false,
            pagination: {}
        };
    }

    static layoutT = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };
    static layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
    };

    render () {
        const { treeTypeList = [], editVisible = false, viewVisible = false } = this.props;
        const {
            search,
            searchList
        } = this.state;
        let dataSource = [];
        if (search) {
            dataSource = searchList;
        } else {
            dataSource = treeTypeList;
        }

        const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        let superuser = false;
        if (user && user.is_superuser) {
            superuser = true;
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
                            <Input id='TreeData' className='search_input' />
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
                                    display: 'inline-block'
                                }}
                            >
                                清空
                            </Button>
                        </Col>
                        <Col span={6}>
                            <Addition {...this.props} {...this.state} />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 5 }}>
                        <Col span={24}>
                            <Table
                                dataSource={dataSource}
                                columns={
                                    superuser ? this.columns : this.columns1
                                }
                                bordered
                                key='ID'
                                pagination={this.state.pagination}
                                onChange={this.handleTableChange.bind(this)}
                            />
                            {editVisible ? <Edite {...this.props} {...this.state} /> : ''}
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

    componentWillReceiveProps (nextProps) {
        if (nextProps.treeTypeList !== this.props.treeTypeList) {
            this.search();
        }
    }

    handleTableChange (pagination) {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager
        });
    }

    search () {
        const {
            pagination
        } = this.state;
        let text = document.getElementById('TreeData');
        let value = '';
        if (text && text.value) {
            value = text.value;
        }
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
        }
        pagination.current = 1;
        pagination.total = searchList && searchList.length;
        pagination.pageSize = 10;
        this.setState({
            search: true,
            pagination,
            searchList
        });
    }

    clear () {
        const {
            pagination
        } = this.state;
        const { treeTypeList = [] } = this.props;
        document.getElementById('TreeData').value = '';
        pagination.current = 1;
        pagination.total = treeTypeList && treeTypeList.length;
        pagination.pageSize = 10;
        this.setState({
            search: false,
            pagination
        });
    }

    componentDidMount = async () => {
        const {
            actions: { getTreeTypeList }
        } = this.props;
        try {
            document.getElementById('TreeData').value = '';
            let treeTypeList = await getTreeTypeList();
            if (treeTypeList && treeTypeList instanceof Array) {
                let pagination = {};
                pagination.current = 1;
                pagination.pageSize = 10;
                pagination.total = treeTypeList && treeTypeList.length;
                this.setState({
                    pagination,
                    search: false
                });
            }
        } catch (e) {

        }
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
            notification.success({
                message: '树种删除成功',
                duration: 3
            });
        } else {
            notification.error({
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
    imgError () {
        console.log('error');
        document
            .getElementById('TreeImg')
            .replaceWith("<Avatar shape='square' icon='picture'></Avatar>");
    }
    columns = [
        {
            title: '树种ID',
            key: '1',
            dataIndex: 'ID',
            width: '5%'
        },
        {
            title: '树种学名',
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
                                    onError={this.imgError.bind(this)}
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
                            title='是否真的要删除该树种?'
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
            title: '树种学名',
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
}
