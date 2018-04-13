import React, {Component} from 'react';
import {Main, Content, Sidebar, DynamicTitle} from '_platform/components/layout';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions, ID} from '../store/cell';
import {PROJECT_UNITS} from '_platform/api';
import {actions as platformActions} from '_platform/store/global';
import PkCodeTree from '../components/PkCodeTree';
import {Table,Chart} from '../components/Score';
import {getUser} from '_platform/auth'
import {Select,Row,Col} from 'antd';

const Option = Select.Option
@connect(
	state => {
		const {quality: {cell = {}}, platform} = state || {};
		console.log(state);
		return {...cell, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)

export default class Search extends Component {
	static propTypes = {};
	biaoduan = [];
	constructor(props){
		super(props)
		this.state = {
			treeList:[],
			sectionList:[]
		}
	}
	render() {

		const {platform:{tree={}}} = this.props;
		let treeList = [];
		if(tree.bigTreeList){
			treeList = tree.bigTreeList
		}
		const { code } = this.state;

		return (
			<Main>
				<DynamicTitle title="质量评分" {...this.props}/>
				<Sidebar>
					<PkCodeTree treeData={treeList}
					            selectedKeys={code}
					            onSelect={this.onSelect.bind(this)}/>
				</Sidebar>
				<Content>
					<Row>
						<Col span={12}>
							<Chart {...this.props} {...this.state}/>
						</Col>
						<Col span={12}>
							<Table {...this.props} {...this.state}/>	
						</Col>
					</Row>
				</Content>
			</Main>
		);
	}

	componentDidMount() {
		this.biaoduan = [];
		for(let i=0;i<PROJECT_UNITS.length;i++){
			PROJECT_UNITS[i].units.map(item => {
				this.biaoduan.push(item);
			})
		}
		const {actions: {getTreeNodeList},platform:{tree = {}}} = this.props;
		if(!tree.bigTreeList){
			getTreeNodeList()
		}
	}
	generateSectionList(sections){
		let sectionList = [];
		sections.map(item => {
			sectionList.push(<Option key={item.code} value={item.code}>{item.value}</Option>)
		})
		return sectionList
	}

	onSelect(value = []) {
		let code = value[0] || ''
		let user = getUser()
		let sections = JSON.parse(user.sections)
		let rst = [];
		if(sections.length === 0){
			rst = this.biaoduan.filter(item => {
				return item.code.indexOf(code) !== -1
			})
		}else {
			rst = this.biaoduan.filter(item => {
				return item.code.indexOf(code) !== -1 && sections.indexOf(item.code) !== -1
			})
		}
		let sectionList = this.generateSectionList(rst)
		this.setState({code,sectionList})
	}
}
