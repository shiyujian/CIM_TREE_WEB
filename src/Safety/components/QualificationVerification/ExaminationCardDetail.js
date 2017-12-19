import React, {Component} from 'react';
import {Input, Form, Spin, Select, Upload, Icon, Button, message} from 'antd';
import moment from 'moment';
import { STATIC_DOWNLOAD_API, SOURCE_API} from '../../../_platform/api';
const FormItem = Form.Item;
const Option = Select.Option;

 class ExaminationCardDetail extends Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}


	
    
	render() {
		const formItemLayout = {
			labelCol: {span: 6},
			wrapperCol: {span: 14},
		};
		const {
			form: {getFieldDecorator}
		} = this.props;
		return (
			<Form>
				<FormItem {...formItemLayout} label="总/分包单位" hasFeedback>
					{getFieldDecorator('packUnit', {
						rules: [
							{required: true, message: '请选择总/分包单位'},
						]
					})(
                        <Input type="text" placeholder="请输入总/分包单位"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="承包项目" hasFeedback>
					{getFieldDecorator('contractingProject', {
						rules: [
							{required: true, message: '请输入承包项目！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入承包项目！"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="企业负责人" hasFeedback>
					{getFieldDecorator('CEO', {
						rules: [
							{required: true, message: '请输入企业负责人！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入企业负责人"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="A证书编号" hasFeedback>
					{getFieldDecorator('ACode', {
						rules: [
							{required: true, message: '请输入A证书编号！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入证书编号"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="有效期限" hasFeedback>
					{getFieldDecorator('AValidityPeriod', {
						rules: [
							{required: true, message: '请选择有效期限'},
						]
					}, {})(
						<Input type="text" placeholder="请选择有效期限"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="A资质证书" hasFeedback>
					<a href={`${STATIC_DOWNLOAD_API}${this.props.certificateone.file.a_file}`}>{this.props.certificateone.file.name}</a>
				</FormItem>
				<FormItem {...formItemLayout} label="项目经理" hasFeedback>
					{getFieldDecorator('projectManager', {
						rules: [
							{required: true, message: '请输入项目经理！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入项目经理"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="B证书编号" hasFeedback>
					{getFieldDecorator('BCode', {
						rules: [
							{required: true, message: '请输入B证书编号！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入证书编号"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="有效期限" hasFeedback>
					{getFieldDecorator('BValidityPeriod', {
						rules: [
							{required: true, message: '请选择有效期限'},
						]
					}, {})(
						<Input type="text" placeholder="请选择有效期限"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="资质证书B" hasFeedback>
					<a href={`${STATIC_DOWNLOAD_API}${this.props.certificatetwo.file.a_file}`}>{this.props.certificatetwo.file.name}</a>
				</FormItem>
				<FormItem {...formItemLayout} label="专职安全员" hasFeedback>
					{getFieldDecorator('securityOfficer', {
						rules: [
							{required: true, message: '请输入专职安全员！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入专职安全员"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="C证书编号" hasFeedback>
					{getFieldDecorator('CCode', {
						rules: [
							{required: true, message: '请输入C证书编号！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入C证书编号"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="有效期限" hasFeedback>
					{getFieldDecorator('CValidityPeriod', {
						rules: [
							{required: true, message: '请选择有效期限'},
						]
					}, {})(
						<Input type="text" placeholder="请选择有效期限"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="资质证书C" hasFeedback>
					<a href={`${STATIC_DOWNLOAD_API}${this.props.certificatethree.file.a_file}`}>{this.props.certificatethree.file.name}</a>
				</FormItem>
			</Form>
		)
	}
}
function dataTransform(obj){
    let res = {};
    for(let key in obj){
        res[key] = {
            value: obj[key]
        }
    }
    return res;
}
export default Form.create({
    mapPropsToFields(props){
        return {
            AValidityPeriod: {value: props.certificateone.period},
            BValidityPeriod: {value: props.certificatetwo.period},
            CValidityPeriod: {value: props.certificatethree.period},
            certificationsB: {value: props.certificatetwo.file.name},
            certificationsC: {value: props.certificatethree.file.name},
            attachment: {value: props.certificateone.file.name},
            ...dataTransform(props)

        }
    }
})(ExaminationCardDetail);