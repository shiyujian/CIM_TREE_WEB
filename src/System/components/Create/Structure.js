import React, { Component } from 'react';
import { Radio, Checkbox, Button, Row, Col, Popover, Icon, message } from 'antd';
import Card from '_platform/components/panels/Card';
import CodeStructure from '_platform/components/panels/CodeStructure';
import queryString from 'query-string';


const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const CheckboxGroup = Checkbox.Group;

export default class Structure extends Component {

	render() {
		const { create: { fields = [], codeGroups = [], sidebar = {}, codeGroupStructure = {} } = {}, location } = this.props;
		const { type = 1 } = sidebar;
		const { struct = [] } = sidebar;
		const values = struct.map(s => s._id);
		const { independent = '0' } = queryString.parse(location.search) || {};

		return (
			<div style={{ marginTop: 20 }}>
				<Card title="创建编码结构">
					<Row gutter={12}>
						<Col span={6} style={{ padding: '10px 20px' }}>
							<div style={{ textAlign: 'center', marginBottom: 20 }}>
								<RadioGroup onChange={this.toggleType.bind(this)} value={type} style={{ width: "100%" }}>
									<RadioButton value={1} style={{ width: "50%" }} >字段</RadioButton>
									<RadioButton value={2} style={{ width: "50%" }} >编码组</RadioButton>
								</RadioGroup>
							</div>
							<CheckboxGroup onChange={this.appendNode.bind(this)} value={values}>
								{
									type === 1 && fields.map(field => {
										return (
											<div key={field._id}>
												<Checkbox value={field._id} style={{ lineHeight: '24px' }}>
													{field.name}
												</Checkbox>
											</div>);
									})
								}
								{
									type === 2 && codeGroups.map(codeGroup => {
										const content = (
											<div>
												<CodeStructure dataSource={codeGroupStructure} disabled />
											</div>);
										return (
											<div key={codeGroup._id}>
												<Checkbox key={codeGroup._id} value={codeGroup._id} style={{ lineHeight: '24px' }}>
													{codeGroup.name}
												</Checkbox>
												<Popover content={content} placement="right" trigger="click">
													<a onClick={this.check.bind(this, codeGroup.name)}>查看</a>
												</Popover>
											</div>);
									})
								}
							</CheckboxGroup>
						</Col>
						<Col span={18}>
							<div style={{ fontSize: 14 }}>编码结构</div>
							<div id="box" style={{ border: '1px solid #e9e9e9', minHeight: 58 }}>
								{
									struct.map((item, index) => {
										return <span style={{
											display: 'inline-block',
											height: 32,
											width: 120,
											margin: '12px 24px',
											backgroundColor: '#e9e9e9',
											textAlign: 'center',
											lineHeight: '32px',

										}} key={index}
											onDrop={this.ondrop.bind(this, index)}
											onDragOver={this.ondragover.bind(this)}
											draggable={true}
											onDragStart={this.ondragstart.bind(this, index)}>


											{item.name}
											<Icon onClick={this.cancel.bind(this, item)} type="close"
												style={{
													fontSize: 16,
													float: 'right',
													marginRight: 12,
													lineHeight: '32px',
													color: '#108ee9',
													cursor: 'pointer'
												}} /></span>
									})
								}

							</div>
						</Col>
					</Row>
				</Card>
				<div style={{ textAlign: 'right' }}>
					<Button onClick={this.back.bind(this)} type="primary" style={{ marginRight: 24 }}>上一步</Button>
					<Button onClick={this.save.bind(this)} type="primary" >
						{independent === '0' ? '保存' : '下一步'}
					</Button>

				</div>
			</div>);
	}

	ondragover(e) {

		e.preventDefault();
	}

	ondragstart(index, e) {
		this.setState({
			startindex: index
		})
	}
	ondrop(index, e) {
		const {
			create: {  sidebar: {  struct = [] } = {} } = {},
			actions: { changeSidebarField}
		} = this.props;
		e.preventDefault();
		const { startindex } = this.state;
		if (startindex != index) {

			let data = struct[startindex];
			struct.splice(startindex, 1);
			struct.splice(index, 0, data);
		    changeSidebarField('struct', struct);
		}
	}

