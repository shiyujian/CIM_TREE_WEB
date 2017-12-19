import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	Form, Input,Button, Row, Col, Modal, Select,
	Icon, message, Table,
} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
export const hiddencode = window.DeathCode.SYSTEM_HIDDEN;
export default class dangerAddition extends Component {
	static propTypes={
		addVisible: PropTypes.bool
	};

	_getDisableStatue(code){
		let disable=false;
		const {
			extravalue = []
		}= this.props;
		let find=extravalue.filter(itm=>itm.code === code);
		if(find.length > 0){
			disable=true;
		}
		return disable;
	}

	render() {
		const{
			editevisible = false,
			filter=[],
			editefile ={},
			taglist=[],
			changevalue=[]
		} = this.props;
		console.log(11,editefile.extra);
		return (
			<div>
				<Modal title="编辑"
				       width={920} visible={editevisible}
				       onOk={this.save.bind(this)}
				       onCancel={this.cancel.bind(this)}>
					<Form>
						<FormItem label="安全隐患名称">
							<Input disabled={true}
							       value={editefile.name}/>
						</FormItem>
						<FormItem label="安全隐患code">
							<Select
								labelInValue
								mode="multiple"
								style={{ width: '100%' }}
								placeholder="Please select"
								value={changevalue}
								onChange={this.handleChange.bind(this)}
							>
								{
									taglist.map((pkg,index) => {
										return <Option key={pkg.code}
										                disabled={this._getDisableStatue(pkg.code)}
										                value={pkg.code}>{pkg.name}</Option>;
									})
								}
							</Select>
						</FormItem>
						<FormItem label="备注">
							<Input onChange={this.mark.bind(this, filter)}
							       value={this._getvalue(editefile)}/>
						</FormItem>
					</Form>
				</Modal>
			</div>

		);
	}

	_getvalue(value){
		if(value.mark === undefined){
			return null
		}else{
			return value.mark
		}
	}

	mark(filter,event){
		let mark = event.target.value;
		const{actions:{setnames,changeeditedoc},editefile={}} = this.props;
		let files={
			code:editefile.code,
			name:editefile.name,
			extra:editefile.extra,
			mark:mark,
			on:editefile.on,
		};
		changeeditedoc({...files});
	}

	handleChange(value){
		const {actions:{setvalue,saveselectvalue}} = this.props;
		setvalue(value);
		let ks =[];
		value.map(rst=>{
			let newrst = {
				name:rst.label,
				code:rst.key
			};
			ks.push(newrst)
		});
		saveselectvalue(ks);
	}

	cancel() {
		const {
			actions: {leveledite,changeeditedoc,setvalue},
		} = this.props;
		leveledite(false);
		changeeditedoc();
		setvalue();
	}

	save() {
		const {actions:{putdocument,leveledite,getwplist,setvalue},wplist={},editefile={},selectvalue=[],extravalue = []} = this.props;
		// console.log(selectvalue);
		let extra = selectvalue.concat(extravalue);
		let onn = parseInt(editefile.on-1);
		let k = {
			code:editefile.code,
			name:editefile.name,
			on:editefile.on,
			extra:extra,
			mark:editefile.mark
		};
		let list = [];
		wplist.metalist.splice(onn,1,k);
		wplist.metalist.forEach(rst =>{
			delete rst.on;
			list.push(rst)
		});
		console.log(888,list);
		putdocument({code:'wpitemtypes'},{
			metalist:list
		}).then(rst =>{
			message.success('编辑文件成功！');
			leveledite(false);
			setvalue();
			getwplist({code:'wpitemtypes'}).then(rst =>{
				let newwplists = rst.metalist;
				rst.metalist.map((wx,index) => {
					newwplists[index].on = index+1;
				});
				const {actions:{setnewwplist}} = this.props;
				setnewwplist(newwplists);
			});
		});
	}

}
