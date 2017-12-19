import React, {Component} from 'react';
import {Table, Icon, Popconfirm, Button, Select, message} from 'antd';
const Option = Select.Option;

export default class ItemStep extends Component {

	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
			addIn: null,
		};
	}

	render() {
		const {items = [], actions: {toggleStep}} = this.props;
		const {addIn} = this.state;
		let data = [];
		if (addIn) {
			data = items.concat([addIn]);
		} else {
			data = items;
		}
		return (
			<div>
				<Table dataSource={data} columns={this.columns}
					   rowKey={(item, index) => `${item.code}-${index}`}
					   className="clearfix"/>
				<div style={{textAlign: 'right'}}>
					<Button onClick={toggleStep.bind(this, -1)}>上一步</Button>
					<Button onClick={this.next.bind(this, 1)}>下一步</Button>
				</div>
			</div>

		);
	}

	next() {
		const {items = [], actions: {toggleStep, fillQuantifier}} = this.props;
		toggleStep(1);
		fillQuantifier(items);
	}

	add(item, event) {
		event.preventDefault();
		this.setState({
			addIn: {section: item.section, editing: true, item},
		});
	}

	remove(item) {
		const {deleteItem} = this.props.actions;
		deleteItem(item);
	}

	del() {
		this.setState({addIn: null});
	}

	append(event) {
		event.preventDefault();
		const {addIn} = this.state;
		const {item, name} = addIn;
		const {appendItem} = this.props.actions;
		if (name && name.length) {
			name.forEach(nm => {
				const code = `${item.code}-${nm}`;
				const suffix = ItemStep.suffixes.find(
					suffix => +suffix.value === +nm);
				appendItem({
					code,
					name: suffix.name,
					section: addIn.section,
				});
				this.setState({
					addIn: null,
				});
			});
		} else {
			message.info('请选择尾码');
		}
	}

	changeSuffix(value) {
		const {addIn} = this.state;
		this.setState({
			addIn: {...addIn, name: value},
		});
	}

	columns = [
		{
			title: '分部工程',
			dataIndex: 'section',
		}, {
			title: '分项工程编码',
			dataIndex: 'code',
		}, {
			title: '分项工程名称',
			render: item => {
				if (item.editing) {
					const {addIn: {name} = {}} = this.state;
					return (
						<div>
							<Select mode={'multiple'} allowClear={true}
									value={name}
									onChange={this.changeSuffix.bind(this)}
									style={{width: '100%'}}>
								{
									ItemStep.suffixes.map(suffix => {
										return <Option
											key={suffix.value}
											value={String(
												suffix.value)}>{suffix.name}</Option>;
									})
								}
							</Select>
						</div>);
				} else {
					return item.name;
				}
			},
		}, {
			title: '操作',
			render: item => {
				if (item.editing) {
					return [
						<a key="0" href="#"
						   onClick={this.append.bind(this)}><Icon
							type="save"/></a>,
						<Popconfirm key="1" title="确定删除新增项?"
									onConfirm={this.del.bind(this)}
									okText="是" cancelText="否">
							<a href="#"><Icon type="close"/></a>
						</Popconfirm>,
					];
				} else {
					return [
						<Popconfirm key="0" title="确定删除分项?"
									onConfirm={this.remove.bind(this, item)}
									okText="是" cancelText="否">
							<a href="#"><Icon type="delete"/></a>
						</Popconfirm>,
						<a key="1" href="#" onClick={this.add.bind(this, item)}><Icon
							type="plus"/></a>,
					];
				}
			},
		}];

	static suffixes = [
		{name: '土方边坡开挖', value: 1},
		{name: '石方边坡开挖', value: 2},
		{name: '岩石地基开挖', value: 3},
		{name: '软基及岸坡开挖', value: 4},
		{name: '土石方填筑', value: 5},
	];
};
