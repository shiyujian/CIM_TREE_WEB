import React, {Component} from 'react';
import {Form, Input, Spin, Row, Col, Icon, Table} from 'antd';
import Dragger from '_platform/components/panels/Dragger';

export default class BlueprintForm extends Component {

	static propTypes = {};

	static layout = {
		labelCol: {span: 4},
		wrapperCol: {span: 20},
	};

	render() {
		const {
			added = false,
			parameters = [],
			workPackage: {} = {},
			actions: {pushParameters},
		} = this.props;
		return (
			<div>
				<Spin tip="提交数据中，请稍等..." spinning={false}>
					<Form>
						<Row gutter={24}>
							<Col span={24} style={{marginTop: 16, height: 160}}>
								<Dragger value={parameters} onChange={pushParameters.bind(this)}>
									<p className="ant-upload-drag-icon">
										<Icon type="inbox"/>
									</p>
									<p className="ant-upload-text">
										点击或者拖拽开始上传</p>
									<p className="ant-upload-hint">
										支持 pdf、doc、docx 文件
									</p>
								</Dragger>
							</Col>
						</Row>
						<Row gutter={24} style={{marginTop: 16}}>
							<Col span={24}>
								<Table columns={this.columns}
								       dataSource={parameters}
								       bordered rowKey="a_file"/>
							</Col>
						</Row>
					</Form>
				</Spin>
			</div>
		);
	}

	columns = [
		{
			title: '名称',
			dataIndex: 'name',
		}, {
			title: '图号',
			render: (doc) => {
				return <Input onChange={this.setParam.bind(this, doc, 'code')}/>;
			},
		}, {
			title: '备注',
			render: (doc) => {
				return <Input onChange={this.setParam.bind(this, doc, 'remark')}/>;
			},
		}, {
			title: '操作',
			render: doc => {
				return (
					<a onClick={this.remove.bind(this, doc)}>删除</a>
				);
			},
		}];

	validateCode(event) {
		const value = event.target.value;
		const {
			actions: {getDocument},
		} = this.props;
		getDocument({doc_id: value}).then(rst => {
			const index = 'object not found'.indexOf(rst);
			if (index < 0) {
				this.setState({
					status: 'error',
				});
			} else {
				this.setState({
					status: 'success',
				});
			}
		});
		// changeParamField('code', value);
	}

	setParam(file, name, event) {
		const {actions: {setParameters}} = this.props;
		file[name] = event.target.value; // todo 设置单个文件属性
		setParameters();
	}

	remove(file) {
		const {actions: {removeParameters}} = this.props;
		removeParameters(file);
	}
};
