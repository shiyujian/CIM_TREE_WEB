/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {actions} from '../../store/monitoring'

import { Modal, Button, Icon, Table, Input,
	Form,
	Select,
 } from 'antd'

import styles from './CameraConfigModal.css'

const FormItem = Form.Item
const Option = Select.Option

export const TYPE ={
	NEW: 1,
	EDIT: 2,
}

@connect(
	state => {
		const {monitoring = {}} = state.quality || {}
		return monitoring
	},
	dispatch => ({
		actions: bindActionCreators(actions, dispatch),
	}),
)

class CameraConfigModal extends Component {

	static propTypes = {
		onOk: PropTypes.func.isRequired,
		onCancel: PropTypes.func.isRequired,

		initialData: PropTypes.object, // 默认值

		type: PropTypes.number,
	}

	static defaultProps ={
		initialData: {},
	}

	state = {
		currInitialData: {},
        engineeringOptionsArr: [],
        projectOptions: [],
        optionIndex: 0
	}

	render() {
		const type = this.props.type
		let title = ''

		switch(type) {
			case TYPE.NEW:
                title = `新建摄像头`
                break
			case TYPE.EDIT:
                title = `编辑摄像头`
                break
			default:
                break
		}

		const modelContent = this.getModalContent()

		return (
			<Modal
				title={title}
                visible={true}
				onCancel={this.props.onCancel}
                onOk={this.handleOk}
				maskClosable={false}
			>
				{modelContent}
			</Modal>
		)
	}

    componentWillMount() {
        this.initOptions()
    }

	componentDidMount() {
		if (this.props.initialData) {
			const initialData = this.props.initialData
			this.setState({
				currInitialData: initialData,
			})
            //
			// this.props.form.setFieldsValue({
			// 	name: initialData.name,
			// })
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.initialData && nextProps.initialData !== this.props.initialData) {
			const initialData = nextProps.initialData
			this.setState({
				currInitialData: initialData,
			})
            //
			// this.props.form.setFieldsValue({
			// 	name: initialData.name,
			// })
		}
	}

    initOptions = () => {
        const { getCameraTree } = this.props.actions
        getCameraTree().then(res => {
            const engineeringOptionsArr = []
            const tmp = res.children
            const projectOptions = tmp[0].children.map(project => {
                const engineerings = project.children
                const engineeringOptions = engineerings.map(engineering => {
                    return <Option key={`${engineering.pk}`}>{engineering.name}</Option>
                })
                engineeringOptionsArr.push(engineeringOptions)
                return (<Option key={`${project.pk}`}>{project.name}</Option>)
            })
            this.setState({
                engineeringOptionsArr: engineeringOptionsArr,
                projectOptions: projectOptions
            })
        })
    }

	getModalContent = () => {

		const { getFieldDecorator } = this.props.form
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
		}

        const {currInitialData: initialData, optionIndex, engineeringOptionsArr} = this.state

		return (
			<div>
				<Form>
					<FormItem
						{...formItemLayout}
						label={`项目`}
						hasFeedback
					>
						{
							getFieldDecorator('project',{
								rules: [
									{required: true, message: `请选择项目`}
								],
								initialValue: initialData.project && `${initialData.project}`,
							})(
                                <Select onSelect={this.handleProject} placeholder="请选择项目">
                                    {this.state.projectOptions}
                                </Select>
							)
						}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label={`单位工程`}
						hasFeedback
					>
						{
							getFieldDecorator('engineering',{
								rules: [
									{required: true, message: `请选择单位工程`}
								],
								initialValue: initialData.engineering && `${initialData.engineering}`,
							})(
                                <Select placeholder="请选择单位工程">
                                    {engineeringOptionsArr[optionIndex]}
                                </Select>
							)
						}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label={`摄像头名称`}
						hasFeedback
					>
						{
							getFieldDecorator('name',{
								rules: [
									{required: true, message: `请输入摄像头名称`}
								],
								initialValue: initialData.name || '',
							})(
								<Input placeholder={`请输入摄像头名称`}/>
							)
						}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label={`外网IP`}
						hasFeedback
					>
						{
							getFieldDecorator('ip',{
								rules: [
									{required: true, message: `请输入ip`}
								],
								initialValue: initialData.ip || '',
							})(
								<Input placeholder={`请输入ip`}/>
							)
						}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label={`端口`}
						hasFeedback
					>
						{
							getFieldDecorator('port',{
								rules: [
									{required: true, message: `请输入端口`}
								],
								initialValue: initialData.port || '',
							})(
								<Input placeholder={`请输入端口`}/>
							)
						}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label={`用户名`}
						hasFeedback
					>
						{
							getFieldDecorator('username',{
								rules: [
									{required: true, message: `请输入用户名`}
								],
								initialValue: initialData.username || ''
							})(
								<Input placeholder={`请输入用户名`}/>
							)
						}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label={`密码`}
						hasFeedback
					>
						{
							getFieldDecorator('password',{
								rules: [
									{required: false, message: `请输入密码`}
								],
								initialValue: initialData.password || '',
							})(
								<Input type="password" placeholder={`请输入密码`}/>
							)
						}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label={`经度坐标`}
						hasFeedback
					>
						{
							getFieldDecorator('lng',{
								rules: [
									{required: true, message: `请输入经度坐标`}
								],
								initialValue: initialData.lng || '',
							})(
								<Input placeholder={`请输入经度坐标`}/>
							)
						}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label={`纬度坐标`}
						hasFeedback
					>
						{
							getFieldDecorator('lat',{
								rules: [
									{required: true, message: `请输入纬度坐标`}
								],
								initialValue: initialData.lat || '',
							})(
								<Input placeholder={`请输入纬度坐标`}/>
							)
						}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label={`描述`}
						hasFeedback
					>
						{
							getFieldDecorator('desc',{
								rules: [
									{required: false, message: `请输入描述`}
								],
								initialValue: initialData.desc || '',
							})(
								<Input placeholder={`请输入描述`}/>
							)
						}
					</FormItem>
				</Form>
			</div>
		)
	}

    handleProject = (value, option) => {
        const optionIndex = option.props.index
        this.setState({optionIndex})
    }

	handleOk = () => {
		const {
			form: {
				validateFields
			}
		} = this.props

		let fieldValues = []
		validateFields({},(err, values)=> {
			if (err) {
				return
			}
			fieldValues = values
		})

		if (fieldValues.length == 0) {
            return
        }
		this.props.onOk(fieldValues)
	}
}

export default Form.create({})(CameraConfigModal)
