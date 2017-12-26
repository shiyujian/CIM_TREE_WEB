import React, { Component } from 'react';
import { Modal, Input, Form, Button, message, Table, Radio, Row, Col } from 'antd';
import { CODE_PROJECT } from '_platform/api';
import '../index.less'; 

const RadioGroup = Radio.Group;
const { TextArea } = Input;

export default class PersonExpurgate extends Component {

	render() {
		const columns = [ {
	        title: '人员编码',
	        dataIndex: 'code',
	        key: 'Code',
	      }, {
	        title: '姓名',
	        dataIndex: 'name',
	        key: 'Name',
	      },{
	        title: '所在组织机构单位',
	        render:(record) => {
	            return (
	                <Select style={{width:"90%"}} value = {record.org || this.state.defaultPro} onSelect={ele => {
	                    record.org = ele;
	                    this.forceUpdate();
	                }}>
	                    {this.state.org}
	                </Select>
	            )
	        }
	      },{
	         title: '所属部门',
	         dataIndex :'depart',
	         key: 'Depart',
	      },{
	        title: '职务',
	        dataIndex :'job',
	        key: 'Job',
	      },{
	        title: '性别',
	        dataIndex :'sex',
	        key:'Sex'
	      },{
	        title: '手机号码',
	        dataIndex :'tel',
	        key:'Tel'
	      },{
	        title: '邮箱',
	        dataIndex :'email',
	        key:'Email'
	      },{
	        title:'二维码',
	        key:'signature',
	        render:(record) => (
	            <Upload
	                beforeUpload={this.beforeUploadPic.bind(this, record)}
	            >
	                <a>{record.signature ? record.signature.name : '点击上传'}</a>
	            </Upload>
	        )
	      },{
        title:'编辑',
        dataIndex:'edit',
        render:(record) => (
            <Popconfirm
                placement="leftTop"
                title="确定删除吗？"
                onConfirm={this.delete.bind(this)}
                okText="确认"
                cancelText="取消"
            >
                <a>删除</a>
            </Popconfirm>
        )
    }]
		
		return(
			<Modal
				width = {1280}
				visible={true}
				onCancel = {() => this.props.closeModal("person_exp_visible",false)}
			>
				<Row style={{margin: '20px 0', textAlign: 'center'}}>
					<h2>删除项目申请页面</h2>
				</Row>
				<Row>
					<Table
						bordered
						className = 'foresttable'
						columns={columns}
					/>
				</Row>
				<Row style={{marginTop: '20px'}}>
					<Col span={2} push={22}>
						<Button type="default" onClick={this.submit.bind(this)}>确认导入</Button>
					</Col>
				</Row>
				<Row style={{marginBottom: '20px'}}>
					<Col span={2}>
						<span>删除原因：</span>
					</Col>
			    </Row>
			    <Row style={{margin: '20px 0'}}>
				    <Col>
				    	<TextArea rows={2} />
				    </Col>
			    </Row>
			</Modal>
		)
	}

	onChange = (e) => {
	    console.log('radio checked', e.target.value);
	    this.setState({
	    	value: e.target.value,
	    });
	}

	//提交
    async submit(){
        this.props.closeModal("person_exp_visible",false)
        message.info("操作成功")
    }
}
