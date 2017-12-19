import React, { Component } from 'react';
import { Table, Button, Row, Col, Modal, Popconfirm, Card, Form, Calendar, message } from 'antd';
import moment from 'moment';
import { getUser } from '../../../_platform/auth';
import AddActionRecord from './AddActionRecord';
import EditActionRecord from './EditActionRecord';
import { STATIC_DOWNLOAD_API, SOURCE_API,} from '../../../_platform/api';
import Preview from '../../../_platform/components/layout/Preview';
import * as previewActions from '../../../_platform/store/global/preview';
import ImgShow from '../../../Quality/components/ImgShow'
class ActionRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: '-1',
            newKey: Math.random(),
            newKey1: Math.random()*5,
            setVisible: false,
            setEditVisible: false,
            dataSource: [],
            record:null,
            selectedDate:'',
            code:'',
            pcode:'',
        }
    }
    componentDidMount(){
        this.setState({selectedDate:moment(new Date()).format('YYYY-MM-DD')})
    }
    componentWillReceiveProps(props){   
        const {code,pcode} = props;
        const {actions:{getSafetyActivity}} = this.props;
        let tempcode = code === "" ? `?project_code=${pcode}` : `?project_unit_code=${code}`
        tempcode = tempcode + '&record_date=' + this.state.selectedDate;
        if(code || pcode){
            getSafetyActivity({code:tempcode}).then(rst => {
                this.setState({code,pcode,record:rst[0]})
            })
        }
    }
    addClick = async() => {
        if(this.state.code === ""){
             message.info("请选择单位工程")
             return 
        }
        if(this.state.selectedDate === ""){
            message.info("请选择一个日期")
            return 
        }
        const {code,pcode} = this.state;
        const {actions:{getSafetyActivity}} = this.props;
        let tempcode = code === "" ? `?project_code=${pcode}` : `?project_unit_code=${code}`
        tempcode = tempcode + '&record_date=' + this.state.selectedDate;
        let rst = await getSafetyActivity({code:tempcode})
        if(rst.length){
            message.info("该天已添加过活动记录")
            return
        }
        this.setState({
            newKey: Math.random()*2,
            setVisible: true,
        });
    }

    editClick = async() => {
        if(this.state.code === ""){
            message.info("请选择单位工程")
            return 
       }
       if(this.state.selectedDate === ""){
           message.info("请选择一个日期")
           return 
       }
       const {code,pcode} = this.state;
       const {actions:{getSafetyActivity}} = this.props;
       let tempcode = code === "" ? `?project_code=${pcode}` : `?project_unit_code=${code}`
       tempcode = tempcode + '&record_date=' + this.state.selectedDate;
       let rst = await getSafetyActivity({code:tempcode})
       if(!rst.length){
           message.info("该天尚未添加过活动记录")
           return
       }
        this.setState({
            setEditVisible: true,
            newKey1: Math.random()*5,
        });
    }
    setEditData(record_chart,images,values){
        const {actions:{patchSafetyActivity}} = this.props;
        let putData = {
            team:values.team,
            team_leader:{
                name:values.team_leader
            },
            worker_number:values.worker_number,
            work_location:{
                name:values.work_location
            },
            work_content:values.work_content,
            record_chart:record_chart,
            images: images,
        };
        patchSafetyActivity({id:this.state.record.id},putData).then(rst => {
            try{
                this.setState({
                    setEditVisible:false,
                    record:rst
                });
            }catch(e){
                message.info("修改失败")
                this.setState({setEditVisible:false})
            }
        }); 
    }

    delete(index){
        if(!this.state.record){
            message.info('请选择活动记录')
            return
        }
        let { actions:{ delSafetyActivity } } = this.props
        delSafetyActivity({id:this.state.record.id}).then(rst => {
            this.setState({record:null})
        })
    }

    setAddData(){
        const {actions:{addSafetyActivity,getWkByCode}} = this.props;
        const {code} = this.state;
        this.props.form.validateFields(async(err,values) => {
            if(!err){
                let wkunit = await getWkByCode({code:code});
                let project = wkunit.parent.obj_type !== "C_PJ" ?  await getWkByCode({code:wkunit.parent.code}) : wkunit.parent; 
                let record_date = moment(this.state.selectedDate).format("YYYY-MM-DD");
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
                    record_date:record_date,
                    team:values.team,
                    team_leader:{
                        name:values.team_leader
                    },
                    worker_number:values.worker_number,
                    work_location:{
                        name:values.work_location
                    },
                    work_content:values.work_content,
                    record_chart:values.record_chart[0],
                    images: values.images ? values.images : [],
                };
                addSafetyActivity({},putData).then(rst => {
                    try{
                        this.setState({
                            setVisible:false,
                            record:rst
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

    //处理日历回调 
    onDateSelect(value, mode) {
        let svalue = moment(value._d).format('YYYY-MM-DD');
        let {code,pcode} = this.state
        const {actions:{getSafetyActivity}} = this.props;
        let tempcode = code === "" ? `?project_code=${pcode}` : `?project_unit_code=${code}`
        tempcode = tempcode + '&record_date=' + svalue
        if(code || pcode){
            getSafetyActivity({code:tempcode}).then(rst => {
                this.setState({code,pcode,record:rst[0]})
            })
        }
        this.setState({selectedDate:svalue})
        console.log(value, mode);
    }
    handlePanelChange(value, mode){
        console.log(value, mode);
    }

    previewFiles(index){
        const {actions: {openPreview}} = this.props;
        let f = this.state.record.record_chart
        let filed = {}
        filed.misc = f.misc;
        filed.a_file = `${SOURCE_API}` + (f.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (f.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = f.name;
        filed.mime_type = f.mime_type;
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

    render() {
        let {record} = this.state
        let tableData = record ? [
            {
                team:record.team,
                projectName:record.project_unit.name,
                operatingParts:record.work_location.name,
                worker_number:record.worker_number
            }
        ] : []
        //安全目标表格
        const columns = [{
            title: '序号',
            dataIndex: 'index',
            // width: '5%',
            render:(text,record,index) => {
                return <div>{index+1}</div>
            }
        }, {
            title: '操作班组',
            dataIndex: 'team',
            // width: '70%'
        }, {
            title: '工程名称',
            dataIndex: 'projectName',
            // width: '15%'
        }, {
            title: '作业部位',
            dataIndex: 'operatingParts',
            // width: '15%'
        }, {
            title: '作业人数',
            dataIndex: 'worker_number',
            // width: '15%'
        }]
        let imgs = this.state.record ? this.state.record.images.map(item => {
            return item.a_file
        }) : [];
        return (
            <div>
                {/* <Row>
                    <Col>
                        <h2 style={{ marginBottom: '10px' }}>安全目标管理</h2>
                    </Col>
                </Row> */}
                <Card>
                    <Row>
                        <Button type='danger' style={{ float: 'right' }}
                            onClick={this.delete.bind(this)}>
                            删除
                        </Button>
                        <Button type='primary' style={{ float: 'right',marginRight:'10px' }}
                            onClick={this.editClick.bind(this)}>
                            编辑
                        </Button>
                        <Button type='primary' style={{ float: 'right',marginRight:'10px' }}
                            onClick={this.addClick.bind(this)}>
                            新增
                        </Button> 
                    </Row>
                    <Calendar fullscreen={false} onSelect={this.onDateSelect.bind(this)} onPanelChange={this.handlePanelChange.bind(this)}/>
                    <Table style={{ marginTop: '10px' }}
                        columns={columns}
                        dataSource={tableData}
                        bordered />
                </Card>
                {this.state.record && 
                    <Card>
                        <h2>施工安全日记</h2>
                        <div>
                            <span style={{marginRight:'20px'}}><label>工程名称：</label>{this.state.record && this.state.record.project_unit.name}</span>
                            <span style={{marginRight:'20px'}}><a href={`${STATIC_DOWNLOAD_API}${this.state.record.record_chart.a_file}`}>{this.state.record.record_chart.name}</a></span>
                            <Button onClick={this.previewFiles.bind(this)}>预览</Button>
                        </div>
                        <ImgShow img={imgs}/>
                    </Card>
                }
                <Preview />
                <Modal 
					title="新增班组班前活动记录"
					width={760}
					maskClosable={false}
					key={this.state.newKey}
					visible={this.state.setVisible}
					onOk={()=>this.setAddData()}
					onCancel={this.goCancel.bind(this)}
					>
					<AddActionRecord props={this.props} state={this.state} />
				</Modal>
                {
                    this.state.setEditVisible &&
                    <EditActionRecord props={this.props} state={this.state} goCancel={this.goCancel.bind(this)} setEditData={this.setEditData.bind(this)} record={this.state.record}/>
                }

            </div>
        )
    }
}
export default Form.create()(ActionRecord);