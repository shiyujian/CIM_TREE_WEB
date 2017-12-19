import React, { Component } from 'react';
import { Radio, Button, Input, Popconfirm } from 'antd';
import { Icon } from 'react-fa';
import { Link } from 'react-router-dom';
import Card from '_platform/components/panels/Card';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const Search = Input.Search;
export default class Type extends Component {
	render() {
		const { code: { codeGroups = [], sidebar = {} } = {} } = this.props;
		const { type = 1, codeGroup } = sidebar;
		return (
			<Card title="编码类型" extra={
				<Link to="/system/code/create">
					<Button type="primary" style={{ backgroundColor: '#169BD5' }}>新建类型</Button>
				</Link>}>
				<div style={{ marginBottom: 16 }}>
					<RadioGroup onChange={this.toggleType.bind(this)} value={type}>
						<RadioButton value={1}>独立类型</RadioButton>
						<RadioButton value={2}>编码组类型</RadioButton>
						<Search style={{ width: '88%', marginTop: '20px' }} />
					</RadioGroup>
				</div>
				<div>
					<RadioGroup onChange={this.toggleCodeGroup.bind(this)} value={codeGroup}>
						{
							codeGroups.map((codeGroup, index) => {
								return (
									<div key={index} style={{
										position: 'relative',
										marginBottom: 20

									}}>
										<Radio key={codeGroup._id} value={codeGroup.name} style={{ display: 'block' }}>
											{codeGroup.name}
										</Radio>
										<Popconfirm
											title={`删除 ${codeGroup.name}?`}
											onConfirm={this.onDelCodegroup.bind(this, codeGroup.name)}
											okText="是"
											cancelText="否"
										>
											<Icon
												style={{ position: 'absolute', left:150, top: 5 }}
												name="close"
											/>
										</Popconfirm>
									</div>
								);

							})
						}
						{/* {
							codeGroups.map(codeGroup => {
								return (
									<a key={codeGroup._id} value={codeGroup.name} style={{display: 'block'}} onClick={this.remove.bind(this, codeGroup.name)}>
										{codeGroup.name}删除
									</a>);
							})
						} */}
					</RadioGroup>
				</div>
			</Card>
		);
	}


	remove(name) {
		const { actions: { deleteCodeGroup } } = this.props;
		deleteCodeGroup({ name: name })
	}

	toggleType(event) {
		const value = event.target.value;
		const { actions: { changeSidebarField } } = this.props;
		changeSidebarField('type', value);
		this.getCodeGroups(value);
	}

	toggleCodeGroup(event) {
		const value = event.target.value;
		const { actions: { changeSidebarField, getCodeGroupStructure } } = this.props;
		changeSidebarField('codeGroup', value);
		getCodeGroupStructure({}, { name: value, code_type: value })
		.then( rst=>{
			console.log('rst',rst)
		})
	}

	componentDidMount() {
		const { create: { sidebar = {} } = {} } = this.props;
		const { type = 1 } = sidebar;
		this.getCodeGroups(type);
	}

	getCodeGroups(type) {
		const { actions: { getCodeGroups, changeSidebarField, getCodeGroupStructure } } = this.props;
		getCodeGroups({}, { is_independent: type === 1 }).then(rst => {
			const { results: [first = {}] = [] } = rst;
			if (first && first.name) {
				changeSidebarField('codeGroup', first.name);
			}
			return first
		}).then(codeGroup => {
			const { name } = codeGroup || {};
			if (name) {
				getCodeGroupStructure({}, { name: name, code_type: name })
				
			}
		})
	}

	onDelCodegroup(name) {
		const { actions: { deleteCodeGroup, getCodeGroups } } = this.props;
		// console.log(this.props)
		console.log(name)
		deleteCodeGroup({ name: name })
			.then(() => {
				getCodeGroups();
			});
	}
}
