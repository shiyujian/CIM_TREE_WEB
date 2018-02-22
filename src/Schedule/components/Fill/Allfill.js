import React from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {GetIsoTime} from '../GetIsoTime';
import {Form, Input, Select, Cascader, Button, DatePicker, Row, Col, Table, message} from 'antd';
import {getFieldValue} from '_platform/store/util';
const FormItem = Form.Item;
const Option = Select.Option;
moment.locale('zh-cn');
export default class Allfill extends React.Component {

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
			} = {}
		} = this.props;
		return (
			<Form>
				<Row gutter={24}>
					<Col span={24}>
						<Row gutter={24}>
							<Col span={6}>
								<FormItem {...Allfill.layout}
										  label="项目">
									<Cascader placeholder="请选择建设项目"
											  allowClear={false}
											  displayRender={Allfill.displayRender}
											  value={filter.project}
											  options={planProjectTree}
											  expandTrigger="hover"
											  onChange={this.changeProject.bind(
												  this)}/>
								</FormItem>
							</Col>
							<Col span={6}>
								<FormItem {...Allfill.layout}
										  label="单位工程">
									<Cascader placeholder="请选择子单位工程"
											  allowClear={false}
											  displayRender={Allfill.displayRender}
											  value={filter.unit}
											  options={planUnitTree}
											  expandTrigger="hover"
											  onChange={this.changeUnit.bind(
												  this)}/>
								</FormItem>
							</Col>
							<Col span={6}>
								<FormItem {...Allfill.layout}
										  label="分部工程">
									<Cascader placeholder="请选择子分部工程"
											  allowClear={false}
											  displayRender={Allfill.displayRender}
											  value={filter.section}
											  options={planSectionTree}
											  expandTrigger="hover"
											  onChange={this.changeSection.bind(
												  this)}/>
								</FormItem>
							</Col>
							<Col span={6}>
								<FormItem {...Allfill.layout}
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
			actions: {changeFilterField, planWorkPackages}
		} = this.props;
		changeFilterField('item', key);
		// planWorkPackages({code: key})
		// 	.then(rst => {
		// 		this.setState({
		// 			dataSource: rst.children_wp
		// 		})
		// 	});
	}

	resetDataSource() {
		this.setState({
			dataSource: []
		})
	}
}
