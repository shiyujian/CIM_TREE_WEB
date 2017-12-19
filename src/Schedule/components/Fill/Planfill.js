import React from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {GetIsoTime} from '../GetIsoTime';
import {Form, Input, Select, Cascader, Button, DatePicker, Row, Col, Table, message, Spin} from 'antd';
import {getFieldValue} from '_platform/store/util';
const FormItem = Form.Item;
const Option = Select.Option;
moment.locale('zh-cn');


class EditableCell extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.value,
			type: this.props.type
		};
	}

	handleChange = (e) => {
		const {actions: {editIndex}} = this.props;
		editIndex(this.props.index);
		const value = getFieldValue(e);
		this.setState({value});
		this.props.onChange(value);
	};

	render() {
		const {value, type} = this.state;
		const {units = []} = this.props;
		return (
			<div className="editable-cell">
				<div className="editable-cell-input-wrapper">
					{
						(type === 'string') ?
							<Input
								value={value}
								onChange={this.handleChange}
							/>
							: ((type === 'time') ?
							<DatePicker defaultValue={moment(value, 'YYYY-MM-DD')} onChange={this.handleChange}/> : (
								<Select placeholder="单位"
								        allowClear={false}
								        value={value}
								        onChange={this.handleChange}>
									{
										units.map(unit => {
											return <Option key={unit.unit}
											               value={unit.unit}>{unit.description}</Option>;
										})
									}
								</Select>
							))
					}
				</div>
			</div>
		);
	}
}

export default class Planfill extends React.Component {

	static propTypes = {};
	static layout = {
		labelCol: {span: 8},
		wrapperCol: {span: 16}
	};

	constructor(props) {
		super(props);
		this.state = {
			dataSource: []
		};
	}

	componentDidMount() {
		const {actions: {planGetProjectTree, unitList}} = this.props;
		planGetProjectTree();
		unitList();
	}

	render() {
		const {
			filter = {},
			planWorkPackage: {
				planProjectTree = [],
				planUnitTree = [],
				planSectionTree = [],
				planItemTree = []
			} = {},
			loadingStatus = false
		} = this.props;
		let columns = [{
			title: '单元名称',
			dataIndex: 'name',
			render: (text) => {
				return (
					<div>{text}</div>
				);
			}
		}, {
			title: '单元编码',
			dataIndex: 'code',
			render: (text) => {
				return (
					<div>{text}</div>
				);
			}
		}, {
			title: '计划开始时间',
			dataIndex: 'basic_params.tech_params.plan_process.start_time',
			render: (text, record, index) => {
				return (
					<EditableCell
						value={text}
						type="time"
						index={index}
						{...this.props}
						onChange={this.onCellChange(index, 'start_time')}
					/>
				);
			}
		}, {
			title: '计划结束时间',
			dataIndex: 'basic_params.tech_params.plan_process.end_time',
			render: (text, record, index) => {
				return (
					<EditableCell
						value={text}
						type="time"
						index={index}
						{...this.props}
						onChange={this.onCellChange(index, 'end_time')}
					/>
				);
			}
		}, {
			title: '单位',
			dataIndex: 'extra_params.task.plan.unit',
			render: (text, record, index) => {
				return (
					<EditableCell
						value={text}
						type="select"
						index={index}
						{...this.props}
						onChange={this.onCellChange(index, 'unit')}
					/>
				);
			}
		}, {
			title: '数量',
			dataIndex: 'extra_params.task.plan.count',
			render: (text, record, index) => {
				return (
					<EditableCell
						value={text}
						type="string"
						index={index}
						{...this.props}
						onChange={this.onCellChange(index, 'count')}
					/>
				);
			}
		}, {
			title: '计划完成百分比',
			dataIndex: 'extra_params.task.plan.percent',
			render: (text, record, index) => {
				return (
					<EditableCell
						value={text}
						type="string"
						index={index}
						{...this.props}
						onChange={this.onCellChange(index, 'percent')}
					/>
				);
			}
		}, {
			title: '计划完成量',
			dataIndex: 'extra_params.task.plan.amount',
			render: (text, record, index) => {
				return (
					<EditableCell
						value={text}
						type="string"
						index={index}
						{...this.props}
						onChange={this.onCellChange(index, 'amount')}
					/>
				);
			}
		}, {
			title: '备注',
			dataIndex: 'extra_params.task.plan.remark',
			render: (text, record, index) => {
				return (
					<EditableCell
						value={text}
						type="string"
						index={index}
						{...this.props}
						onChange={this.onCellChange(index, 'remark')}
					/>
				);
			}
		}];
		return (
			<Form>
				<Row gutter={24}>
					<Col span={24}>
						<Row gutter={24}>
							<Col span={6}>
								<FormItem {...Planfill.layout}
								          label="项目">
									<Cascader placeholder="请选择建设项目"
									          allowClear={false}
									          displayRender={Planfill.displayRender}
									          value={filter.project}
									          options={planProjectTree}
									          expandTrigger="hover"
									          onChange={this.changeProject.bind(
										          this)}/>
								</FormItem>
							</Col>
							<Col span={6}>
								<FormItem {...Planfill.layout}
								          label="单位工程">
									<Cascader placeholder="请选择子单位工程"
									          allowClear={false}
									          displayRender={Planfill.displayRender}
									          value={filter.unit}
									          options={planUnitTree}
									          expandTrigger="hover"
									          onChange={this.changeUnit.bind(
										          this)}/>
								</FormItem>
							</Col>
							<Col span={6}>
								<FormItem {...Planfill.layout}
								          label="分部工程">
									<Cascader placeholder="请选择子分部工程"
									          allowClear={false}
									          displayRender={Planfill.displayRender}
									          value={filter.section}
									          options={planSectionTree}
									          expandTrigger="hover"
									          onChange={this.changeSection.bind(
										          this)}/>
								</FormItem>
							</Col>
							<Col span={6}>
								<FormItem {...Planfill.layout}
								          label="分项工程">
									<Select placeholder="分项工程"
									        allowClear={false}
									        value={filter.item}
									        onChange={this.changeItem.bind(
										        this)}>
										{
											planItemTree.map(pkg => {
												return <Option key={pkg.code}
												               value={pkg.code}>{pkg.name}</Option>;
											})
										}
									</Select>
								</FormItem>
							</Col>
						</Row>
					</Col>
				</Row>
				<Row gutter={24} style={{marginTop: '20px'}}>
					<Spin tip="加载中..." spinning={loadingStatus}>
						<Table columns={columns}
						       dataSource={this.state.dataSource} bordered pagination={false} rowKey="code"/>
						<Col offset={20} span={4} style={{textAlign: 'right'}}>
							<Button type="primary" onClick={this.submit.bind(this)}>提交</Button>
						</Col>
					</Spin>
				</Row>
			</Form>
		);
	}

