import React, {Component} from 'react';
import {
	Input, 
	Form, 
	Spin, 
	message, 
	Upload, 
	notification,
	Button, 
	Icon,
	Progress,
	Select,
	Table,
	Popconfirm,
	Modal,
    DatePicker} from 'antd';
import moment from 'moment';
import EditableCell from '../EditableCell' 
import {FILE_API} from '../../../_platform/api';
const FormItem = Form.Item;
const Option = Select.Option;
export default class AddData extends Component {

	constructor(props) {
		super(props);
		this.state = {
			dataSource:this.props.state.currentDepthArray,
			dataArray:[],
		};
	}
	
	disabledDate(current) {
		const {dateList} = this.props.state;
		if(current){
		  let dada = current.format('YYYY-MM-DD');
		  return current && dateList.indexOf(dada)!==-1;
		}
		return current;
	  }

    onCellChange = ( index, key ,record ) => {      //编辑某个单元格
        const { 
            actions: { 
                setTableArray
            } 
        } = this.props.props;
        const {dataSource} = this.state;
        return (value) => {
        	dataSource[index][key] = value;
        	setTableArray(dataSource);
			record[key] = value;
        };
	}

	render() {
		const formItemLayout = {
			labelCol: {span: 6},
			wrapperCol: {span: 14},
		};
		const {
			form: {getFieldDecorator}
		} = this.props.props;
		const columns = [
            {
                title:'序号',
                dataIndex:'index',
                width: '15%',
                render:(text,record,index) => {
                    return <div>{index+1}</div>
                }
            },{
                title:'深度',
                dataIndex:'depth',
                width: '20%',
            },{
                title:'本次读数',
                dataIndex:'value',
                width: '15%',
                render: (text, record ,index) => (
					<div>
						<EditableCell
							editOnOff = { false }
							onChange={ this.onCellChange( index , "value", record) }
						/>
					</div>
				),
            }
        ];
		const {currentTypeValue,isSurvey} = this.props.state;
		let typeValue = currentTypeValue.split("-");
		return (
				<Form>
					<p style={{fontSize:14}}>{`${typeValue[1]}`}</p>
					<FormItem {...formItemLayout} label="监测日期">
						{getFieldDecorator('date', {
							rules: [
								{required: true, message: '请选择监测日期'},
							]
						})(
							<DatePicker 
							disabledDate={(value)=>this.disabledDate(value)}/>
						)}
					</FormItem>
					<Table 
					 dataSource={this.state.dataSource}
					 columns={columns}
					 bordered
					 style={{width:300,marginLeft:180,marginTop:15}}
					 size="small"
					 pagination = {{pageSize:15}}
					> 
					</Table>
					
				</Form>
		)
	}
}