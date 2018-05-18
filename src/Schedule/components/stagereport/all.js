/**
 *
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @Author: ecidi.mingey
 * @Date: 2018-02-20 10:14:05
 * @Last Modified by: ecidi.mingey
 * @Last Modified time: 2018-05-18 15:21:21
 */
import React, { Component } from 'react';
import { Table, Spin, Button, notification, Modal, Form, Row, Col, Input, Select, Checkbox, Upload, Progress, Icon, Popconfirm } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Link } from 'react-router-dom';
import { getUser } from '../../../_platform/auth';
import { base, SOURCE_API, DATASOURCECODE,SERVICE_API,PROJECT_UNITS } from '../../../_platform/api';
// import PerSearch from './PerSearch';
import PerSearch from '../../../_platform/components/panels/PerSearch';
import { WORKFLOW_CODE } from '../../../_platform/api';
import { getNextStates } from '../../../_platform/components/Progress/util';
import queryString from 'query-string';
import SearchInfo from './SearchInfo';
import TotleModal from './TotleModal';
import './index.less';
const FormItem = Form.Item;
const Dragger = Upload.Dragger;
moment.locale('zh-cn');


class All extends Component {
    static propTypes = {};
    constructor(props) {
        super(props);
        this.state = {
            totolData: [],
            TotleModaldata:[],
            selectedRowKeys: [],
            dataSourceSelected: [],
            visible: false,
            totlevisible: false,
            fileList: [],
            isCopyMsg: false, //接收人员是否发短信
            TreatmentData: [],
            newFileLists: [],
            key:Math.random(),
            sectionSchedule:[], //当前用户的标段信息
            file:'',
            projectName:'', //当前用户的项目信息
            filterData:[], //对流程信息根据项目进行过滤
            currentSection:'',
            currentSectionName:'',
            loading:false
        };
    }
    async componentDidMount() {
        this.gettaskSchedule();
        this.getSection()
    }

