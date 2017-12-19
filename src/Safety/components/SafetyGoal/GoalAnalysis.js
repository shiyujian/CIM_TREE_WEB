import React, { Component } from 'react';
import { Table, Tabs, Button, Row, Col, message, Modal, 
    Popconfirm, Card, Select, Form ,notification} from 'antd';
import moment from 'moment';
import { getUser } from '../../../_platform/auth';
import AddAnalysis from './AddAnalysis';
import EditAnalysis from './EditAnalysis';
import { STATIC_DOWNLOAD_API } from '../../../_platform/api';

const Option = Select.Option;

class GoalAnalysis extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newKey: Math.random(),
            newKey1: Math.random()*5,
            setVisible: false,
            setEditVisible: false,
            dataSource1: [],
            record:{},
        }
    }
    componentDidMount(){
        const {
            actions: {
                getPersonSafetyGoal
            },
            unitProject,
        } = this.props;
        let datas = [];
        getPersonSafetyGoal({},{project_unit_pk:unitProject.pk}).then(rst=>{
            rst.map(item=>{
                let data = {};
                data.id = item.id;
                data.value = item.goal;
                data.content = item.content;
                data.people = item.responsor.name;
                datas.push(data);
            });
            this.setState({dataSource1:datas});
        });
    }

    addClick = () => {
        this.setState({
            setVisible: true,
            newKey: Math.random(),
        });
    }

    editClick = (record, index) => {
        this.setState({
            setEditVisible: true,
            newKey1: Math.random()*5,
            record: record
        });
    }

    setEditData(){
        const {
            actions: {
                getPersonSafetyGoal,
                patchPersonSafetyGoal
            },
            project,
            unitProject,
            construct
        } = this.props;
        let datas = [];
        const {record} = this.state;
        this.props.form.validateFields((err,values) => {
            if(!err){
                let postData = {
                    responsor:{
                        name:values.people
                    },
                    content:values.content,
                    goal:values.value
                }
                patchPersonSafetyGoal({pk:record.id},postData).then(rst=>{
                    if(rst.id){
                        notification.info({
                            message: '编辑成功！',
                            duration: 2
                        });
                        getPersonSafetyGoal({},{project_unit_pk:unitProject.pk}).then(rst=>{
                            rst.map(item=>{
                                let data = {};
                                data.id = item.id;
                                data.value = item.goal;
                                data.content = item.content;
                                data.people = item.responsor.name;
                                datas.push(data);
                            });
                            this.setState({setVisible:false,dataSource1:datas});
                        });
                    }else{
                        notification.info({
                            message: '编辑失败！',
                            duration: 2
                        });
                    }
                });
                this.setState({
                    setVisible:false,
                    dataSource1:datas
                });
            }
        }); 
    }

    deletet(record,index){
        const {
            actions: {
                deletePersonSafetyGoal,
            }
        } = this.props;
        let datas = this.state.dataSource1;
        deletePersonSafetyGoal({pk:record.id}).then(rst=>{
            if(rst===""){
                notification.error({
                    message: '删除成功！',
                    duration: 2
                });
                datas.splice(index,1);
                this.setState({dataSource1:datas});
            }else{
                notification.error({
                    message: '删除失败！',
                    duration: 2
                });
            }
        })
    }

    onOk(){
        this.setState({
            setVisible:false,
        });
    }
    setAddData(){
        const {
            actions: {
                getPersonSafetyGoal,
                postPersonSafetyGoal
            },
            project,
            unitProject,
            construct
        } = this.props;
        let datas = [];
        this.props.form.validateFields((err,values) => {
            if(!err){
                let postData = {
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
                    responsor:{
                        name:values.people
                    },
                    content:values.content,
                    goal:values.value
                }
                postPersonSafetyGoal({},postData).then(rst=>{
                    if(rst.id){
                        notification.info({
                            message: '添加成功！',
                            duration: 2
                        });
                        getPersonSafetyGoal({},{project_unit_pk:unitProject.pk}).then(rst=>{
                            rst.map(item=>{
                                let data = {};
                                data.id = item.id;
                                data.value = item.goal;
                                data.content = item.content;
                                data.people = item.responsor.name;
                                datas.push(data);
                            });
                            this.setState({setVisible:false,dataSource1:datas});
                        });
                    }else{
                        notification.info({
                            message: '添加失败！',
                            duration: 2
                        });
                    }
                });
                this.setState({
                    setVisible:false,
                    dataSource1:datas
                });
            }
        }); 
    }
    goCancel(){
        this.setState({
            setVisible:false,
            setEditVisible: false,
        });
    }

    render() {
        const { 
            form: {getFieldDecorator}, 
        } = this.props;
        //安全目标表格
        const columns = [{
            title: '序号',
            dataIndex: 'index',
            width: '5%',
            render:(text,record,index) => {
                return <div>{index+1}</div>
            }
        }, {
            title:'安全目标职责',
            dataIndex:'content',
            width:'65%'
        },{
            title:'目标值',
            dataIndex:'value',
            width:'10%'
        },{
            title:'责任人',
            dataIndex:'people',
            width:'10%',
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
                        onConfirm={this.deletet.bind(this, record,index)}
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
                        dataSource={this.state.dataSource1}
                        bordered />
                </Card>
                <Modal 
                    title="新增目标分解"
                    width={760}
                    maskClosable={false}
                    key={this.state.newKey} 
                    visible={this.state.setVisible}
                    onOk={()=>this.setAddData()}
                    onCancel={this.goCancel.bind(this)}
                    >
                    <AddAnalysis props={this.props} state={this.state} />
                </Modal>
                <Modal 
					title="编辑目标分解"
					width={760}
                    key={this.state.newKey1}
					maskClosable={false}
					visible={this.state.setEditVisible}
					onOk={()=>this.setEditData()}
					onCancel={()=>this.goCancel()}
					>
					<EditAnalysis props={this.props} state={this.state} />
				</Modal>
            </div>
        )
    }
}

export default Form.create()(GoalAnalysis);