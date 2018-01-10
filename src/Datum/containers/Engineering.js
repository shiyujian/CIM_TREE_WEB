import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import reducer, {actions} from '../store/engineering';
import {actions as platformActions} from '_platform/store/global';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {Filter, Table,Addition,Updatemodal,Tree} from '../components/Engineering'
import PkCodeOnTree from '../components/PkCodeOnTree';
import PkCodeTree1 from '../components/PkCodeTree';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import Button from "antd/es/button/button";
export const Engicode = window.DeathCode.DATUM_ENGINEERING;

@connect(
	state => {
		const {datum:{engineering = {}}, platform} = state || {};
		return {...engineering, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions,...previewActions}, dispatch)
	})
)
export default class Engineering extends Component {

	static propTypes = {};
	state = {
		loading:false,
		loadingLeaf:false,
		tableSrc:[]
    }

	render() {
		const {newdirtree=[],stas = true,tablevisible = false, keycode,expandedKeys,tree=[],projectList=[]} = this.props;
		return (
            <Body>
            <Main>
                <DynamicTitle title="工程文档" {...this.props}/>
                <Sidebar>
	                {
		                stas == true?
			                <PkCodeOnTree treeData={projectList}
			                            selectedKeys={keycode}
			                            onSelect={this.onSelect.bind(this)}
										{...this.state}
			                />:
			                <div>
				                <Button onClick={this.retree.bind(this)}>返回</Button>
				                <PkCodeTree1 treeData={newdirtree}
				                             expandedKeys={expandedKeys}
				                            selectedKeys={keycode}
				                            onSelect={this.onSelectdir.bind(this)}
											{...this.state}
				                />
			                </div>
	                }
                </Sidebar>
                <Content>
	                {
	                	tablevisible == false?
			                null:
			                <div>
				                <Filter {...this.props} query = {this.query.bind(this)}/>
			                    <Table {...this.props} {...this.state}/>
				                <Addition {...this.props}/>
				                <Updatemodal {...this.props}/>
			                </div>
	                }
                </Content>
            </Main>
            <Preview/>
            </Body>
		)
	}

	componentDidMount() {
		const {actions:{getTree,getprofessionlist,savenewshuzu, getDesignUnit,getProjectAc,getDesignStage}} =this.props;
		getprofessionlist();
		getDesignUnit();//获取设计单位列表
		getProjectAc();
		getDesignStage();
		this.setState({loading:true});
		getTree({code:Engicode},{depth:2}).then(({children}) => {
			// let newshuzu = children;
			// children.map((rst,index) => {
			// 	newshuzu[index].on = "one";
			// 	if(newshuzu[index].length !==0 ){
			// 		rst.children.map((rst1 ,index1)=>{
			// 			newshuzu[index].children[index1].on = "two";
			// 		})
			// 	}
			// 	savenewshuzu(newshuzu)
			// });
			this.setState({loading:false});
		});
		
	}

	onSelect(value = [],node){
		const {node: {props: {eventKey = ''} = {}} = {}} = node || {};
		const {actions:{getdirtree,setstas,setnewdirtree,setkeycode},tree=[]} = this.props;
		const [code] = value;
		if(code === undefined){
			return
		}
		let valuecode = code.split("--")[1];
		const level = Engineering.loop(tree, eventKey.split("--")[1]);
		setkeycode(code);
		if(level !== "two" ){
			return
		}else{
			setstas(false);
			this.setState({loadingLeaf:true});
			getdirtree({code:valuecode},{depth:4}).then(rst =>{
				let newdirtree = [rst];
            	setnewdirtree(newdirtree);
				this.setState({loadingLeaf:false});
			})
		}
	}

	static loop = (list, code, deep = 0) => {
		let rst = null;
		list.find((item = {}) => {
			const {code: value, children = []} = item;
			if (value === code) {
				let type = '';
				switch (deep) {
					case 0:
						type = 'one';
						break;
					case 1:
						type = 'two';
						break;
					default:
						type = 'three';
						break;
				}
				rst = type;

			} else {
				const tmp = Engineering.loop(children, code, deep + 1);
				if (tmp) {
					rst = tmp;
				}
			}
		});

		return rst;
	};

	onSelectdir(value = [],node){
		const {actions:{getdocument,settablevisible,getkey,setnewkey,setcurrentcode,setkeycode,judgeFile},newdirtree=[]} = this.props;
		const [code] = value;
		const {tableSrc = []} = this.state;
		setkeycode(code);
		let fileType = node.node.props.title;
		judgeFile(fileType);
		if(code === undefined){
			return
		}
		let valuecode = code.split("--")[1];
		setcurrentcode({code:valuecode});
		for(let j=0;j<newdirtree.length;j++){
			if(newdirtree[j].code === valuecode){
				settablevisible(false);
				break;
			}else{
				newdirtree[0].children.map(rst => {
					if(valuecode.indexOf(rst.code) !== -1){
						settablevisible(true);
						getdocument({code: valuecode}).then(rst => {
							this.setState({tableSrc:rst.result});
						});
						getkey({code:rst.code}).then(rst=>{
							setnewkey(rst.extra_params);
						})
					}
				})
			}
		}
	}

	retree(){
		const {actions:{getTree,settablevisible,setstas,setnewdirtree}} =this.props;
		setstas(true);
		getTree({code:Engicode},{depth:2}).then(({children}) => {
		});
		settablevisible(false);
		setnewdirtree({});
	}

	query(value){
		const {tableSrc = []} = this.state;
		const {Doc = []} =this.props;
		let docArr = [];
		if(value){
			Doc.map(item => {
				if(item.extra_params.keyword_19.indexOf(value) != -1 || item.name.indexOf(value) != -1 || 
				item.extra_params.juance.indexOf(value) != -1 || item.extra_params.keyword_17.indexOf(value) != -1){
					docArr.push(item);
				}
			})
			this.setState({tableSrc:docArr});
		}else{
			this.setState({tableSrc:Doc});
		}
    }
}
