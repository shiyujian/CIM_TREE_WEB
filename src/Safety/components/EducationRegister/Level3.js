import React, { Component } from 'react';
import { Table, Button, Row, Col, Modal, Popconfirm, Card, Form, Input, message } from 'antd';
import moment from 'moment';
import { getUser } from '../../../_platform/auth';
import AddLevel3 from './AddLevel3';
import Level3Detail from './Level3Detail';
import { STATIC_DOWNLOAD_API, SOURCE_API} from '../../../_platform/api';
import Preview from '../../../_platform/components/layout/Preview';
import * as previewActions from '../../../_platform/store/global/preview';
import { getSafeMonitor } from '../../../Quality/store/monitoring';

const Search = Input.Search;

class Level3 extends Component {
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
            detailVisible:false,
            code:"",
        }
    }

    componentWillReceiveProps(props){
        console.log('props',props)
        const {code,pcode} = props;
        const {actions:{getSafetyEducation}} = this.props;
        console.log('this.props', this.props)
        const tempcode = code === "" ? `?project_code=${pcode}` : `?project_unit_code=${code}`
        getSafetyEducation({code:tempcode}).then(rst => {
            let dataSource = this.handleData(rst) || [];
            this.setState({code,dataSource})
        })
    }
    addClick = () => {
        // if(this.state.code === ""){
        //      message.info("请选择单位工程")
        // }else{
            this.setState({
                newKey: Math.random()*2,
                setVisible: true,
            });
        // } 
    }

    setEditData(){
        let jsxThis = this;
        this.props.form.validateFields((err,values) => {
            if(!err){
                let datas = this.state.dataSource;
                //values.date = moment(values.date._d).format('YYYY-MM-DD');
                datas.splice(jsxThis.state.index,1,values);
                //debugger
                this.setState({
                    setEditVisible:false,
                    dataSource:datas
                });
            }
        }); 
    }

    delete(index){
        const {actions:{delSafetyEducation}} = this.props
        let datas = this.state.dataSource;
        delSafetyEducation({id:datas[index].id}).then(rst => {
            datas.splice(index,1);
            this.setState({dataSource:datas});
        })   
    }

    setAddData(){
        this.props.form.validateFields(async (err,values) => {
            const {actions:{getSafetyEducation,addSafetyEducation,getWkByCode}} = this.props;
            const {code} = this.state;
            console.log('code', code)
            if(!err){
                let wkunit = await getWkByCode({parent:code});
                console.log('wkunit',wkunit)
                let project = wkunit.parent.obj_type !== "C_PJ" ?  await getWkByCode({code:wkunit.parent.code}) : wkunit.parent; 
                values.age = moment().format("YYYY") - moment(values.birthdate._d).format('YYYY');
                values.inTime = moment(values.inTime._d).format('YYYY-MM-DD');
                values.company_edu_time = moment(values.company_edu_time._d).format('YYYY-MM-DD');
                values.project_edu_time = moment(values.project_edu_time._d).format('YYYY-MM-DD');
                values.class_edu_time = moment(values.class_edu_time._d).format('YYYY-MM-DD');
                values.status = "在场";
                let putData = {
                    project:{
                        pk:project.pk,
                        code:project.code,
                        name:project.name,
                        obj_type:project.obj_type
                    },
                    project_unit:{
                        pk:wkunit.pk,
                        code:wkunit.code,
                        name:wkunit.name,
                        obj_type:wkunit.obj_type
                    },
                    person:{
                        name:values.name,
                        work:values.class,
                        female:values.gender,
                        enter_time:values.inTime,
                        age:values.age,
                        worktime:values.workage
                    },
                    register_form:values.register_form[0],
                    company_edu_time:values.company_edu_time,
                    company_edu_record: values.company_edu_record ? values.company_edu_record[0] : {},
                    company_edu_book:values.company_edu_book ? values.company_edu_book[0] : {},
                    company_edu_img:values.company_edu_img ? values.company_edu_img : [],

                    project_edu_time:values.project_edu_time,
                    project_edu_record: values.project_edu_record ? values.project_edu_record[0] : {},
                    project_edu_book:values.project_edu_book ? values.project_edu_book[0] : {},
                    project_edu_img:values.project_edu_img ? values.project_edu_img : [],

                    class_edu_time:values.class_edu_time,
                    class_edu_record: values.class_edu_record ? values.class_edu_record[0] : {},
                    class_edu_book:values.class_edu_book ? values.class_edu_book[0] : {},
                    class_edu_img:values.class_edu_img ? values.class_edu_img : []
                };
                let {dataSource} = this.state;
                addSafetyEducation({},putData).then(rst => {
                    try{
                        dataSource = dataSource.concat(this.handleData([rst]));
                        this.setState({
                            setVisible:false,
                            dataSource
                        });
                    }catch(e){
                        message.info("添加失败")
                        this.setState({setVisible:false})
                    }
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
    
    showDetail(record,index){
        this.setState({
            record:record,
            detailVisible: true,
        });
    }

    createLink = (name, url) => {    //下载
        let link = document.createElement("a");
        link.href = url;
        link.setAttribute('download', this);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    download(record,index){
    	let data = this.state.dataSource;
        if(data[index].attachment){
        	let apiGet = `${STATIC_DOWNLOAD_API}`+data[index].attachment[0].url;
        	this.createLink(this,apiGet);
        }else{
        	let apiGet = `${STATIC_DOWNLOAD_API}/media/documents/2017/10/%E5%AE%89%E5%85%A8%E5%BA%94%E6%80%A5%E9%A2%84%E6%A1%88.pdf`;
        	this.createLink(this,apiGet);
        }
    }

    onSearch(value){   
        const {actions:{getSafetyEducation}} = this.props
        let param = "?keyword=" + value
        getSafetyEducation({code:param}).then(rst => {
            let dataSource = this.handleData(rst)
            this.setState({dataSource})
        })
    }
     //将数据处理成适用于表格的数据
     handleData(data){
         try{
            return data.map(item => {
                return {
                    class:item.person.work,
                    name:item.person.name,
                    gender:item.person.female,
                    age:item.person.age,
                    workage:item.person.worktime,
                    inTime:item.person.enter_time,
                    time1:item.company_edu_time,
                    time2:item.project_edu_time,
                    time3:item.class_edu_time,
                    status:"在场",
                    ...item
                }
            })
         }catch(e){
             return []
         }
        
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
            title:'工种',
            dataIndex:'class',
            //width:'30%'
        },{
            title:'人员姓名',
            dataIndex:'name',
            // width:'15%'
        },{
            title:'性别',
            dataIndex:'gender',
            //width:'15%'
        },{
            title:'年龄',
            dataIndex:'age',
            
        },{
            title:'工龄',
            dataIndex:'workage',
            
        },{
            title:'进场时间',
            dataIndex:'inTime',
            //width:'15%'
        },{
            title:'一级教育时间',
            dataIndex:'time1',
            //width:'15%'
        },{
            title:'二级教育时间',
            dataIndex:'time2'
        },{
            title:'三级教育时间',
            dataIndex:'time3',
            //width:'15%'
        },{
            title:'状态',
            dataIndex:'status',
            //width:'15%'
        },{
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: '10%',
            render: (text, record, index) => (
                <span>
                    <a onClick={this.showDetail.bind(this,record,index)}>查看详情</a>
                    <span className="ant-divider" />
                    <Popconfirm
                        placement="rightTop"
                        title="确定删除吗？"
                        onConfirm={this.delete.bind(this, index)}
                        okText="确认"
                        cancelText="取消">
                        <a>删除</a>
                    </Popconfirm>
                </span>
            ),
        }]

        return (
            <div>
                {/* <Row>
                    <Col>
                        <h2 style={{ marginBottom: '10px' }}>安全目标管理</h2>
                    </Col>
                </Row> */}
                <Card>
                    <Row>
                        <Col span={12}>
                            <Search
                                placeholder="请输入搜索关键词"
                                style={{ width: '80%', display: 'block' }}
                                onSearch={(value) => this.onSearch(value)}
                            >
                            </Search>
                        </Col>
                        <Col span={12}>
                            <Button type='primary' style={{ float: 'right' }}
                                onClick={this.addClick.bind(this)}>
                                新增
                        </Button>
                        </Col>
                    </Row>
                    <Table style={{ marginTop: '10px' }}
                        columns={columns}
                        dataSource={this.state.dataSource}
                        bordered />
                </Card>

                <Modal 
					title="新工人入场三级安全教育登记"
					width={760}
					maskClosable={false}
					key={this.state.newKey}
					visible={this.state.setVisible}
					onOk={()=>this.setAddData()}
					onCancel={this.goCancel.bind(this)}
					>
					<AddLevel3 props={this.props} state={this.state} />
				</Modal>

                 <Modal 
					title="新工人入场三级安全教育登记详情"
					width={760}
                    key={Math.random()*4}
					maskClosable={false}
					visible={this.state.detailVisible}
					onOk={()=>this.setState({detailVisible:false,record:{}})}
					onCancel={()=>this.setState({detailVisible:false,record:{}})}
					>
					<Level3Detail {...this.state.record} />
				</Modal> 
                <Preview/>
            </div>
        )
    }
}
export default Form.create()(Level3);