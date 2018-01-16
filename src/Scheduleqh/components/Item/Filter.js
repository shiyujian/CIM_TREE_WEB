import React, {Component} from 'react';
import {Form, Input, Select, Cascader, Button, Row, Col} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

export default class Filter extends Component {

	static propTypes = {};

	static layout = {
		labelCol: {span: 10},
		wrapperCol: {span: 14},
	};

	render() {
		const {
			filter = {},
			majors = [],
			docTypes = [],
			actions: {changeFilterField, resetFilterField},
		} = this.props;
		return (
			<Form>
				<Row gutter={24}>
					<Col span={20}>
						<Row gutter={24}>
							<Col span={12}>
								<FormItem {...Filter.layout} label="图纸名称">
									<Input value={filter.name}/>
								</FormItem>
							</Col>
							<Col span={12}>
								<FormItem {...Filter.layout} label="图号">
									<Input value={filter.number}/>
								</FormItem>
							</Col>
						</Row>
						<Row gutter={24}>
							<Col span={12}>
								<FormItem {...Filter.layout} label="文档类型">
									<Select placeholder="文档类型"
									        onChange={changeFilterField.bind(this, 'docType')}>
										{
											docTypes.map((type, index) => {
												return <Option key={index} value={type}>{type}</Option>;
											})
										}
									</Select>
								</FormItem>
							</Col>
							<Col span={12}>
								<FormItem {...Filter.layout} label="专业">
									<Select placeholder="专业" onChange={changeFilterField.bind(this, 'major')}>
										{
											majors.map((major, index) => {
												return <Option key={index} value={major}>{major}</Option>;
											})
										}
									</Select>
								</FormItem>
							</Col>
						</Row>
					</Col>
					<Col span={3} offset={1}>
						<Row>
							<FormItem>
								<Button onClick={this.query.bind(this)}>查询</Button>
							</FormItem>
						</Row>
						<Row>
							<FormItem>
								<Button onClick={this.remove.bind(this)}>清除</Button>
							</FormItem>
						</Row>
					</Col>
				</Row>
			</Form>
		);
	}

	//查询
	query() {
		const {sidebar: {node}, actions: {getDocuments}} = this.props;
		getDocuments({code: node});
	}

	remove() {

	}

	componentDidMount() {
		const {
			actions: {getDocumenttypeMeta, getMajorMeta}
		} = this.props;
		getDocumenttypeMeta();
		getMajorMeta();
	}
};
