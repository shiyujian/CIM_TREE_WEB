import React, { Component } from 'react';

import { Input, Form, Spin, Upload, Icon, Button, Modal,
    Cascader ,Select, Popconfirm,message, Table, Row, Col, notification,DatePicker } from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API} from '_platform/api';
import '../../containers/quality.less';
import Preview from '../../../_platform/components/layout/Preview';
import EditableCell from '../EditableCell' ;
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;

export default class EditFile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: this.props.dataSourceSelected,
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
    }
    

    //下拉框选择人
    selectChecker(value){
        let check = JSON.parse(value);
        this.setState({check})
    }

    //删除
    delete(index){
        let {dataSource} = this.state;
        dataSource.splice(index,1);
        this.setState({dataSource});
    }

    //预览
    handlePreview(index){
        const {actions: {openPreview}} = this.props;
        let f = this.state.dataSource[index].file
        let filed = {}
        filed.misc = f.misc;
        filed.a_file = `${SOURCE_API}` + (f.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (f.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = f.name;
        filed.mime_type = f.mime_type;
        openPreview(filed);
    }
    onSelectChange = (value,index,str) =>{
        const {dataSource} = this.state;
        dataSource[index][str] = value;
    }

    onCellChange = ( index, key ,record ) => {      //编辑某个单元格
        const {dataSource} = this.state;
        return (value) => {
        	dataSource[index][key] = value;
			record[key] = value;
        };
    }
    onok(){
        if(!this.state.check){
            notification.warning({
				message:'请选择审核人'
			})
            return
        }
        
        let temp = this.state.dataSource.some((o,index) => {
                        return !o.file.a_file
                    })
        if(temp){
            notification.warning({
				message:'有数据未上传附件'
			})
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
		this.props.onok(this.state.dataSource,per);
    }
    remove(index){
        const {actions:{deleteStaticFile}} = this.props
        let {dataSource} = this.state
        let id = dataSource[index]['file'].id
        deleteStaticFile({id:id})
        let resUnit = dataSource[index].resUnit;
        let type = dataSource[index].type;
        let upTime = dataSource[index].upTime;
        let checkTime = dataSource[index].checkTime;
        let editTime = dataSource[index].editTime;
        let result = dataSource[index].result;
        let deadline = dataSource[index].deadline;
        let editResult = dataSource[index].editResult;
        dataSource[index] = {
            resUnit: resUnit,
            type: type,
            upTime: upTime,
            checkTime: checkTime,
            editTime: editTime,
            result: result,
            deadline: deadline,
            editResult: editResult,
            code: code,
            wbs: wbs,
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
            file:{
            }
        }
        this.setState({dataSource});
    }

    //删除
    delete(index) {
        let { dataSource } = this.state;
        dataSource.splice(index, 1);
        this.setState({ dataSource });
    }
    beforeUploadPicFile  = (index,file) => {
        // 上传到静态服务器
        const fileName = file.name;
        let {dataSource,unit,project} = this.state;
        let temp = fileName.split(".")[0]
		const { actions:{uploadStaticFile} } = this.props;
        const formdata = new FormData();
        formdata.append('a_file', file);
        formdata.append('name', fileName);
        let myHeaders = new Headers();
        let myInit = { method: 'POST',
                        headers: myHeaders,
                        body: formdata
                        };
                        //uploadStaticFile({}, formdata)
        fetch(`${FILE_API}/api/user/files/`,myInit).then(async resp => {
            resp = await resp.json()
            console.log('uploadStaticFile: ', resp)
            if (!resp || !resp.id) {
                notification.error({
                    message:'文件上传失败'
                })
                return;
            };
            const filedata = resp;
            filedata.a_file = this.covertURLRelative(filedata.a_file);
            filedata.download_url = this.covertURLRelative(filedata.a_file);
            const attachment = {
                size: resp.size,
                id: filedata.id,
                name: resp.name,
                status: 'done',
                url: filedata.a_file,
                //thumbUrl: SOURCE_API + resp.a_file,
                a_file:filedata.a_file,
                download_url:filedata.download_url,
                mime_type:resp.mime_type
            };
            let unitProject = {
                name:unit.name,
                code:unit.code,
                obj_type:unit.obj_type
            }
            let projectt = {
                name:project.name,
                code:project.code,
                obj_type:project.obj_type
            }
            dataSource[index]['file'] = attachment;
            dataSource[index]['unit'] = unitProject;
            dataSource[index]['project'] = projectt;
            this.setState({dataSource})
        });
        return false;
    }

    onDateChange = (index,dateString,str) =>{
        const {dataSource} = this.state;
        dataSource[index][str] = dateString;
        this.setState({dataSource});
    }

    render() {
        const columns = [
            {
                title: '文档编码',
                dataIndex: 'code',
                width: '8%',
                render: (text, record ,index) => (
					<div>
                        <EditableCell
                            value={record.code}
							editOnOff = { false }
							onChange={ this.onCellChange( index , "code", record) }
						/>
					</div>
				),
            }, {
                title: 'WBS编码',
                dataIndex: 'wbs',
                width: '8%',
            }, {
                title: '责任单位',
                dataIndex: 'resUnit',
                width: '8%',
            }, {
                title: '隐患类型',
                dataIndex: 'type',
                width: '5%',
                render: (text, record ,index) => (
					<Select defaultValue={record.type} style={{ width: 120 }} onChange={(value)=>this.onSelectChange(value,index,"type")}>
                        <Option value="重大安全隐患">重大安全隐患</Option>
                        <Option value="较大安全隐患">较大安全隐患</Option>
                        <Option value="一般安全隐患">一般安全隐患</Option>
                    </Select>
				),
            }, {
                title: '上报时间',
                dataIndex: 'upTime',
                width: '10%',
                render: (text, record ,index) => (
					<div>
                        <DatePicker
                        onChange={(date,dateString)=>{this.onDateChange(record,dateString,'upTime')}} 
                        defaultValue={moment(record.upTime)} />
					</div>
				),
            }, {
                title: '核查时间',
                dataIndex: 'checkTime',
                width: '10%',
                render: (text, record ,index) => (
					<div>
                        <DatePicker
                        onChange={(date,dateString)=>{this.onDateChange(record,dateString,'checkTime')}}
                         defaultValue={moment(record.checkTime)} />
					</div>
				),
            }, {
                title: '整改时间',
                dataIndex: 'editTime',
                width: '10%',
                render: (text, record ,index) => (
					<div>
                        <DatePicker
                        onChange={(date,dateString)=>{this.onDateChange(record,dateString,'editTime')}}
                         defaultValue={moment(record.editTime)} />
					</div>
				),
            }, {
                title: '排查结果',
                dataIndex: 'result',
                width: '6%',
                render: (text, record ,index) => (
					<Select defaultValue={record.result} style={{ width: 120 }} onChange={(value)=>this.onSelectChange(value,index,"type")}>
                        <Option value="不合格">不合格</Option>
                        <Option value="及格">及格</Option>
                        <Option value="良好">良好</Option>
                        <Option value="优秀">优秀</Option>
                    </Select>
				),
            }, {
                title: '整改期限',
                dataIndex: 'deadline',
                width: '10%',
                render: (text, record ,index) => (
					<div>
                        <DatePicker
                         defaultValue={moment(record.deadline)} />
					</div>
				),
            }, {
                title: '整改结果',
                dataIndex: 'editResult',
                width: '6%',
                render: (text, record ,index) => (
					<Select defaultValue={record.editResult} style={{ width: 120 }} onChange={(value)=>this.onSelectChange(value,index,"type")}>
                        <Option value="通过">通过</Option>
                        <Option value="待整改">待整改</Option>
                        <Option value="失败">失败</Option>
                    </Select>
				),
            }, {
                title:'附件',
                width:"10%",
                render:(text,record,index) => {
                    return (<span>
                            <a onClick={this.handlePreview.bind(this,index)}>预览</a>
                            <span className="ant-divider" />
                            <a href={`${STATIC_DOWNLOAD_API}${record.file.a_file}`}>下载</a>
                        </span>)
                }
            }, {
                title: '操作',
                render: (text, record, index) => {
                    return (
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
            }
        ];
        return (
            <Modal
			key={this.props.akey}
            visible={true}
            width= {1280}
			onOk={this.onok.bind(this)}
			maskClosable={false}
			onCancel={this.props.oncancel}>
            <h1 style ={{textAlign:'center',marginBottom:20}}>申请变更</h1>
                <Table
                    columns={columns}
                    dataSource={this.state.dataSource}
                    bordered
                    pagination={{ pageSize: 10 }}
                />
                <Row style={{ marginBottom: "30px" }} type="flex">
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
                </Row>
                <Preview />
            </Modal>
        )
    }
}
