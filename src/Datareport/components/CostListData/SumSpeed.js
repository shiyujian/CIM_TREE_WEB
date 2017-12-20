import React, { Component } from 'react';
import { Button, Input, Table, Modal, Select, Form, Upload, Icon, Row, Col, Radio,bordered } from 'antd';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
export default class SumSpeed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            visibles:false
        }
    }
    render () {
		  const rowSelection = {
			onChange: (selectedRowKeys, selectedRows) => {
			  console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
			},
			getCheckboxProps: record => ({
			  disabled: record.name === 'Disabled User', // Column configuration not to be checked
			}),
          };
          const columns = [{
			title: '序号',
			dataIndex: 'serialnumber',
		  },{
			title: '项目/子项目',
			dataIndex: 'subproject',
		  },{
			title: '费用名称',
			dataIndex: 'nodetarget',
		  },{
			title: '单位',
			dataIndex: 'completiontime',
		  },{
			title: '支付情况',
			dataIndex: 'summoney',
		  },{
			title: '备注',
			dataIndex: 'remarks',
		  }]
        const data = [{
			key: '1',
			serialnumber: '1',
			subproject: '植树造林项目',
			nodetarget: '02101512152',
			completiontime:'篮球场规划',
            summoney: 'm2',
            remarks: '5555'
          },{
			key: '2',
			serialnumber: '2',
			subproject: '植树造林项目',
			nodetarget: '02101512152',
			completiontime:'篮球场规划',
            summoney: 'm2',
            remarks: '5555'
          }]
          const columnss = [{
			title: '序号',
			dataIndex: 'serialnumber',
		  },{
			title: '项目/子项目',
			dataIndex: 'subproject',
		  },{
			title: '费用名称',
			dataIndex: 'nodetarget',
		  },{
			title: '单位',
			dataIndex: 'completiontime',
		  },{
			title: '支付情况',
			dataIndex: 'summoney',
		  },{
			title: '备注',
			dataIndex: 'remarks',
		  },{
			title: '编辑',
			dataIndex: 'edit',
		  }]
        const datas = [{
			key: '1',
			serialnumber: '1',
			subproject: '植树造林项目',
			nodetarget: '02101512152',
			completiontime:'篮球场规划',
            summoney: 'm2',
            remarks: '5555',
            edit:'添加/删除'
          },{
			key: '2',
			serialnumber: '2',
			subproject: '植树造林项目',
			nodetarget: '02101512152',
			completiontime:'篮球场规划',
            summoney: 'm2',
            remarks: '5555',
            edit:'添加/删除'
          }]
        return (
            <div>
               <div style ={{marginBottom:20}}>
					<Button >申请变更</Button>
					<Button style ={{marginLeft:20}}>申请删除</Button>
					<Button style ={{marginLeft:20}}>导出表格</Button>
					<Search
						placeholder="请输入内容"
						onSearch={value => console.log(value)}
						style={{ width: 200,marginLeft:20}}
					/>
                    <Button style ={{marginLeft:20}} onClick={this.submit.bind(this)}>跳转提交</Button>
                    <Button style ={{marginLeft:20}} onClick={this.examine.bind(this)}>跳转审核</Button>
				</div>
				<div >
					<Table rowSelection={rowSelection} columns={columns} dataSource={data} bordered/>
				</div>
                <Modal
                    visible={this.state.visible}
                    onOk={this.hideModal}
                    onCancel={this.hideModal}
                    width ={1200}
                    >
                    <h1 style ={{textAlign:'center',marginBottom:20}}>结果预览</h1>
                    <Table rowSelection={rowSelection} columns={columnss} dataSource={datas} bordered/>
                    <Button onClick={this.download.bind(this)}>模板下载</Button>
                    <Select defaultValue="1" 
                        style={{ width: '8%' ,marginLeft:10}}
                    >
                        <Option value="1"> 1</Option>
                        <Option value="2"> 2</Option>
                        <Option value="3"> 3</Option>
                    </Select>
                    <Button style ={{marginLeft:20}} onClick={this.select.bind(this)}>选择文件</Button>
                    <Input placeholder="请选择上传文件" style ={{width:"200px",marginLeft:20}} />
                    <Button style ={{marginLeft:20}} onClick={this.upload.bind(this)}>确认提交</Button>
                    <span style={{marginLeft:20}}>
                        导入方式：
                    </span>
                    <Select defaultValue="1" 
                        style={{ width: '300px' ,marginLeft:10}}
                    >
                        <Option value="1"> 不导入重复的数据</Option>
                        <Option value="2"> 导入重复的数据</Option>
                    </Select>
                    <Button style ={{marginLeft:20}} onClick={this.confirm.bind(this)}>确认提交</Button>
                    <div style={{marginTop:"30px"}}>
                        <p><span>注：</span>1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；</p>
                        <p style={{ paddingLeft: "25px" }}> 2、数值用半角阿拉伯数字，如：1.2</p>
                        <p style={{ paddingLeft: "25px" }}> 3、日期必须带年月日，如2017年1月1日</p>
                        <p style={{paddingLeft:"25px"}}> 4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.</p>
                    </div>
                </Modal>
                <Modal
                    visible={this.state.visibles}
                    onOk={this.hideModal}
                    onCancel={this.hideModal}
                    width ={1200}
                    >
                    <h1 style ={{textAlign:'center',marginBottom:20}}>结果审核</h1>
                    <Table columns={columns} dataSource={data} bordered/>

                    <Button onClick={this.download.bind(this)}>模板下载</Button>
                    <Select defaultValue="1" 
                        style={{ width: '8%' ,marginLeft:10}}
                    >
                        <Option value="1"> 1</Option>
                        <Option value="2"> 2</Option>
                        <Option value="3"> 3</Option>
                    </Select>
                    {/* <Upload {...props}>
                        <Button
                            style={{marginLeft:10}}
                        >
                        <Icon type="选择文件" /> Upload
                        </Button>
                    </Upload>  
                    <Input size="small" placeholder="请选择上传文件" style ={{width:100}} /> */}
                    <span style={{marginLeft:20}}>
                        导入方式：
                    </span>
                    <Select defaultValue="1" 
                        style={{ width: '300px' ,marginLeft:10}}
                    >
                        <Option value="1"> 不导入重复的数据</Option>
                        <Option value="2"> 导入重复的数据</Option>
                    </Select>
                    <Button style ={{marginLeft:20}} onClick={this.confirm.bind(this)}>确认提交</Button>
                    <Row style={{margin: '20px 0'}}>
					<Col span={2}>
						<span>审查意见：</span>
					</Col>
					<Col span={4}>
						<RadioGroup onChange={this.onChange} value={this.state.value}>
					        <Radio value={1}>通过</Radio>
					        <Radio value={2}>不通过</Radio>
					    </RadioGroup>
				    </Col>
				    <Col span={2} push={14}>
				    	<Button type='primary'>
        					导出表格
        				</Button>
				    </Col>
				    <Col span={2} push={14}>
				    	<Button type='primary'>
        					确认提交
        				</Button>
				    </Col>
			    </Row>
			    <Row style={{margin: '20px 0'}}>
				    <Col>
				    	<TextArea rows={2} />
				    </Col>
			    </Row>
			    <Row style={{marginBottom: '10px'}}>
			    	<div>审批流程</div>
			    </Row>
			    <Row>
			    	<Col span={10}>
			    		<div style={{padding: '20px 0 0 10px', width: '300px', height: '200px', border: '1px solid #000'}}>
			    			<div>执行人：数据上传者</div>
			    			<div>执行时间：2017-11-22</div>
			    			<div>执行意见：XXXXXXXXXXXXX</div>
			    			<div style={{marginTop: '50px'}}>电子签章：</div>
			    		</div>
			    		<div style={{width: '300px', textAlign: 'center', fontSize: '16px'}}>数据上传</div>
			    	</Col>
			    	<Col span={10}>
			    		<div style={{padding: '20px 0 0 10px', width: '300px', height: '200px', border: '1px solid #000'}}>
			    			<div>执行人：数据审批</div>
			    			<div>执行时间：</div>
			    			<div>执行意见：</div>
			    			<div style={{marginTop: '50px'}}>电子签章：</div>
			    		</div>
			    		<div style={{width: '300px', textAlign: 'center', fontSize: '16px'}}>数据上传审核</div>
			    	</Col>
			    </Row>

                </Modal>
            </div>
        )
    } 
    submit(){
        this.setState({
            visible: true,
        });
    }
    showModal = () => {
        this.setState({
          visible: true,
          visibles: true,
        });
      }
    hideModal = () => {
    this.setState({
        visible: false,
        visibles: false,
    });
    }
    download () {

    }
    confirm () {

    }
    select (){

    }
    upload () {

    }
    examine () {
        this.setState({
            visibles: true,
        });
    }
    download () {
        
    }
    onChange = (e) => {
	    console.log('radio checked', e.target.value);
	    this.setState({
	    	value: e.target.value,
	    });
	}
}