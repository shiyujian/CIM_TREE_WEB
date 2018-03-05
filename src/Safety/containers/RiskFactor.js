import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import reducer, { actions } from '../store/riskFactor';
import { actions as platformActions } from '_platform/store/global';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import {
    Table, Button, Row, Col, Icon, Modal, Input, message,
    notification, DatePicker, Select, Form, Upload, Steps
} from 'antd';
import RiskModle from './RiskModle';
import DatumTree from '../components/DatumTree';
// import DatumTree from '../components/RiskFactor/DatumTree';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import { SOURCE_API, STATIC_DOWNLOAD_API, WORKFLOW_CODE, DefaultZoomLevel } from '_platform/api';
import './Register.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
export const Datumcode = window.DeathCode.SAFETY_WMSG;
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
            isTreeSelected: false,
            loading:false,
            dataSet: [],
            currentUnitCode: '',
            currentSteps: 0,
            detailObj: {},
            currentSelectValue: '',
            modalVisible: false,
            dataSous: {},
            leafletCenter: [22.516818, 113.868495]
        }
    }
    componentDidMount() {
        const {actions: {getTree}} = this.props;
        this.setState({loading:true});
        getTree({code:Datumcode}).then(({children}) => {
            this.setState({loading:false});
        });
        if(this.props.Doc){
            this.setState({isTreeSelected:true})
        }        
    }

    onSearch = (value) => {
        const {
            actions: {
                getRisk,
            }
        } = this.props; 
        getRisk( ).then(rst => {
            const { dataSet } = this.state;
            let datas = [];
            for (let i = 0; i < rst.content.length; i++) {
                let data = {};
                if(rst.content[i].ProblemType.indexOf(value) >= 0){
                    data.problemType=rst.content[i].ProblemType;
                    data.level='三';
                    data.reorganizeRequireTime=rst.content[i].ReorganizeRequireTime;
                    data.status = this.getRiskState(rst.content[i].Status);
                    data.resPeople=rst.content[i].ReorganizerObj?rst.content[i].ReorganizerObj.Full_Name:'';
                    data.id = rst.content[i].id;
                    datas.push(data);
                }
            }
            this.setState({ dataSet: datas });
        });
    }

    getRiskState(status){
        switch (status) {
            case -1:
                return "确认中"; 
            case 0:
                return "整改中";
            case 1:
                return "审核中";
            case 2:
                return "完成";
            case "确认中":
                return -1;
            case "整改中":
                return 0;
            case "审核中":
                return 1;
            case "完成":
                return 2;
            default:
                return "确认中";
        }
    }

    onSelect(value = [],e) {
        const [code] = value;
        const {actions:{getdocument,setcurrentcode,setkeycode}} =this.props;
        setkeycode(code);
        if(code === undefined){
            return
        }
        this.setState({isTreeSelected:e.selected})
        setcurrentcode({code:code.split("--")[1]});
        getdocument({code:code.split("--")[1]});
    }

    onSelectChange = (value) => {
        this.setState({ currentSelectValue: value });
        const {
            actions: {
                getRisk
            }
        } = this.props;
         getRisk({status:value}).then(rst => {
            const { dataSet } = this.state;
            let datas = [];
            if (rst.content.length === 0) {
                notification.info({
                    message: '未查询到数据',
                    duration: 2
                });
                return;
            }
            for (let i = 0; i < rst.content.length; i++) {
                let data = {};
                data.problemType=rst.content[i].ProblemType;
                data.level='三';
                data.reorganizeRequireTime=rst.content[i].ReorganizeRequireTime;
                data.status = this.getRiskState(rst.content[i].Status);
                data.resPeople= rst.content[i].ReorganizerObj?rst.content[i].ReorganizerObj.Full_Name:'';
                data.id = rst.content[i].id;
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
        // const {
        //     platform: {
        //         dir:{
        //             list = []
        //         } = {}
        //     } = {},
        //     Doc=[],
        //     keycode,
        // } = this.props; 
        const {
            tree=[],
            Doc=[],
            keycode,
        } = this.props;
        const columns = [
            {
                title: '编号',
                dataIndex: 'o',
                width: '10%',
                render: (text, record, index) => {
                    return <div>{index + 1}</div>;
                }
            }, {
                title: '不文明施工内容',
                dataIndex: 'problemType',
                width: '10%'
            }, {
                title: '工程部位',
                dataIndex: 'unitName',
                width: '10%'
            }, {
                title: '等级',
                dataIndex: 'level',
                width: '10%'
            }, {
                title: '整改期限',
                dataIndex: 'reorganizeRequireTime',
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
                width: '15%',
                render: (text, record, index) => {
                    return <div>
                        <a href="javascript:;" onClick={this.onDetailClick.bind(this, record, index)}>详情</a>
                    </div>
                }
            }
        ];

        return (
            <div>
                <DynamicTitle title="文明施工" {...this.props} />
                <Sidebar>
                    <DatumTree treeData={tree}
                                selectedKeys={keycode}
                                onSelect={this.onSelect.bind(this)}
                                {...this.state}/>
                </Sidebar>
                <Content>
                    <Row>
                        <Col>
                            <Row>
                                <Col span={6}>
                                    <Input.Search
                                        placeholder="请输入搜索关键词"
                                        style={{ width: '80%', display: 'block' }}
                                        onSearch={(value) => this.onSearch(value)}
                                    ></Input.Search>
                                </Col>
                                <Col span={6}>
                                    <div style={{ width: '80%', marginLeft:'10%'}} >
                                        <span style={{ fontSize: 16,marginRight:5 }}>状态</span>
                                        <Select
                                            defaultValue=""
                                            style={{ width:80}}
                                            onChange={(value) => this.onSelectChange(value)}>
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
                                className = 'foresttable'
                                columns={columns}
                                dataSource = {this.state.dataSet}
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
                        data = {this.state.dataSet}
                        dataSous = {this.state.dataSous}
                    />}
                </Content>
            </div>

        );
    }
}



