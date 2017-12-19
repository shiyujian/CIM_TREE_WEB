import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import reducer, {actions} from '../store/template';
import Addition from "../components/Keyword/Addition";
import {Modal1,Table,KeyTable} from '../components/Template'

@connect(
	state => {
		const {setup:{template = {} = {}}, platform} = state || {};
		return {...template, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)

export default class Template extends Component {
	static propTypes = {};

	render() {
		const {keyvisible = false} = this.props;

		return (
			<div>
				<DynamicTitle title="模板配置" {...this.props}/>
				<Content>
					<Modal1 {...this.props}/>
					<Table {...this.props}/>
					{
						keyvisible ===false?
							null:<KeyTable {...this.props}/>
					}
				</Content>
			</div>
		);
	}

	componentDidMount() {
		const {actions:{getdir,setdir,getkeyword,setkeyword}} = this.props;
		getkeyword({code:'Keyword'});
		getdir({code:'Folder'}).then(rst =>{
			let dir =[];
			if(rst.metalist === undefined){
				return
			}
			rst.metalist.map(rst1 => {
				if(rst1.parent === ""){
					dir.push(rst1);
				}
			});
			setdir(dir)
		});
	}
}
