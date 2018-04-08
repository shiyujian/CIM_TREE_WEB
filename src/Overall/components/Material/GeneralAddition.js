import React, {PropTypes, Component} from 'react';
import {FILE_API} from '../../../_platform/api';
import {
    Form, Input, Row, Col, Modal, Upload, Button,
    Icon, message, Table,DatePicker,Progress,Select,Checkbox,Popconfirm,notification,Spin
} from 'antd';
import moment from 'moment';
import {DeleteIpPort} from '../../../_platform/components/singleton/DeleteIpPort';
// import PerSearch from './PerSearch';
import PerSearch from '../../../_platform/components/panels/PerSearch';
import { getUser } from '../../../_platform/auth';
import { getNextStates } from '../../../_platform/components/Progress/util';
import { base,   WORKFLOW_CODE,SECTIONNAME,PROJECT_UNITS } from '../../../_platform/api';
const Dragger = Upload.Dragger;
const FormItem = Form.Item;
const fileTypes = 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword';
const EditableCell = ({ editable, value, onChange }) => (
          <div>
            {editable
              ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
              : value
            }
          </div>
        );

//机械设备
class GeneralAddition extends Component {

    static propTypes = {};
    constructor(props){
        super(props)
        this.state={
            isUploading: false,
            dataSource:[],
            engineerName:'',
            count:0,
            TreatmentData:[],
            newFileLists: [],
            currentSection:'',
            currentSectionName:'',
            projectName:'',
            loading:false,
            selectedRowKeys:[]
    
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
            render: (text, record) => this.renderColumns(text, record, 'equipTime'),
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
                      <a style={{marginRight:'10'}}onClick={() => this.saveTable(record.key)}>
                        <Icon type='save' style={{fontSize:20}}/>
                      </a>
                      <a onClick={() => this.edit(record.key)}>
                        <Icon type='edit' style={{fontSize:20}}/>
                      </a>
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

    async componentDidMount() {
        this.getSection()
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
        const{
            generalAddVisible = false,
            form: { getFieldDecorator },
        } = this.props;
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
            <Modal 
             title="新增文档"
             width={920} visible={generalAddVisible}
             closable={false}
             footer={false}
             maskClosable={false}
            >
            <Spin spinning={this.state.loading}>
				<Form onSubmit={this.handleSubmit.bind(this)}>
                    <Row gutter={24}>
                        <Col span={24} style={{paddingLeft:'3em'}}>
                            <Row gutter={15} >
                                <Col span={10}>
                                    <FormItem   {...GeneralAddition.layoutT} label="标段:">
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
                                    <FormItem {...GeneralAddition.layoutT} label="编号:">
                                    {
                                        getFieldDecorator('code', {
                                            rules: [
                                                { required: true, message: '请输入编号' }
                                            ]
                                        })
                                        (
                                            <Input placeholder='请输入编号' />
                                        )
                                    }
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Table  
                             rowSelection={rowSelection}
                             dataSource={this.state.dataSource}
                             columns={this.equipment}
                             pagination={false}
                             bordered />
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
                    <Row style={{marginTop: 15}}>
                        <Col span={10} >
                            <FormItem {...GeneralAddition.layoutT} label='审核人'>
                                {
                                    getFieldDecorator('dataReview', {
                                        rules: [
                                            { required: true, message: '请选择审核人员' }
                                        ]
                                    })
                                        (
                                        <PerSearch selectMember={this.selectMember.bind(this)} code={WORKFLOW_CODE.机械设备报批流程}/>
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
            dataReview: this.member
        });
    }

    cancel() {
        const {
            actions: {GeneralAddVisible}
        } = this.props;
        GeneralAddVisible(false);
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
          this.cacheData = newData.map(item => ({ ...item }));
        }
    }
    handleSubmit = (e) =>{
        e.preventDefault();
        const {
            currentcode = {},
            actions: {
                createFlow,
                getWorkflowById,
                putFlow,
                GeneralAddVisible
            },
            location
        } = this.props;
        const{
            TreatmentData,
            dataSource,
            projectName,
            currentSectionName,
			currentSection
        } = this.state

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
            if (!err) {

                postData.upload_unit = user.org ? user.org : '';
                postData.type = '机械设备';
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
                    "dataSource":JSON.stringify(dataSource),
                    "TreatmentData":JSON.stringify(TreatmentData),
                    "code":JSON.stringify(values.code),
                    "reviewUnit":JSON.stringify(values.reviewUnit),
                    "timedate": JSON.stringify(moment().format('YYYY-MM-DD')),
                    "postData": JSON.stringify(postData),
                }];

                const nextUser = this.member;

                let WORKFLOW_MAP = {
                    name: "物资管理机械设备报批流程",
                    desc: "综合管理模块物资管理机械设备报批流程",
                    code: WORKFLOW_CODE.机械设备报批流程
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
                                    GeneralAddVisible(false);
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
export default Form.create()(GeneralAddition)