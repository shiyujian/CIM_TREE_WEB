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
		const {actions:{getDocuments,getProject}} = this.props;
		if (code.length === 0) {
			return
		}
		let projectInfo = {};
		const {projectList=[],actions: {setSelectProjectAc,getInstanceAc}} = this.props;
		console.log("code:",code);
		getProject({code:code[0].split('--')[0]}).then(rst => {
			getDocuments({code: code[0].split('--')[0]+"REL_DOC_A"}).then(rst1 => {
				if (rst1 && rst1.code) {
					projectInfo.code = code[0].split('--')[0]
					projectInfo.extra_params.desc = rst1.extra_params.intro;
					projectInfo.extra_params.images = rst1.basic_params.files[1];
					projectInfo.extra_params.file_info = rst1.basic_params.files[0];
				}else{
					projectInfo.code = code[0].split('--')[0]
					projectInfo.extra_params.desc = rst.extra_params.desc;
					projectInfo.extra_params.images = rst.extra_params.images
					projectInfo.extra_params.file_info = rst.extra_params.file_info;
				}
				console.log("projectInfo:",projectInfo);
			})
		})
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
							<Button onClick={this.addProject.bind(this)}>新建</Button>
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
