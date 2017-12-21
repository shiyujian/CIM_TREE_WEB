/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React , {Component} from 'react';
import './index.less';
import { Timeline,BackTop , Row , Col , Select , Icon ,Table ,Form, Input, Button ,Popconfirm ,Checkbox ,message,notification } from 'antd';

class EditableCheckbox extends React.Component {

	constructor(props){
		super(props)
		this.state = {
			value: false
		};
		this.editCache = {};
	}

	handleChange = (e) => {
		const value = e.target.checked;
        this.setState({ value });
        this.props.onChange(value);
	}


	render() {
		const { value } = this.state;
		const{
			editDisabled
		}=this.props
		if(editDisabled){
			console.log('editDisabled',editDisabled)
			return (
				<span>是</span>
				);
		}else{
			return (
				<div className="editable-cell" style = {{width:"100%"}}>
					<Checkbox onChange={this.handleChange} ></Checkbox>
				</div>
				);
		}
		
	}
}

export default EditableCheckbox;
