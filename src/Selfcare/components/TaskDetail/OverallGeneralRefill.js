import React, {PropTypes, Component} from 'react';
import {FILE_API} from '../../../_platform/api';
import {
    Form, Input, Row, Col, Modal, Upload, Button,
    Icon, message, Table,DatePicker,Progress,Select,Checkbox,Popconfirm,notification,Card,Steps,Spin
} from 'antd';
import moment from 'moment';
import {DeleteIpPort} from '../../../_platform/components/singleton/DeleteIpPort';
// import PerSearch from '../Task/PerSearch';
import PerSearch from '../../../_platform/components/panels/PerSearch';
import { getUser } from '../../../_platform/auth';
import { getNextStates } from '../../../_platform/components/Progress/util';
import { base, SOURCE_API, DATASOURCECODE,WORKFLOW_CODE,SECTIONNAME,PROJECT_UNITS } from '../../../_platform/api';
import queryString from 'query-string';
//import {fileTypes} from '../../../_platform/store/global/file';
const Dragger = Upload.Dragger;
const FormItem = Form.Item;
const fileTypes = 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword';
const Step = Steps.Step;
const EditableCell = ({ editable, value, onChange }) => (
          <div>
            {editable
              ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
              : value
            }
          </div>
        );

class OverallGeneralRefill extends Component {

    static propTypes = {};
    constructor(props){
        super(props)
        this.state={
            dataSource:[],
            count:0,
            TreatmentData:[],
            dataSource:[],
            currentSection:'',
            currentSectionName:'',
            projectName:'',
            loading:false,
            selectedRowKeys:[],
            oldSubject:{},
           
        }
    }
    //第一个表格的列属性
    equipment=[
        {
            title: '设备名称',
            dataIndex: 'equipName',
            key: 'equipName',
            render: (text, record) => this.renderColumns(text, record, 'equipName'),
        }, {
            title: '规格型号',
            dataIndex: 'equipNumber',
            key: 'equipNumber',
            render: (text, record) => this.renderColumns(text, record, 'equipNumber'),
        }, {
            title: '数量',
            dataIndex: 'equipCount',
            key: 'equipCount',
            render: (text, record) => this.renderColumns(text, record, 'equipCount'),
        }, {
            title: '进场日期',
            dataIndex: 'equipTime',
            key: 'equipTime',
            render: (text, record) => {

                return  <div>
                    { 
                        record.editable 
                        ?
                        < DatePicker onChange={this.equipTimeChange.bind(this,record,'equipTime')} defaultValue={moment(record.equipTime,'YYYY-MM-DD')} format={'YYYY-MM-DD'}/>
                        :
                        record.equipTime
                    }
                </div>
                
            },
        }, {
            title: '技术状况',
            dataIndex: 'equipMoment',
            key: 'equipMoment',
            render: (text, record) => this.renderColumns(text, record, 'equipMoment'),
        },{
            title: '备注',
            dataIndex: 'equipRemark',
            key: 'equipRemark',
            render: (text, record) => this.renderColumns(text, record, 'equipRemark')
        }, {
          title: '操作',
          dataIndex: 'equipOperation',
          render: (text, record) => {
            const { editable } = record;
            return (
                <div>
                    <span>
                        {
                            editable ?
                            <a style={{marginRight:'10'}}onClick={() => this.saveTable(record.key)}>
                                <Icon type='save' style={{fontSize:20}}/>
                            </a>:
                            <a onClick={() => this.edit(record.key)}>
                                <Icon type='edit' style={{fontSize:20}}/>
                            </a>
                        }
                    </span>
                </div>
            );
          }
        }
    ];
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
    static layout = {
        labelCol: {span: 4},
        wrapperCol: {span: 20},
    };

    async componentDidMount() {
        const { 
            form: {
                setFieldsValue
            },
            platform: { task = {}, users = {} } = {}, 
        } = this.props;
        this.getSection()

        let record = {}
		if(task && task.subject && !record.id){
			record = this.getTable(task)
        }
        console.log('record',record.timedate)
        
        setFieldsValue({
            section:record.sectionName?record.sectionName:'',
            code:record.code?record.code:'',
        })
    }

    //获取流程详情
    getTable(instance){
        let subject = instance.subject[0]
        let postData = subject.postData?JSON.parse(subject.postData):''
        let record = {
            'id':instance.id,
            'TreatmentData':subject.TreatmentData?JSON.parse(subject.TreatmentData):'',
            'dataSource':subject.dataSource?JSON.parse(subject.dataSource):'',
            'section':subject.section?JSON.parse(subject.section):'',
            'sectionName': subject.sectionName?JSON.parse(subject.sectionName):'',
			'code':subject.code?JSON.parse(subject.code):''
        }
 
        let TreatmentData = subject.TreatmentData?JSON.parse(subject.TreatmentData):[];
        let dataSource = subject.dataSource?JSON.parse(subject.dataSource):[];
        this.setState({
            oldSubject:subject,
            TreatmentData:TreatmentData,
            dataSource:dataSource
        })
        
		return record
	}

