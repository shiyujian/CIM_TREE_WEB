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
			spin:true
		}
	}
	//选中左侧树中node节点
	onSelect(code, node) {
		if (code.length === 0) {
			return;
		}
		
		const {actions: {setSelectWbsProjectAc, setTableDataAc, setCreate, getSectionAc, getLocationOne},wbsProjectList=[],searchWbsList=[]} = this.props;
		setSelectWbsProjectAc(code[0]);
		rst = [];
		let tableList=[SubTree.checkLoop(wbsProjectList, code[0].split('--')[0])];
		setTableDataAc(tableList)
		let canCreate = node.node.props.obj_type === "C_WP_PTR" ? true : false;
		setCreate(canCreate);
		// 点击的是分部
		if (node.node.props.obj_type === "C_WP_PTR") {
			// 获取locations
			tableList = [];
			getSectionAc({code:code[0].split('--')[0]}).then(rst => {
				let promises = rst.locations.map(item => {
					return getLocationOne({code:item.code});
				});
				Promise.all(promises).then(rst=>{
					rst.map(ele=>{
						tableList.push(ele);
					});
					setTableDataAc(tableList)
				});
				
			})
			
		}
	}
	//搜索
	searchKeyword(keyword) {
		const {actions: {searchToggleAc, searchWbsProjectAc}} = this.props;
		if (keyword !== '') {
			searchToggleAc(true);
			searchWbsProjectAc({keyword: keyword});
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
		const {wbsProjectList = [], searchWbsList = [], selectWbsProject, searchVisible = false} = this.props;
		return (
			<div>
				<Row>
					<Col span={24}>
						<div style={{borderBottom: 'solid 1px #999', paddingBottom: 5, marginBottom: 20}}>
							工程部位WBS结构
						</div>
					</Col>
					<Col>
						<Search
							ref="keyword"
							placeholder="请输入工程部位关键字"
							onSearch={this.searchKeyword.bind(this)}
						/>
					</Col>
				</Row>
				<div className={searchVisible ? '' : 'hide-content'} style={{position:'relative'}}>
					<div style={{textAlign:'right',padding:'5px 0'}}>
						<Button onClick={this.closeSearch.bind(this)}>关闭搜索</Button>
					</div>

					{
						searchWbsList.length > 0 ? (
							<Tree className='global-tree-list' showLine
								  selectedKeys={[selectWbsProject]} onSelect={this.onSelect.bind(this)}>
								{
									SubTree.loop(searchWbsList)
								}
							</Tree>
						) : <div className='global-tree-list'>暂无结果</div>
					}
				</div>
					<Tree className={searchVisible ? 'global-tree-list hide-content' : 'global-tree-list'} showLine
						selectedKeys={[selectWbsProject]} onSelect={this.onSelect.bind(this)}>
						{
							SubTree.loop(wbsProjectList)
						}
					</Tree>
			</div>

		);
	}
	//过滤掉子分部数据【itm=>itm.obj_type !== 'C_WP_PTR_S'】
	static loop(data = []) {
		return data.map((item) => {
			if (item.obj_type === "C_WP_PTR_S") {
				return ;
			}
			if (item.children && item.children.length) {
				return (
					<TreeNode key={`${item.code}--${item.name}`}
						title={`${item.code} ${item.name}`}
						obj_type={item.obj_type}
					>
						{
							SubTree.loop(item.children)
						}
					</TreeNode>
				);
			}
			return <TreeNode key={`${item.code}--${item.name}`}
				title={`${item.code} ${item.name}`}
				obj_type={item.obj_type} 
				/>;

		});
	};
}
