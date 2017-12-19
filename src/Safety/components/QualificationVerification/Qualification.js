import React, { Component } from 'react';
import { Table, Button, Row, Col, Modal, Popconfirm, Card, Form, message } from 'antd';
import moment from 'moment';
import { getUser } from '../../../_platform/auth';
import AddVerificationModal from './AddVerificationModal';
// import EditManage from './EditManage';
import { STATIC_DOWNLOAD_API, SOURCE_API} from '../../../_platform/api';
import Preview from '../../../_platform/components/layout/Preview';
import * as previewActions from '../../../_platform/store/global/preview';

class Qualification extends Component {
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
            code:"",
        }
    }
    componentDidMount(){
    }
    componentWillReceiveProps(props){
        const {code,pcode} = props;
        const {actions:{getVerificationByCode}} = this.props;
        const tempcode = code === "" ? `?project_code=${pcode}` : `?project_unit_code=${code}`
        getVerificationByCode({code:tempcode}).then(rst => {
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


    delete(index){
        const {actions:{delVerfication}} = this.props;
        let datas = this.state.dataSource;
        delVerfication({id:datas[index].id}).then(rst => {
            datas.splice(index,1);
            this.setState({dataSource:datas});
        })
    }

    async setAddData(){
        const {actions:{getVerificationByCode,putVerification,getWkByCode}} = this.props;
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
                    certificateone: values.attachment ? values.attachment[0] : {},
                    certificatetwo:values.certifications ? values.certifications[0] : {},
                    certificatethree:values.safetyLicense ? values.safetyLicense[0] : {}
                };
                let {dataSource} = this.state;
                putVerification({},putData).then(rst => {
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
    
    previewFiles(index,type){
        const {actions: {openPreview}} = this.props;
        /* if(JSON.stringify(file.basic_params) == "{}"){
            return
        }else {
            const filed = file.basic_params.files[0];
            openPreview(filed);
        } */
        let data = this.state.dataSource;
        let filed = {};
        if(data[index][type].name){
            filed.misc = data[index][type].misc;
            filed.a_file = `${SOURCE_API}` + (data[index][type].a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
            filed.download_url = `${STATIC_DOWNLOAD_API}` + (data[index][type].download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
            filed.name = data[index][type].name;
            filed.mime_type = data[index][type].mime_type;
            openPreview(filed);
        }else{
            message.info("暂无文件");
        }
        /*if(!data[index].attachment){
            filed = {
                "a_file": `${SOURCE_API}/media/documents/2017/10/%E5%AE%89%E5%85%A8%E5%BA%94%E6%80%A5%E9%A2%84%E6%A1%88.pdf`,
                "misc": "file",
                //"mime_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "mime_type": "application/pdf",
                "download_url": `${STATIC_DOWNLOAD_API}/media/documents/2017/10/%E5%AE%89%E5%85%A8%E5%BA%94%E6%80%A5%E9%A2%84%E6%A1%88.pdf`,
                "name": "安全应急预案.pdf"
            }
        }*/
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
    
    download(index,type){
    	let data = this.state.dataSource;
        if(data[index][type].name){
            let apiGet = `${STATIC_DOWNLOAD_API}`+data[index][type].a_file;
        	this.createLink(this,apiGet);
        }else{
        	message.info("暂无文件")
        }
    }
    //将数据处理成适用于表格的数据
    handleData(data){
        return data.map(item => {
            return {
                packUnit:item.org.name,
                contractingProject:item.contract_project.name,
                certifications:'',
                businessLicense:'',
                safetyLicense:'',
                ...item
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
            width: '5%',
            render:(text,record,index) => {
                return <div>{index+1}</div>
            }
        }, {
            title:'总包/分包单位',
            dataIndex:'packUnit',
            width:'30%'
        },{
            title:'承包项目',
            dataIndex:'contractingProject',
            // width:'15%'
        },{
            title:'营业执照',
            dataIndex:'businessLicense',
            render: (text, record, index) => (
                <span>
                    <a onClick={this.previewFiles.bind(this,index,"certificateone")}>预览</a>
                    <span className="ant-divider" />
                    <a onClick={this.download.bind(this,index,"certificateone")}>下载</a>
                </span>
            ),
        },{
            title:'资质证书',
            dataIndex:'certifications',
            render: (text, record, index) => (
                <span>
                    <a onClick={this.previewFiles.bind(this,index,"certificatetwo")}>预览</a>
                    <span className="ant-divider" />
                    <a onClick={this.download.bind(this,index,"certificatetwo")}>下载</a>
                </span>
            ),
        },{
            title:'安全生产许可证',
            dataIndex:'safetyLicense',
            render: (text, record, index) => (
                <span>
                    <a onClick={this.previewFiles.bind(this,index,"certificatethree")}>预览</a>
                    <span className="ant-divider" />
                    <a onClick={this.download.bind(this,index,"certificatethree")}>下载</a>
                </span>
            ),
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: '10%',
            render: (text, record, index) => (
                <span>
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
        console.log(this.state.dataSource)
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
					title="新增单位资质"
					width={760}
					maskClosable={false}
					key={this.state.newKey}
					visible={this.state.setVisible}
					onOk={()=>this.setAddData()}
					onCancel={this.goCancel.bind(this)}
					>
					<AddVerificationModal props={this.props} state={this.state} />
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
export default Form.create()(Qualification);