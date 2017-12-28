import React, {Component} from 'react';
import {Tree, Row, Col, Button, Input, message, Spin} from 'antd';
import './SubTree.css'

const TreeNode = Tree.TreeNode;
const Search = Input.Search;

export default class SubTree extends Component {
	constructor(props){
		super(props);
		this.state = {
			spin:true,
			show:false
		}
	}
	// 当组件传入的props发生变化时调用
	componentWillReceiveProps(nextProps){
		const {unitList} = nextProps;
		this.setState({
			spin:false
		})
	}
	//选中项目
	async onSelect(code,p2) {
		console.log("p2:",p2)
		console.log("code:",code)
		if (code.length === 0) {
			return;
		}
		this.setState({show:true});		
		let{getWorkpackageByPk,getOrgTreeReverseByCode,setCAnJianList,setCanCreate} = this.props.actions;
		if(p2.node.props.data.obj_type_hum==='单位工程'||p2.node.props.data.obj_type_hum==='子单位工程'){
			let wpk = await getWorkpackageByPk({pk:p2.node.props.data.pk});
			let units = wpk.extra_params.unit||[];
			console.log(units)
			for(let i = 0;i<units.length;i++){
				let orgRoot = await getOrgTreeReverseByCode({code:units[i].code});
				units[i].type =orgRoot.children[0]?orgRoot.children[0].name:'组织机构';
			}
			setCAnJianList(units);
		}
		if(p2.node.props.data.obj_type_hum==='单位工程'){
			let childs = p2.node.props.data.children;
			if(childs.length>0)
			{
				if(childs.some(ele=>{
					return ele.obj_type_hum === '分部工程'
				}))
				{
					this.setState({show:false});
				}
			}
		}
		const {unitList=[],actions: {setSelectUnitAc,getInstanceAc}} = this.props;
		setSelectUnitAc(code[0]);
		console.log(p2.node.props)
		if (p2.node.props.children && p2.node.props.obj_type.indexOf("C_WP_PTR") > -1) {
			// 此时不能创建子单位工程
			setCanCreate(false);
		}else{
			setCanCreate(true);
		}
	}
	static checkLoop = (list, checkCode) => {
		let rst = null;
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
	//新增单位工程或子单位工程
	addUnit() {
		const {actions: {toggleModalAc}} = this.props;
		toggleModalAc({
			type: "ADD",
			visible: true
		})
	}

	//搜索
	searchKeyword(keyword) {
		const {actions: {searchToggleAc, searchUnitAc}} = this.props;
		if (keyword !== '') {
			searchToggleAc(true);
			searchUnitAc({keyword: keyword});
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
	//获取当前点击的obj_type
	_getType(obj_type, canCreate){
		console.log("65456:",canCreate);
		if (!canCreate) {
			return ;
		}
		switch(obj_type){
			case 'C_PJ':
				return '新建单位工程';
				break;
			case 'C_WP_UNT':
				return '新建子单位工程';
				break;
			default:
				return null;
		}
	}
	//获取新建的内容
	render() {
		const {unitList = [], searchList = [], selectUnit, searchVisible = false, canCreate = false} = this.props;
		
		return (
			<div>
				<Row>
					<Col span={24}>
						<div style={{borderBottom: 'solid 1px #999', paddingBottom: 5, marginBottom: 20}}>
							{
								selectUnit && this._getType(selectUnit.split('--')[2], canCreate) && 
									<Button 
									// style = {this.state.show?{display:'block'}:{display:'none'}} 
									onClick={this.addUnit.bind(this)}>
										{this._getType(selectUnit.split('--')[2], canCreate)}
									</Button>
								
							}
						</div>
					</Col>
					<Col>
						<Search
							ref="keyword"
							placeholder="请输入单位工程关键字"
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
							<Tree
								 className='global-tree-list' showLine defaultExpandAll={false}
								  selectedKeys={[selectUnit]} onSelect={this.onSelect.bind(this)}>
								{
									SubTree.loop(searchList)
								}
							</Tree>
						) : <div className='global-tree-list'>暂无结果</div>
					}
				</div>
				<Spin spinning = {this.state.spin}>
					<Tree className={searchVisible ? 'global-tree-list hide-content' : 'global-tree-list'} showLine
						defaultExpandAll={false}
						selectedKeys={[selectUnit]} onSelect={this.onSelect.bind(this)}>
						{
							SubTree.loop(unitList)
						}
					</Tree>
				</Spin>
			</div>

		);
	}

	static loop(data = []) {

		return data.map((item) => {
			if (item.obj_type === 'C_WP_PTR') {
				return;
			}
			else {
				return (
					<TreeNode
						data={item}
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

			return <TreeNode
				data={item}
				key={`${item.code}--${item.name}--${item.obj_type}`}
				title={`${item.code} ${item.name}`}
				obj_type={`${item.obj_type}`}
			/>;
		});
	};
}
