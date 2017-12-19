import React, { Component } from 'react';
import { Table, Button, Row, Col, Modal, Popconfirm, Card, Form,notification } from 'antd';
import moment from 'moment';
import { getUser } from '../../../_platform/auth';
import AddManage from './AddManage';
import EditManage from './EditManage';
import { STATIC_DOWNLOAD_API } from '../../../_platform/api';

class GoalManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: '-1',
            newKey: Math.random(),
            newKey1: Math.random()*5,
            setVisible: false,
            setEditVisible: false,
            dataSource: [],
            record:{},
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.dataSource){
            this.setState({dataSource:nextProps.dataSource});
        }
    }

    addClick = () => {
        debugger
        this.setState({
            newKey: Math.random()*2,
            setVisible: true,
        });
    }

    editClick = (record, index) => {
        this.setState({
            setEditVisible: true,
            newKey1: Math.random()*5,
            record: record,
        });
    }

    setEditData(){
        const {
            actions: {
                getSafetyGoal,
                patchSafetyGoal
            },
            project,
            unitProject,
            construct
        } = this.props;
        let datas = [];
        const {record} =  this.state;
        this.props.form.validateFields((err,values) => {
            if(!err){
                let projectData = {
                    content:values.content,
                    goal:values.value,
                }
                patchSafetyGoal({pk:record.id},projectData).then(rst=>{
                    if(rst.id){
                        notification.info({
                            message: '修改成功！',
                            duration: 2
                        });
                        getSafetyGoal({},{project_unit_pk:unitProject.pk}).then(rst=>{
                            rst.map(item=>{
                                let data = {};
                                data.id = item.id;
                                data.value = item.goal;
                                data.content = item.content;
                                datas.push(data);
                            });
                            this.setState({setVisible:false,dataSource:datas});
                        });
                    }else{
                        notification.info({
                            message: '修改失败！',
                            duration: 2
                        });
                    }
                });
                this.setState({
                    setEditVisible:false,
                    dataSource:datas
                });
            }
        }); 
    }

    deletet(index,record){
        const {
            actions: {
                deleteSafetyGoal
            }
        } = this.props;
        let datas = this.state.dataSource;
        deleteSafetyGoal({pk:record.id}).then(rst=>{
            if(rst===""){
                notification.error({
                    message: '删除成功！',
                    duration: 2
                });
                datas.splice(index,1);
                this.setState({dataSource:datas});
            }else{
                notification.error({
                    message: '删除失败！',
                    duration: 2
                });
            }
        })
    }

    setAddData(){
        const {
            actions: {
                getSafetyGoal,
                postSafetyGoal
            },
            project,
            unitProject,
            construct
        } = this.props;
        let datas = [];
        this.props.form.validateFields((err,values) => {
            let projectData = {
                    project:{
                        pk:project.pk,
                        code:project.code,
                        name:project.name,
                        obj_type:project.obj_type
                    },
                     constructionorg: {
                        obj_type: construct.obj_type,
                        code: construct.code,
                        name: construct.name
                    },
                    project_unit:{
                        pk:unitProject.pk,
                        code:unitProject.code,
                        name:unitProject.name,
                        obj_type:unitProject.obj_type
                    },
                    content:values.content,
                    goal:values.value,
                }
            postSafetyGoal({},projectData).then(rst=>{
                if(rst.id){
                    notification.info({
                        message: '添加成功！',
                        duration: 2
                    });
                    getSafetyGoal({},{project_unit_pk:unitProject.pk}).then(rst=>{
                        rst.map(item=>{
                            let data = {};
                            data.id = item.id;
                            data.value = item.goal;
                            data.content = item.content;
                            datas.push(data);
                        });
                        this.setState({setVisible:false,dataSource:datas});
                    });
                }else{
                    notification.info({
                        message: '添加失败！',
                        duration: 2
                    });
                }
            });
            this.setState({
                setEditVisible:false,
                dataSource:datas
            });
        }); 
    }
    
	goCancel(){
        debugger
		this.setState({
            setVisible:false,
            setEditVisible: false,
		});
	}

    render() {
        const { 
            form: {getFieldDecorator}, 
        } = this.props;
        console.log("*******",this.state);
        //安全目标表格
        const columns = [{
            title: '序号',
            dataIndex: 'index',
            width: '5%',
            render:(text,record,index) => {
                return <div>{index+1}</div>
            }
        }, {
            title: '目标内容',
            dataIndex: 'content',
            width: '70%'
        }, {
            title: '目标值',
            dataIndex: 'value',
            width: '15%'
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: '10%',
            render: (text, record, index) => (
                <span>
                    <a onClick={() => this.editClick(record,index)}>编辑</a>
                    <span className="ant-divider" />
                    <Popconfirm
                        placement="rightTop"
                        title="确定删除吗？"
                        onConfirm={this.deletet.bind(this, index,record)}
                        okText="确认"
                        cancelText="取消">
                        <a>删除</a>
                    </Popconfirm>
                </span>
            ),
        }]

        return (
            <div>
                <Card>
                    <Row>
                        <Button type='primary' style={{ float: 'right' }}
                            onClick={this.addClick.bind(this)}>
                            新增
                        </Button>
                    </Row>
                    <Table style={{ marginTop: '10px' }}
                        columns={columns}
                        dataSource={this.state.dataSource}
                        bordered />
                </Card>

                <Modal 
					title="新增安全目标"
					width={760}
					maskClosable={false}
					key={this.state.newKey}
					visible={this.state.setVisible}
					onOk={()=>this.setAddData()}
					onCancel={this.goCancel.bind(this)}
					>
					<AddManage props={this.props} state={this.state} />
				</Modal>

                <Modal 
					title="编辑安全目标"
					width={760}
                    key={this.state.newKey1}
					maskClosable={false}
					visible={this.state.setEditVisible}
					onOk={()=>this.setEditData()}
					onCancel={()=>this.goCancel()}
					>
					<EditManage props={this.props} state={this.state} />
				</Modal>
            </div>
        )
    }
}
export default Form.create()(GoalManage);