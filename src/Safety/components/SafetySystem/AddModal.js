import React, { Component } from 'react';
import {FILE_API,base, SOURCE_API, DATASOURCECODE,UNITS,SERVICE_API,PROJECT_UNITS,SECTIONNAME,WORKFLOW_CODE } from '../../../_platform/api';
import {
	Form, Input, Row, Col, Modal, Upload, Button,
	Icon, message, Table, DatePicker, Progress, Select, Checkbox, Popconfirm,notification
} from 'antd';
import { getUser } from '../../../_platform/auth';
import PerSearch from '../../../_platform/components/panels/PerSearch';
import moment from 'moment';
import 'moment/locale/zh-cn';
const Dragger = Upload.Dragger;
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const fileTypes = 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword';
class AddModal extends Component {
	static propTypes = {};
    constructor(props) {
        super(props);
        this.state = {
            sectionSchedule:[], //当前用户的标段信息
            file:'',
            projectName:'', //当前用户的项目信息
            filterData:[], //对流程信息根据项目进行过滤
        };
    }
	async componentDidMount() {
        this.getSection()
    }
	
	render() {
		
		const {
            form: { getFieldDecorator },
			addVisible,
        } = this.props;
		const { 
            selectedRowKeys,
            sectionSchedule=[],
            filterData,
            TotleModaldata
        } = this.state;
		const FormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        }
		

		let sectionOption = this.getSectionOption()

		return (
			<Modal title="新增文档"
				width={920} 
				visible={addVisible}
				closable={false}
				onCancel={this.cancel.bind(this)}
                onOk={this.sendWork.bind(this)}
				maskClosable={false}>
				<Form>
					<Row>
						<Col span={24}>
							<Row>
								<Col span={12}>
									<FormItem {...FormItemLayout} label='标段'>
										{
											getFieldDecorator('Safesection', {
												rules: [
													{ required: true, message: '请选择标段' }
												]
											})
												(<Select placeholder='请选择标段' >
													{sectionOption}
												</Select> )
										}
									</FormItem>
								</Col>
								<Col span={12}>
									<FormItem {...FormItemLayout} label='名称'>
										{
											getFieldDecorator('Safename', {
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
									<FormItem {...FormItemLayout} label='编号'>
										{
											getFieldDecorator('Safenumbercode', {
												rules: [
													{ required: true, message: '请输入编号' }
												]
											})
												(<Input placeholder='请输入编号' />)
										}
									</FormItem>
								</Col>
								<Col span={12}>
									<FormItem {...FormItemLayout} label='文档类型'>
										{
											getFieldDecorator('Safedocument', {
												rules: [
													{ required: true, message: '请选择文档类型' }
												]
											})
												(<Select placeholder='请选择文档类型' >
													<Option key={'安全管理体系'} value={'安全管理体系'}>安全管理体系</Option>
													<Option key={'安全应急预案'} value={'安全应急预案'}>安全应急预案</Option>
													<Option key={'安全专项方案'} value={'安全专项方案'}>安全专项方案</Option>
												</Select>)
										}
									</FormItem>
								</Col>
							</Row>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={24} style={{ marginTop: 16, height: '160px' }}>
							<Dragger 
								{...this.uploadProps}
							>
								<p className="ant-upload-drag-icon">
									<Icon type="inbox" />
								</p>
								<p>点击或者拖拽开始上传</p>
								<p className="ant-upload-hint">
									支持 pdf、doc、docx 文件
						 		</p>
							</Dragger>
						</Col>
					</Row>
					<Row style={{ marginTop: 20}}>
						<Col span={8} offset={4}>
							<FormItem {...FormItemLayout} label='审核人'>
								{
									getFieldDecorator('SafedataReview', {
										rules: [
											{ required: true, message: '请选择审核人员' }
										]
									})
										(
										<PerSearch selectMember={this.selectMember.bind(this)} 
											code={WORKFLOW_CODE.安全体系报批流程} 
											visible={addVisible}
										/>
										)
								}
							</FormItem>
						</Col>
						<Col span={8} offset={4}>
							<Checkbox onChange={this._cpoyMsgT.bind(this)}>短信通知</Checkbox>
						</Col>
					</Row>
				</Form>
			</Modal>
		)
	}

	cancel() {
		const { actions: { AddVisible } } = this.props;
		AddVisible(false);
	}
	sendWork(){
		const { actions: { AddVisible } } = this.props;
		AddVisible(false);
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
            TdataReview: this.member
        });
    }

    //上传文件
    uploadProps = {
        name: 'a_file',
        multiple: true,
        showUploadList: false,
        action: base + "/service/fileserver/api/user/files/",
        onChange: ({ file, fileList, event }) => {
			
            const status = file.status;
            const { newFileLists } = this.state;
            let newdata = [];
            if (status === 'done') {
				console.log('file',file)
				console.log('fileList',fileList)
				console.log('event',event)
				this.setState({file:file});
            }else if(status === 'error'){
				this.setState({file:null});
				notification.error({
					message: '文件上传失败',
					duration: 2
				})
				return;
			}
        },
    };
	
	changeDoc({ file, fileList, event }) {
		const {
            docs = [],
			actions: { changeDocs }
        } = this.props;
		if (file.status === 'done') {
			changeDocs([...docs, file]);
		}
		// this.setState({
		// 	isUploading: file.status === 'done' ? false : true
		// })
		if (event) {
			let { percent } = event;
			// if (percent !== undefined)
			// 	this.setState({ progress: parseFloat(percent.toFixed(1)) });
		}
	}
	//获取当前登陆用户的标段
	getSection(){
        let user = getUser()
        
        let sections = user.sections
        let sectionSchedule = []
        let sectionName = ''
        let projectName = ''
        
        sections = JSON.parse(sections)
        if(sections && sections instanceof Array && sections.length>0){
            sections.map((section)=>{
                let code = section.split('-')
                if(code && code.length === 3){
                    //获取当前标段的名字
                    SECTIONNAME.map((item)=>{
                        if(code[2] === item.code){
                            sectionName = item.name
                        }
                    })
                    //获取当前标段所在的项目
                    PROJECT_UNITS.map((item)=>{
                        if(code[0] === item.code){
                            projectName = item.value
                        }
                    })
                }
                sectionSchedule.push({
                    value:section,
                    name:sectionName
                })
            })
            this.setState({
                sectionSchedule,
                projectName
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

	_cpoyMsgT(){

	}
}
export default Form.create()(AddModal)