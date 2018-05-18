import React, {PropTypes, Component} from 'react';
import {FILE_API} from '../../../_platform/api';
import {
    Form, Input, Row, Col, Modal, Upload, Button,
    Icon, message, Table,DatePicker,Progress,Select,Checkbox,Popconfirm,notification,Spin
} from 'antd';
import moment from 'moment';
import {DeleteIpPort} from '../../../_platform/components/singleton/DeleteIpPort';
import PerSearch from '../../../_platform/components/panels/PerSearch';
import { getUser } from '../../../_platform/auth';
import { getNextStates } from '../../../_platform/components/Progress/util';
import { base,   WORKFLOW_CODE,PROJECT_UNITS } from '../../../_platform/api';
const Dragger = Upload.Dragger;
const FormItem = Form.Item;
const fileTypes = 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword';


class FormAddition extends Component {

    static propTypes = {};
    constructor(props){
        super(props)
        this.state={
            TreatmentData:[],
            currentSection:'',
            currentSectionName:'',
            projectName:'',
            loading:false
        }
    }
    
    columns1 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: '10%',
        }, {
            title: '文件名称',
            dataIndex: 'fileName',
            key: 'fileName',
            width: '35%',
        }, {
            title: '备注',
            dataIndex: 'remarks',
            key: 'remarks',
            width: '30%',
            render: (text, record, index) => {
                return <Input value={record.remarks || ""} onChange={ele => {
                    record.remarks = ele.target.value
                    this.forceUpdate();
                }} />
            }
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: '10%',
            render: (text, record, index) => {
                return <div>
                    <Popconfirm
                        placement="rightTop"
                        title="确定删除吗？"
                        onConfirm={this.deleteTreatmentFile.bind(this, record, index)}
                        okText="确认"
                        cancelText="取消">
                        <a>删除</a>
                    </Popconfirm>
                </div>
            }
        }
    ]
    static layoutT = {
        labelCol: {span: 8},
        wrapperCol: {span: 16},
    };

    async componentDidMount() {
        console.log('componentDidMountcomponentDidMount')
        this.setState({
            TreatmentData:[]
        })
        this.getSection()
    }
    async componentDidUpdate(prevProps,prevState){
        const{
            formAddVisible = false,
        }= this.props
        if(formAddVisible && formAddVisible != prevProps.formAddVisible){
            this.setState({
                TreatmentData:[]
            })
        }
    }

    //获取当前登陆用户的标段
    getSection(){
        let user = getUser()
        
        let sections = user.sections
        let sectionSchedule = []
        let currentSectionName = ''
        let projectName = ''
        
        sections = JSON.parse(sections)
        if(sections && sections instanceof Array && sections.length>0){
            let section = sections[0]
            let code = section.split('-')
            if(code && code.length === 3){
                //获取当前标段所在的项目
                PROJECT_UNITS.map((item)=>{
                    if(code[0] === item.code){
                        projectName = item.value
                        let units = item.units
                        units.map((unit)=>{
                            //获取当前标段的名字
                            if(unit.code == section){
                                currentSectionName = unit.value
                            }
                        })

                    }
                })
            }
            this.setState({
                currentSection:section,
                currentSectionName:currentSectionName,
                projectName:projectName
            })
        }
    }
    render() {
        const{
            formAddVisible = false,
            selectedDir,
            form: { getFieldDecorator },
        } = this.props;
        const {
            TreatmentData,
            currentSectionName=''
        } = this.state;

        let flow = selectedDir.extra_params ? selectedDir.extra_params.workflow : ''
        let arr = ''
        try{
            arr = flow.split('--')[0]
        }catch(e){
            console.log(e)
        }
         
        console.log('arr',arr)
        return (
            <div>
                {
                    formAddVisible
                    ?
                    <Modal
                     title="新增文档"
                     width={920}
                     visible={formAddVisible}
                     maskClosable={false}
                     footer={false}
                     >
                        <Spin spinning={this.state.loading}>
                            <Form onSubmit={this.handleSubmit.bind(this)}>
                                <Row>
                                    <Col span={12}>
                                        <FormItem {...FormAddition.layoutT} label='标段'>
                                            {
                                                getFieldDecorator('section', {
                                                    initialValue: `${currentSectionName}`,
                                                    rules: [
                                                        { required: true, message: '请输入标段' }
                                                    ]
                                                })
                                                (
                                                    (<Input readOnly placeholder='请输入标段' />)
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem {...FormAddition.layoutT} label='名称'>
                                            {
                                                getFieldDecorator('name', {
                                                    rules: [
                                                        { required: true, message: '请输入名称' }
                                                    ]
                                                })
                                                    (<Input placeholder='请输入名称' />)
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem {...FormAddition.layoutT} label='编号'>
                                            {
                                                getFieldDecorator('code', {
                                                    rules: [
                                                        { required: true, message: '请输入编号' }
                                                    ]
                                                })
                                                    (<Input placeholder='请输入编号' />)
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem {...FormAddition.layoutT} label='文档类型'>
                                            {
                                                getFieldDecorator('document', {
                                                    initialValue: `${selectedDir.name || ''}`,
                                                    rules: [
                                                        { required: true, message: '请选择文档类型' }
                                                    ]
                                                })
                                                (<Input readOnly placeholder='请选择文档类型' />)
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Dragger
                                        {...this.uploadProps}
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <Icon type="inbox"/>
                                        </p>
                                        <p>点击或者拖拽开始上传</p>
                                        <p className="ant-upload-hint">
                                            支持 pdf、doc、docx 文件
                                        </p>
                                    </Dragger>

                                    <Table 
                                        columns={this.columns1}
                                        dataSource={TreatmentData}
                                        pagination={true}
                                    />
                                </Row>
                                <Row style={{marginTop: 15}}>
                                    <Col span={10} >
                                        <FormItem {...FormAddition.layoutT} label='审核人'>
                                            {
                                                getFieldDecorator('dataReview', {
                                                    rules: [
                                                        { required: true, message: '请选择审核人员' }
                                                    ]
                                                })
                                                    (
                                                    <PerSearch selectMember={this.selectMember.bind(this)} code={arr}/>
                                                    )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={8} offset={4}>
                                        <Checkbox >短信通知</Checkbox>
                                    </Col>
                                </Row>
                                <FormItem>
                                    <Row>
                                        <Col span={24} style={{ textAlign: 'right' }}>
                                            <Button  onClick={this.cancel.bind(this)}>取消</Button>
                                            <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">确认</Button>
                                        </Col>
                                    </Row>
                                </FormItem>
                            </Form>
                        </Spin>
                    </Modal>
                    :
                    ''
                }
            </div>
            
        );
    }

    //上传文件
    uploadProps = {
        name: 'a_file',
        multiple: true,
        showUploadList: false,
        action: base + "/service/fileserver/api/user/files/",
        onChange: ({ file, fileList, event }) => {
            this.setState({
                loading:true
            })
            const status = file.status;
            const{
				TreatmentData = []
			} = this.state
            let newdata = [];
            if (status === 'done') {
                console.log('file',file)
                // const { actions: { postUploadFilesAc } } = this.props;
                let len = TreatmentData.length
				TreatmentData.push(
					{
						index: len + 1,
                        fileName: file.name,
                        file_id: file.response.id,
                        file_partial_url: '/media' + file.response.a_file.split('/media')[1],
                        send_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                        a_file: '/media' + file.response.a_file.split('/media')[1],
                        download_url: '/media' + file.response.download_url.split('/media')[1],
                        misc: file.response.misc,
                        mime_type: file.response.mime_type,
					}
				)
				console.log('TreatmentData',TreatmentData)
                notification.success({
                    message:'文件上传成功',
                    duration:3
                })
                this.setState({ 
                    TreatmentData: TreatmentData,
                    loading:false 
                })

            }else if(status === 'error'){
                notification.error({
                    message:'文件上传失败',
                    duration:3
                })
                this.setState({
                    loading:false
                })
                return;
            }
        },
    };

     //删除文件表格中的某行
	deleteTreatmentFile = (record, index) => {
		const{
			TreatmentData
		}=this.state
		TreatmentData.splice(index, 1);
		let array = []
        TreatmentData.map((item, index) => {
            let data = {
				index: index + 1,
				fileName: item.fileName,
				file_id: item.file_id,
				file_partial_url: item.file_partial_url,
				send_time: item.send_time,
				a_file: item.a_file,
				download_url: item.download_url,
				misc: item.misc,
				mime_type: item.mime_type,
            }
            array.push(data)
		})
        this.setState({TreatmentData: array })
	}

    //选择人员
    selectMember(memberInfo) {
        const {
            form: {
                setFieldsValue
            }
        } = this.props
		this.member = null;
		if (memberInfo) {
			let memberValue = memberInfo.toString().split('#');
			if (memberValue[0] === 'C_PER') {
				console.log('memberValue', memberValue)
				this.member = {
					"username": memberValue[4],
					"person_code": memberValue[1],
					"person_name": memberValue[2],
					"id": parseInt(memberValue[3]),
					org: memberValue[5],
				}
			}
		} else {
			this.member = null
		}
        setFieldsValue({
            dataReview: this.member
        });
    }

    cancel() {
        const {
            actions: {FormAddVisible}
        } = this.props;
        FormAddVisible(false);
    }

    handleSubmit = (e) =>{
        e.preventDefault();
        const {
            selectedDir,
            actions: {
                createFlow,
                getWorkflowById,
                putFlow,
                FormAddVisible,
                SearchForm
            }
        } = this.props;
        
        const{
            TreatmentData,
            projectName,
            currentSectionName,
			currentSection
        } = this.state
        console.log('TreatmentData',TreatmentData)
        let user = getUser();//当前登录用户
        let sections = user.sections || []
        if(!sections || sections.length === 0 ){
            notification.error({
                message:'当前用户未关联标段，不能创建流程',
                duration:3
            })
            return
        }

        let me = this;
        let postData = {};
        me.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
            // console.log('currentSection: ', currentSection);
            // console.log('currentSectionName: ', currentSectionName);
            // console.log('projectName: ', projectName);
            if (!err) {

                if (TreatmentData.length === 0) {
                    notification.error({
                        message: '请上传文件',
                        duration: 3
                    })
                    return
                }

                postData.upload_unit = user.org ? user.org : '';
                postData.type = values.document;
                postData.upload_person = user.name ? user.name : user.username;
                postData.upload_time = moment().format('YYYY-MM-DDTHH:mm:ss');


                //当前用户信息
                const currentUser = {
                    "username": user.username,
                    "person_code": user.code,
                    "person_name": user.name,
                    "id": parseInt(user.id),
                    "org": user.org,
                };


                let subject = [{
                    "section": JSON.stringify(currentSection),
                    "sectionName":JSON.stringify(currentSectionName),
                    "projectName":JSON.stringify(projectName),

                    "name":JSON.stringify(values.name),
                    "code":JSON.stringify(values.code),
                    "document":JSON.stringify(values.document),
                    "TreatmentData":JSON.stringify(TreatmentData),
                    "timedate": JSON.stringify(moment().format('YYYY-MM-DD')),
                    "postData": JSON.stringify(postData),
                    "FillPerson":JSON.stringify(currentUser),
                }];

                const nextUser = this.member;

                //在项目管理时关联的流程
                let flow = selectedDir.extra_params.workflow
                let arr = flow.split('--')
                console.log('arr',arr)

                let WORKFLOW_MAP = {
                    name: arr[1],
                    desc: arr[1],
                    code: arr[0]
                };

                let workflowdata = {
                    name: WORKFLOW_MAP.name,
                    description: WORKFLOW_MAP.desc,
                    subject: subject,
                    code: WORKFLOW_MAP.code,
                    creator: currentUser,
                    plan_start_time: null,
                    deadline: null,
                    "status": 2
                }
                createFlow({}, workflowdata).then((instance) => {
                    if (!instance.id) {
                        notification.error({
                            message: '数据提交失败',
                            duration: 2
                        })
                        return;
                    }
                    const { id, workflow: { states = [] } = {} } = instance;
                    const [{ id: state_id, actions: [action] }] = states;

                    getWorkflowById({ id: id }).then(instance => {
                        if (instance && instance.current) {
                            let currentStateId = instance.current[0].id;
                            let nextStates = getNextStates(instance, currentStateId);
                            let stateid = nextStates[0].to_state[0].id;

                            let postInfo = {
                                next_states: [{
                                    state: stateid,
                                    participants: [nextUser],
                                    deadline: null,
                                    remark: null
                                }],
                                state: instance.workflow.states[0].id,
                                executor: currentUser,
                                action: nextStates[0].action_name,
                                note: "提交",
                                attachment: null
                            }
                            let data = { pk: id };
                            //提交流程到下一步
                            putFlow(data, postInfo).then(rst => {
                                if (rst && rst.creator) {
                                    notification.success({
                                        message: '流程提交成功',
                                        duration: 2
                                    });
                                    SearchForm(Math.random())
                                    FormAddVisible(false);
                                    
                                } else {
                                    notification.error({
                                        message: '流程提交失败',
                                        duration: 2
                                    });
                                    return;
                                }
                            });
                        }
                    });
                });
            }
        })
    }
}
export default Form.create()(FormAddition)