import React, {Component} from 'react';
import {Tree, Row, Col, Button, Input, message, Spin} from 'antd';
import './SubTree.css'

const TreeNode = Tree.TreeNode;
const Search = Input.Search;

export default class SubTree extends Component {
	constructor(props){
		super(props);
		this.state = {
			spin:true
		}
	}
	componentWillReceiveProps(nextProps){
		const {projectList = []} = nextProps;
		if (projectList.length != 0) {
			this.setState({
				spin:false
			})
		}
	}
	//选中项目
	onSelect(code) {
		if (code.length === 0) {
			return
		}
		const {projectList=[],actions: {setSelectProjectAc,getInstanceAc}} = this.props;
		setSelectProjectAc(code[0]);
	}
	//
	addProject() {
		const {actions: {toggleModalAc}} = this.props;
		toggleModalAc({
			type: "ADD",
			visible: true
		})
	}

	//搜索,通过传入关键字到后台搜索结果
	searchKeyword(keyword) {
		const {actions: {searchToggleAc, searchProjectAc}} = this.props;
		if (keyword !== '') {
			searchToggleAc(true);
			searchProjectAc({keyword: keyword});
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
	render() {
		const {projectList = [], selectList = [], selectProject, searchVisible = false} = this.props;
		return (
			<div>
				<Row>
					<Col span={24}>
						<div style={{borderBottom: 'solid 1px #999', paddingBottom: 5, marginBottom: 20}}>
							<Button onClick={this.addProject.bind(this)}>新建单位</Button>
						</div>
					</Col>
					<Col>
						<Search
							ref="keyword"
							placeholder="请输入项目关键字"
							onSearch={this.searchKeyword.bind(this)}
						/>
					</Col>
				</Row>
				<div className={searchVisible ? '' : 'hide-content'} style={{position:'relative'}}>
					<div style={{textAlign:'right',padding:'5px 0'}}>
						<Button onClick={this.closeSearch.bind(this)}>关闭搜索</Button>
					</div>

					{
						selectList.length > 0 ? (
							<Tree className='global-tree-list' showLine defaultExpandAll={true}
								  selectedKeys={[selectProject]} onSelect={this.onSelect.bind(this)}>
								{
									SubTree.loop(selectList)
								}
							</Tree>
						) : <div className='global-tree-list'>暂无结果</div>
					}
				</div>
					<Tree className={searchVisible ? 'global-tree-list hide-content' : 'global-tree-list'} showLine
						defaultExpandAll={true}
						selectedKeys={[selectProject]} onSelect={this.onSelect.bind(this)}>
						{
							SubTree.loop(projectList)
						}
					</Tree>
				</div>

		);
	}

	static loop(data = []) {
		return data.map((item) => {
			if (item.children && item.children.length) {
				return (
					<TreeNode key={`${item.code}--${item.name}`}
							  title={`${item.code} ${item.name}`}>
						{
							SubTree.loop(item.children)
						}
					</TreeNode>
				);
			}
			return <TreeNode key={`${item.code}--${item.name}`}
							 title={`${item.code} ${item.name}`}/>;
		});
	};
}
