import React, { Component } from 'react';
import { Table, Button, Row, Col, Modal, Popconfirm, Card, Form, message } from 'antd';
import moment from 'moment';
import { getUser } from '../../../_platform/auth';
import AddExaminationCard from './AddExaminationCard';
// import EditManage from './EditManage';
import { STATIC_DOWNLOAD_API, SOURCE_API } from '../../../_platform/api';
import Preview from '../../../_platform/components/layout/Preview';
import * as previewActions from '../../../_platform/store/global/preview';
import ExaminationCardDetail from "./ExaminationCardDetail";
class ExaminationCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: '-1',
            newKey: Math.random(),
            newKey1: Math.random()*5,
            setVisible: false,
            setEditVisible: false,
            detailVisible:false,
            dataSource: [],
            record:{},//选中的record
            code:""
        }
    }
    componentWillReceiveProps(props){
        const {code,pcode} = props;
        const {actions:{getPersonCertificate}} = this.props;
        const tempcode = code === "" ? `?project_code=${pcode}` : `?project_unit_code=${code}`
        getPersonCertificate({code:tempcode}).then(rst => {
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
        const {actions:{delPersonCertificate}} = this.props;
        let datas = this.state.dataSource;
        delPersonCertificate({id:datas[index].id}).then(rst => {
            datas.splice(index,1);
            this.setState({dataSource:datas});
        })
    }

    setAddData(){
        const {actions:{addPersonCertificate,getPersonCertificate,getWkByCode}} = this.props;
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
                    org:{
                        name:values.packUnit
                    },
                    contract_project:{
                        name:values.contractingProject
                    },
                    certificateone: {
                        file: values.attachment[0],
                        person: values.CEO,
                        period: values.AValidityPeriod,
                        code: values.ACode
                    },
                    certificatetwo: {
                        file: values.certificationsB[0],
                        person: values.projectManager,
                        period: values.BValidityPeriod,
                        code: values.BCode
                    },
                    certificatethree:{
                        file: values.certificationsB[0],
                        person: values.securityOfficer,
                        period: values.CValidityPeriod,
                        code: values.CCode
                    }
                };
                addPersonCertificate({},putData).then(rst => {
                    try{
                        let {dataSource} = this.state;
                        dataSource = dataSource.concat(this.handleData([rst]));
                        this.setState({
                            setVisible:false,
                            dataSource
                        });
                    }catch(e){
                        message.info('新增失败')
                        this.setState({
                            setVisible:false
                        });
                    }
                })
            }
        }); 
    }
    
	goCancel(){
		this.setState({
            setVisible:false,
            setEditVisible: false,
		});
	}
    //查看详情
	showDetail(record){
        this.setState({
            record:record,
            newKey: Math.random()*2,
            detailVisible: true,
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
    download(index){
    	let data = this.state.dataSource;
        if(data[index].attachment){
        	let apiGet = `${STATIC_DOWNLOAD_API}`+data[index].attachment[0].url;
        	this.createLink(this,apiGet);
        }else{
        	let apiGet = `${STATIC_DOWNLOAD_API}/media/documents/2017/10/%E5%AE%89%E5%85%A8%E5%BA%94%E6%80%A5%E9%A2%84%E6%A1%88.pdf`;
        	this.createLink(this,apiGet);
        }
    }
    //将数据处理成适用于表格的数据
    handleData(data){
        return data.map(item => {
            //item.certificateone = JSON.parse(item.certificateone)
            //item.certificatetwo = JSON.parse(item.certificatetwo)
            //item.certificatethree = JSON.parse(item.certificatethree)
            return {
                packUnit:item.org.name,
                contractingProject:item.contract_project.name,
                CEO:item.certificateone.person,
                ACode:item.certificateone.code,
                projectManager:item.certificatetwo.person,
                BCode:item.certificatetwo.code,
                securityOfficer:item.certificatethree.person,
                CCode:item.certificatethree.code,
                ...item
            }
        })
    }
    render() {
        const { 
            form: {getFieldDecorator}, 
        } = this.props;
        //安全目标表格
        const columns = [{
            title: '序号',
            dataIndex: 'index',
            render:(text,record,index) => {
                return <div>{index+1}</div>
            }
        },{
			title:'总包/分包单位',
			dataIndex:'packUnit',
		},{
			title:'承包项目',
			dataIndex:'contractingProject',
		},{
			title:'企业负责人',
			dataIndex:'CEO',
		},{
			title:'A证证件编号',
			dataIndex:'ACode',
			
		},{
			title:'项目经理',
			dataIndex:'projectManager',
			
		},{
			title:'B证证件编号',
			dataIndex:'BCode',
			
		},{
			title:'专职安全员',
			dataIndex:'securityOfficer',
			
		},{
			title:'C证证件编号',
			dataIndex:'CCode',
			
		},{
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, record, index) => (
                <span>
                    <a onClick={this.showDetail.bind(this,record)}>查看详情</a>
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
					title="新增三类人员考核证"
					width={760}
					maskClosable={false}
					key={this.state.newKey}
					visible={this.state.setVisible}
					onOk={()=>this.setAddData()}
					onCancel={this.goCancel.bind(this)}
					>
					<AddExaminationCard props={this.props} state={this.state} />
				</Modal>
                <Modal 
					title="三类人员考核证详情"
					width={760}
					maskClosable={false}
					key={new Date().toString()}
					visible={this.state.detailVisible}
					onOk={() => this.setState({detailVisible:false,record:{}})}
					onCancel={() => this.setState({record:{},detailVisible:false})}
					>
					<ExaminationCardDetail {...this.state.record} />
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
export default Form.create()(ExaminationCard);