    async componentDidUpdate(prevProps,prevState){
        const{
            leftkeycode
        } = this.props
        if(leftkeycode != prevProps.leftkeycode){
            this.filterTask()
        }
    }
    // 获取总进度进度计划流程信息
    gettaskSchedule = async ()=>{
        const { actions: { getTaskSchedule },leftkeycode } = this.props;
        let reqData={};
        this.props.form.validateFields((err, values) => {
			console.log("总进度进度计划流程信息", values);
            console.log("err", err);
            
            values.sunitproject?reqData.subject_sectionName__contains = values.sunitproject : '';
            values.snumbercode?reqData.subject_numbercode__contains = values.snumbercode : '';
            // values.ssuperunit?reqData.subject_superunit__contains = values.ssuperunit : '';
            values.stimedate?reqData.real_start_time_begin = moment(values.stimedate[0]._d).format('YYYY-MM-DD 00:00:00') : '';
            values.stimedate?reqData.real_start_time_end = moment(values.stimedate[1]._d).format('YYYY-MM-DD 23:59:59') : '';
            values.sstatus?reqData.status = values.sstatus : (values.sstatus === 0? reqData.status = 0 : '');
        })
        
        console.log('reqData',reqData)

        let tmpData = Object.assign({}, reqData);


        let task = await getTaskSchedule({ code: WORKFLOW_CODE.总进度计划报批流程 },tmpData);
        let subject = [];
        let totledata = [];
        let arrange = {};
        if(task && task instanceof Array){
            task.map((item,index)=>{
                let itemdata = item.subject[0];
                let itempostdata = itemdata.postData?JSON.parse(itemdata.postData):null;
                let itemtreatmentdata = itemdata.TreatmentData ? JSON.parse(itemdata.TreatmentData) : null;
                let itemarrange = {
                    index:index+1,
                    id:item.id,
                    section: itemdata.section?JSON.parse(itemdata.section):'',
                    sectionName: itemdata.sectionName?JSON.parse(itemdata.sectionName):'',
                    projectName: itemdata.projectName?JSON.parse(itemdata.projectName):'',
                    type: itempostdata.type,
                    numbercode:itemdata.numbercode?JSON.parse(itemdata.numbercode):'',
                    // remarks:itemtreatmentdata[0].remarks||"--",
                    submitperson:item.creator.person_name,
                    submittime:moment(item.workflow.created_on).utc().zone(-8).format('YYYY-MM-DD'),
                    status:item.status,
                    // totlesuperunit:itemdata.superunit?JSON.parse(itemdata.superunit):'',
                    totledocument:itemdata.totledocument?JSON.parse(itemdata.totledocument):'',
                    treatmentdata:itemtreatmentdata,
                    dataReview:itemdata.dataReview?JSON.parse(itemdata.dataReview).person_name:''
                }
                totledata.push(itemarrange);
            })
            this.setState({
                totolData:totledata
            },()=>{
                this.filterTask()
            })
        }
    }
    //对流程信息根据选择项目进行过滤
	filterTask(){
		const {
			totolData 
		}=this.state
		const{
			leftkeycode
		}=this.props
		let filterData = []
		let user = getUser()
		
		let sections = user.sections
		
		sections = JSON.parse(sections)
		
		let selectCode = ''
		//关联标段的人只能看自己项目的进度流程
		if(sections && sections instanceof Array && sections.length>0){
			let code = sections[0].split('-')
			selectCode = code[0] || '';

			totolData.map((task)=>{
			
				let projectName = task.projectName
				let projectCode = this.getProjectCode(projectName)
				
				if(projectCode === selectCode && task.section === sections[0]){
					filterData.push(task);
				}
			})
		}else{
			//不关联标段的人可以看选择项目的进度流程
			selectCode = leftkeycode
			totolData.map((task)=>{
			
				let projectName = task.projectName
				let projectCode = this.getProjectCode(projectName)
				
				if(projectCode === selectCode ){
					filterData.push(task);
				}
			})

		}      
		
		this.setState({
			filterData
		})
	}
    //获取项目code
    getProjectCode(projectName){
        let projectCode = ''
        PROJECT_UNITS.map((item)=>{
            if(projectName === item.value){
                projectCode = item.code
            }
        })
		
		return projectCode 
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
            console.log('section',section)
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
                                console.log('currentSectionName',currentSectionName)
                                console.log('projectName',projectName)
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
    //获取当前登陆用户的标段的下拉选项
    getSectionOption(){
        const{
            sectionSchedule
        } = this.state
        let option = []
        sectionSchedule.map((section)=>{
            option.push(<Option key={section.value} value={section.value}>{section.name}</Option>)
        })
        return option
    }   

    render() {
        const { 
            selectedRowKeys,
            sectionSchedule=[],
            filterData,
            TotleModaldata,
            currentSectionName
        } = this.state;
        const {
            form: { getFieldDecorator },
            fileList = [],
        } = this.props;

        let user = getUser()
        let username = user.username

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        
        const FormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        }
        let fileName = '暂无文件';
        if(this.state.file){
            fileName = this.state.file.name;
        }
        console.log('currentSectionNamecurrentSectionNamecurrentSectionName',currentSectionName)

        // let sectionOption = this.getSectionOption()
        return (
            <div>
                {
                    this.state.totlevisible &&
                    <TotleModal
                        {...this.props}
                        {...this.state.TotleModaldata}
                        oncancel={this.totleCancle.bind(this)}
                        onok={this.totleOk.bind(this)}
                    />
                }
                <SearchInfo {...this.props} {...this.state} gettaskSchedule={this.gettaskSchedule.bind(this)}/>
                <Button onClick={this.addClick.bind(this)}>新增</Button>
                {
                    username === 'admin'?
                    <Popconfirm
                      placement="leftTop"
                      title="确定删除吗？"
                      onConfirm={this.deleteClick.bind(this)}
                      okText="确认"
                      cancelText="取消"
                    >
                        <Button >删除</Button>
                    </Popconfirm>
                    :
                    ''
                }
                <Table
                    columns={this.columns}
                    rowSelection={username === 'admin'?rowSelection:null} 
                    dataSource={filterData} 
                    bordered
                    rowKey='index'
                    className='foresttable'/>
                <Modal
                 title="新增文档"
                 width={800}
                 visible={this.state.visible}
                 maskClosable={false}
                 onCancel={this.closeModal.bind(this)}
                 onOk={this.sendWork.bind(this)}
                 // key={this.state.key}
                 >
                    <div>
                        <Spin spinning={this.state.loading}>
                            <Form>
                                <Row>
                                    <Col span={24}>
                                        <Row>
                                            <Col span={12}>
                                                <FormItem {...FormItemLayout} label='标段'>
                                                    {
                                                        getFieldDecorator('Tsection', {
                                                            initialValue: {currentSectionName},
                                                            rules: [
                                                                { required: true, message: '请输入标段' }
                                                            ]
                                                        })
                                                            // (<Select placeholder='请选择标段' allowClear>
                                                            //     {sectionOption}
                                                            // </Select> )
                                                            (<Input readOnly placeholder='请输入标段' />)
                                                    }
                                                </FormItem>
                                            </Col>
                                            <Col span={12}>
                                                <FormItem {...FormItemLayout} label='编号'>
                                                    {
                                                        getFieldDecorator('Tnumbercode', {
                                                            rules: [
                                                                { required: true, message: '请输入编号' }
                                                            ]
                                                        })
                                                            (<Input placeholder='请输入编号' />)
                                                    }
                                                </FormItem>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <FormItem {...FormItemLayout} label='文档类型'>
                                                    {
                                                        getFieldDecorator('Ttotledocument', {
                                                            initialValue: `总计划进度`,
                                                            rules: [
                                                                { required: true, message: '请选择文档类型' }
                                                            ]
                                                        })
                                                            (<Input readOnly/>)
                                                    }
                                                </FormItem>
                                            </Col>
                                            {/* <Col span={12}>
                                                <FormItem {...FormItemLayout} label='监理单位'>
                                                    {
                                                        getFieldDecorator('Tsuperunit', {
                                                            rules: [
                                                                { required: true, message: '请选择审核人员' }
                                                            ]
                                                        })
                                                            (<Input placeholder='系统自动识别，无需手输' readOnly/>)
                                                    }
                                                </FormItem>
                                            </Col> */}
                                        </Row>
                                        <Row>
                                            <Dragger
                                                {...this.uploadProps}
                                            >
                                                <p className="ant-upload-drag-icon">
                                                    <Icon type="inbox" />
                                                </p>
                                                <p className="ant-upload-text">点击或者拖拽开始上传</p>
                                                <p className="ant-upload-hint">
                                                    支持 pdf、doc、docx 文件
                                                </p>
                                            </Dragger>
                                            {/* <Dragger  
                                                style={{ margin: '10px' }}
                                                onChange={this.uplodachange.bind(this)}
                                                name='file'
                                                showUploadList={false}
                                                action={`${SERVICE_API}/excel/upload-api/`}
                                                beforeUpload = {this.beforeUpload.bind(this)}
                                                >
                                                <p className="ant-upload-drag-icon">
                                                        <Icon type="inbox" />
                                                </p>
                                                <p className="ant-upload-text">上传进度表(文件名需为英文)</p>
                                                <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
                                            </Dragger > */}

                                            <Table
                                                columns={this.columns1}
                                                pagination={true}
                                                dataSource={this.state.TreatmentData}
                                                className='foresttable'
                                            />
                                        </Row>
                                        <Row style={{  marginTop: 20 }}>

                                            <Col span={8} offset={4}>
                                                <FormItem {...FormItemLayout} label='审核人'>
                                                    {
                                                        getFieldDecorator('TdataReview', {
                                                            rules: [
                                                                { required: true, message: '请选择审核人员' }
                                                            ]
                                                        })
                                                            (
                                                            <PerSearch selectMember={this.selectMember.bind(this)} 
                                                            code={WORKFLOW_CODE.总进度计划报批流程} 
                                                            visible={this.state.visible}/>
                                                            )
                                                    }
                                                </FormItem>
                                            </Col>
                                            <Col span={8} offset={4}>
                                                <Checkbox onChange={this._cpoyMsgT.bind(this)}>短信通知</Checkbox>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                            </Form>
                        </Spin>
                    </div>
                </Modal>
            </div>
        )
    }


