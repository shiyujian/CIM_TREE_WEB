import React, { Component } from 'react';
import { base, STATIC_DOWNLOAD_API } from '../../../_platform/api';
import {
	Form, Input, Button, Row, Col, message, Popconfirm,DatePicker
} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const { RangePicker } = DatePicker;

class Filter extends Component {

	static propTypes = {};

	static layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	};
	render() {
		const { 
			actions: { toggleAddition }, 
			form: { getFieldDecorator },
			Doc = [] 
		} = this.props;
		// console.log('sssss',this.props.isTreeSelected)
		return (
			<Form style={{ marginBottom: 24 }}>
				<Row gutter={24}>
					<Col span={20}> 
						<Row>
							<Col span={8}>
								<FormItem {...Filter.layout} label='项目'>
									{
										getFieldDecorator('searchProject', {
											rules: [
												{ required: false, message: '请选择项目' }
											]
										})
											(<Input placeholder='请选择项目' />)
									}
								</FormItem>
							</Col>
							<Col span={8}>
								<FormItem {...Filter.layout}label="标段">
									{
										getFieldDecorator('searcSection', {
											rules: [
												{ required: false, message: '请选择标段' }
											]
										})
											(<Input placeholder='请选择标段' />)
									}
								</FormItem>
							</Col>
							<Col span={8}>
								<FormItem {...Filter.layout} label='名称'>
									{
										getFieldDecorator('searchName', {
											rules: [
												{ required: false, message: '请输入名称' }
											]
										})
											(<Input placeholder='请输入名称' />)
									}
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span={8}>
								<FormItem {...Filter.layout} label='编号'>
									{
										getFieldDecorator('searchCode', {
											rules: [
												{ required: false, message: '请输入编号' }
											]
										})
											(<Input placeholder='请输入编号' />)
									}
								</FormItem>
							</Col>
							<Col span={8}>
								<FormItem {...Filter.layout} label='日期'>
									{
										getFieldDecorator('searchDate', {
											rules: [
												{type: 'array',  required: false, message: '请选择日期' }
											]
										})
											(<RangePicker size='default' format='YYYY-MM-DD' style={{ width: '100%', height: '100%' }} />)
									}
								</FormItem>
							</Col>
						</Row>
					</Col>
					
					<Col span={3} offset={1}>
                        <Row gutter={10}>
                            <FormItem >
                                <Button type='Primary' onClick={this.query.bind(this)} >查询</Button>
                            </FormItem>
							<FormItem >
                                <Button onClick={this.clear.bind(this)}>清除</Button>
                            </FormItem>
                        </Row>
                    </Col>
				</Row>
				<Row gutter={24}>
					<Col span={24}>
						{!this.props.parent ?
							<Button style={{ marginRight: 10 }} disabled>新增</Button> :
							<Button style={{ marginRight: 10 }} type="primary" onClick={toggleAddition.bind(this, true)}>新增</Button>
						}
						{/* </Col> */}·
						{/* <Col span ={2}> */}
						{/* {
							(Doc.length === 0 )?
								<Button style={{marginRight: 10}} disabled>下载</Button>:
								<Button style={{marginRight: 10}} type="primary" onClick={this.download.bind(this)}>下载</Button>
						} */}
						{/* </Col> */}
						{/* <Col span ={2}> */}
						{
							(Doc.length === 0) ?
								<Button style={{ marginRight: 10 }} disabled>删除</Button> :
								<Popconfirm title="确定要删除文件吗？" onConfirm={this.confirm.bind(this)} onCancel={this.cancel.bind(this)} okText="Yes" cancelText="No">
									<Button style={{ marginRight: 10 }} type="primary" onClick={this.delete.bind(this)}>删除</Button>
								</Popconfirm>
						}
					</Col>
				</Row>
			</Form>
		);
	}

	query() {
		const { 
			actions: { getdocument }, 
			form:{validateFields},
			currentcode 
		} = this.props;
		validateFields((err, values) => {
			let search = {}
			search = {
				doc_name: values.searchName
			};
			
			getdocument({ code: currentcode.code }, search);
		})
		
	}
	clear() {
        this.props.form.setFieldsValue({
			searchProject: undefined,
            searcSection: undefined,
            searchName: undefined,
			searchDate: undefined,
			searchCode: undefined,
        })
    }
	cancel() {

	}

	delete() {
		const { selected } = this.props;
	}
	confirm() {
		const {
			coded = [],
			selected = [],
			currentcode = {},
			actions: { deletedoc, getdocument }
		} = this.props;
		if (selected === undefined || selected.length === 0) {
			message.warning('请先选择要删除的文件！');
			return;
		}
		selected.map(rst => {
			coded.push(rst.code);
		});
		let promises = coded.map(function (code) {
			return deletedoc({ code: code });
		});
		message.warning('删除文件中...');
		Promise.all(promises).then(() => {
			message.success('删除文件成功！');
			getdocument({ code: currentcode.code })
				.then(() => {
				});
		}).catch(() => {
			message.error('删除失败！');
			getdocument({ code: currentcode.code })
				.then(() => {
				});
		});
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

	download() {
		const { selected = [], file = [], files = [], down_file = [] } = this.props;
		if (selected.length == 0) {
			message.warning('没有选择无法下载');
		}
		selected.map(rst => {
			file.push(rst.basic_params.files);
		});
		file.map(value => {
			value.map(cot => {
				files.push(cot.download_url)
			})
		});
		files.map(down => {
			let down_load = STATIC_DOWNLOAD_API + "/media" + down.split('/media')[1];
			this.createLink(this, down_load);
		});
	}
};
export default Filter = Form.create()(Filter);
