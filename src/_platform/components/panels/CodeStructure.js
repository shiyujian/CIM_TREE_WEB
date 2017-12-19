import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import './CodeStructure.less';
import * as actions from '_platform/store/global/dict';
import onClickOutside from 'react-onclickoutside';

@connect(
	state => {
		const {platform = {}} = state;
		return platform;
	},
	dispatch => ({
		actions: bindActionCreators(actions, dispatch),
	}),
)
@onClickOutside
export default class CodeStructure extends Component {
	static propTypes = {
		dataSource: PropTypes.object,
	};

	constructor(props) {
		super(props);
		this.state = {
			fields: {},
			values: {},
			connections: {},
		};
	}

	dataSource = [];

	componentDidMount() {
		const {dataSource = {}} = this.props;
	}

	componentWillReceiveProps(nextProps) {
		const {dataSource} = this.props;
		const {dataSource: nextDataSource} = nextProps;
		if (dataSource !== nextDataSource) {
		}
	}

	render() {
		const {dataSource = {},children = ''} = this.props;
		
		
		const {code_type = '', all_fields = [],fields_connections, field_restrictions = [], detailed_struct = {}} = dataSource || {};
		const groups = detailed_struct.struct_list || [];
		if (!all_fields.length) return null;
		return (
			<div>
				<table cellPadding="0" cellSpacing="0" className="code-structure">
					<tbody>
					{/* 层级 */}
					<tr>
						<td className="title">层级</td>
						{
							groups.map((group, index) => {
								const count = this.getFieldSize(group);
								return (
									<td key={index} colSpan={count}>{`${index + 1}级`}</td>)
							})
						}
					</tr>
					{
						this.renderGroup(groups)
					}
					{/* 编码类型名称 */}
					{/* <tr>
						<td className="title">编码类型名称</td>
						<td colSpan={all_fields.length}>{code_type}</td>
					</tr> */}
					{/* 字段名称 */}
					<tr>
						<td className="title" width="20%">字段名称</td>
						{
							all_fields.map((field, index) => {
								return <td key={index} width={`${80 / all_fields.length}%`}>{field}</td>
							})
						}
					</tr>
					{/* 字段类型 */}
					<tr>
						<td className="title" width="20%">字段类型</td>
						{
							all_fields.map((field, index) => {
								return <td key={index} width={`${80 / all_fields.length}%`}>{field}</td>
							})
						}
					</tr>
					{
						!!children
						? children
						:  [
							!!fields_connections
							?
								<tr key={1}>
									<td className="title" width="20%" >字段后连接符</td>
									{
										fields_connections.map((field, index) => {
											return <td key={index} width={`${80 / all_fields.length}%`}>{field===''?"无":field===' '?'空格':field}</td>
										})
									}
									<td key={-1} width={`${80 / all_fields.length}%`}>/</td>								
								</tr>
							: null,
							<tr key={2}>
								<td className="title" width="20%" >字符类型</td>
								{
									field_restrictions.map((field, index) => {
										return <td key={index} width={`${80 / all_fields.length}%`}>{field.type}</td>
									})
								}
							</tr>,
							
							<tr key={3}>
								<td className="title" width="20%" >字符位数</td>
								{
									field_restrictions.map((field, index) => {
										return <td key={index} width={`${80 / all_fields.length}%`}>{field.min}-{field.max}</td>
									})
								}
							</tr>,
							<tr key={4}>
								<td className="title" width="20%" >是否可缺省</td>
								{
									field_restrictions.map((field, index) => {
										return <td key={index} width={`${80 / all_fields.length}%`}>{field.nullable ? "是": "否"}</td>
									})
								}
							</tr>]
					}
					
					</tbody>
				</table>
			</div>)

	}

	renderGroup(groups = []) {
		if (!groups.length) return;
		const twoLevel = groups.some(({struct_list: [{code_type} = {}] = []}) => code_type);
		const level = twoLevel ? 2 : 1;
		const tds = [];
		const addedTrs = [];
		groups.forEach((group, index) => {
			const {struct_list = [], code_type: codeType = ''} = group;
			const [{code_type} = {}] = struct_list;
			const count = this.getFieldSize(group);
			if (code_type) {
				tds.push(<td colSpan={count} key={index}>{codeType}</td>);
				struct_list.forEach((item, index) => {
					const c = this.getFieldSize(item);
					addedTrs.push(<td key={index} colSpan={c}>{item.code_type}</td>)
				});
			} else if (codeType) {
				tds.push(<td colSpan={count} rowSpan={level} key={index}>{codeType}</td>);
			}

		});

		if (addedTrs.length) {
			return [
				<tr key="1">
					<td className="title" rowSpan={level}>编码组名称</td>
					{tds}
				</tr>,
				<tr key="2">{addedTrs}</tr>
			]
		} else if (tds.length) {
			return (
				<tr>
					<td className="title" rowSpan={level}>编码组名称</td>
					{tds}
				</tr>)
		}
	}

	getFieldSize(group, count = 0) {
		const {struct_list = [], code_type} = group || {};
		struct_list.forEach(s => {
			count += this.getFieldSize(s);
		});
		if (!code_type) {
			count++;
		}
		return count;
	}

	getGroupLevel() {

	}

	handleClickOutside(event) {
		if (event.target.className.indexOf('select-dropdown') > 0) return;
		const {onClose} = this.props;
		onClose && onClose();
	}
}
