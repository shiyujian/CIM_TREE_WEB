import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import { Button,Tree,Input,Switch, Modal,Row,Col,Form,message,Popconfirm } from 'antd';
import {bindActionCreators} from 'redux';
import {Icon} from 'react-fa';


import * as flowActions from '../store/workflow';

import {base} from '../../../api';


import NewTemplateModal from '../components/NewTemplateModal';
import TemplateTree from '../components/TemplateTree';
import DynamicTabs from '../components/DynamicTabs';
import CloseEditConfirm from '../components/CloseEditConfirm';

import styles from './styles.css';

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const confirm = Modal.confirm;

@connect(
	state=>({}),
	dispatch => {
		return {
			flowActions: bindActionCreators(flowActions,dispatch)
		}
	}
)
class Flow extends Component {

	constructor(props) {
		super(props);
		this.state = {
			list:{},
			select_id:'',
			isNewTemplateModalVisible:false,
			btn_loading:false,
			tabs: [],
			activeKey: '',
			isCloseEditConfirmVisible: false, // 关闭 Tab时弹出
			closeEditContent: '', // Tab Modal content
			deleteTabKey: '', // delete Tabkey
			deletable: true, // 该flow是否可以 删除
		}
	}

	componentDidMount(){
		this.getList();
	}

	getWorkflowAPI() {
		// let system = JSON.parse(window.localStorage.getItem('USER_DATA'));
  //       let Workflow_API = '';
  //       const System_API = API_CONFIG.Workflow_API;
  //       for(var i=0;i<System_API.length;i++){
  //           if(system.system === System_API[i].name){
  //               Workflow_API = System_API[i].value;
  //           }
  //       }

        return base;
	}

	getList() {
		const { getTemplate }  = this.props.flowActions;


	  	const Workflow_API = this.getWorkflowAPI();

		// 获取 可编辑的与不可编辑的 template
		const requestArray = [];
		
		requestArray.push(getTemplate({
				Workflow_API: Workflow_API,
				status: 0
			}));

		requestArray.push(getTemplate({
				Workflow_API: Workflow_API,
				status: 1
			}));


		return Promise.all(requestArray).then(resp => {

				this.setState({
					list:{
						editableTemplates: resp[0],
						uneditableTemplates: resp[1]
					}
					
				})
			});
	}

	//模板选择
	onSelect = ([id]) =>{
		if(id && id !=0) {
			const {
				list: {
					editableTemplates = [],
					uneditableTemplates=[]
				},
				tabs
			} = this.state;

			let currTemplate = editableTemplates.find(item => item.id == id);
			if(!currTemplate) {
				currTemplate = uneditableTemplates.find(item => item.id == id);
				this.setState({
					deletable: false,
					select_id: id,
					selectedKeys: [String(id)]
				});
			} else {
				this.setState({
					deletable: true,
					select_id: id,
					selectedKeys: [String(id)]
				});
			}


			// 是否已经存在
			// const alreadyExist = tabs.findIndex(item => item.id == id);

			// if(alreadyExist !== -1) {
			// 	this.setState({
			// 		select_id:id,
			// 		selectedKeys: 
			// 		tabs,
			// 		activeKey: String(alreadyExist)
			// 	});				
			// } else {
			// 	tabs.push({
			// 		title: currTemplate.name,
			// 		id: currTemplate.id
			// 	});
			// 	this.setState({
			// 		select_id:id,
			// 		tabs,
			// 		activeKey:String(tabs.length -1)
			// 	});
			// }
		}

	}

	// open createTemplate Modal
	openCreateNewTemplateModal = () => {
		this.setState({
			isNewTemplateModalVisible: true
		});
	}

	// delete
	handleDel = () => {
		const { updateTemplate } = this.props.flowActions;

		const Workflow_API = this.getWorkflowAPI();

		updateTemplate({
			Workflow_API: Workflow_API,
			pk:this.state.select_id},{status:2}).then(rep=>{
			message.success("删除模板成功");
			this.getList();
			this.setState({
				select_id: ''
			});
		})
	}

	// create new Template flow
	handleCreateTemplateOk = (values) => {

		const { postTemplate } = this.props.flowActions;

		const Workflow_API = this.getWorkflowAPI();

		postTemplate({
			Workflow_API: Workflow_API
		},{status:0,remark:null,position:null,...values}).then(rep=>{
			
			this.setState({isNewTemplateModalVisible:false});
			
			message.success('新增模板成功');
			
			this.getList().then(list => {
				this.onSelect([rep.id]);
			});

		});
	}

	// cancel create Template
	handleCancel = () => {
		this.setState({
			isNewTemplateModalVisible: false
		});
	}


	// DynamicTabs
	handleTabsChange = (targetKey) => {
		const {
			list
		} = this.state;
		const selectId = list[targetKey].id;
		this.setState({
			activeKey: String(targetKey),
			select_id: selectId
		});
	}

