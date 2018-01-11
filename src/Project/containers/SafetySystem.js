import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import PkCodeTree from '../components/PkCodeTree';
import reducer, {actions} from '../store/safetySystem';
import Button from "antd/es/button/button";
import {Table, DirAddition, Additon} from '../components/SafetySystem'
export const Engicode = window.DeathCode.DATUM_ENGINEERING;

@connect(
	state => {
		const {project: {safetySystem = {} = {}}, platform} = state || {};
		return {...safetySystem, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)

export default class SafetySystem extends Component {
	static propTypes = {};

	render() {
		const {worktree = [], keycode,tableposible = 0} = this.props;

		return (
			<div>
				<DynamicTitle title="安全体系目录" {...this.props}/>
				<Sidebar>
					<PkCodeTree treeData={worktree}
					            selectedKeys={keycode}
					            onSelect={this.onSelect.bind(this)}/>
				</Sidebar>
				<Content>
					{
						(tableposible === 0)?
							null:
							<Table {...this.props}/>
					}
				</Content>
				<Additon {...this.props}/>
				<DirAddition {...this.props} />
			</div>
		);
	}

	componentDidMount() {
		const {actions: {getworkTree}} = this.props;
		getworkTree({code: Engicode}, {depth: 2}).then(({children}) => {
		});
	}

	onSelect(value = []) {
		const [code] = value;
		const {actions: {setkeycode}, worktree = []} = this.props;
		setkeycode(code);
		console.log("value",value);
		if(code === undefined){
			return
		}
		let valuecode = code.split("--")[1];
		for (let j = 0; j < worktree.length; j++) {
			if (worktree[j].code === valuecode) {
				const {actions: {retn}} = this.props;
				retn(0);
				break;
			} else {
				const {actions: {getdirtree, savecode, savepk,retn}, paren = {}} = this.props;
				retn(1);
				savecode(code.split("--")[1]);
				paren.code = code.split("--")[1];
				paren.pk = code.split("--")[0];
				savepk(paren);
				getdirtree({code: code.split("--")[1]}, {depth: 4}).then(({children,pk}) => {
					let newshuzu = children;
					children.map((rst,index) => {
						newshuzu[index].on = "one";
						if(newshuzu[index].length !==0 ){
							rst.children.map((rst1 ,index1)=>{
								newshuzu[index].children[index1].on = "two";
								if(newshuzu[index].children[index1].length !==0 ){
									rst1.children.map((rst2,index2)=>{
										newshuzu[index].children[index1].children[index2].on ="three";
									})
								}
							})
						}
					});
					const {actions:{savenewshuzu}} =this.props;
					savenewshuzu(newshuzu)
				});
			}
		}
	}
}
