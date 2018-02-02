import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import reducer, { actions } from '../store/riskFactor';
import { actions as platformActions } from '_platform/store/global';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import {
    Table, Button, Row, Col, Icon, Modal, Input, message,
    notification, DatePicker, Select, InputNumber, Form, Upload, Card, Steps
} from 'antd';
import RiskModle from './RiskModle';
import WorkPackageTree from '../components/WorkPackageTree';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import { SOURCE_API, STATIC_DOWNLOAD_API, WORKFLOW_CODE, DefaultZoomLevel } from '_platform/api';
import './Register.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'leaflet/dist/leaflet.css';
import './HiddenDanger.less';
moment.locale('zh-cn');
const Option = Select.Option;
@connect(
    state => {
        const { safety: { riskFactor = {} } = {}, platform } = state;
        return { ...riskFactor, platform }
    },
    dispatch => ({
        actions: bindActionCreators({ ...actions, ...platformActions, ...previewActions }, dispatch)
    })
)

export default class RiskFactor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSet: [],
            currentUnitCode: '',
            currentSteps: 0,
            detailObj: {},
            currentSelectValue: '',
            modalVisible: false,
            dataSous: {},
            leafletCenter: [22.516818, 113.868495],
            data: [
                {
                    o: 1,
                    riskContent: "侧枝折断",
                    unitName: "1标段",
                    smallName: "1小班",
                    thinName: "12细班",
                    level: "V",
                    timeLimit: "2016-11-01",
                    status: "jj",
                    resPeople: "张三",
                    fsPeople: "小明",
                    jlPeople: "小王",
                    zgcuoshi: "随便",
                    x: "22.5202031353",
                    y: "113.893730454",
                    geometry: {coordinates: [22.5202031353,113.893730454],type: "Point"},
                    type: "danger",
                    properties: {},
                    key: "b5d535a8-9b52-4d8b-8e64-e68d96857ce2",
                }, {
                    o: 2,
                    riskContent: "车辆停靠",
                    unitName: "12标段",
                    smallName: "2小班",
                    thinName: "13细班",
                    level: "V",
                    timeLimit: "2016-11-01",
                    status: "hh",
                    resPeople: "李四",
                    fsPeople: "小明11",
                    jlPeople: "小王11",
                    zgcuoshi: "随便11",
                    x: "22.5202031353",
                    y: "113.893730454",
                    geometry: {coordinates: ["22.5202031353","113.893730454"],type: "Point"},
                    type: "danger",
                    properties: {},
                }, {
                    o: 3,
                    riskContent: "苗木枯萎",
                    unitName: "123标段",
                    smallName: "3小班",
                    thinName: "14细班",
                    level: "V",
                    timeLimit: "2016-11-01",
                    status: "aaa",
                    resPeople: "王五",
                    fsPeople: "小明22",
                    jlPeople: "小王22",
                    zgcuoshi: "随便22",
                    x: "22.5202031353",
                    y: "113.893730454",
                    geometry: {coordinates: ["22.5202031353","113.893730454"],type: "Point"},
                    type: "danger",
                    properties: {},
                }
            ]
        }
    }
    componentDidMount() {
        
    }

    onSearch = (value) => {
        const { currentUnitCode, currentSelectValue } = this.state;
        const {
            actions: {
                getPotentialRiskByCode,
            }
        } = this.props;
        getPotentialRiskByCode({ code: currentUnitCode, status: currentSelectValue, keyword: value }).then(rst => {
            const { dataSet } = this.state;
            let datas = [];
            debugger
            if (rst.length === 0) {
                notification.info({
                    message: '未查询到数据',
                    duration: 2
                });
                return;
            }
            for (let i = 0; i < rst.length; i++) {
                let data = {};
                data.riskContent = rst[i].risk_content;
                data.projectName = rst[i].project_location.project_name;
                data.unitName = rst[i].project_location.unit_name;
                data.level = rst[i].risk_level["风险级别"];
                data.status = this.getRiskState(rst[i].status);
                data.resPeople = rst[i].response_org.name;
                data.coordinate = rst[i].coordinate;
                data.images = rst[i].rectify_before.images ? rst[i].rectify_before.images : [];
                data.id = rst[i].id;
                datas.push(data);
            }
            this.setState({ dataSet: datas });
        });
    }

    onViewClick(record, index) {
        const { actions: { openPreview } } = this.props;
        let data = this.state.dataSet;
        let filed = {};
        if (!data[index].attachment) {
            filed = {
                "a_file": `${SOURCE_API}/media/documents/2017/10/%E5%AE%89%E5%85%A8%E8%B4%A3%E4%BB%BB%E4%B9%A6.doc`,
                "misc": "file",
                "mime_type": "application/msword",
                "download_url": `${STATIC_DOWNLOAD_API}/media/documents/2017/10/%E5%AE%89%E5%85%A8%E8%B4%A3%E4%BB%BB%E4%B9%A6.doc`,
                "name": "安全责任书.doc"
            }
        } else {
            filed.misc = "file";
            filed.a_file = `${SOURCE_API}` + data[index].attachment[0].url;
            filed.download_url = `${STATIC_DOWNLOAD_API}` + data[index].attachment[0].url;
            filed.name = data[index].attachment[0].name;
            filed.id = data[index].attachment[0].id;
            let type = data[index].attachment[0].url.split('.')[1];
            if (type == 'xlsx' || type == 'docx' || type == 'xls' || type == 'doc' || type == 'pptx' || type == 'ppt') {
                filed.mime_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            }
            if (type == 'pdf') {
                filed.mime_type = "application/pdf";
            }
        }
        openPreview(filed);
    }

    getRiskState = (status) => {
        debugger
        switch (status) {
            case 1:
                return "发起";
            case 2:
                return "确认";
            case 3:
                return "整改";
            case 4:
                return "审核";
            case "发起":
                return 1;
            case "确认":
                return 2;
            case "整改":
                return 3;
            case "审核":
                return 4;
            default:
                return "发起";
        }
    }

    onSelect(selectedKeys, e) {
        console.log('selectedKeys',selectedKeys,e)
        if (!e.selected) {
            return
        }
        this.setState({ currentUnitCode: selectedKeys });
        const {
            actions: {
                getPotentialRiskByCode,
            }
        } = this.props;

        const { currentSelectValue } = this.state;
        getPotentialRiskByCode({ code: selectedKeys, status: currentSelectValue }).then(rst => {
            const { dataSet } = this.state;
            let datas = [];
            for (let i = 0; i < rst.length; i++) {
                let data = {};
                data.riskContent = rst[i].risk_content;
                data.projectName = rst[i].project_location.project_name;
                data.unitName = rst[i].project_location.unit_name;
                data.level = rst[i].risk_level["风险级别"];
                data.status = this.getRiskState(rst[i].status);
                data.resPeople = rst[i].response_org.name;
                data.coordinate = rst[i].coordinate;
                data.images = rst[i].rectify_before.images;
                data.id = rst[i].id;
                datas.push(data);
            }
            this.setState({ dataSet: datas });
        });
    }
    createLink = (name, url) => {    //下载
        let link = document.createElement("a");
        link.href = url;
        link.setAttribute('download', this);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    onDownClick(record, index) {
        let data = this.state.dataSet;
        if (data[index].attachment) {
            let apiGet = `${STATIC_DOWNLOAD_API}` + data[index].attachment[0].url;
            this.createLink(this, apiGet);
        } else {
            let apiGet = `${STATIC_DOWNLOAD_API}/media/documents/2017/10/%E5%AE%89%E5%85%A8%E8%B4%A3%E4%BB%BB%E4%B9%A6.doc`;
            this.createLink(this, apiGet);
        }
    }

    onSelectChange = (value) => {
        this.setState({ currentSelectValue: value });
        const { currentUnitCode } = this.state;
        const {
            actions: {
                getPotentialRiskByCode
            }
        } = this.props;
        getPotentialRiskByCode({ code: currentUnitCode, status: value }).then(rst => {
            const { dataSet } = this.state;
            let datas = [];
            for (let i = 0; i < rst.length; i++) {
                let data = {};
                data.riskContent = rst[i].risk_content;
                data.projectName = rst[i].project_location.project_name;
                data.unitName = rst[i].project_location.unit_name;
                data.level = rst[i].risk_level["风险级别"];
                data.status = this.getRiskState(rst[i].status);
                data.resPeople = rst[i].response_org.name;
                if (rst[i].rectify_before && rst[i].rectify_before.images) {
                    data.images = rst[i].rectify_before.images;
                } else {
                    data.images = [];
                }
                data.id = rst[i].id;
                datas.push(data);
            }
            this.setState({ dataSet: datas });
        });
    }

    onDetailClick = (record, index) => {
        const {dataSous} = this.state;
        this.setState({ dataSous: record, modalVisible: true });
    }

    cancel() {
        this.setState({modalVisible: false})
    }

    render() {
        const columns = [
            {
                title: '编号',
                dataIndex: 'o',
                width: '5%',
                render: (text, record, index) => {
                    return <div>{index + 1}</div>;
                }
            }, {
                title: '不文明施工内容',
                dataIndex: 'riskContent',
                width: '10%'
            }, {
                title: '工程部位',
                dataIndex: 'unitName',
                width: '10%'
            }, {
                title: '小班',
                dataIndex: 'smallName',
                width: '10%'
            }, {
                title: '细班',
                dataIndex: 'thinName',
                width: '10%'
            }, {
                title: '等级',
                dataIndex: 'level',
                width: '10%'
            }, {
                title: '整改期限',
                dataIndex: 'timeLimit',
                width: '10%'
            }, {
                title: '状态',
                dataIndex: 'status',
                width: '10%'
            }, {
                title: '负责人',
                dataIndex: 'resPeople',
                width: '10%'
            }, {
                title: '操作',
                dataIndex: 'opt',
                width: '8%',
                render: (text, record, index) => {
                    return <div>
                        {/*<a href='avascript:;' onClick={this.onViewClick.bind(this,record,index)}>预览</a>
                              <span className="ant-divider" />
                              <a href="javascript:;" onClick={this.onDownClick.bind(this,record,index)}>下载</a>
                              <span className="ant-divider" />*/}
                        <a href="javascript:;" onClick={this.onDetailClick.bind(this, record, index)}>详情</a>
                    </div>
                }
            }
        ];

        return (
            <div>
                <DynamicTitle title="文明施工" {...this.props} />
                <Sidebar>
                    <WorkPackageTree {...this.props}
                        onSelect={this.onSelect.bind(this)} />
                </Sidebar>
                <Content>
                    <Row>
                        <Col>
                            <Row>
                                <Col span={6}>
                                    <Input.Search
                                        placeholder="请输入搜索关键词"
                                        style={{ width: '300px', display: 'block' }}
                                        onSearch={(value) => this.onSearch(value)}
                                    ></Input.Search>
                                </Col>
                                <Col span={6}>
                                    <span style={{ fontSize: 16 }}>状态</span>
                                    <Select
                                        defaultValue=""
                                        style={{ width: '70px', marginLeft: 5 }}
                                        onChange={(value) => this.onSelectChange(value)}>
                                        <Option value={1}>发起</Option>
                                        <Option value={2}>确认</Option>
                                        <Option value={3}>整改</Option>
                                        <Option value={4}>审核</Option>
                                        <Option value="">全部</Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Table
                                className = 'foresttable'
                                columns={columns}
                                dataSource = {this.state.data}
                                bordered
                                style={{ marginTop: 20 }}
                            />
                        </Col>
                    </Row>
                    {this.state.modalVisible && 
                     <RiskModle 
                        {...this.props} 
                        onok = {this.onDetailClick.bind(this)} 
                        oncancel = {this.cancel.bind(this)}
                        data = {this.state.data}
                        dataSous = {this.state.dataSous}
                    />}
                </Content>
            </div>

        );
    }
}


