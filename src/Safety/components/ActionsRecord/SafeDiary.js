import React, { Component } from 'react';
import { Table, Button, Row, Col, Modal, Popconfirm, Card, Form, Calendar, message, Select } from 'antd';
import moment from 'moment';
import { getUser } from '../../../_platform/auth';
import AddSafeDiary from './AddSafeDiary';
import EditSafeDiary from './EditSafeDiary';
import { STATIC_DOWNLOAD_API, SOURCE_API,} from '_platform/api';
import Preview from '../../../_platform/components/layout/Preview';
import * as previewActions from '../../../_platform/store/global/preview';
import ImgShow from '../../../Quality/components/ImgShow'
const Option = Select.Option;

class SafeDiary extends Component {
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
            user:null,//当前用户
			project_unit:null,//当前单位工程
        }
    }
    componentDidMount(){
        this.getCurrentUser();
        this.setState({selectedDate:moment(new Date()).format('YYYY-MM-DD')})
    }
    componentWillReceiveProps(props){   
        const {code,pcode} = props;
        const {actions:{getSafetyLog}} = this.props;
        let tempcode = code === "" ? `?project_code=${pcode}` : `?project_unit_code=${code}`
        tempcode = tempcode + '&log_date=' + this.state.selectedDate;
        if(code || pcode){
            getSafetyLog({code:tempcode}).then(rst => {
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
        const {actions:{getSafetyLog}} = this.props;
        let tempcode = code === "" ? `?project_code=${pcode}` : `?project_unit_code=${code}`
        tempcode = tempcode + '&log_date=' + this.state.selectedDate;
        let rst = await getSafetyLog({code:tempcode})
        if(rst.length){
            message.info("该天已添加过日记")
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
       const {actions:{getSafetyLog}} = this.props;
       let tempcode = code === "" ? `?project_code=${pcode}` : `?project_unit_code=${code}`
       tempcode = tempcode + '&log_date=' + this.state.selectedDate;
       let rst = await getSafetyLog({code:tempcode})
       if(!rst.length){
           message.info("该天尚未添加过日记")
           return
       }
        this.setState({
            setEditVisible: true,
            newKey1: Math.random()*5,
        });
    }

    setEditData(tableData,log_diary,images){
        if(tableData.length === 0){
            message.info("请至少在表格填写一条")
            return
        }
        if(tableData.some(item => item.pk === "")){
            message.info("请选择分部")
            return
        }
        const {actions:{patchSafetyLog}} = this.props;
        let putData = {
            log_objects:tableData,
            log_diary:log_diary,
            images: images,
        };
        patchSafetyLog({id:this.state.record.id},putData).then(rst => {
            try{
                this.setState({
                    setEditVisible:false,
                    record:rst
                });
                message.info("修改成功")
            }catch(e){
                message.info("修改失败")
                this.setState({setVisible:false})
            }
        });

    }

    delete(index){
        if(!this.state.record){
            message.info('请选择日记')
            return
        }
        let { actions:{ delSafetyLog } } = this.props
        delSafetyLog({id:this.state.record.id}).then(rst => {
            this.setState({record:null})
        })
    }

    setAddData(tableData){
        if(tableData.length === 0){
            message.info("请至少在表格填写一条")
            return
        }
        if(tableData.some(item => item.pk === "")){
            message.info("请选择分部")
            return
        }
        const {actions:{addSafetyLog,getSafetyLog,getWkByCode}} = this.props;
        const {code} = this.state;
        this.props.form.validateFields(async(err,values) => {
            if(!err){
                let wkunit = await getWkByCode({code:code});
                let project = wkunit.parent.obj_type !== "C_PJ" ?  await getWkByCode({code:wkunit.parent.code}) : wkunit.parent; 
                let log_date = moment(this.state.selectedDate).format("YYYY-MM-DD");
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
                    log_date:log_date,
                    log_person:this.state.user,
                    log_objects:tableData,
                    log_diary:values.log_diary[0],
                    images: values.images ? values.images : [],
                };
                addSafetyLog({},putData).then(rst => {
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
        const {actions:{getSafetyLog}} = this.props;
        let tempcode = code === "" ? `?project_code=${pcode}` : `?project_unit_code=${code}`
        tempcode = tempcode + '&log_date=' + svalue
        if(code || pcode){
            getSafetyLog({code:tempcode}).then(rst => {
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
        let f = this.state.record.log_diary
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
    
 
    //获得当前登录用户
	getCurrentUser(){
		let user = getUser();
		this.setState({user:{
			pk:user.id,
			code:user.code,
			name:user.name,
		}})
	}
 

    render() {
        const { 
            form: {getFieldDecorator}, 
        } = this.props;
        //安全目标表格
        const columns = [{
            title: '序号',
            dataIndex: 'index',
            // width: '5%',
            render:(text,record,index) => {
                return <div>{index+1}</div>
            }
        }, {
            title: '分项名称',
            dataIndex: 'project',
            // width: '15%'
        }, {
            title: '层段位置',
            dataIndex: 'location',
            // width: '15%'
        }, {
            title: '工作班组',
            dataIndex: 'team',
            // width: '70%'
        }, {
            title: '工作人数',
            dataIndex: 'workernum',
            // width: '15%'
        }, {
            title: '进度情况',
            dataIndex: 'progress',
        }]
        let imgs = this.state.record ? this.state.record.images.map(item => {
            return item.a_file
        }) : [];
        return (
            <div>
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
                        dataSource={this.state.record ? this.state.record.log_objects : []}
                        bordered />
                </Card>
                {this.state.record && 
                    <Card>
                        <h2>施工安全日记</h2>
                        <div>
                            <span style={{marginRight:'20px'}}><label>工程名称：</label>{this.state.record && this.state.record.project_unit.name}</span>
                            <span style={{marginRight:'20px'}}><a href={`${STATIC_DOWNLOAD_API}${this.state.record.log_diary.a_file}`}>{this.state.record.log_diary.name}</a></span>
                            <Button onClick={this.previewFiles.bind(this)}>预览</Button>
                        </div>
                        <ImgShow img={imgs}/>
                    </Card>
                }
                <Preview/>
                {
                    this.state.setVisible && 
                    <AddSafeDiary props={this.props} state={this.state} goCancel={this.goCancel.bind(this)} setAddData={this.setAddData.bind(this)} />
                }
                {
                    this.state.setEditVisible &&
                    <EditSafeDiary props={this.props} state={this.state} goCancel={this.goCancel.bind(this)} setEditData={this.setEditData.bind(this)} record={this.state.record}/>
                }
            </div>
        )
    }
}
export default Form.create()(SafeDiary);