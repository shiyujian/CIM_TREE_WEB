import React, {Component} from 'react';
import {Row, Col, Table, Button, Input, Cascader, Icon, message} from 'antd';
import moment from 'moment';
import {getUser} from '_platform/auth';

export default class ContrastStep extends Component {

	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
			quantityMap: {},
			user: null,
		};
	}

	render() {
		const {contrasts = [], actions: {toggleStep}} = this.props;
		const user = getUser();
		return (
			<div>
				<Table dataSource={contrasts} columns={this.columns}
					   rowKey="key" className="clearfix"/>
				<Row>
					<Col span={8}>
						<span>填报人:</span>
						<span>{`${user.name} ${user.org}`}</span>
					</Col>
					<Col span={8}>
						<span>审核人:</span>
						<span>
							<Cascader options={this.getUserOptions()}
									  expandTrigger="hover"
									  placeholder="请选择审核人"
									  value={this.state.user}
									  onChange={this.changeUser.bind(this)}
									  displayRender={ContrastStep.displayRender}/>
						</span>
					</Col>
					<Col span={8} style={{textAlign: 'right'}}>
						<Button onClick={toggleStep.bind(this, -1)}>上一步</Button>
						<Button onClick={this.submit.bind(this)}>提交</Button>
					</Col>
				</Row>
			</div>
		);
	}

	componentDidMount() {
		const {getUsers} = this.props.actions;
		getUsers();
	}

	getUserOptions() {
		const {users = []} = this.props;
		return users.map(u => {
			return {
				label: u.key,
				value: u.key,
				children: u.org.map(o => {
					const account = o.account || {};
					return {
						label: account.person_name,
						value: o.id,
					};
				}),
			};
		});
	}

	changeUser(value) {
		this.setState({
			user: value,
		});
	}

	edit(item) {
		const {reloadQuantifier} = this.props.actions;
		const {quantityMap} = this.state;
		quantityMap[item.name] = {
			bidQuantity: item.bidQuantity || '',
			pBidQuantity: item.pBidQuantity || '',
		};
		this.setState({
			quantityMap,
		});
		item.editing = true;
		reloadQuantifier();
	}

	changeQuantity(item, name, event) {
		event.preventDefault();
		const {quantityMap} = this.state;
		const quantity = quantityMap[item.name];
		quantity[name] = event.target.value;
		this.setState({
			quantityMap,
		});
	}

	save(item) {
		const {reloadQuantifier} = this.props.actions;
		const {quantityMap} = this.state;
		const quantity = quantityMap[item.name];
		item.bidQuantity = quantity.bidQuantity;
		item.pBidQuantity = quantity.pBidQuantity;
		item.editing = false;
		item.bidSum = item.unit_price * quantity.bidQuantity / 10000;
		reloadQuantifier();
	}

	close(item) {
		const {reloadQuantifier} = this.props.actions;
		const {quantityMap} = this.state;
		const quantity = quantityMap[item.name];
		quantity.bidQuantity = '';
		quantity.pBidQuantity = '';
		this.setState({
			quantityMap,
		});
		item.editing = false;
		reloadQuantifier();
	}

	getNextUser() {
		let nextUser = null;
		const {users = []} = this.props;
		const [, id] = this.state.user;
		users.forEach(({org}) => {
			const next = org.find(u => +u.id === +id);
			if (next) {
				nextUser = next;
			}
		});
		return {
			id: nextUser.id,
			username: nextUser.username,
		};
	}

	static getCurrentUser() {
		const {id, username} = getUser();
		return {id: +id, username};
	}

	submit() {
		const {
			actions: {postNotice, createFlow, addActor, commitFlow, startFlow, putFlow},
			contrasts, param, currentNode = {}, items = [],
		} = this.props;

		const {name, code, ...arg} = param;
		const nextUser = this.getNextUser();
		const currentUser = ContrastStep.getCurrentUser();
		if (!nextUser) {
			message.error('请先选择审核人');
			return;
		}
		postNotice({}, {
			name: name,
			code: code,
			obj_type: 'C_DOC',
			profess_folder: {code: currentNode.code, obj_type: 'C_DIR'},
			extra_params: {...arg, contrasts, items},
		}).then(rst => {
			const {pk} = rst;
			if (pk) {
				createFlow({}, {
					name: '图纸报审',
					description: '图纸报审流程',
					subject: [{'id': rst.pk, 'name': name}],
					workflow: 5,
					creator: currentUser,
					plan_start_time: moment().format('YYYY-MM-DD'),
					deadline: null,
				}).then(instance => {
					const {id, workflow: {states = []} = {}} = instance;
					const [{id: state_id, actions: [action]}, {id: next_id}] = states;
					Promise.all([
						addActor({ppk: id, pk: state_id}, {
							participants: [currentUser],
							remark: 'testest',
						}),
						addActor({ppk: id, pk: next_id}, {
							participants: [nextUser],
							remark: 'testest',
						}),
					]).then(() => {
						commitFlow({pk: id}, {
							creator: currentUser,
						}).then(() => {
							startFlow({pk: id}, {
								creator: currentUser,
							}).then(() => {
								putFlow({pk: id}, {
									'state': state_id,
									'executor': currentUser,
									'action': action,
									'note': '同意',
									'attachment': null,
								});
								message.success('图纸报审流程提交成功');
							});
						});
					});
				});
			} else {
				message.error('文档报错失败');
			}

		});
	}

	columns = [
		{
			title: '编号',
			dataIndex: 'index',
		}, {
			title: '项目名称',
			dataIndex: 'name',
		}, {
			title: '单位',
			dataIndex: 'unit',
		}, {
			title: '招标工程量',
			render: (item) => {
				const {quantityMap} = this.state;
				const quantity = quantityMap[item.name];
				if (item.editing) {
					return <Input value={quantity.bidQuantity}
								  onChange={this.changeQuantity.bind(this, item,
									  'bidQuantity')}/>;
				} else {
					return item.bidQuantity;
				}
			},
		}, {
			title: '投标工程量',
			render: (item) => {
				const {quantityMap} = this.state;
				const quantity = quantityMap[item.name];
				if (item.editing) {
					return <Input value={quantity.pBidQuantity}
								  onChange={this.changeQuantity.bind(this, item,
									  'pBidQuantity')}/>;
				} else {
					return item.pBidQuantity;
				}
			},
		}, {
			title: '投标单价(元)',
			dataIndex: 'unit_price',
		}, {
			title: '投标投资（万元）',
			dataIndex: 'bidSum',
		}, {
			title: '技施图纸工程量(系统)',
			dataIndex: 'quantity',
		}, {
			title: '技施图纸工程量(预留随机)',
			dataIndex: 'techQuantity',
		}, {
			title: '技施投资（万元）',
			dataIndex: 'techSum',
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
					];
				}
			},
		}];

	static displayRender(label) {
		return label[label.length - 1];
	}
};


