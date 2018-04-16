import React, { Component } from 'react';
import { base, STATIC_DOWNLOAD_API } from '../../../_platform/api';
import {
	Form, Input, Button, Row, Col, message, Popconfirm,DatePicker,Table,Modal
} from 'antd';
import moment from 'moment';
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
		return (
			<Form style={{ marginBottom: 24 }}>
				<Row gutter={24}>
					<Col span={18}> 
						<Row>
							<Col span={12}>
								<FormItem {...Filter.layout} label='影像名称'>
									{
										getFieldDecorator('searchName', {
											rules: [
												{ required: false, message: '请输入影像名称' }
											]
										})
											(<Input placeholder='请输入影像名称' />)
									}
								</FormItem>
							</Col>
							<Col span={12}>
								<FormItem {...Filter.layout}label="拍摄日期">
									{
										getFieldDecorator('searchDate', {
											rules: [
												{ type: 'array', required: false, message: '请选择日期' }
											]
										})
											(<RangePicker size='default' format='YYYY-MM-DD' style={{ width: '100%', height: '100%' }} />)
									}
								</FormItem>
							</Col>
						</Row>
					</Col>
					
					<Col span={5} offset={1}>
                        <Row gutter={10}>
                            <Col span={12}>
                                <Button type='Primary' onClick={this.query.bind(this)} >查询</Button>
                            </Col>
							<Col span={12}>
                                <Button onClick={this.clear.bind(this)}>清除</Button>
                            </Col>
                        </Row>
                    </Col>
				</Row>
				<Row gutter={24}>
					<Col span={24}>
						{!this.props.parent ?
							<Button style={{ marginRight: 10 }} disabled>新增</Button> :
							<Button style={{ marginRight: 10 }} type="primary" onClick={toggleAddition.bind(this, true)}>新增</Button>
						}
						{/* </Col> */}
						{/* <Col span ={2}> */}
						{
							/* (Doc.length === 0 )?
								<Button style={{marginRight: 10}} disabled>下载文件</Button>:
								<Button style={{marginRight: 10}} type="primary" onClick={this.download.bind(this)}>下载文件</Button> */
						}
						{/* </Col> */}
						{/* <Col span ={2}> */}
						{
							(Doc.length === 0) ?
								<Button style={{ marginRight: 10 }} disabled type="danger">删除</Button> :
								<Popconfirm title="确定要删除文件吗？" onConfirm={this.confirm.bind(this)} onCancel={this.cancel.bind(this)} okText="Yes" cancelText="No">
									<Button style={{ marginRight: 10 }} type="danger" onClick={this.delete.bind(this)}>删除</Button>
								</Popconfirm>
						}
					</Col>
				</Row>
			</Form>
		);
	}

	query() {
		const { 
			actions: { 
				searchRedioMessage,
				searchRedioVisible 
			}, 
			form:{validateFields},
			currentcode 
		} = this.props;
		validateFields((err, values) => {
			let search = {}

			console.log("获取工程文档搜索信息", values);
            console.log("err", err);
            
			values.searchName?search.searchName = values.searchName : '';
			//moment的比较日期的方法不能判断同一天的   所以前后各加一天
			values.searchDate?search.searchDate_begin = moment(values.searchDate[0]._d).subtract(1, 'days').format('YYYY-MM-DD') : '';
            values.searchDate?search.searchDate_end = moment(values.searchDate[1]._d).add(1, 'days').format('YYYY-MM-DD') : '';
		
			console.log('search',search)

			let postData = Object.assign({}, search);
			searchRedioMessage(postData)
			searchRedioVisible(true)
		})


		// validateFields((err, values) => {
		// 	let search = {}
		// 	search = {
		// 		doc_name: values.searchname
		// 	};
			
		// 	getdocument({ code: currentcode.code }, search);
		// })
		
	}
	clear() {
        this.props.form.setFieldsValue({
            searchName: undefined,
            searchDate: undefined
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
