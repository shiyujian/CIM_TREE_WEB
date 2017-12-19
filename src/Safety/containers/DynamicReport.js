import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/dynamicReport';
import EditData from '../components/DynamicReport/EditData'
import {actions as platformActions} from '_platform/store/global';
import styles from './RiskEvaluation.css';
// import ProjectTree from '../components/Treatment/ProjectTree';
import WorkPackageTree from '../components/WorkPackageTree';
import {
    Table,
    Row,
    Col,
    Form,
    message,
    Modal,
    Button,
    Popconfirm
} from 'antd';


@connect(
	state => {
		const {safety: {dynamicReport = {}} = {}, platform} = state;
		return {dynamicReport, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch)
	})
)
class DynamicReport extends Component {
    static propTypes = {};
    constructor(){
        super();
        this.state = {
            record:{},
            setEditVisiable:false,
            index:'-1',
            dataSet:[{unbearable:'挑食、吃垃圾食品',mayaccident:'营养不良',warninglevel:'level-3',position:'办公室',targetControl:'加班宅男',jobControl:'按时吃食堂',rescue:'时蔬两道'},
            {unbearable:'挑食、吃垃圾食品',mayaccident:'营养不良',warninglevel:'level-3',position:'办公室',targetControl:'加班宅男',jobControl:'按时吃食堂',rescue:'时蔬两道'},
            {unbearable:'挑食、吃垃圾食品',mayaccident:'营养不良',warninglevel:'level-3',position:'办公室',targetControl:'加班宅男',jobControl:'按时吃食堂',rescue:'时蔬两道'},
            {unbearable:'挑食、吃垃圾食品',mayaccident:'营养不良',warninglevel:'level-3',position:'办公室',targetControl:'加班宅男',jobControl:'按时吃食堂',rescue:'时蔬两道'},
            {unbearable:'挑食、吃垃圾食品',mayaccident:'营养不良',warninglevel:'level-3',position:'办公室',targetControl:'加班宅男',jobControl:'按时吃食堂',rescue:'时蔬两道'}]
        }
    }

    onEditClick(record,index){
        this.setState({record:record,index:index,setEditVisiable:true});
    }

    goCancel(){
        this.setState({setEditVisiable:false});
    }

    onConfirm = () =>{
        message.info('保存成功.');
    }

    setEditData(){
        this.props.form.validateFields((err,values) => {
            if(!err){
                let datas = this.state.dataSet;
                datas[this.state.index].unbearable = values.unbearable;
                datas[this.state.index].mayaccident = values.mayaccident;
                datas[this.state.index].warninglevel = values.warninglevel;
                datas[this.state.index].position = values.position;
                datas[this.state.index].targetControl = values.targetControl;
                datas[this.state.index].jobControl = values.jobControl;
                datas[this.state.index].jobControl = values.jobControl;
                datas[this.state.index].rescue = values.rescue;
                this.setState({setEditVisiable:false,dataSet:datas});
            }
        }); 
    }

    render() {
        const { 
            form: {getFieldDecorator}, 
        } = this.props;
        const dataSet = this.state.dataSet;
        const columns = [
            {
                title:'序号',
                dataIndex:'index',
                width: '5%',
                render:(text,record,index) => {
                    return <div>{index+1}</div>
                }
            },{
                title:'重大危险源',
                dataIndex:'unbearable',
                width: '20%',
            },{
                title:'危险源的存在具体情况',
                dataIndex:'mayaccident',
                width: '12.5%',
            },{
                title:'目前情况',
                dataIndex:'warninglevel',
                width: '15%',
            },{
                title:'下一步施工计划情况',
                dataIndex:'position',
                width: '12.5%',
            },{
                title:'控制方式',
                children:[{
                    title:'目标控制',
                    dataIndex:'targetControl',
                    key:'targetControl',
                    width: '5%',
                },{
                    title:'作业控制',
                    dataIndex:'jobControl',
                    key:'jobControl',
                    width: '5%',
                },{
                    title:'应急救援',
                    dataIndex:'rescue',
                    key:'rescue',
                    width: '5%',
                }],
            },{
                title:'操作',
                dataIndex:'opt',
                width: '5%',
                render: (text,record,index) => {
                    return <div><a href='#' onClick={this.onEditClick.bind(this,record,index)}>编辑</a></div>
                }
            }
        ];
        return (
            <div className={styles.riskevaluation}>
                <DynamicTitle title="重大危险源" {...this.props}/>

                <Sidebar>
                    <WorkPackageTree />
                </Sidebar>

                <Content>
                    <h1 style={{textAlign:'center'}}>重大危险源动态登记表</h1>
                    <Popconfirm title="确定要保存吗？" okText="Yes" cancelText="No" onConfirm={()=>this.onConfirm()}>
                        <Button 
                         icon="save" 
                         style={{float:'right'}}
                         type="primary" 
                         >保存</Button>
                    </Popconfirm>
                    <Table 
                     columns={columns} 
                     dataSource={dataSet}
                     bordered
                     style={{height:380,marginTop:40}}
                     pagination = {{pageSize:10}} 
                    />
                </Content>
                <Modal
                 title="编辑数据"
                 width={760}
                 visible={this.state.setEditVisiable}
                 onOk={this.setEditData.bind(this)}
                 onCancel={this.goCancel.bind(this)}
                >
                    <EditData props={this.props} state={this.state} />
                </Modal>
            </div>
        );
    }
}
export default Form.create()(DynamicReport);
