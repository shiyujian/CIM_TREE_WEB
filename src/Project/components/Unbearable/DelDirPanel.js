import React, { Component } from 'react';
import {Button,Icon} from 'antd';
export const Datumcode = window.DeathCode.SAFETY_HJBH;

export default class DelDirPanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
		}
	}

	onDeleteDir() {
		let {
			actions: { removeDir, refreshPanelTo, getworkTree, },
			currentcode={},
		} = this.props;
	console.log(currentcode)
		removeDir({code:currentcode})
			.then(
				()=>{
					getworkTree({code:Datumcode})
						.then(()=>{console.log('miao!')});
				}
			);
		refreshPanelTo('NOR');
	}

	getCurrentTargetDirName() {
		let {
			currentcode={},
			worktree = [],
		}= this.props;
		return worktree.map((rst,index)=>{
			if(rst.code === currentcode){
				let toDeleteDir = rst;
				console.log(toDeleteDir.name);
				return toDeleteDir.name
			}else{
				if(rst.children.length !== 0){
					return rst.children.map((rst1,index1)=>{
						if(rst1.code === currentcode){
							let toDeleteDir = rst1;
							console.log(toDeleteDir.name);
							return toDeleteDir.name
						}
					})
				}
			}
		});
	}

	render() {
		return (
			<div style={ {'padding-top':'50px', 'padding-left':'50px'}  }>
				<Icon type='exclamation-circle-o' style={ {color:'red'} }/>
				&nbsp;此操作将
				<span style={ {color:'red'} }>
					删除
				</span>
				目录
				<span  style={ {color:'red'} }>
					{this.getCurrentTargetDirName()}
				</span>
				, 是否确定删除 ?
				<br/>
				<br/>
				&nbsp;&nbsp;<Button type='danger' onClick={this.onDeleteDir.bind(this)} >删除</Button>
			</div>
		)
	}
}