    //获取当前登陆用户的标段
    getSection(){
        let user = getUser()
        
        let sections = user.sections
        let currentSectionName = ''
        let projectName = ''
        
        sections = JSON.parse(sections)
        if(sections && sections instanceof Array && sections.length>0){
            let section = sections[0]
            let code = section.split('-')
            if(code && code.length === 3){
                //获取当前标段的名字
                SECTIONNAME.map((item)=>{
                    if(code[2] === item.code){
                        currentSectionName = item.name
                    }
                })
                //获取当前标段所在的项目
                PROJECT_UNITS.map((item)=>{
                    if(code[0] === item.code){
                        projectName = item.value
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

        const { platform: { task = {}, users = {} } = {}, location, actions, form: { getFieldDecorator },docs = [] } = this.props;
		const { history = [], transitions = [], states = [] } = task;
		const user = getUser();
        const {
            dataSource,
            currentSectionName='',
            selectedRowKeys=[]
        } = this.state;
        const rowSelection  = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        return (
            <div>
                <Spin spinning={this.state.loading}>
                    <Form onSubmit={this.handleSubmit.bind(this)}>
                        <Card title='流程详情'>
                            <Row gutter={24}>
                                <Col span={24} style={{paddingLeft:'3em'}}>
                                    <Row gutter={15} >
                                        <Col span={10}>
                                            <FormItem   {...OverallGeneralRefill.layoutT} label="标段:">
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
                                        <Col span={10}>
                                            <FormItem {...OverallGeneralRefill.layoutT} label="编号:">
                                            {
                                                getFieldDecorator('code', {
                                                    rules: [
                                                        { required: true, message: '请输入编号' }
                                                    ]
                                                })
                                                (
                                                    <Input   placeholder='请输入编号'/>
                                                )
                                            }
                                                
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Table  rowSelection={rowSelection}
                                            dataSource={this.state.dataSource}
                                            columns={this.equipment}
                                            pagination={false}
                                            bordered  />
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Button  style={{ marginLeft: 20,marginRight: 10 }}
                                            type="primary" ghost
                                            onClick={this.handleAdd. bind(this)}>添加</Button>
                                    <Button type="primary" onClick={this.onDelete.bind(this)}>删除</Button>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={24} style={{marginTop: 16, height: 160}}>
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
                                    {/* <Progress percent={progress} strokeWidth={5} /> */}
                                </Col>
                            </Row>
                            <Row gutter={24} style={{marginTop: 15}}>
                                <Col span={24}>
                                    <Table 
                                        columns={this.columns1}
                                        dataSource={this.state.TreatmentData}
                                        pagination={true}
                                    />
                                </Col>
                            </Row>
                        </Card>
                        <Card title={'审批流程'} style={{marginTop:10}}>
                            <Steps direction="vertical" size="small" current={history.length - 1}>
                                {
                                    history.map((step, index) => {
                                        const { state: { participants: [{ executor = {} } = {}] = [] } = {} } = step;
                                        const { id: userID } = executor || {};
                                        if (step.status === 'processing') { // 根据历史状态显示
                                            const state = this.getCurrentState();
                                            return (
                                                <Step 
                                                    title={
                                                        <div style={{ marginBottom: 8 }}>
                                                            <span>{step.state.name}-(执行中)</span>
                                                            <span style={{ paddingLeft: 20 }}>当前执行人: </span>
                                                            <span style={{ color: '#108ee9' }}> {`${executor.person_name}` || `${executor.username}`}</span>
                                                        </div>}
                                                    description={ userID === +user.id &&
                                                        <div>
                                                            <Row style={{marginTop: 15}}>
                                                                <Col span={10} >
                                                                    <FormItem {...OverallGeneralRefill.layoutT} label='审核人'>
                                                                        {
                                                                            getFieldDecorator('dataReview', {
                                                                                rules: [
                                                                                    { required: true, message: '请选择审核人员' }
                                                                                ]
                                                                            })
                                                                                (
                                                                                <PerSearch selectMember={this.selectMember.bind(this)} task={task}/>
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
                                                                    <Col span={24} style={{ textAlign: 'center' }}>
                                                                        <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">提交</Button>
                                                                    </Col>
                                                                </Row>
                                                            </FormItem>
                                                        </div>} 
                                                    key={index} 
                                                />

                                            )
                                        } else {
                                            const { records: [record] } = step;
                                            const { log_on = '', participant: { executor = {} } = {}, note = '' } = record || {};
                                            const { person_name: name = '', organization = '' } = executor;
                                            return (
                                                <Step key={index} title={`${step.state.name}-(${step.status})`}
                                                    description={
                                                        <div style={{ lineHeight: 2.6 }}>
                                                            <div>{`${step.state.name}`}意见：{note}</div>
                                                            <div>
                                                                <span>{`${step.state.name}`}人:{`${name}` || `${executor.username}`} [{executor.username}]</span>
                                                                <span
                                                                    style={{ paddingLeft: 20 }}>{`${step.state.name}`}时间：{moment(log_on).format('YYYY-MM-DD HH:mm:ss')}</span>
                                                            </div>
                                                        </div>} />);
                                        }
                                    }).filter(h => !!h)
                                }
                            </Steps>
                        </Card>
                    </Form>
                </Spin>
            </div>
            
				
        );
    }

    getCurrentState() {
		const { platform: { task = {} } = {}, location = {} } = this.props;
		const { state_id = '0' } = queryString.parse(location.search) || {};
		const { states = [] } = task;
		return states.find(state => state.status === 'processing' && state.id === +state_id);
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
            // const { newFileLists } = this.state;
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
                // postUploadFilesAc(newFileLists)

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
            dataReview: this.member,
        });
    }

    onSelectChange= (selectedRowKeys) => {
        console.log('selectedRowKeys',selectedRowKeys)
        this.setState({
            selectedRowKeys
        })
    }

    //第一个表格添加行
    handleAdd(){
        const {count,dataSource } = this.state;
        let len = dataSource.length
        const newData = {
            key:len,
            editable:true,
            count:count
        };
        
        this.setState({
            dataSource: [...dataSource, newData],
            count:count+1
        })
    }
    //第一个表格删除
    onDelete(){
        const{
            dataSource,
            selectedRowKeys
		}=this.state

        selectedRowKeys.map((rst,index) => {
            dataSource.splice(rst-index, 1);
        });
        let array = []
        let data = {}
        dataSource.map((item, index) => {
            data = item
            data.key = index
            array.push(data)
		})

        this.setState({
            dataSource:array,
            selectedRowKeys:[]
        })
    }
    equipTimeChange( record, column,value){
        const newData = [...this.state.dataSource];
        const target = newData.filter(item => record.key === item.key)[0];
        if (target) {
            target[column] = moment(value._d).format('YYYY-MM-DD')
            this.setState({ dataSource: newData });
        }
    }
    renderColumns(text, record, column) {
        return (
          <EditableCell
            editable={record.editable}
            value={text}
            onChange={value => this.handleChange(value, record.key, column)}
          />
        );
    }
    handleChange(value, key, column) {
        const newData = [...this.state.dataSource];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target[column] = value;
            this.setState({ dataSource: newData });
        }
    }
    edit(key) {
        const newData = [...this.state.dataSource];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target.editable = true;
            this.setState({ dataSource: newData });
        }
    }
    saveTable(key) {
        const newData = [...this.state.dataSource];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          target.editable = false;
          this.setState({dataSource: newData });
        }
    }

    handleSubmit = (e) =>{
        e.preventDefault();
        const {
            platform: { task = {} } = {},
            actions: {
                putFlow,
                postSubject
            },
            location
        } = this.props;
        const{
            TreatmentData,
            dataSource,
            oldSubject
        } = this.state
        let user = getUser();//当前登录用户
        let me = this;
        let postData = {};
        me.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
            if (!err) {

                const { state_id = '0' } = queryString.parse(location.search) || {};
                console.log('state_id', state_id)

                let me = this;
                const user = getUser();
                let executor = {
                    "username": user.username,
                    "person_code": user.code,
                    "person_name": user.name,
                    "id": parseInt(user.id),
                    "org": user.org,
                };
                let nextUser = {};
                
                nextUser = values.dataReview;
                // 获取流程的action名称
                let action_name = '';
                let nextStates = getNextStates(task, Number(state_id));
                console.log('nextStates',nextStates)
                let stateid = 0
                action_name = nextStates[0].action_name
                stateid = nextStates[0].to_state[0].id
                console.log('nextStates', nextStates)

                
                let note = action_name + '。';
                
                let state = task.current[0].id;
                let postdata = {
                    next_states: [
                        {
                            state: stateid,
                            participants: [nextUser],
                            dealine: null,
                            remark: null,
                        }
                    ],
                    state: state,
                    executor: executor,
                    action: action_name,
                    note: note,
                    attachment: null
                }

                let subject = [{
                    "section": oldSubject.section,
                    "sectionName":oldSubject.sectionName,
                    "projectName":oldSubject.projectName,
                    "dataSource":JSON.stringify(dataSource),
                    "TreatmentData":JSON.stringify(TreatmentData),
                    "code":JSON.stringify(values.code),
                    "timedate": JSON.stringify(moment().format('YYYY-MM-DD')),
                    "postData": oldSubject.postData,
                }];

                let newSubject = {
                    subject:subject
                }
                let data = {
                    pk: task.id
                }
                postSubject(data,newSubject).then( value=>{
                    console.log('value',value)
                })

                putFlow(data,postdata).then( rst=>{
                    console.log('rst',rst)
                    if(rst && rst.creator){
                        notification.success({
                            message: '流程提交成功',
                            duration: 2
                        }) 
                        let to = `/selfcare/task`;
                        me.props.history.push(to)
                    } else {
                        notification.error({
                            message: '流程提交失败',
                            duration: 2
                        })
                        return
                    }
                })
            }
        })
        
    }

}
export default Form.create()(OverallGeneralRefill)