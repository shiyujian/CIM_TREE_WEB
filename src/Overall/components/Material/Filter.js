import React, { Component } from 'react';
import { base, STATIC_DOWNLOAD_API } from '../../../_platform/api';
import {
	Form, Input, Button, Row, Col, message, Popconfirm,Tabs,DatePicker,Select
} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const TabPane=Tabs.TabPane;
const {RangePicker}=DatePicker;

export default class Filter extends Component {

	static propTypes = {};

	render() {
		const { actions: { toggleAddition }, Doc = [] } = this.props;
		// console.log('filter.this.props',this.props)
		return (
			<Form style={{ marginBottom: 24 }}>
				<Row gutter={24}>
					<Col span={24} style={{paddingLeft:'5em'}}>
						<Row gutter={15}  style={{marginTop: 5}}>
							<Col span={8}>
								<FormItem   {...Filter.layoutT} label="单位工程:">
                                     <Select>
                                          <Option value='第一阶段'>第一阶段</Option>
                                          <Option value='第二阶段'>第二阶段</Option>
                                     </Select>
                                </FormItem>
							</Col>
							<Col span={8}>
								<FormItem {...Filter.layoutT} label="编号:">
									<Input />
                                </FormItem>
							</Col>
							<Col span={8}>
								<Button type="primary" style={{marginLeft:'100px'}}>查询</Button>
							</Col>
						</Row>
						<Row gutter={15}  style={{marginTop: 5}}>
							<Col span={8}>
								<FormItem {...Filter.layoutT} label="日期:">
									<RangePicker/>
                                </FormItem>
							</Col>
							<Col span={8}>
								<FormItem {...Filter.layoutT} label="流程状态:">
									<Select>
                                          <Option value='待提交'>待提交</Option>
                                          <Option value='审批中'>审批中</Option>
                                     </Select>
                                </FormItem>
							</Col>
							<Col span={8}>
								<Button type="primary" ghost style={{marginLeft:'100px'}}>清空</Button>
							</Col>
						</Row>
					</Col>
				</Row>
				<Row gutter={24}>
					<Col span={24}>
						{!this.props.isTreeSelected ?
							<Button style={{ marginRight: 10 }} disabled>新增</Button> :
							<Button style={{ marginRight: 10 }} type="primary" onClick={toggleAddition.bind(this, true)}>新增</Button>
						}
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

	query(value) {
		const { actions: { getdocument }, currentcode } = this.props;
		let search = {
			doc_name: value
		};
		getdocument({ code: currentcode.code }, search);
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
	static layoutT = {
          labelCol: {span: 8},
          wrapperCol: {span: 16},
     };
};
