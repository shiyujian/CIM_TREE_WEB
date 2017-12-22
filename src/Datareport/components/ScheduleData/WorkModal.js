import React, { Component } from 'react';

import { Input, Form, Spin, Upload, Icon, Button, Modal,
    Cascader ,Select, Popconfirm,message, Table, Row, Col, notification } from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API} from '_platform/api';
import '../../containers/quality.less';
import Preview from '../../../_platform/components/layout/Preview';
import {getUser} from '_platform/auth';
const FormItem = Form.Item;
const Option = Select.Option;

export default class AddFile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            checkers:[],//审核人下来框选项
            check:null,//审核人
            project:{},
            unit:{},
            options:[],
        };
    }

    componentDidMount(){
        const {actions:{getAllUsers,getProjectTree}} = this.props;
        getAllUsers().then(rst => {
            let checkers = rst.map(o => {
                return (
                    <Option value={JSON.stringify(o)}>{o.account.person_name}</Option>
                )
            })
            this.setState({checkers})
        })
        getProjectTree({depth:1}).then(rst =>{
            if(rst.status){
                let projects = rst.children.map(item=>{
                    return (
                        {
                            value:JSON.stringify(item),
                            label:item.name,
                            isLeaf:false
                        }
                    )
                })
                this.setState({options:projects});
            }else{
                //获取项目信息失败
            }
        });
    }
    beforeUpload = (info) => {
        if (info.name.indexOf("xls") !== -1 || info.name.indexOf("xlsx") !== -1) {
            return true;
        } else {
            notification.warning({
                message: '只能上传Excel文件！',
                duration: 2
            });
            return false;
        }
    }
    uplodachange = (info) => {
        //info.file.status/response
        if (info && info.file && info.file.status === 'done') {
            notification.success({
                message: '上传成功！',
                duration: 2
            });
            let name = Object.keys(info.file.response);
            let dataList = info.file.response[name[0]];
            let dataSource = [];
            for (let i = 1; i < dataList.length; i++) {
                dataSource.push({
                    code: dataList[i][0] ? dataList[i][0] : '',
                    name: dataList[i][1] ? dataList[i][1] : '',
                    construct_unit: dataList[i][2] ? dataList[i][2] : '',
                    quantity: dataList[i][3] ? dataList[i][3] : '',
                    factquantity: dataList[i][4] ? dataList[i][4] : '',
                    planstarttime: dataList[i][5] ? dataList[i][5] : '',
                    planovertime: dataList[i][6] ? dataList[i][6] : '',
                    factstarttime: dataList[i][7] ? dataList[i][7] : '',
                    factovertime: dataList[i][8] ? dataList[i][8] : '',
                    uploads: getUser().username,
                    project:{
                        code:"",
                        name:"",
                        obj_type:""
                    },
                    unit:{
                        code:"",
                        name:"",
                        obj_type:""
                    },  
                })
            }
            this.setState({ dataSource });
        }
    }

    //下拉框选择人
    selectChecker(value){
        let check = JSON.parse(value);
        this.setState({check})
    }

    onSelectProject = (value,selectedOptions) =>{
        let project = {};
        let unit = {};
        if(value.length===2){
            let temp1 = JSON.parse(value[0]);
            let temp2 = JSON.parse(value[1]);
            project = {
                name:temp1.name,
                code:temp1.code,
                obj_type:temp1.obj_type
            }
            unit = {
                name:temp2.name,
                code:temp2.code,
                obj_type:temp2.obj_type
            }
            this.setState({project,unit});
            return;
        }
        //must choose all,otherwise make it null
        this.setState({project:{},unit:{}});
    }

    loadData = (selectedOptions) =>{
        const {actions:{getProjectTree}} = this.props;
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        getProjectTree({depth:2}).then(rst =>{
            if(rst.status){
                let units = [];
                rst.children.map(item=>{
                    if(item.code===JSON.parse(targetOption.value).code){  //当前选中项目
                        units = item.children.map(unit =>{
                            return (
                                {
                                    value:JSON.stringify(unit),
                                    label:unit.name
                                }
                            )
                        })
                    }
                })
                targetOption.loading = false;
                targetOption.children = units;
                this.setState({options:[...this.state.options]})
            }else{
                //获取项目信息失败
            }
        });
    }

    onok(){
        if(!this.state.check){
            message.info("请选择审核人")
            return
        }
        if(this.state.dataSource.length === 0){
            message.info("请上传excel")
            return
        }
        const {project,unit} =  this.state;
        if(!project.name){
            message.info(`请选择项目和单位工程`);
            return;
        }

        let {check} = this.state
        let per = {
            id:check.id,
            username:check.username,
            person_name:check.account.person_name,
            person_code:check.account.person_code,
            organization:check.account.organization
        }
        for(let i=0;i<this.state.dataSource.length;i++){
            this.state.dataSource[i].project = project;
            this.state.dataSource[i].unit = unit;
        }
		this.props.onok(this.state.dataSource,per);
    }

    //删除
    delete(index){
        let {dataSource} = this.state
        dataSource.splice(index,1)
        this.setState({dataSource})
    } 
    covertURLRelative = (originUrl) => {
    	return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }
    render() {
        const columns =
        [{
            title: '序号',
            render: (text, record, index) => {
                return index + 1
            }
        }, {
            title: 'WBS编码',
            dataIndex: 'code',
        }, {
            title: '任务名称',
            dataIndex: 'name',
        }, {
            title: '施工单位',
            dataIndex: 'construct_unit',
        }, {
            title: '施工图工程量',
            dataIndex: 'quantity',
        }, {
            title: '实际工程量',
            dataIndex: 'factquantity',
        }, {
            title: '计划开始时间',
            dataIndex: 'planstarttime',
        }, {
            title: '计划结束时间',
            dataIndex: 'planovertime',
        }, {
            title: '实际开始时间',
            dataIndex: 'factstarttime',
        }, {
            title: '实际结束时间',
            dataIndex: 'factovertime',
        }, {
            title: '上传人员',
            dataIndex: 'uploads',
        }, {
            title: '操作',
            render:(text,record,index) => {
                return  (
                    <Popconfirm
                        placement="leftTop"
                        title="确定删除吗？"
                        onConfirm={this.delete.bind(this, index)}
                        okText="确认"
                        cancelText="取消">
                        <a>删除</a>
                    </Popconfirm>
                )
            }
        }]
        return (
            <Modal
			title="施工进度信息上传表"
			key={this.props.akey}
            visible={true}
            width= {1280}
			onOk={this.onok.bind(this)}
			maskClosable={false}
			onCancel={this.props.oncancel}>
                <Table
                    columns={columns}
                    dataSource={this.state.dataSource}
                    bordered
                    pagination={{  //分页
                        pageSize: 10
                    }} />
                <Row style={{ marginBottom: "30px" }} type="flex">
                    <Col><Button style={{ margin:'10px 10px 10px 0px' }}>模板下载</Button></Col>
                    <Col>
                        <Upload
                            onChange={this.uplodachange.bind(this)}
                            name='file'
                            showUploadList={false}
                            action={`${SERVICE_API}/excel/upload-api/`}
                            beforeUpload={this.beforeUpload.bind(this)}
                        >
                            <Button style={{ margin:'10px 10px 10px 0px' }}>
                                <Icon type="upload" />上传并预览(文件名需为英文)
                             </Button>
                        </Upload>
                    </Col>
                    <Col>
                        <span>
                            审核人：
                            <Select style={{width:'200px'}} className="btn" onSelect={this.selectChecker.bind(this)}>
                                {
                                    this.state.checkers
                                }
                            </Select>
                        </span> 
                    </Col>
                    <Col>
                    <span>
                        项目-单位工程：
                        <Cascader
                        options={this.state.options}
                        className='btn'
                        loadData={this.loadData.bind(this)}
                        onChange={this.onSelectProject.bind(this)}
                        changeOnSelect
                      />
                    </span> 
                </Col>
                </Row>
                <Preview />
                <Row style={{ marginBottom: "30px" }}>
                    <p><span>注：</span>1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；</p>
                    <p style={{ paddingLeft: "25px" }}>2、数值用半角阿拉伯数字，如：1.2</p>
                    <p style={{ paddingLeft: "25px" }}>3、日期必须带年月日，如2017年1月1日</p>
                    <p style={{ paddingLeft: "25px" }}>4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.</p>
                </Row>
            </Modal>
        )
    }
}
