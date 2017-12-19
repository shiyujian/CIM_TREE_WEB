import React, {Component} from 'react';

import {Input, Form, Table,Popconfirm,Button,Row,Col,Select,Modal,message} from 'antd';
import AddRating from './AddRating'
import EditRating from './EditRating'
import {UPLOAD_API} from '_platform/api';
const {Option} = Select

class CheckFrom extends Component {

	constructor(props) {
		super(props);
		this.state = {
            code:"",
            pcode:"",
            selectedRowKeys :[],
            selectedRowKeys1:[],
            checkFormData:[],
            checkContentData:[],
            checkformVisible:false,//新建安全用表
            checkContentVisivle:false,//新建表格
            editCheckContentVisible:false,//修改编辑
            checkFormId:"",//点击安全检查用表的id
            record:{}
		};
    }
    componentWillReceiveProps(props){
        const {code,pcode} = props;
        const {actions:{getSafetyCheckform}} = this.props;
        const tempcode = code === "" ? `?project_code=${pcode}` : `?project_unit_code=${code}`
        getSafetyCheckform({code:tempcode}).then(rst => {
            let checkFormData = rst || [];
            this.setState({code,checkFormData,checkFormId:""})
        })
    }
    addClick = () => {
        if(this.state.code === ""){
             message.info("请选择单位工程")
        }else{
            this.setState({
                checkformVisible: true,
            });
        } 
    }
    addClick2 = () => {
        if(this.state.checkFormId === ""){
            message.info("请选择一个安全检查用表")
        }else{
            this.setState({checkContentVisivle:true});
        }
    }
    //新建安全检查用表
    addCheckForm = async() => {
        let name = document.getElementById("checkFormName").value;
        if(!name){
            message.info("请填写安全检查用表名称")
            return
        }
        const {code} = this.state
        const {actions:{addSafetyCheckform,getWkByCode}} = this.props
        let wkunit = await getWkByCode({code:code});
        let project = wkunit.parent.obj_type !== "C_PJ" ?  await getWkByCode({code:wkunit.parent.code}) : wkunit.parent; 
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
            name:name
        };
        let {checkFormData} = this.state;
        addSafetyCheckform({},putData).then(rst => {
            try{
                checkFormData.push(rst)
                this.setState({
                    checkformVisible:false,
                    checkFormData
                });
            }catch(e){
                message.info("添加失败")
                this.setState({checkformVisible:false})
            }
        });
    }
    //删除安全检查表
    delCheckForm = () => {
        const {selectedRowKeys,checkFormData,code,pcode} = this.state
        const {actions:{delSafetyCheckform}} = this.props
        let delActions = [] 
        selectedRowKeys.map((item,index) => {
            delActions.push(delSafetyCheckform({id:checkFormData[index].id}));
        })
        const {actions:{getSafetyCheckform}} = this.props;
        const tempcode = code === "" ? `?project_code=${pcode}` : `?project_unit_code=${code}`
        Promise.all(delActions).then(rst => {
            getSafetyCheckform({code:tempcode}).then(rst => {
                let checkFormData = rst || [];
                this.setState({code,checkFormData,selectedRowKeys:[]})
            })
        })
    }
    //删除安全管理检查评分表
    delCheckContent = () => {
        const {selectedRowKeys1,checkContentData} = this.state
        const {actions:{delCheckContent,getCheckContent}} = this.props
        let delActions = [] 
        selectedRowKeys1.map((item,index) => {
            delActions.push(delCheckContent({id:checkContentData[index].id}));
        })
        Promise.all(delActions).then(rst => {
            getCheckContent({id:this.state.checkFormId}).then(rst => {
                let checkContentData = rst || [];
                this.setState({checkContentData,selectedRowKeys1:[]})
            })
        })
    }
    //点击展示细节
    showContent(index){
        const {checkFormData} = this.state;
        const {actions:{getCheckContent}} = this.props
        getCheckContent({id:checkFormData[index].id}).then(rst => {
            this.setState({checkContentData:rst,checkFormId:checkFormData[index].id})
        })
    }
    //新建安全管理检查评分表
    addCheckContent1 = async(dataSource,values) => {
        if(dataSource.length === 0){
            message.info("请至少填写一行")
            return
        }
        if(dataSource.some(item => {
            return !item.name || !item.reduce_score
        })){
            message.info("请不要空着")
            return
        }
        const {actions:{addCheckContent}} = this.props;
        let putData = {
            check_item:values.check_item,
            ratio:values.ratio,
            score:values.score,
            item_property:values.item_property,
            reduce_item:dataSource
        };
        addCheckContent({id:this.state.checkFormId},putData).then(rst => {
            let {checkContentData} = this.state
            checkContentData.push(rst)
            try{
                this.setState({
                    checkContentVisivle:false,
                    checkContentData
                });
            }catch(e){
                message.info("添加失败")
                this.setState({checkContentVisivle:false})
            }
        });
    }
    //修改安全管理检查评分表
    editCheckContent = async(dataSource,values) => {
        if(dataSource.length === 0){
            message.info("请至少填写一行")
            return
        }
        if(dataSource.some(item => {
            return !item.name || !item.reduce_score
        })){
            message.info("请不要空着")
            return
        }
        const {actions:{patchCheckContent,getCheckContent}} = this.props;
        let putData = {
            check_item:values.check_item,
            ratio:values.ratio,
            score:values.score,
            item_property:values.item_property,
            reduce_item:dataSource
        };
        patchCheckContent({id:this.state.record.id},putData).then(rst => {
            getCheckContent({id:this.state.checkFormId}).then(rst => {
                this.setState({checkContentData:rst,editCheckContentVisible:false,})
            })
        });
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    onSelectChange1 = (selectedRowKeys1) => {
        this.setState({ selectedRowKeys1 });
    }
	render() {
		const {selectedRowKeys,selectedRowKeys1} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        }
        const rowSelection1 = {
            selectedRowKeys1,
            onChange: this.onSelectChange1
        }
        const hasSelected = selectedRowKeys.length>0;
        const hasSelected1 = selectedRowKeys1.length>0;
        const columns2 = [{
            title: '用户自定义表格',
            dataIndex: 'name',
            render:(text,record,index) => {
              return <a onClick={this.showContent.bind(this,index)}>{text}</a>
            }
          }]
          const columns1 = [
            {
                title:'序号',
                dataIndex:'index',
                width: '5%',
                render:(text,record,index) => {
                    return <div>{index+1}</div>
                }
            },{
                title:'检查项目',
                dataIndex:'check_item',
                width: '15%'
            },{
                title:'项目级别',
                dataIndex:'item_property',
                width: '7%'
            },{
                title:'扣分标准',
                dataIndex:'reduce_item',
                width: '42%',
                render: (text,record,index) => {
                    return (
                        <ul>{
                            record.reduce_item.map(item => {
                                return  <li>{item.name},扣{item.reduce_score}分</li>
                            })
                        }
                        </ul>
                    )
                }
            },{
                title:'应得分数',
                dataIndex:'score',
                width: '7%'
            },{
                title:'扣减分数',
                dataIndex:'targetControl',
                width: '7%'
            },{
                title:'实得分数',
                dataIndex:'rescue',
                width: '7%'
            },{
                title:'操作',
                dataIndex:'opt',
                width: '10%',
                render: (text,record,index) => {
                    return <div>
                              <a href='javascript:;' onClick={()=>this.setState({record,editCheckContentVisible:true})}>编辑</a>
                            </div>
                }
            }
        ];
		return (
            <div>
                <Row>
                    <Col span={6}>
                    <h2 style={{textAlign:'center'}}>安全检查用表</h2>
                        <Table
                            dataSource={this.state.checkFormData}
                            rowSelection={rowSelection}
                            columns={columns2}
                            bordered
                            size="small"
                            style={{height:580,marginTop:20,marginBottom:15,width:"80%",overflow:'auto'}}
                            />
                        <Button 
                            type="primary" 
                            onClick={()=>this.addClick("item")}
                            style={{float:'right',marginLeft:5,marginRight:15}}
                            >增加</Button>
                        <Popconfirm title="确定要删除吗？" okText="Yes" cancelText="No" onConfirm={()=>this.delCheckForm()}>
                            <Button 
                            type="danger" 
                            disabled={!hasSelected} 
                            style={{float:'right'}}
                            >删除</Button>
                        </Popconfirm>
                        
                    </Col>
                    <Col span={18}>
                        <h2 style={{textAlign:'center'}}>安全管理检查评分表</h2>
                        <Table 
                            columns={columns1} 
                            dataSource={this.state.checkContentData}
                            bordered
                            rowSelection={rowSelection1}
                            style={{height:580,marginTop:20,marginBottom:15,overflow:'auto'}}
                        />
                        <Button 
                            type="primary" 
                            onClick={()=>this.addClick2()}
                            style={{float:'right',marginLeft:5,marginRight:15}}
                            >增加</Button>
                        <Popconfirm title="确定要删除吗？" okText="Yes" cancelText="No" onConfirm={()=>this.delCheckContent()}>
                            <Button 
                            type="danger" 
                            disabled={!hasSelected1} 
                            style={{float:'right'}}
                            >删除</Button>
                        </Popconfirm>
                    </Col>
                </Row>
                <Modal
                    title="安全检查用表"
                    key={Math.random()*2}
                    visible={this.state.checkformVisible}
                    onOk={()=>this.addCheckForm()}
                    maskClosable={false}
                    onCancel={()=>this.setState({checkformVisible:false})}>
                        <Input id="checkFormName"/>
                </Modal>
                {
                    this.state.checkContentVisivle &&
                    <AddRating ckey={Math.random()*3} props={this.props} state={this.state} oncancel={()=>this.setState({checkContentVisivle:false})} addCheckContent1={this.addCheckContent1}/>                
                } 
                {
                    this.state.editCheckContentVisible &&
                    <EditRating ckey={Math.random()*4} record={this.state.record} oncancel={()=>this.setState({editCheckContentVisible:false})} editCheckContent={this.editCheckContent}/>
                }
            </div>
		)
	}
}

export default Form.create()(CheckFrom)