    // 确认提交
    sendWork() {
        const {
            actions: {
                createFlow,
                getWorkflowById,
                putFlow
            },
            location,
        } = this.props
        const {
            TreatmentData,
            sectionSchedule,
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
        //共有信息
        let postData = {};
        me.props.form.validateFields((err, values) => {
            
            if (!err) {
                if (TreatmentData.length === 0) {
                    notification.error({
                        message: '请上传文件',
                        duration: 5
                    })
                    return
                }

                postData.upload_unit = user.org ? user.org : '';
                postData.type = '总进度计划';
                postData.upload_person = user.name ? user.name : user.username;
                postData.upload_time = moment().format('YYYY-MM-DDTHH:mm:ss');

                 
                const currentUser = {
                    "username": user.username,
                    "person_code": user.code,
                    "person_name": user.name,
                    "id": parseInt(user.id)
                };
                
               
                let subject = [{
                    "section": JSON.stringify(currentSection),
                    "sectionName":JSON.stringify(currentSectionName),
                    "projectName":JSON.stringify(projectName),
					// "superunit": JSON.stringify(values.Tsuperunit),
					"dataReview": JSON.stringify(values.TdataReview),
					"numbercode": JSON.stringify(values.Tnumbercode),
					"timedate": JSON.stringify(moment().format('YYYY-MM-DD')),
					"totledocument": JSON.stringify(values.Ttotledocument),
					"postData": JSON.stringify(postData),
                    "TreatmentData": JSON.stringify(TreatmentData),
                    
                }];
                const nextUser = this.member;
                let WORKFLOW_MAP = {
                    name: "总进度计划报批流程",
                    desc: "进度管理模块总进度计划报批流程",
                    code: WORKFLOW_CODE.总进度计划报批流程
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
                                    this.gettaskSchedule();//重新更新流程列表
                                    this.setState({
                                        visible: false
                                    })
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

    onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys',selectedRowKeys)
        console.log('selectedRows',selectedRows)
        this.setState({ selectedRowKeys, dataSourceSelected: selectedRows });
    }
    // 删除
    deleteClick = async () => {
        const{
            actions:{
                deleteFlow
            }
        }=this.props
        const { 
            dataSourceSelected 
        } = this.state
        if (dataSourceSelected.length === 0) {
            notification.warning({
                message: '请先选择数据！',
                duration: 3
            });
            return
        } else {

            let user = getUser()
            let username = user.username

            if(username != 'admin'){
                notification.warning({
                    message: '非管理员不得删除！',
                    duration: 3
                });
                return
            }

            let flowArr = dataSourceSelected.map((data)=>{
                if(data && data.id){
                    return data.id
                }
            })
             
            let promises = flowArr.map((flow)=>{
                let data = flow
                let postdata = {
                    pk:data
                }
                return deleteFlow(postdata)
            })

            Promise.all(promises).then(rst => {
                console.log('rst',rst)
                notification.success({
                    message: '删除流程成功',
                    duration: 3
                });
                this.setState({
                    selectedRowKeys:[],
                    dataSourceSelected:[]
                })
                this.gettaskSchedule()
            });
            
            
            
        }
    }
    
    // 操作--查看
    clickInfo(record) {
        this.setState({ totlevisible: true ,TotleModaldata:record});
    }
    // 取消
    totleCancle() {
        this.setState({ totlevisible: false });
    }
    // 确定
    totleOk() {
        this.setState({ totlevisible: false });
    }

    // 新增按钮
    addClick = () => {
        // const { actions: { postUploadFilesAc } } = this.props;
        // postUploadFilesAc([]);
        this.setState({
            visible: true,
            TreatmentData: [],
            key:Math.random()
        })
        this.props.form.setFieldsValue({
            // Tsuperunit: undefined,
            Tsection: this.state.currentSectionName || undefined,
            TdataReview: undefined,
            Tnumbercode: undefined
        })

    }
    // 关闭弹框
    closeModal() {
        // const { actions: { postUploadFilesAc } } = this.props;
        // postUploadFilesAc([]);

        this.setState({
            visible: false,
            TreatmentData: [],
        })
    }
    
    // 短信
    _cpoyMsgT(e) {
        this.setState({
            isCopyMsg: e.target.checked,
        })
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
    // 修改备注

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
		console.log('array',array)
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
            TdataReview: this.member,
            // Tsuperunit: this.member.org
        });
    }

    columns = [
		{
			title: '项目',
			dataIndex: 'projectName',
			key: 'projectName',
			width: '15%'
		},
		{
			title: '标段',
			dataIndex: 'sectionName',
			key: 'sectionName',
			width: '10%'
		}, {
			title: '进度类型',
			dataIndex: 'type',
			key: 'type',
			width: '15%'
		}, {
			title: '编号',
			dataIndex: 'numbercode',
			key: 'numbercode',
			width: '15%'
		}, {
			title: '提交人',
			dataIndex: 'submitperson',
			key: 'submitperson',
			width: '10%'
		}, {
			title: '提交时间',
			dataIndex: 'submittime',
			key: 'submittime',
			width: '15%',
			sorter: (a, b) => moment(a['submittime']).unix() - moment(b['submittime']).unix(),
			render: text => {
				return moment(text).format('YYYY-MM-DD')
			}
		}, {
			title: '流程状态',
			dataIndex: 'status',
			key: 'status',
			width: '10%',
			render:(record,index)=>{
                if(record===1){
                    return '已提交'
                }else if(record===2){
                    return '执行中'
                }else if(record===3){
                    return '已完成'
                }else{
                    return ''
                }
            }
		}, {
			title: '操作',
			render: record => {
				return (
					<span>
						<a onClick={this.clickInfo.bind(this, record, 'VIEW')}>查看</a>
					</span>
				)
			}
		},
	];
    columns1 = [{
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
    }]
}

export default Form.create()(All)
