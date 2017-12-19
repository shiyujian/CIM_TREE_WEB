import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	Form, Input,Button, Row, Col, Modal, Upload,
	Icon, message, Table,
} from 'antd';
const FormItem = Form.Item;
export const hiddencode = window.DeathCode.SYSTEM_HIDDEN;
export default class Addition extends Component {
	static propTypes={
		addVisible: PropTypes.bool
	};

	render() {
		const{
			levelAddVisible = false,
			newdoc={},
			filter=[],
		} = this.props;

		return (
			<div>
				<Modal title="新增"
				       width={920} visible={levelAddVisible}
				       onOk={this.save.bind(this)}
				       onCancel={this.cancel.bind(this)}>
					<Form>
						<FormItem label="工程量项名称">
							<Input value={newdoc.name} onChange={this.name.bind(this,filter)}/>
						</FormItem>
						<FormItem label="安全隐患编码">
							<Input value={newdoc.code} disabled={true}/>
						</FormItem>
						<FormItem label="项目特征">
							<Input value={newdoc.simple} onChange={this.simple.bind(this,filter)}/>
						</FormItem>
						<FormItem label="工程量项单位">
							<Input value={newdoc.unit} onChange={this.unit.bind(this,filter)}/>
						</FormItem>
					</Form>
				</Modal>
			</div>
		);
	}

	name(filter,event){
		let name = event.target.value;
		const {actions:{changedoc},newtaglist=[],docs={}} =this.props;
		let num= [];
		if(newtaglist.length ===0){
			docs.name = name;
			docs.code = 'G001';
			changedoc({...docs})
		}else {
			newtaglist.map((rst) => {
				num.push(rst.code.substring(1,4));
			});
			let max = Math.max.apply(null, num);
			let rightnum = max + 1;
			if(rightnum < 10){
				let newcode = 'G'+'00'+rightnum;
				docs.code = newcode;
			}else if(rightnum >= 100){
				let newcode = 'G'+rightnum;
				docs.code = newcode;
			}else{
				let newcode = 'G'+'0'+rightnum
				docs.code = newcode;
			}
			docs.name = name;
			changedoc({...docs});
		}
	}

	simple(filter,event){
		const {actions:{changedoc},newdoc={}} =this.props;
		let simple = event.target.value;
		newdoc.simple = simple;
		changedoc({...newdoc});
	}

	unit(filter,event){
		const {actions:{changedoc},newdoc={}} =this.props;
		let unit = event.target.value;
		newdoc.unit = unit;
		changedoc({...newdoc});
	}

	cancel() {
		const {
			actions: {levelAdding,changedoc},
			docs={}
		} = this.props;
		levelAdding(false);
		changedoc();
	}

	save() {
		const {actions:{patchdocument,levelAdding,gettaglist,changedoc},newdoc={}} = this.props;
		console.log(33333,newdoc);
		patchdocument({code:'Taglist'},{
			metalist:[
				{
					"code":newdoc.code,
					"name":newdoc.name,
					"unit":newdoc.unit,
					"simple":newdoc.simple
				}
			]
		}).then(rst =>{
			message.success('新增文件成功！');
			changedoc();
			levelAdding(false);
			gettaglist({code:'Taglist'}).then(rst =>{
				let newtaglists = rst.metalist;
				rst.metalist.map((wx,index) => {
					newtaglists[index].on = index+1;
				});
				const {actions:{setnewtaglist}} = this.props;
				setnewtaglist(newtaglists);
			})
		});
	}

}
