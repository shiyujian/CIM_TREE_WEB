import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions, ID} from '../store/item';
import {actions as actions2} from '../store/cells';
import {actions as platformActions} from '_platform/store/global';
import {message,Select,Table,Input,Button,Upload,Modal,Spin,Card} from 'antd';
import {Main, Content, Sidebar, DynamicTitle} from '_platform/components/layout';
import DocTree from '../components/DocTree';
import Approval from '_platform/components/singleton/Approval';
import {Filter, Blueprint} from '../components/Item';
import QualityTree from '../components/QualityTree'
import './common.less'
import {USER_API, SERVICE_API, WORKFLOW_API,JYPMOD_API,UPLOADFILE_API} from '_platform/api';
import EditMod from '../components/HuaFenModal'
import '../../Datum/components/Datum/index.less'

const Option = Select.Option;
const confirm = Modal.confirm;
@connect(
	state => {
		const {item = {}} = state.quality || {};
		return item;
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
		cellActions: bindActionCreators({...actions2}, dispatch),
	}),
)
export default class HuaFen extends Component {

	static propTypes = {};
	constructor(props){
		super(props);
		this.state={
			fenbus:[],
			zifenbus:[],
			fenxiangs:[],
			jianyanpis:[],
			targetFenxiang:null,
			loading:false,
			fileUpLoadAddress:UPLOADFILE_API,
			editing:false,
			editingJYP:null
		};
		this.columns = [
			{
				title: '检验批名称',
				dataIndex: 'name',
			},	{
				title: '创建时间',
				dataIndex: 'time',
			},	{
				title: '编码',
				dataIndex: 'code',
			},
			{
				title:'操作',
				render:(p1,p2)=>{
					console.log(p1,p2);
					return(
					<div>
						<Button
						 onClick = {
							 ()=>{
								this.setState({editing:true,editingJYP:p1});
							 }
						}
						  style = {{margin:'10px'}}>编辑</Button>
						<Button onClick = {()=>{
							let jthis = this;
							confirm({
								title:"是否确认删除？",
								content:`${p1.name}`,
								onOk(){
									let {delJYP} = jthis.props.cellActions;
									delJYP({pk:p1.pk}).then(rst=>{
										console.log('delete',rst);
										jthis.setState({loading:true});
										setTimeout(
											()=>{
												jthis.selectFenxiang(jthis.state.targetFenxiang.pk);
											}
										,500);
										
									});
								},
								onCancel(){}
							})
							/**/
						}} style = {{margin:'10px'}}>删除</Button>
					</div>
					);
				}
			}
		];
	}
	componentDidMount(){
		console.log('context',this.context);
	}
    getOptions(datas){
		let arr = [];
		datas.forEach(ele=>{
			arr.push(<Option value = {ele.pk}>{ele.name}</Option>);
		});
		return arr;
	}
	selectFenbu(fenbu){
		// console.log(fenbu);
		this.setState({loading:true});
		let fenxiangs = [];
		let zifenbus = [];
		let {getUnitTreeByPk} = this.props.cellActions;
		getUnitTreeByPk({pk:fenbu}).then(rst=>{
			this.setState({selectedfenbu:rst,selectedzifenbu:null,targetFenxiang:null,jianyanpis:[]});
			if(rst.children.length>0){
				if(rst.children[0].obj_type ==='C_WP_PTR_S'){
					zifenbus = rst.children;
				}else{
					fenxiangs = rst.children;
				}
			}
			this.setState({fenxiangs:fenxiangs,zifenbus:zifenbus});
			this.setState({loading:false});
		});
	}
	selectZifenbu(zifenbu){
		this.setState({loading:true});
		let {getUnitTreeByPk} = this.props.cellActions;
		let fenxiangs = [];
		getUnitTreeByPk({pk:zifenbu}).then(rst=>{
			this.setState({selectedzifenbu:rst,targetFenxiang:null,jianyanpis:[]});
			console.log(rst);
			if(rst.children.length>0){
				this.setState({fenxiangs:rst.children});
			}
			this.setState({loading:false});
		});

	}
	selectFenxiang(fenxiang){
		this.setState({loading:true});
		let {getUnitTreeByPk} = this.props.cellActions;
		getUnitTreeByPk({pk:fenxiang}).then(rst=>{
			this.setState({targetFenxiang:rst});
			let ret = rst.children;
			ret.forEach((ele)=>{
				delete ele.children;
				if (ele.extra_params.time){
					ele.time = ele.extra_params.time;
				}
			});
			this.setState({jianyanpis:rst.children});
			this.setState({loading:false});
		})
	}
	treeNodeClk(code){
		//console.log(code);
		let [pk,type,] = code[0].split('--');
		//console.log(pk,type);
		let {getUnitTreeByPk} = this.props.cellActions;
		this.setState({loading:true});
		getUnitTreeByPk({pk:pk}).then(rst=>{
			console.log('clk',rst)
			//console.log(rst);
			let fenbus = [];
			rst.children.map(item => {
				if(item.obj_type === "C_WP_UNT_S"){
					fenbus = fenbus.concat(item.children)
				}else{
					if(item.obj_type === "C_WP_PTR"){
						fenbus.push(item);
					}
				}
			});
			this.setState({selectedzifenbu:null,selectedfenbu:null,targetFenxiang:null,jianyanpis:[]});
			this.setState({fenbus:fenbus,fenxiangs:[],zifenbus:[]});
			this.setState({loading:false});
			console.log('fenbus',fenbus);
		});
	}
	codeToString(code){
		let codestr = ''+code;
		let zeros = '';
		for (let i =0;i<6 - codestr.length;i++ ){
			zeros+='0';
		}
		return zeros + code;
	}
	getStartCode(list){
		let code = 0;
		list.forEach(ele=>{
			let arr = ele.code.split('-');
			let elecode = 0;
			if(arr.length>0){
				let temp =arr[arr.length-1];
				if(temp.length === 6){
					let temp2 = Number.parseInt(temp);
					if(temp2>code){
						code = temp2;
					}
				}
			}
		})
		code++;
		console.log(code);
		return this.codeToString(code);
	}
	async addJianYanPi(){
		if(!this.state.targetFenxiang){
			return;
		}
		this.setState({loading:true});
		let {postJianYanPi,codeSearch} = this.props.cellActions;
		console.log(postJianYanPi);
		let name= document.getElementById('jianyanpiName').value;
		let date = new Date();
		let datestr = `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日`;
		let codelist=[]
		const test = await (codeSearch({type:'C_WP_CEL',code:this.state.targetFenxiang.code}).then(rst=>{
			console.log(rst);
			rst.result.forEach(ele=>{
				codelist.push(ele);
			});
		}));
		//console.log(codelist);
		let data = {
			"name": name,
			"code":`${this.state.targetFenxiang.code}-${this.getStartCode(codelist)}`,
			"obj_type": "C_WP_CEL",
			"extra_params": {
				time:datestr,
				check_status:0
			},
			"version": "A",
			"status": "A",
			"description": "description",
			"basic_params": {            
				"tech_params": {},
				"description": "",
				"process_status": 0
			},
			"parent": {
				"code":this.state.targetFenxiang.code,
				"name":this.state.targetFenxiang.name,
				"obj_type":this.state.targetFenxiang.obj_type
			},
			"qc_counts":{
				"checked": 0,
				"fine": 0,
				"is_leaf": true,
				"nonchecked": 1
			},
			"defect_counts": {
				"is_leaf": true,
				"settled": 0,
				"executing": 0,
				"total": 1
			}
		};
		postJianYanPi({},data).then(rst=>{
			if(rst.name){
				this.selectFenxiang(this.state.targetFenxiang.pk);
			}
			this.setState({loading:false});
		});
	}
	uplodachange(info){
		if (info.file.status !== 'uploading') {
			//console.log(info.file, info.fileList);
		}
		if (info.file.status === 'done') {
			message.success(`${info.file.name} file uploaded successfully`);
			//console.log(info.file.response);
			let nameList = info.file.response['Sheet1'].map(ele=>{
				if(ele.length>0){
					return ele[0];
				}
			});
			let arr = [];
			nameList.forEach((ele,index)=>{
				arr.push(
					<span style = {{display:"block"}}>{`${index+1}.名称:${ele}`}</span>
				);
			});
			console.log(nameList);
			let node = <div style = {{width:'400px',height:'400px',overflow:'scroll'}}>{arr}</div>
			let mod =  Modal.confirm({title:'是否添加',content:node,width:550,
			onCancel:()=>{
			 	setTimeout(()=>{mod.destroy()},20);
			},
			onOk:async ()=>{
				this.setState({loading:true});
				let {postJianYanPi,codeSearch} = this.props.cellActions;
				let codelist=[]
				const test = await (codeSearch({type:'C_WP_CEL',code:this.state.targetFenxiang.code}).then(rst=>{
					console.log(rst);
					rst.result.forEach(ele=>{
						codelist.push(ele);
					});
				}));
				let codestart =Number.parseInt(this.getStartCode(codelist));
				let addActions = [];
				let date = new Date();
				let datestr = `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日`;
				nameList.forEach((name,index)=>{
					let data = {
						"name": name,
						"code":`${this.state.targetFenxiang.code}-${this.codeToString(codestart+index)}`,
						"obj_type": "C_WP_CEL",
						"extra_params": {
							time:datestr,
							check_status:0
						},
						"version": "A",
						"status": "A",
						"description": "description",
						"basic_params": {            
							"tech_params": {},
							"description": "",
							"process_status": 0
						},
						"parent": {
							"code":this.state.targetFenxiang.code,
							"name":this.state.targetFenxiang.name,
							"obj_type":this.state.targetFenxiang.obj_type
						},
						"qc_counts":{
							"checked": 0,
							"fine": 0,
							"is_leaf": true,
							"nonchecked": 1
						},
						"defect_counts": {
							"is_leaf": true,
							"settled": 0,
							"executing": 0,
							"total": 1
						}
					};
					let act = postJianYanPi({},data);
					addActions.push(act)
				});
				Promise.all(addActions).then(rst=>{
					console.log('promise',rst);
					if(rst.length>0)
					{
					this.selectFenxiang(this.state.targetFenxiang.pk);
					this.setState({loading:false});
					}
				});
				setTimeout(()=>{mod.destroy()},20);
			}
		});
		} else if (info.file.status === 'error') {
			message.error(`${info.file.name} file upload failed.`);
		}
	}
	editCancel(){
		this.setState({editing:false});
	}
	editok(newName){
		if((!newName)||newName.length<=0){
			message.error('名称不合规范');
			this.setState({editing:false});
			return;
		}
		let {putJianYanPi} = this.props.cellActions;
		putJianYanPi({pk:this.state.editingJYP.pk},{
			version:'A',
			name:newName
		}).then(rst=>{
			setTimeout(()=>{				
				this.setState({editing:false});
				this.selectFenxiang(this.state.targetFenxiang.pk);
			},500);
		});
		
	}
	render() {
		const rowSelection = {
			// selectedRowKeys,
			onChange: this.onSelectChange,
		};
		const {table: {editing = false} = {}} = this.props;
		let fenxiangs = this.state.fenxiangs.filter((element) => {
			return element.obj_type === "C_WP_LOC" ? false : true; 
		});
		return (
			<Main>
				<DynamicTitle title="检验批划分" {...this.props} />
				<Sidebar>
					<QualityTree
						nodeClkCallback={this.treeNodeClk.bind(this)}
						actions={this.props.cellActions} />
				</Sidebar>
				<Content>
					<Spin spinning = {this.state.loading}>
						<span>选择分部分项：</span>
						<Select
							value = {this.state.selectedfenbu?this.state.selectedfenbu.pk:''}
							onSelect={this.selectFenbu.bind(this)}
							className='mySelect' placeholder='分部'>
							{this.getOptions(this.state.fenbus)}
						</Select>
						<Select
							value = {this.state.selectedzifenbu?this.state.selectedzifenbu.pk:''}
							onSelect={this.selectZifenbu.bind(this)}
							className='mySelect' placeholder='子分部'>
							{this.getOptions(this.state.zifenbus)}
						</Select>
						<Select
							value = {this.state.targetFenxiang?this.state.targetFenxiang.pk:''}
							onSelect={this.selectFenxiang.bind(this)}
							className='mySelect' placeholder='分项'>
							{this.getOptions(fenxiangs)}
						</Select>
						<EditMod
					     key = {new Date().toString()}
						 ok = {this.editok.bind(this)}
						 cancel = {this.editCancel.bind(this)}
						 visible = {this.state.editing}/>
						<div>
							<span>添加检验批：</span>
							<Input
								id='jianyanpiName'
								placeholder='检验批名称'
								style={{ width: '220px', margin: '10px 15px 10px 15px' }} />
							<Button
								onClick={this.addJianYanPi.bind(this)}
								disabled={!this.state.targetFenxiang}
								style={{ width: '100px', margin: '10px 15px 10px 15px' }}>添加检验批</Button>
							<Upload
								disabled =  {!this.state.targetFenxiang}
								style={{ margin: '10px 15px 10px 15px' }}
								onChange={this.uplodachange.bind(this)}
								name='file'
								showUploadList={false}
								action={`${SERVICE_API}/excel/upload-api/`}
							>
								<Button type="primary"
									disabled={!this.state.targetFenxiang}
								>批量提交</Button>
							</Upload>
							<a id='downloadjianyanpi'
								href={JYPMOD_API}>
								<Button type="primary" style={{ margin: '10px 17px 10px 15px' }}>模版下载</Button>
							</a>
						</div>
						{
						// <Button 
						//  onClick = {(e)=>{
						// 	e.persist();
						// 	document.getElementById('test').click();
						// 	//e.persist();
						//  }}
						//  style={{ margin: '10px' }}>测试</Button>
						}
						<div style={{ width: '100%' }}>
							<h3 style={{marginBottom:"10px"}}>检验批清单</h3>
							<Table
								rowSelection={rowSelection}
								// className='huafenTable'
								className="foresttables"
								bordered
								dataSource={this.state.jianyanpis}
								columns={this.columns}
							/>
						</div>
						{
							// <a id= 'test' href = {JYPMOD_API}>aaaa</a>
						}
					</Spin>
				</Content>
			</Main>

		);
	}

}