	back() {
		const {
			create: { sidebar = {} } = {}, location = {}, history,
			actions: { postCodeGroupStructure, changeSidebarField, clearSidebarField, saveFlag },
		} = this.props;
		const { create: { nameInde } } = this.props;
		history.replace(`/system/code/create`);

	}

	removeField(name) {
		const {
			actions: { deleteField }
		} = this.props;
		deleteField({ name });
	}

	check(name, event) {
		event.preventDefault();
		const { actions: { getCodeGroupStructure } } = this.props;
		getCodeGroupStructure({}, { name, code_type: name })
	}

	remove(name) {
		const {
			actions: { deleteCodeGroup }
		} = this.props;
		deleteCodeGroup({ name })
	}

	componentDidMount() {
		const {
			create: { sidebar = {} } = {},
			actions: { getCodeGroups, getFields }
		} = this.props;
		const { type = 1 } = sidebar;
		if (type === 2) {
			getCodeGroups({}, { is_independent: false });
		} else {
			getFields();

		}
	}

	toggleType(event) {
		const value = event.target.value;

		const { create: { sidebar = {} } = {}, actions: { getCodeGroups, changeSidebarField, getFields } } = this.props;
		const { groupstruct = [],fieldsstruct = [] ,struct = []} = sidebar;
		console.log('a',this.props)
		
			changeSidebarField('type', value);
			if (value === 2) {
				getCodeGroups({}, { is_independent: false });
				changeSidebarField('fieldsstruct',struct)
				changeSidebarField('struct',groupstruct)
			} else {
				getFields();
				changeSidebarField('groupstruct',struct)
				changeSidebarField('struct',fieldsstruct)
			}
		
	}

	appendNode(values) {
		const {
			create: { fields = [], codeGroups = [], sidebar: { type = 1, struct = [] } = {} } = {},
			actions: { changeSidebarField, getCodeGroupStructure }
		} = this.props;
		const segs = values.map(value => {
			if (type === 1) {
				return fields.find(field => field._id === value);
			} else {
				return codeGroups.find(field => field._id === value);
			}
		});
		const value = values.find(value => !struct.some(s => s._id === value));
		console.log(value)
		const currentSeg = segs.find(seg => seg._id === value);
		if (type === 1) {
			changeSidebarField('struct', segs);
		} else {
			if (value) {
				getCodeGroupStructure({}, { name: currentSeg.name, code_type: currentSeg.name }).then((payload = {}) => {
					if (payload) {
						currentSeg.struct = payload;
						changeSidebarField('struct', segs);
					}
				});
			} else {
				changeSidebarField('struct', segs);
			}
		}
	}

	cancel(item) {
		const { create: { sidebar = {} } = {}, actions: { changeSidebarField } } = this.props;
		const { struct = [] } = sidebar;
		const rst = struct.filter(s => s !== item);
		changeSidebarField('struct', rst);
	}

	save() {
		const {
			create: { sidebar = {} } = {}, location = {}, history,
			actions: { postCodeGroupStructure, changeSidebarField, clearSidebarField },
		} = this.props;
		const { code_type = '', independent = '0' } = queryString.parse(location.search) || {};
		const { struct = [], type = 1 } = sidebar;
		let segs = [];
		let struct_type = '';
		if (type === 1) {
			struct_type = 'field';
			segs = struct.map(s => s.name);
		} else {
			struct_type = 'group';
			segs = struct.map(s => {
				const { struct = {} } = s || {};
				// const {detailed_struct: {struct_list} = {}} = struct;
				return {
					ref_struct_id: struct._id,
					code_type_name: struct.name,
					struct_name: s.name,
					// code_type: struct.name,
					// struct_list,
				}
			})
		}

		if (!segs.length) {
			message.warn('请选择字段或者编码组');
		} else {
			postCodeGroupStructure({}, { code_type: code_type, name: code_type, struct_type: struct_type, struct: segs }).then(({ code_type }) => {
				if (code_type) {
					clearSidebarField();
					if (independent === '0') {
						history.replace('/system/code');
					} else {
						history.replace(`/system/code/create?current=2&code_type=${code_type}`);
					}
				}
			});
		}
	}

}
