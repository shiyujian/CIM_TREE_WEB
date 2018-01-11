import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import PkCodeTree from '../components/PkCodeTree';
import reducer, {actions} from '../store/keyword';
import Button from "antd/es/button/button";
import Table from "../components/Keyword/Table";
import Addition from "../components/Keyword/Addition";
export const Engicode = window.DeathCode.DATUM_ENGINEERING;

@connect(
	state => {
		const {project:{keyword = {} = {}}, platform} = state || {};
		return {...keyword, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)

export default class Keyword extends Component {
	static propTypes = {};

	render() {
		const {newshuzu = [],keycode,tableposible = 0} = this.props;

		return (
			<div>
				<DynamicTitle title="工程字段" {...this.props}/>
				<Sidebar>
					<PkCodeTree treeData={newshuzu}
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
				<Addition {...this.props}/>
			</div>
		);
	}

	componentDidMount() {
		const {actions:{getworkTree,getkeyword}} =this.props;
		getkeyword({code:'Keyword'});
		getworkTree({code:Engicode},{depth:3}).then(({children}) => {
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
			console.log(222,newshuzu);
			const {actions:{savenewshuzu}} =this.props;
			savenewshuzu(newshuzu)
		});
	}

	onSelect(value = [],keys) {
		console.log(value,keys);
		const [code] = value;
		const {actions:{settablevisible,setselectcode,getparentdir,setkeycode},newshuzu=[]} = this.props;
		setkeycode(code);
		if(code === undefined){
			return
		}
		let newcode = code.split("--")[1];
		setselectcode(newcode);
		getparentdir({code: newcode});
		console.log(newshuzu);
		newshuzu.find((rst,index)=>{
			if(newcode === rst.code){
				settablevisible(0);
			}else if (newshuzu[index].children.length !== 0){
				newshuzu[index].children.map((rst1,index1)=>{
					if(newcode === rst1.code){
						settablevisible(0);
					}else{
						if(newshuzu[index].children[index1].children.length!==0){
							newshuzu[index].children[index1].children.map((rst2,index2)=>{
								if(newcode === rst2.code){
									settablevisible(1)
								}
							})
						}
					}
				})
			}
		})
	}
}
