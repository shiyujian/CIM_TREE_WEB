import React , {Component} from 'react';
import { Timeline,BackTop , Row , Col , Select , Icon ,Table ,Form, Input, Button ,Popconfirm ,Checkbox ,message,notification } from 'antd';

class EditableCell extends React.Component {

	constructor(props){
		super(props)
		this.state = {
			value: this.props.value,
			//editable: true,
			editable: this.props.editOnOff
		};
		this.editCache = {};
	}

	handleChange = (e) => {
		const value = e.target.value;
		this.setState({ value });
	}

	// 这里需要去判断
	check = () => {
		let value = this.state.value;
		// console.log(value,"vip-value")
		if(!value || value == undefined || value == null ){
            notification.error({
                message: '没有完成填写',
                duration: 2,
            });
			return;
		}else{
				if (this.props.onChange) {
				this.props.onChange(this.state.value);
			}
		}
		this.setState({ editable: false });
	}

	edit = () => {
		this.setState({ editable: true });
	}

	render() {
		const { value, editable } = this.state;
		return (
		<div className="editable-cell" style = {{width:"100%"}}>

			{
				editable ?
				<div className="editable-cell-input-wrapper">
				<Input
					value={value}
					onChange={this.handleChange}
					onPressEnter={this.check}
					onBlur={this.check}
				/>
				<Icon
					type="check"
					className="editable-cell-icon-check"
					onClick={this.check}
				/>
				</div>
				:
				<div className="editable-cell-text-wrapper">
				{  value != undefined || ' ' }
				{value}
				<Icon
					type="edit"
					className="editable-cell-icon"
					onClick={this.edit}
				/>
				</div>
			}

		</div>
		);
	}
}

export default EditableCell;
