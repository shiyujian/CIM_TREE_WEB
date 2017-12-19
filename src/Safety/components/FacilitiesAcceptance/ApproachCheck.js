import React, { Component } from 'react';
import { Table, Button, Row, Col, Modal, Popconfirm, Card, Form, Input, message } from 'antd';
import moment from 'moment';
import { getUser } from '../../../_platform/auth';
import AddCheck from './AddCheck';
import ApproachCheckDetail from './ApproachCheckDetail';
import { STATIC_DOWNLOAD_API, SOURCE_API } from '../../../_platform/api';
import Preview from '../../../_platform/components/layout/Preview';
import * as previewActions from '../../../_platform/store/global/preview';

const Search = Input.Search;

class ApproachCheck extends Component {
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
            unit_name:"",
            detailVisible:false
        }
    }

    async componentWillReceiveProps(props){
        const {code,pcode} = props;
        const {actions:{getDeviceEnter,getWkByCode}} = this.props;
        if(code){
            let unit = await getWkByCode({code:code});
            this.setState({unit_name:unit.name})
        }
        const tempcode = code === "" ? `?project_code=${pcode}` : `?project_unit_code=${code}`
        getDeviceEnter({code:tempcode}).then(rst => {
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
        const {actions:{delDeviceEnter}} = this.props;
        let datas = this.state.dataSource;
        delDeviceEnter({id:datas[index].id}).then(rst => {
            datas.splice(index,1);
            this.setState({dataSource:datas});
        })
    }

    setAddData(){
        const {actions:{addDeviceEnter,getWkByCode}} = this.props;
        const {code} = this.state;
        this.props.form.validateFields(async(err,values) => {
            if(!err){
                let wkunit = await getWkByCode({code:code});
                let project = wkunit.parent.obj_type !== "C_PJ" ?  await getWkByCode({code:wkunit.parent.code}) : wkunit.parent; 
                values.accept_date = moment(values.accept_date).format("YYYY-MM-DD");
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
                    responsor:{
                        name:values.responsor
                    },
                    safety_guard:{
                        name:values.safety_guard
                    },
                    name:values.name,
                    device_type:values.device_type,
                    device_spec:values.device_spec,
                    number:values.number,
                    licence:{
                        number:values.licence
                    },
                    certificate:{
                        number:values.certificate
                    },
                    conclusion:values.conclusion,
                    check_report:values.check_report,
                    accept_date:values.accept_date,
                    acceptor:{
                        name:values.acceptor
                    },
                    images:values.images ? values.images : []
                };
                let {dataSource} = this.state;
                addDeviceEnter({},putData).then(rst => {
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
    
    previewFiles(record,index){
        const {actions: {openPreview}} = this.props;
        /* if(JSON.stringify(file.basic_params) == "{}"){
            return
        }else {
            const filed = file.basic_params.files[0];
            openPreview(filed);
        } */
        let data = this.state.dataSource;
        let filed = {};
        if(!data[index].attachment){
            filed = {
                "a_file": `${SOURCE_API}/media/documents/2017/10/%E5%AE%89%E5%85%A8%E5%BA%94%E6%80%A5%E9%A2%84%E6%A1%88.pdf`,
                "misc": "file",
                //"mime_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "mime_type": "application/pdf",
                "download_url": `${STATIC_DOWNLOAD_API}/media/documents/2017/10/%E5%AE%89%E5%85%A8%E5%BA%94%E6%80%A5%E9%A2%84%E6%A1%88.pdf`,
                "name": "安全应急预案.pdf"
            }
        }else{
            filed.misc = "file";
            filed.a_file = `${SOURCE_API}`+data[index].attachment[0].url;
            filed.download_url = `${STATIC_DOWNLOAD_API}`+data[index].attachment[0].url;
            filed.name = data[index].attachment[0].name;
            filed.id = data[index].attachment[0].id;
            let type = data[index].attachment[0].url.split('.')[1];
            if(type == 'xlsx' || type == 'docx' || type == 'xls' || type == 'doc' || type == 'pptx' || type == 'ppt'){
                filed.mime_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            }
            if(type == 'pdf'){
                filed.mime_type = "application/pdf";
            } 
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
    
    download(record,index){
    	let data = this.state.dataSource;
        if(data[index].attachment){
        	let apiGet = `${STATIC_DOWNLOAD_API}`+data[index].attachment[0].url;
        	this.createLink(this,apiGet);
        }else{
        	let apiGet = `${STATIC_DOWNLOAD_API}/media/documents/2017/10/%E5%AE%89%E5%85%A8%E5%BA%94%E6%80%A5%E9%A2%84%E6%A1%88.pdf`;
        	this.createLink(this,apiGet);
        }
    }

    onSearch(value){
        const {actions:{getDeviceEnter}} = this.props
        let param = "?keyword=" + value
        getDeviceEnter({code:param}).then(rst => {
            let dataSource = this.handleData(rst)
            this.setState({dataSource})
        }) 
    }
    showDetail(record,index){
        this.setState({
            record:record,
            detailVisible: true,
        });
    }
    //将数据处理成适用于表格的数据
    handleData(data){
        return data.map(item => {
            return {
                permitNumber:item.licence.number,
                certificateNumber: item.certificate.number,
                acceptance: item.acceptor.name,
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
            width: '5%',
            render:(text,record,index) => {
                return <div>{index+1}</div>
            }
        },{
            title:'名称',
            dataIndex:'name',
            // width:'15%'
        },{
            title:'型号规格',
            dataIndex:'device_spec',
            //width:'30%'
        },{
            title:'数量',
            dataIndex:'number',
            //width:'15%'
        },{
            title:'类型',
            dataIndex:'device_type',
            
        },{
            title:'许可证号',
            dataIndex:'permitNumber',
            
        },{
            title:'合格证号',
            dataIndex:'certificateNumber',
            //width:'15%'
        },{
            title:'检验报告结论',
            dataIndex:'conclusion',
            //width:'15%'
        },{
            title:'验收人',
            dataIndex:'acceptance'
        },{
            title:'验收日期',
            dataIndex:'accept_date',
            //width:'15%'
        },{
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: '10%',
            render: (text, record, index) => (
                <span>
                    <a onClick={this.showDetail.bind(this,record,index)}>详情</a>
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
                        <Col span={12}>
                            <Search
                                placeholder="请输入搜索关键词"
                                style={{ width: '80%', display: 'block' }}
                                onSearch={(value) => this.onSearch(value)}
                            >
                            </Search>
                        </Col>
                        <Col span={12}>
                            <Button type='primary' style={{ float: 'right' }}
                                onClick={this.addClick.bind(this)}>
                                新增
                            </Button>
                        </Col>
                    </Row>
                    <Table style={{ marginTop: '10px' }}
                        columns={columns}
                        dataSource={this.state.dataSource}
                        bordered />
                </Card>

                <Modal 
					title="新增设施设备进场查验登记"
					width={760}
					maskClosable={false}
					key={this.state.newKey}
					visible={this.state.setVisible}
					onOk={()=>this.setAddData()}
					onCancel={this.goCancel.bind(this)}
					>
					<AddCheck props={this.props} state={this.state} />
				</Modal>
                <Modal 
					title="设施设备进场查验登记详情"
					width={760}
                    key={Math.random()*4}
					maskClosable={false}
					visible={this.state.detailVisible}
					onOk={()=>this.setState({detailVisible:false,record:{}})}
					onCancel={()=>this.setState({detailVisible:false,record:{}})}
					>
					<ApproachCheckDetail {...this.state.record} />
				</Modal>
                <Preview/>
            </div>
        )
    }
}
export default Form.create()(ApproachCheck);