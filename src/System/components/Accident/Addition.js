import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	Form, Input,Button, Row, Col, Modal, Upload,
	Icon, message, Table,
} from 'antd';
const FormItem = Form.Item;
export const Acccode = window.DeathCode.SYSTEM_ACC;
export default class Addition extends Component {
	static propTypes={
		addVisible: PropTypes.bool
	};

	render() {
		const{
			AddVisible = false,
			newdoc={},
			filter=[],
		} = this.props;

		return (
			<div>
				<Modal title="新增"
				       width={920} visible={AddVisible}
				       onOk={this.save.bind(this)}
				       onCancel={this.cancel.bind(this)}>
					<Form>
						<FormItem label="安全事故类别名称">
							<Input value={newdoc.name} onChange={this.name.bind(this,filter)}/>
						</FormItem>
						<FormItem label="安全事故类别编码">
							<Input value={newdoc.code} disabled={true}/>
						</FormItem>
					</Form>
				</Modal>
			</div>
		);
	}

	name(filter,event){
		let name = event.target.value;
		const {actions:{changedoc},newaccidentlist=[],docs={}} =this.props;
		let num= [];
		if(newaccidentlist.length ===0){
			docs.name = name;
			docs.code = 'accident_1';
			changedoc({...docs})
		}else{
			newaccidentlist.map((rst) =>{
				num.push(parseInt(rst.code.split('_')[1]));
			});
			let max = Math.max.apply(null, num);
			let rightnum = max+1;
			let newcode= 'accident'+'_'+rightnum;
			docs.name = name;
			docs.code = newcode;
			changedoc({...docs});
		}
	}

	cancel() {
		const {
			actions: {Adding,changedoc},
			docs={}
		} = this.props;
		Adding(false);
		changedoc();
	}

	save() {
		const {actions:{patchdocument,Adding,getaccidentlist,changedoc},newdoc={}} = this.props;
		patchdocument({code:Acccode},{
			metalist:[
				{
					"code":newdoc.code,
					"name":newdoc.name,
				}
			]
		}).then(rst =>{
			message.success('新增文件成功！');
			changedoc();
			Adding(false);
			getaccidentlist({code:Acccode}).then(rst =>{
				let newaccidentlists = rst.metalist;
				rst.metalist.map((wx,index) => {
					newaccidentlists[index].on = index+1;
				});
				const {actions:{setnewaccidentlist}} = this.props;
				setnewaccidentlist(newaccidentlists);
			})
		});
	}

}
