import React, {Component} from 'react';
import {Table, Select, Input, Button, Icon, Popconfirm} from 'antd';
import tags from './tags.json';

const Option = Select.Option;

export default class QuantityStep extends Component {

	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
			addIn: null,
			index: 0,
			tagMap: {},
		};
	}

	render() {
		const {quantifiers = [], actions: {toggleStep}} = this.props;
		const {addIn, index} = this.state;
		const data = [...quantifiers];
		if (addIn) {
			data.splice(index + 1, 0, addIn);
		}
		return (
			<div>
				<Table dataSource={data} columns={this.columns} rowKey="code"
					   className="clearfix"/>
				<div style={{textAlign: 'right'}}>
					<Button onClick={toggleStep.bind(this, -1)}>上一步</Button>
					<Button onClick={this.next.bind(this)}>下一步</Button>
				</div>
			</div>
		);
	}

	next() {
		const {quantifiers = [], actions: {toggleStep, fillContrast}} = this.props;
		toggleStep(1);
		fillContrast(quantifiers);
	}

	edit(item) {
		const {editQuantifier} = this.props.actions;
		const {tagMap} = this.state;
		tagMap[item.code] = {
			tag: item.tag || '',
			unit: item.unit || '',
			unit_price: item.unit_price || '',
			quantity: item.quantity || '',
			techQuantity: item.techQuantity || '',
		};
		this.setState({tagMap});
		editQuantifier(item);
	}

	remove(item) {
		const {deleteQuantifier} = this.props.actions;
		deleteQuantifier(item);
	}

	add(item) {
		const {quantifiers = []} = this.props;
		const index = quantifiers.indexOf(item);
		const code = item.code;
		const [origin] = code.split('--');
		this.setState({
			addIn: {
				editing: true,
				item: item.item,
				code: `${origin}--${QuantityStep.index++}`,
			},
			index,
		});
	}

	toggleQuantifierTag(item, value) {
		const tag = tags.find(tag => `${tag.code} ${tag.name}` === value) || {};
		const attributes = JSON.parse(tag.attributes || '{}');
		const {basic: {unit = '', unit_price = ''} = {}} = attributes || {};
		const {tagMap} = this.state;
		const tmp = tagMap[item.code] || {};

		tagMap[item.code] = {
			...tmp,
			tag: value,
			unit: unit,
			unit_price: unit_price,
		};
		this.setState({
			tagMap,
		});
	}

	toggleQuantifierValue(item, name, event) {
		event.preventDefault();
		const value = event.target.value;
		const {tagMap} = this.state;
		const q = tagMap[item.code];
		tagMap[item.code] = {
			...q,
			[name]: value,
		};
		this.setState({
			tagMap,
		});
	}

	save(item) {
		const {quantifiers = [], actions: {addQuantifier, saveQuantifier}} = this.props;
		const have = quantifiers.some(q => q === item);
		this.setState({
			addIn: null,
			index: 0,
		});
		const {tagMap} = this.state;
		const tag = tagMap[item.code];
		if (have) {
			item.editing = false;
			item.tag = tag.tag;
			item.unit = tag.unit;
			item.unit_price = tag.unit_price;
			item.quantity = tag.quantity;
			item.techQuantity = tag.techQuantity;
			saveQuantifier();
		} else {
			addQuantifier({
				...item,
				editing: false,
				tag: tag.tag,
				unit: tag.unit,
				unit_price: tag.unit_price,
				quantity: tag.quantity,
				techQuantity: tag.techQuantity,
			});
		}
	}

	close(item) {
		const {quantifiers = [], actions: {reloadQuantifier}} = this.props;
		const have = quantifiers.some(q => q === item);
		if (have) {
			item.editing = false;
			reloadQuantifier();
		} else {
			this.setState({
				addIn: null,
				index: 0,
			});
		}
	}

	columns = [
		{
			title: '分项工程',
			dataIndex: 'item',
		}, {
			title: '工程量项',
			render: (item) => {
				const tag = this.state.tagMap[item.code] || {};
				if (item.editing) {
					return (
						<Select combobox placeholder="搜索量项"
								style={{width: '100%'}}
								value={tag.tag}
								onChange={this.toggleQuantifierTag.bind(this,
									item)}>
							{
								tags.map((tag, index) => {
									return <Option key={index}
												   value={`${tag.code} ${tag.name}`}>{`${tag.code} ${tag.name}`}</Option>;
								})
							}
						</Select>
					);
				} else {
					return item.tag;

				}
			},
		}, {
			title: '单位',
			render: (item) => {
				const tag = this.state.tagMap[item.code] || {};
				if (item.editing) {
					return tag.unit;
				} else {
					return item.unit;
				}
			},
		}, {
			title: '单价',
			render: (item) => {
				const tag = this.state.tagMap[item.code] || {};
				if (item.editing) {
					return tag.unit_price;
				} else {
					return item.unit_price;
				}
			},
		}, {
			title: '技施图纸工程量(系统)',
			render: (item) => {
				const tag = this.state.tagMap[item.code] || {};
				if (item.editing) {
					return <Input
						value={tag.quantity}
						onChange={this.toggleQuantifierValue.bind(this,
							item, 'quantity')}/>;
				} else {
					return item.quantity;
				}
			},
		}, {
			title: '技施图纸工程量(预留随机)',
			render: (item) => {
				const tag = this.state.tagMap[item.code] || {};
				if (item.editing) {
					return <Input
						value={tag.techQuantity}
						onChange={this.toggleQuantifierValue.bind(this,
							item, 'techQuantity')}/>;
				} else {
					return item.techQuantity;
				}
			},
		}, {
			title: '操作',
			render: (item) => {
				if (item.editing) {
					return [
						<a key="0" href="#"
						   onClick={this.save.bind(this, item)}>
							<Icon type="save"/></a>,
						<a key="1" href="#"
						   onClick={this.close.bind(this, item)}>
							<Icon type="close"/></a>,
					];
				} else {
					return [
						<a key="0" href="#"
						   onClick={this.edit.bind(this, item)}><Icon
							type="edit"/></a>,
						<Popconfirm key="1" title="确定删除分项?"
									onConfirm={this.remove.bind(this, item)}
									okText="是" cancelText="否">
							<a href="#"><Icon type="delete"/></a>
						</Popconfirm>,
						<a key="2" href="#" onClick={this.add.bind(this, item)}><Icon
							type="plus"/></a>,
					];
				}
			},
		}];

	static index = 0;
};
