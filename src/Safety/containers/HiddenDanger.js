import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import reducer, { actions } from '../store/hiddenDanger';
import { actions as platformActions } from '_platform/store/global';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import {
    Table, Button, Row, Col, Icon, Modal, Input, message,
    notification, DatePicker, Select, Form, Upload, Steps
} from 'antd';
import HiddenModle from './HiddenModle';
// import WorkPackageTree from '../components/WorkPackageTree';
import DatumTree from '../components/DatumTree';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import { SOURCE_API, STATIC_DOWNLOAD_API, WORKFLOW_CODE, DefaultZoomLevel } from '_platform/api';
import './Register.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'leaflet/dist/leaflet.css';
import './HiddenDanger.less';
export const Datumcode = window.DeathCode.SAFETY_AQYH;
moment.locale('zh-cn');
const Option = Select.Option;

@connect(
    state => {
        const { safety: { hiddenDanger = {} } = {}, platform } = state;
        return { ...hiddenDanger, platform }
    },
    dispatch => ({
        actions: bindActionCreators({ ...actions, ...platformActions, ...previewActions }, dispatch)
    })
)

export default class HiddenDanger extends Component {
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
        const {actions: {getDir}} = this.props;
        this.setState({loading:true});
        getDir({code:Datumcode}).then(({children}) => {
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
            console.log('rst',rst)
            const { dataSet } = this.state;
            let datas = [];
            // debugger
            for (let i = 0; i < rst.content.length; i++) {
                let data = {};
                if(rst.content[i].ProblemType.indexOf(value) >= 0){
                    data.problemType=rst.content[i].ProblemType;
                    data.level='V';
                    data.createTime=rst.content[i].CreateTime;
                    data.status = this.getRiskState(rst.content[i].Status);
                    data.resPeople=rst.content[i].ReorganizerObj?rst.content[i].ReorganizerObj.Full_Name:'';

                    // data.riskContent = rst[i].risk_content;
                    // data.projectName = rst[i].project_location.project_name;
                    // data.unitName = rst[i].project_location.unit_name;
                    // data.level = rst[i].risk_level["风险级别"];
                    // data.status = this.getRiskState(rst[i].status);
                    // data.resPeople = rst[i].response_org.name;
                    // data.coordinate = rst[i].coordinate;
                    // data.images = rst[i].rectify_before.images ? rst[i].rectify_before.images : [];
                    data.id = rst.content[i].id;
                    datas.push(data);
                }
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

    getRiskState(status){
        // debugger
        switch (status) {
            case -1:
                return "提交";
            case 0:
                return "整改中";
            case 1:
                return "整改完成";
            case 2:
                return "确认完成";
            case "提交":
                return -1;
            case "整改中":
                return 0;
            case "整改完成":
                return 1;
            case "确认完成":
                return 2;
            default:
                return "提交";
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
    // onSelect(selectedKeys, e) {
    //     console.log('selectedKeys',selectedKeys,e)
    //     if (!e.selected) {
    //         return
    //     }
    //     this.setState({ currentUnitCode: selectedKeys });
    //     const {
    //         actions: {
    //             getRisk,
    //         }
    //     } = this.props;

    //     const { currentSelectValue } = this.state;
    //      getRisk( ).then(rst => {
    //         const { dataSet } = this.state;
    //         let datas = [];
    //         // debugger
    //         if (rst.content.length === 0) {
    //             notification.info({
    //                 message: '未查询到数据',
    //                 duration: 2
    //             });
    //             return;
    //         }
    //         for (let i = 0; i < rst.content.length; i++) {
    //             let data = {};
    //             data.problemType=rst.content[i].ProblemType;
    //             data.level='V';
    //             data.createTime=rst.content[i].CreateTime;
    //             data.status = this.getRiskState(rst.content[i].Status);
    //             data.resPeople=rst.content[i].ReorganizerObj?rst.content[i].ReorganizerObj.Full_Name:'';
    //             data.id = rst.content[i].id;
    //             datas.push(data);
    //         }
    //         this.setState({ dataSet: datas }); 
    //     });
    // }
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
        const {
            actions: {
                getRisk
            }
        } = this.props;
         getRisk({status:value}).then(rst => {
            const { dataSet } = this.state;
            let datas = [];
            // debugger
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
                data.level='V';
                data.createTime=rst.content[i].CreateTime;
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
        const {
            platform: {
                dir:{
                    list = []
                } = {}
            } = {},
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
                title: '隐患内容',
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
                dataIndex: 'createTime',
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
                <DynamicTitle title="安全隐患" {...this.props} />
                {/*<Sidebar>
                    <WorkPackageTree {...this.props}
                        onSelect={this.onSelect.bind(this)} />
                </Sidebar>*/}
                <Sidebar>
                    <DatumTree treeData={list}
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
                                        style={{ width: '300px', display: 'block' }}
                                        onSearch={(value) => this.onSearch(value)}
                                    ></Input.Search>
                                </Col>
                                <Col span={6}>
                                    <span style={{ fontSize: 16 }}>状态</span>
                                    <Select
                                        defaultValue=""
                                        style={{ width: '100px', marginLeft: 5 }}
                                        onChange={(value) => this.onSelectChange(value)}>
                                        <Option value={-1}>提交</Option>
                                        <Option value={0}>整改中</Option>
                                        <Option value={1}>整改完成</Option>
                                        <Option value={2}>确认完成</Option>
                                        <Option value=''>全部</Option>
                                    </Select>
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
                     <HiddenModle 
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


