import React, {Component} from 'react';
import {Form, Row, Col, Input, Select, Button, DatePicker} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const {RangePicker} = DatePicker;

export default class Filter extends Component {

	static propTypes = {};

	static layout = {
		labelCol: {span: 6},
		wrapperCol: {span: 18},
	};

	render() {
		const {actions: {changeFilterField}} = this.props;
		return (
			<Form>
				<Row>
					<Col span={20}>
						<Row>
							<Col span={8}>
								<FormItem {...Filter.layout} label="任务名称">
									<Input placeholder="请输入任务名称"
									       onChange={changeFilterField.bind(this,
										       'workflowactivity')}/>
								</FormItem>
							</Col>
							<Col span={8}>
								<FormItem {...Filter.layout} label="任务分类">
									<Select placeholder="请选择任务分类"
									        onChange={changeFilterField.bind(this,
										        'workflow')}>
										<Option value="图纸报审">图纸报审</Option>
										<Option value="修改通知报审">修改通知报审</Option>
										<Option value="报告报审">报告报审</Option>
									</Select>
								</FormItem>
							</Col>
							<Col span={8}>
								<FormItem {...Filter.layout} label="表单状态">
									<Select placeholder="请选择表单状态"
									        onChange={changeFilterField.bind(this,
										        'status')}>
										<Option value="">全部</Option>
										<Option value="0">编辑中</Option>
										<Option value="1">已提交</Option>
										<Option value="2">执行中</Option>
										<Option value="3">已完成</Option>
										<Option value="4">已废止</Option>
										<Option value="5">异常</Option>
									</Select>
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span={8}>
								<FormItem {...Filter.layout} label="发起人">
									<Input placeholder="请输入发起人"
									       onChange={changeFilterField.bind(this,
										       'creator')}/>
								</FormItem>
							</Col>
							<Col span={8}>
								<FormItem {...Filter.layout} label="发起时间">
									<RangePicker
										onChange={changeFilterField.bind(this,
											'timer')}
										placeholder={['开始时间', '结束时间']}/>
								</FormItem>
							</Col>
							<Col span={8}>
								<FormItem {...Filter.layout} label="当前执行人">
									<Input placeholder="请输入当前执行人"
									       onChange={changeFilterField.bind(this,)}/>
								</FormItem>
							</Col>
						</Row>
					</Col>
					<Col span={3} offset={1}>
						<Row>
							<FormItem>
								<Button
									onClick={this.query.bind(this)}>查询</Button>
							</FormItem>
						</Row>
						<Row>
							<FormItem>
								<Button>清除</Button>
							</FormItem>
						</Row>
					</Col>
				</Row>
			</Form>
		);
	}

	query() {
		const {type = 'processing', actions: {getTasks}, param} = this.props;
		getTasks({}, {workflow: '图纸报审流程'});
	}

	componentDidMount() {
		this.query();
	}

};
