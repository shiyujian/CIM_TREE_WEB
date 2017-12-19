import React, {Component} from 'react';
import {Row,Col,Button,Table,Popconfirm,message} from 'antd';
import './index.less'
import {CODE_API} from '_platform/api';
var Dropzone = require('react-dropzone')
var request = require('superagent')


export default class Dictvalue extends Component {
	constructor(props) {
        super(props);
        this.state ={
            selectedRowKeys:[]
        }
    }
	render() {
		let {fieldname = [], dictValues = [],dictloading} = this.props;
		dictValues = this.addindex(dictValues);
		let columns = [{
			title: '序号',
			dataIndex: 'index',
		},{
			title: '编码值',
			dataIndex: 'value',
		},{
			title: '名称',
			dataIndex: 'implication',
		},{
			title: '描述',
			dataIndex: 'description',
		},{
			title: '操作',
			render:(text,record,index) => {
				return	<span>
							<a className="fa fa-edit" style={{fontSize:"20px", margin:'0 5px'}} onClick={this.edit.bind(this,record)}></a>
							<Popconfirm
								title={`确定删除?`}
								onConfirm={this.handleDeleteRow.bind(this,record.value)}
								okText="是"
								cancelText="否"
							>
								<a className="fa fa-trash" style={{fontSize:"20px", margin:'0 5px'}} ></a>
							</Popconfirm>
						</span>
			}
		}]
		const rowSelection = {
			onChange: (selectedRowKeys, selectedRows) => {
				this.setState({selectedRowKeys})
			},
			selectedRowKeys: this.state.selectedRowKeys,
		};
		return (
			<div style={{marginTop: 16}}>
				<Row style={{marginTop: 16}}>
					<Col span={3} offset={1}>
						<span style={{fontSize:'15px',fontWeight:'bold'}}>
							{fieldname}
						</span>
					</Col>
					<Col span={3} offset={11}>
						<Button type="primary" onClick={this.dictCreate.bind(this)}>
							单个创建
						</Button>
					</Col>
					<Col span={3}>
						<Dropzone 
	                     ref="dropzone" 
	                     className='dropzone'
	                     id="uploadObjectDropzone" 
	                     onDrop={this.onDrop.bind(this)}>
	                    </Dropzone>
		                <Button 
		                 type='primary' 
		                 style={{fontSize: '14px'}}
		                 onClick={() => {
                                document.getElementById('uploadObjectDropzone').click()
                           }}
	                    >
		                    文件上传
		                </Button>
					</Col>
					<Col span={3}>
						<Popconfirm
							title={`确定删除?`}
							onConfirm={this.batchdelete.bind(this)}
							okText="是"
							cancelText="否"
						>
							<Button type="primary" >
								批量删除
							</Button>
						</Popconfirm>
					</Col>
				</Row>
				<Row>
					<Col span={24} style={{padding:'10px'}}>
						<Table
						 className='codesystemtable'
						 rowKey='index'
						 loading={dictloading}
						 rowSelection={rowSelection}
						 dataSource={dictValues} 
						 columns={columns}
						 bordered
						/>
					</Col>
				</Row>
			</div>
		);
	}
	onDrop(files) {
		let jsxThis = this
		const {fieldname} = this.props;
        files.forEach((file)=> {
            let req = request.post(`${CODE_API}/api/v1/import-data/dict-value/public/`)
            req.attach('file', file, file.name)
            req.field('dict_field', fieldname)
            req.end(function(err, res){
            	console.log(err, res)
            	if(res.body.errors == 0) {
            		message.success('上传成功')
            		jsxThis.getDictValue();
            	} else {
            		message.error(`${res.body.errors}条数据上传失败`)
            		jsxThis.getDictValue();
            	}
            })
        })
	}
	getDictValue() {
		const {fieldname,actions:{getDictValues,setDictLoading}} = this.props;
		setDictLoading(true)
		getDictValues({},{dict_field:fieldname,per_page:100})
		.then(rst => {
			setDictLoading(false)
		})
	}
	dictCreate() {
		const {actions: {changeDictcreateField}} = this.props;
		changeDictcreateField('visible', true);
		changeDictcreateField('isadd', true);
	}
	batchdelete() {
		const {fieldname, actions: {deleteDictValue},dictValues} = this.props;
		const {selectedRowKeys} = this.state;
		let all = [];
		try {
			selectedRowKeys.forEach(value => {
				all.push(deleteDictValue({dict_field:fieldname,value:dictValues[value-1].value}))
			})
			Promise.all(all)
			.then(rst => {
				message.success('批量删除成功')
				this.setState({selectedRowKeys:[]})
				this.getDictValue();
			})
		} catch(e) {
			console.log(e)
		}
	}
	edit(record) {
		console.log('a',record);
		const {actions: {changeDictcreateField}} = this.props;
		changeDictcreateField('visible', true);
		changeDictcreateField('value', record.value);
		changeDictcreateField('implication', record.implication);
		changeDictcreateField('description', record.description);
		changeDictcreateField('isadd', false);
	}
	addindex(arr) {
		arr.forEach((item,index) => {
			arr[index].index = ++index;
		})
		return arr
	}
	handleDeleteRow(name) {
		const {actions: {deleteDictValue},fieldname} = this.props;
		this.setState({selectedRowKeys:[]})
		deleteDictValue({dict_field:fieldname,value:name})
		.then(rst => {
			console.log(rst)
			if(rst == undefined){
				message.success('删除成功')
				this.getDictValue();
			} else {
				message.error(`删除失败,错误原因：${JSON.stringify(rst)}`)
				this.getDictValue();
			}
		})
	}
}