	// removeTab
	openCloseRemoveTabModal = (targetKey) => {
		const {
			tabs,
		} = this.state;

		if(targetKey) {

			const tab = tabs[targetKey];

			this.setState({
				isCloseEditConfirmVisible: true,
				closeEditContent: `${tab.title} 已经更改，是否保存改?`,
				deleteTabKey: targetKey,
			});
		}

	}

	// removeTab with Save
	handleCloseTab = () => {
		const {
			deleteTabKey
		} = this.state;
		
		//save

		this.removeTabsByKey(deleteTabKey);


		this.setState({
			isCloseEditConfirmVisible: false
		});
	}

	// force to remove Tab without save
	handleForceCloseTab = () => {

		const {
			deleteTabKey
		} = this.state;

		//
		this.removeTabsByKey(deleteTabKey);

		this.setState({
			isCloseEditConfirmVisible: false,
		});
		
	}

	// cancel close Tab
	handleCancelTab = () => {
		this.setState({
			isCloseEditConfirmVisible: false
		});
	}

	removeTabsByKey = (key) => {
		
		const {
			tabs,
			activeKey
		} = this.state;
		const currKey = parseInt(key);

		tabs.splice(key, 1);
		
		let newActiveKey = parseInt(activeKey);
		if(key === activeKey && key == tabs.length) {
			newActiveKey = activeKey - 1;
		} else if (key < activeKey) {
			newActiveKey = activeKey - 1;
		}

		this.setState({
			activeKey: String(newActiveKey),
			tabs,
			deleteTabKey: ''
		});
	}

	//
	handleEdit = () => {
		const {
			deletable,
			select_id,
		} = this.state;

		const {
			flowActions: {
				putTemplate
			}
		} = this.props;

		const Workflow_API = this.getWorkflowAPI();

		// 是否能 编辑的
		if(deletable) {
			// 可激活
			putTemplate({
				Workflow_API: Workflow_API,
				id: select_id
			}, {
				status: 1
			}).then(resp => {
				message.info("已经激活");
				this.getList().then(result => {
					this.onSelect([select_id]);
				});
			});
		} else {
			// 取消激活
			// putTemplate({
			// 	Workflow_API: Workflow_API,
			// 	id: select_id
			// }, {
			// 	status: 0
			// }).then(resp => {
			// 	message.info("已经取消激活");
			// 	this.getList().then(result => {
			// 		this.onSelect([select_id]);
			// 	});
			// });
		}
	}


	render() {

		const {
			isNewTemplateModalVisible,
			select_id,
			list = {},
			tabs,
			activeKey,
			isCloseEditConfirmVisible,
			closeEditContent,
			deletable,      // 是否可删除,
			selectedKeys=[],
		} =  this.state;

		return (
			<div>
				<Row>
					<Col span={4}>
						<div style={{textAlign:'center',padding:5}}>
							<Button
								size="small"
								onClick={ this.openCreateNewTemplateModal }
								title="添加模板"
								className="btn"
							><Icon name="plus"/></Button>
							{
								deletable && 
							  	<Popconfirm title="确定删除该模板？" onConfirm={this.handleDel} okText="确定" cancelText="取消">
									<Button type="danger" size="small" disabled={!select_id} title="删除模板" className="btn"><Icon name="minus"/></Button>
								</Popconfirm>
							}
							{
								deletable &&
								<Popconfirm title={`确定激活该模板?`} onConfirm={this.handleEdit} okText="是" cancelText="否">
									<Button size="small" disabled={!select_id} title="激活模板" className="btn"><Icon name="flash"/></Button>
								</Popconfirm>	
							}
						</div>
						<div style={{height:950, overflow:'scroll'}}>
							<TemplateTree data={list} selectedKeys={selectedKeys} onSelect={this.onSelect}/>	
						</div>
					</Col>
					<Col span={20}>
						{
							// <DynamicTabs
							// 	tabs={tabs}
							// 	activeKey={activeKey}
							// 	onChange={this.handleTabsChange}
							// 	removeTab={this.openCloseRemoveTabModal}
							// />
						}
						<iframe
							allowFullScreen
							style={{height:1000,width: '100%',flex:1,overflow:'hidden'}}
							src={`/gooflow/index.html?id=${select_id}&serverURL=${encodeURIComponent(base)}`}
							frameBorder="0"
						></iframe>
					</Col>
				</Row>

				<NewTemplateModal
					title="新增流程模板"
					visible={isNewTemplateModalVisible}
					onOk={this.handleCreateTemplateOk}
					onCancel={this.handleCancel}
				></NewTemplateModal>

				<CloseEditConfirm 
					title="是否保存更改"
					visible={isCloseEditConfirmVisible}
					content={closeEditContent}
					okText="是"
					exitText="否"
					cancelText="取消"
					onOk={this.handleCloseTab}
					onExit={this.handleForceCloseTab}
					onCancel={this.handleCancelTab}
				></CloseEditConfirm>

			</div>);
	}

}

export default Flow;