	changeProject(keys) {
		const {
			actions: {changeFilterField, setUnitTree, setSectionTree, setItemTree, planGetUnitTree}
		} = this.props;

		changeFilterField('project', keys);

		changeFilterField('unit', undefined);
		setUnitTree([]);

		changeFilterField('section', undefined);
		setSectionTree([]);

		changeFilterField('item', undefined);
		setItemTree([]);

		planGetUnitTree({code: keys[keys.length - 1]})
		this.resetDataSource();
	}

	changeUnit(keys) {
		const {
			actions: {changeFilterField, setSectionTree, setItemTree, planGetSectionTree}
		} = this.props;
		changeFilterField('unit', keys);

		changeFilterField('section', undefined);
		setSectionTree([]);

		changeFilterField('item', undefined);
		setItemTree([]);

		planGetSectionTree({code: keys[keys.length - 1]})
		this.resetDataSource();
	}

	changeSection(keys) {
		const {
			actions: {changeFilterField, planGetItemTree, setItemTree}
		} = this.props;
		changeFilterField('section', keys);

		changeFilterField('item', undefined);
		setItemTree([]);
		planGetItemTree({code: keys[keys.length - 1]});
		this.resetDataSource();
	}

	changeItem(key) {
		const {
			actions: {changeFilterField, planWorkPackages, loadToggle}
		} = this.props;
		changeFilterField('item', key);
		loadToggle(true);
		planWorkPackages({code: key})
			.then(rst => {
				this.setState({
					dataSource: rst.children_wp
				});
				loadToggle(false);
			});
	}

	resetDataSource() {
		this.setState({
			dataSource: []
		})
	}

	onCellChange = (index, key) => {
		return (value) => {
			const dataSource = [...this.state.dataSource];
			dataSource[index][key] = value;
			this.setState({dataSource});
		};
	};

	submit() {
		const {filter = {}, actions: {updateWork, planWorkPackages, loadToggle}, editIdx = []} = this.props;
		if (editIdx.length === 0) {
			message.warning('请先修改相应信息后提交数据！')
		} else {
			let editList = {"data_list": []};
			editIdx.map((idx) => {
				let work = this.state.dataSource[idx];
				let editData = {
					"code": work.code,
					"basic_params": {
						"plan_process": {}
					},
					"extra_params": {
						"task": {
							"plan": {}
						}
					}
				};
				for (let key in work) {
					if (key === 'start_time') {
						editData.basic_params.plan_process.start_time = work['start_time']
					}
					if (key === 'end_time') {
						editData.basic_params.plan_process.end_time = work['end_time']
					}
					if (key === 'unit') {
						editData.extra_params.task.plan.unit = work['unit']
					}
					if (key === 'count') {
						editData.extra_params.task.plan.count = work['count']
					}
					if (key === 'percent') {
						editData.extra_params.task.plan.percent = work['percent']
					}
					if (key === 'amount') {
						editData.extra_params.task.plan.amount = work['amount']
					}
					if (key === 'remark') {
						editData.extra_params.task.plan.remark = work['remark']
					}
				}
				editList.data_list.push(editData)
			});
			loadToggle(true);
			updateWork({}, editList)
				.then(() => {
					message.success('更新计划进度成功！');
					planWorkPackages({code: filter.item})
						.then(rst => {
							this.setState({
								dataSource: rst.children_wp
							});
							loadToggle(false);
						});
				})
		}

	}

	static displayRender(label) {
		return label[label.length - 1];
	}
}
