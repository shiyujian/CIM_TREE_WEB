import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as platformActions } from '_platform/store/global';
import {
    Main,
    Aside,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import {
    Table,
    Button,
    Row,
    Col,
    Icon,
    Modal,
    Input,
    message,
    notification,
    DatePicker,
    Select,
    Form,
    Upload,
    Steps
} from 'antd';
import * as previewActions from '_platform/store/global/preview';
import HiddenModle from './HiddenModle';
import PkCodeTree from '../components/PkCodeTree';
import Preview from '_platform/components/layout/Preview';
import {
    SOURCE_API,
    STATIC_DOWNLOAD_API,
    WORKFLOW_CODE,
    DefaultZoomLevel
} from '_platform/api';
import moment from 'moment';
import 'moment/locale/zh-cn';
export const Datumcode = window.DeathCode.SAFETY_AQYH;
moment.locale('zh-cn');
const Option = Select.Option;

@connect(
    state => {
        const { safety: { hiddenDanger = {} } = {}, platform } = state;
        return { ...hiddenDanger, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...platformActions, ...previewActions },
            dispatch
        )
    })
)
export default class Defect extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isTreeSelected: false,
            loading: false,
            dataSet: [],
            currentUnitCode: '',
            currentSteps: 0,
            detailObj: {},
            currentSelectValue: '',
            modalVisible: false,
            dataSous: {},
            leafletCenter: [22.516818, 113.868495]
        };
    }
    componentDidMount () {
        const {
            actions: { getTreeNodeList },
            platform: { tree = {} }
        } = this.props;
        if (!tree.bigTreeList) {
            getTreeNodeList();
        }
    }

    onSelect (selectedKeys, e) {}
    onSearch (value) {}

    onSelectChange (value) {}

    render () {
        const { Doc = [], keycode } = this.props;
        const {
            platform: { tree = {} }
        } = this.props;
        let treeList = [];
        if (tree.bigTreeList) {
            treeList = tree.bigTreeList;
        }
        const columns = [
            {
                title: '编号',
                dataIndex: 'o',
                width: '10%',
                render: (text, record, index) => {
                    return <div>{index + 1}</div>;
                }
            },
            {
                title: '单位工程',
                dataIndex: 'problemType',
                width: '10%'
            },
            {
                title: '小班',
                dataIndex: 'unitName',
                width: '10%'
            },
            {
                title: '细班',
                dataIndex: 'level',
                width: '10%'
            },
            {
                title: '等级',
                dataIndex: 'createTime',
                width: '10%'
            },
            {
                title: '整改期限',
                dataIndex: 'status',
                width: '10%'
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: '10%'
            },
            {
                title: '负责人',
                dataIndex: 'resPeople',
                width: '10%'
            },
            {
                title: '操作',
                dataIndex: 'opt',
                width: '15%',
                render: (text, record, index) => {
                    return (
                        <div>
                            <a
                                href='javascript:;'
                                onClick={this.onDetailClick.bind(
                                    this,
                                    record,
                                    index
                                )}
                            >
                                详情
                            </a>
                        </div>
                    );
                }
            }
        ];

        return (
            <div>
                <DynamicTitle title='质量缺陷' {...this.props} />
                <Sidebar>
                    <PkCodeTree
                        treeData={treeList}
                        onSelect={this.onSelect.bind(this)}
                    />
                </Sidebar>
                <Content>
                    <Row>
                        <Col>
                            <Row>
                                <Col span={6}>
                                    <Input.Search
                                        placeholder='请输入搜索关键词'
                                        style={{
                                            width: '80%',
                                            display: 'block'
                                        }}
                                        onSearch={value => this.onSearch(value)}
                                    />
                                </Col>
                                <Col span={6}>
                                    <div
                                        style={{
                                            width: '90%',
                                            marginLeft: '10%'
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 16,
                                                marginRight: 5
                                            }}
                                        >
                                            状态
                                        </span>
                                        <Select
                                            defaultValue=''
                                            style={{ width: 80 }}
                                            onChange={value =>
                                                this.onSelectChange(value)
                                            }
                                        >
                                            <Option value={-1}>确认中</Option>
                                            <Option value={0}>整改中</Option>
                                            <Option value={1}>审核中</Option>
                                            <Option value={2}>完成</Option>
                                            <Option value=''>全部</Option>
                                        </Select>
                                    </div>
                                </Col>
                            </Row>
                            <Table
                                className='foresttable'
                                columns={columns}
                                dataSource={this.state.dataSet}
                                bordered
                                style={{ marginTop: 20 }}
                            />
                        </Col>
                    </Row>
                    {this.state.modalVisible && (
                        <HiddenModle
                            {...this.props}
                            onok={this.onDetailClick.bind(this)}
                            oncancel={this.cancel.bind(this)}
                            data={this.state.dataSet}
                            dataSous={this.state.dataSous}
                        />
                    )}
                </Content>
            </div>
        );
    }
}
