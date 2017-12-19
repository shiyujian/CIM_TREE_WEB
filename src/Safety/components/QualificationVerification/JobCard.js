import React, { Component } from 'react';
import { Table, Button, Row, Col, Modal, Popconfirm, Card, Form, message } from 'antd';
import moment from 'moment';
import { getUser } from '../../../_platform/auth';
import AddJobCard from './AddJobCard';
// import EditManage from './EditManage';
import { STATIC_DOWNLOAD_API, SOURCE_API } from '../../../_platform/api';
import Preview from '../../../_platform/components/layout/Preview';
import * as previewActions from '../../../_platform/store/global/preview';

class JobCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: '-1',
            newKey: Math.random(),
            newKey1: Math.random()*5,
            setVisible: false,
            setEditVisible: false,
            dataSource: [],
            record:{},
            code:""
        }
    }

    componentWillReceiveProps(props){
        const {code,pcode} = props;
        const {actions:{getWorkCertificate}} = this.props;
        const tempcode = code === "" ? `?project_code=${pcode}` : `?project_unit_code=${code}`
        getWorkCertificate({code:tempcode}).then(rst => {
            let dataSource = this.handleData(rst) || [];
            this.setState({code,dataSource})
        })
    }
    addClick = () => {
        if(this.state.code === ""){
             message.info("请选择单位工程")
        }else{
            this.setState({
                newKey: Math.random()*2,
                setVisible: true,
            });
        } 
    }

    editClick = (record, index) => {
        this.setState({
            setEditVisible: true,
            newKey1: Math.random()*5,
            record: record,
            index: index,
        });
    }

    setEditData(){
        let jsxThis = this;
        this.props.form.validateFields((err,values) => {
            if(!err){
                let datas = this.state.dataSource;
                //values.date = moment(values.date._d).format('YYYY-MM-DD');
                datas.splice(jsxThis.state.index,1,values);
                //debugger
                this.setState({
                    setEditVisible:false,
                    dataSource:datas
                });
            }
        }); 
    }

    delete(index){
        const {actions:{delWorkCertificate}} = this.props;
        let datas = this.state.dataSource;
        delWorkCertificate({id:datas[index].id}).then(rst => {
            datas.splice(index,1);
            this.setState({dataSource:datas});
        })
    }

    setAddData(){
        const {actions:{getWorkCertificate,addWorkCertificate,delWorkCertificate,getWkByCode}} = this.props;
        const {code} = this.state;
        this.props.form.validateFields(async(err,values) => {
            if(!err){
                let wkunit = await getWkByCode({code:code});
                let project = wkunit.parent.obj_type !== "C_PJ" ?  await getWkByCode({code:wkunit.parent.code}) : wkunit.parent; 
                let putData = {
                    project:{
                        pk:project.pk,
                        code:project.code,
                        name:project.name,
                        obj_type:project.obj_type
                    },
                    project_unit:{
                        pk:wkunit.pk,
                        code:wkunit.code,
                        name:wkunit.name,
                        obj_type:wkunit.obj_type
                    },
                    person:{
                        name: values.name,
                        female:values.gender,

                    },
                    org:{
                        name:values.packUnit
                    },
                    contract_project:{
                        name:values.contractingProject
                    },
                    certificateone: {
                        "work": values.class,
                        department: values.department,
                        date: values.date,
                        code: values.code,
                        deadline: values.deadline,
                        file: values.attachment[0]
                    },
                };
                let {dataSource} = this.state;
                addWorkCertificate({},putData).then(rst => {
                    try{
                        dataSource = dataSource.concat(this.handleData([rst]));
                        this.setState({
                            setVisible:false,
                            dataSource
                        });
                    }catch(e){
                        message.info("添加失败")
                        this.setState({setVisible:false})
                    }
                });
            }
        }); 
    }
    
	goCancel(){
		this.setState({
            setVisible:false,
            setEditVisible: false,
		});
	}

	previewFiles(index){
        const {actions: {openPreview}} = this.props;
        let data = this.state.dataSource;
        let filed = {};
        if(data[index].file.name){
            filed.misc = data[index].file.misc;
            filed.a_file = `${SOURCE_API}` + (data[index].file.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
            filed.download_url = `${STATIC_DOWNLOAD_API}` + (data[index].file.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
            filed.name = data[index].file.name;
            filed.mime_type = data[index].file.mime_type;
            openPreview(filed);
        }else{
            message.info("暂无文件");
        }
        openPreview(filed);
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
    download(index){
    	let data = this.state.dataSource;
        if(data[index].file){
        	let apiGet = `${STATIC_DOWNLOAD_API}`+data[index].file.a_file;
        	this.createLink(this,apiGet);
        }else{
        	message.info('暂无文件')
        }
    }
     //将数据处理成适用于表格的数据
     handleData(data){
        return data.map(item => {
            return {
                packUnit:item.org.name,
                contractingProject:item.contract_project.name,
                gender:item.person.female,
                class:item.certificateone.work,
                ...item.certificateone,
                ...item.person,
                id:item.id
            }
        })
    }
    render() {
        const { 
            form: {getFieldDecorator}, 
        } = this.props;
        console.log("*******",this.state);
        //安全目标表格
        const columns = [{
            title: '序号',
            dataIndex: 'index',
            render:(text,record,index) => {
                return <div>{index+1}</div>
            }
        },{
            title:'人员姓名',
            dataIndex:'name',
            // width:'15%'
        },{
            title:'性别',
            dataIndex:'gender',
            // width:'10%'
        },{
            title:'工种',
            dataIndex:'class',
            // width:'15%'
        },{
            title:'发证部门',
            dataIndex:'department',
            // width:'15%'
        },{
            title:'证书编号',
            dataIndex:'code'
        },{
            title:'发证日期',
            dataIndex:'date',
            // width:'15%'
        },{
            title:'复审期限',
            dataIndex:'deadline',
            // width:'15%'
        },{
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, record, index) => (
                <span>
                    <a onClick={this.previewFiles.bind(this,index)}>预览</a>
                    <span className="ant-divider" />
                    <a onClick={this.download.bind(this,index)}>下载</a>
                    <span className="ant-divider" />
                    <Popconfirm
                        placement="rightTop"
                        title="确定删除吗？"
                        onConfirm={this.delete.bind(this, index)}
                        okText="确认"
                        cancelText="取消">
                        <a>删除</a>
                    </Popconfirm>
                </span>
            ),
        }]

        return (
            <div>
                {/* <Row>
                    <Col>
                        <h2 style={{ marginBottom: '10px' }}>安全目标管理</h2>
                    </Col>
                </Row> */}
                <Card>
                    <Row>
                        <Button type='primary' style={{ float: 'right' }}
                            onClick={this.addClick.bind(this)}>
                            新增
                        </Button>
                    </Row>
                    <Table style={{ marginTop: '10px' }}
                        columns={columns}
                        dataSource={this.state.dataSource}
                        bordered />
                </Card>

                <Modal 
					title="新增上岗证"
					width={760}
					maskClosable={false}
					key={this.state.newKey}
					visible={this.state.setVisible}
					onOk={()=>this.setAddData()}
					onCancel={this.goCancel.bind(this)}
					>
					<AddJobCard props={this.props} state={this.state} />
				</Modal>

                {/* <Modal 
					title="编辑安全目标"
					width={760}
                    key={this.state.newKey1}
					maskClosable={false}
					visible={this.state.setEditVisible}
					onOk={()=>this.setEditData()}
					onCancel={()=>this.goCancel()}
					>
					<EditManage props={this.props} state={this.state} />
				</Modal> */}
            </div>
        )
    }
}
export default Form.create()(JobCard);