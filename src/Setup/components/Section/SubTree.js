import React, {Component} from 'react';
import {Tree, Row, Col, Button, Input, message, Spin} from 'antd';
import './SubTree.css'

const TreeNode = Tree.TreeNode;
const Search = Input.Search;
let rst = [];
export default class SubTree extends Component {
	constructor(props){
		super(props);
		this.state = {
			spin: true
		}
	}
	componentWillReceiveProps(nextProps){
		const {wbsProjectList = []} = nextProps;
		if (wbsProjectList.length !== 0) {
			this.setState({
				spin:false
			})
		}
	}
	//选中左侧树中node节点
	onSelect(code, node) {
		console.log(node)
		if (code.length === 0) {
			return
		}
		const {actions: {setSelectWbsProjectAc,setTableDataAc,setNodeType},wbsProjectList=[]} = this.props;
		setSelectWbsProjectAc(code[0]);
		rst = [];
		let tableList=[SubTree.checkLoop(wbsProjectList, code[0].split('--')[0])];
		setTableDataAc(tableList)
	}

	//搜索
	searchKeyword(keyword) {
		const {actions: {searchToggleAc, searchWbsProjectAc, searchUnit_s, searchItem}} = this.props;
		if (keyword !== '') {
			searchToggleAc(true);
			// 搜索分部
			searchWbsProjectAc({keyword: keyword});
			// 搜索子分部
			searchUnit_s({keyword: keyword});
			// 搜索分项
			searchItem({keyword: keyword});
		} else {
			this.closeSearch();
		}
	}
	//关闭搜索
	closeSearch(){
		const {actions: {searchToggleAc}} = this.props;
		searchToggleAc(false);
		//TODO 清空内容
		this.refs.keyword.input.refs.input.value=''
	}
	//查询数据
	static checkLoop = (list, checkCode) => {
		list.find((item = {}) => {
			const {code, children = []} = item;
			if (code === checkCode) {
				rst = item;
			} else {
				const tmp = SubTree.checkLoop(children, checkCode);
				if (tmp) {
					rst = tmp;
				}
			}
		});
		return rst;
	};
	render() {
		const {wbsProjectList = [], searchWbsList = [], searchUnit_sList = [], searchItemList = [], selectWbsProject, searchVisible = false} = this.props;
		let searchList = [...searchWbsList, ...searchUnit_sList, ...searchItemList];
		return (
			<div>
				<Row>
					<Col span={24}>
						<div style={{borderBottom: 'solid 1px #999', paddingBottom: 5, marginBottom: 20}}>
							单位工程WBS结构
						</div>
					</Col>
					<Col>
						<Search
							ref="keyword"
							placeholder="请输入分部或分项关键字"
							onSearch={this.searchKeyword.bind(this)}
						/>
					</Col>
				</Row>
				<div className={searchVisible ? '' : 'hide-content'} style={{position:'relative'}}>
					<div style={{textAlign:'right',padding:'5px 0'}}>
						<Button onClick={this.closeSearch.bind(this)}>关闭搜索</Button>
					</div>

					{
						searchList.length > 0 ? (
							<Tree className='global-tree-list' showLine
								  selectedKeys={[selectWbsProject]} onSelect={this.onSelect.bind(this)}>
								{
									SubTree.loop(searchList)
								}
							</Tree>
						) : <div className='global-tree-list'>暂无结果</div>
					}
				</div>
				<Spin spinning = {this.state.spin}>
					<Tree className={searchVisible ? 'global-tree-list hide-content' : 'global-tree-list'} showLine
						selectedKeys={[selectWbsProject]} onSelect={this.onSelect.bind(this)}>
						{
							SubTree.loop(wbsProjectList)
						}
					</Tree>
				</Spin>
			</div>

		);
	}
	//过滤掉工程部位数据【itm=>itm.obj_type !== 'C_WP_LOC'】
	static loop(data = []) {
		return data.map((item) => {
			if(item.obj_type ==='C_WP_CEL'){
				   return;
				}else{
					return (
						<TreeNode
							data = {item}
							key={`${item.code}--${item.name}--${item.obj_type}`}
							title={`${item.code} ${item.name}`}
							obj_type={`${item.obj_type}`}
						 >
							{
								SubTree.loop(item.children)
							}
						</TreeNode>
					)
				}
			return <TreeNode key={`${item.code}--${item.name}`}
							 title={`${item.code} ${item.name}`}
							 obj_type = {`${item.obj_type}`}
					 />;
		});
	};
}
