import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Alert } from 'antd';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';
import PkCodeTree from '../components/PkCodeTree';
import reducer, { actions } from '../store/riskEvaluation';
import Button from "antd/es/button/button";
import AddDirPanel from "../components/RiskEvaluation/AddDirPanel";
import DelDirPanel from "../components/RiskEvaluation/DelDirPanel";
export const Datumcode = window.DeathCode.SAFETY_FXPJ;

@connect(
	state => {
		const {
			project: {
				riskEvaluation = {}
			} = {},
			platform 
			} = state;
			return {...riskEvaluation, platform};
		},
	dispatch => ({
		actions: bindActionCreators(
			{
				...actions, ...platformActions
			},
			dispatch
		)
	})
)

export default class RiskEvaluation extends Component {
	
	static propTypes = {};
	constructor(props){
		super(props);
		this.state = {
			hidden:{
				'margin-right':"8px",
				'visibility':"hidden",
			},
			show:{
				'margin-right':"8px",
				'visibility':"visible",
			},
			data:""
		}
	}
	state={
		addOrDel:'NOR',
		hadSelectDir: false,
	};

	selectStandardDir(value=[],node) {
		console.log(node)
		let data = node.node.props.data[0].children ? node.node.props.data[0].children : "undefined";
		this.setState({
			data:data
		})
		this.setState({hadSelectDir: true});
		const [code] = value;
        const {actions:{setcurrentcode,savecode,setcurrentpk,refreshPanelTo}} = this.props;
		if(code === undefined){
			setcurrentcode(code);
			setcurrentpk(code);
			savecode(code);
			refreshPanelTo('NOR')
		}else {
			console.log(code.split("--")[1]);
			setcurrentcode(code.split("--")[1]);
			setcurrentpk(code.split("--")[0]);
			savecode(code);
			refreshPanelTo('NOR')
		}
	}


	render() {
		console.log(this.props)
		const
			{
				worktree = [],
				adddelpanel='NOR',
				keycode =[]
			} = this.props;

		const
			{
				hadSelectDir
			} = this.state;
			
		let { actions:{refreshPanelTo}} = this.props;

		return (

			<div>
				<DynamicTitle title="危险源风险评价" {...this.props} />
				<Sidebar>
					<div style={{borderBottom: 'solid 1px #999', paddingBottom: 8,}}>
						<Button style={this.state.data === "undefined" ? this.state.hidden : this.state.show} onClick={() => {refreshPanelTo('ADD');}}>新增目录</Button>
						<Button onClick={() => {refreshPanelTo('DEL');}}>删除目录</Button>
					</div>
					<PkCodeTree treeData={workTree}
					            selectedKeys={keycode}
					            onSelect={this.selectStandardDir.bind(this)} />
				</Sidebar>
				<Content>
				{adddelpanel==='NOR'?
					null:adddelpanel==='ADD'?
						<AddDirPanel {...this.props }/>:hadSelectDir?
							<DelDirPanel {...this.props }/> : <Alert message='请在左侧选择需要删除的目录' type='error' closable />}
				</Content>			
			</div>
		);
	}

	componentDidMount() {
	    const {actions: {getworkTree,savepk,addDir}} = this.props;
		getworkTree({code:Datumcode}).then(rst=>{
			if(!rst.pk){
				addDir({},{
					"status": "A",
					"obj_type": "C_DIR",
					"code":Datumcode,
					"name": "制度规范",
					"basic_params": {
						"permitted_orgs": [],
						"model_name": ""
					}
				}).then(rst=>{
					savepk(rst.pk);
				});
			}else{
				savepk(rst.pk);	
			}
			});
		
		
	}
}
