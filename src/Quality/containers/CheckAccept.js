import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions, ID } from '../store';
import { actions as actions2 } from '../store/cells';
import { actions as platformActions } from '_platform/store/global';
import { message, Select, Table, Input, Button, Upload, Modal, Spin, Radio, Carousel, Row, Col, Form,notification } from 'antd';
import { Main, Content, Sidebar, DynamicTitle } from '_platform/components/layout';
import { getUser } from '_platform/auth';
import { PkCodeTree } from '../components';
import SearchInfo from '../components/CheckAccept/SearchInfo';
import AddCheckAccept from '../components/CheckAccept/AddCheckAccept';
import DeleteCheckAccept from '../components/CheckAccept/DeleteCheckAccept';
import './common.less';
import { getNextStates } from '_platform/components/Progress/util';
import WorkflowHistory from '../components/WorkflowHistory.js';
import { USER_API, SERVICE_API, WORKFLOW_API, JYPMOD_API, UPLOADFILE_API, SOURCE_API, STATIC_DOWNLOAD_API,WORKFLOW_CODE } from '_platform/api';
import '../../Datum/components/Datum/index.less'

const FormItem = Form.Item;
const Option = Select.Option;
@connect(
    state => {
        const { checkAcc = {} } = state.quality || {};
        return checkAcc;
    },
    dispatch => ({
        actions: bindActionCreators({ ...actions, ...platformActions }, dispatch),
        cellActions: bindActionCreators({ ...actions2 }, dispatch),
    }),
)
class CheckAccept extends Component {

    constructor(props) {
        super(props);
        this.columns = [
            {
                title: `区域`,
                width: '10%',
                dataIndex: 'area',
            }, {
                title: `单位工程`,
                dataIndex: 'project',
                width: '10%',
            }, {
                title: '子单位工程',
                dataIndex: 'unitProject',
                width: '10%',
            }, {
                title: '分部工程',
                dataIndex: 'fenbu',
                width: '10%',
            }, {
                title: '分项工程',
                width: '10%',
                dataIndex: 'fenxiang',
            }, {
                title: '小班',
                width: '10%',
                dataIndex: 'littleban',
            }, {
                title: '细班',
                width: '10%',
                dataIndex: 'thinban',
            }, {
                title: '编号',
                width: '10%',
                dataIndex: 'number',
            }, {
                title: '文档类型',
                width: '10%',
                dataIndex: 'docType',
            }, {
                title: '流程状态',
                width: '10%',
                dataIndex: 'flow_status',
            }, {
                title: '操作',
                render: (text, record, index) => {
                    return (
                        <div>
                            <Button onClick={this.show.bind(this, record)} >
                                查看
                            </Button>
                            <Button onClick={this.show.bind(this, record)}>
                                下载
                            </Button>
                        </div>
                    );
                }
            }
        ];
        this.state = {
            fenbus: [],
            zifenbus: [],
            fenxiangs: [],
            treeLists: [],
            leftkeycode: '',
            deleteVisiable:false,
            addVisiable:false,
            root:[],
            littleBan:[],
            thinBan:[],
            canopenmodel:false
        };
    }
    componentDidMount() {
        const { actions: { getTreeNodeList } } = this.props;
        getTreeNodeList().then(rst => {
            if (rst instanceof Array && rst.length > 0) {
                let root,level2,level3,level4,level5,level6 = [];
                root = rst.filter(node => {
                    return node.Type === '项目工程';
                })
                level2 = rst.filter(node => {
                    return node.Type === '子项目工程';
                })
                level3 = rst.filter(node => {
                    return node.Type === '单位工程';
                })
                level4 = rst.filter(node => {
                    return node.Type === '子单位工程';
                })
                level5 = rst.filter(node => {
                    return node.Type === '分部工程';
                })
                level6 = rst.filter(node => {
                    return node.Type === '分项工程';
                })
                for(let i=0;i<level5.length;i++){
                    level5[i].children = level6.filter(node => {
                        return node.Parent === level5[i].No;
                    })
                }
                for(let i=0;i<level4.length;i++){
                    level4[i].children = level5.filter(node => {
                        return node.Parent === level4[i].No;
                    })
                }
                for(let i=0;i<level3.length;i++){
                    level3[i].children = level4.filter(node => {
                        return node.Parent === level3[i].No;
                    })
                }
                for(let i=0;i<level2.length;i++){
                    level2[i].children = level3.filter(node => {
                        return node.Parent === level2[i].No;
                    })
                }
                root[0].children = level2;
                this.setState({root});
            }
        })
    }
    getOptions(datas) {
        let arr = [];
        datas.forEach(ele => {
            arr.push(<Option value={ele.pk}>{ele.name}</Option>);
        });
        return arr;
    }
   
    //得到检验批相应的数据,默认取第一个
    async getQuertData(data, type) {
        const { getUnitTreeByPk } = this.props.cellActions;
        if (data.obj_type_hum === type) {
            return [data];
        }
        if (data.children.length > 0) {
            if (data.children[0].obj_type_hum === type) {
                return data.children;
            } else {
                let child = await getUnitTreeByPk({ pk: data.children[0].pk });
                return this.getQuertData(child, type);
            }

        } else {
            return [];
        }
    }

    onBtnClick(type){
        if(type==='add'){
            const {canopenmodel} = this.state;
            if(canopenmodel){
                this.setState({addVisiable:true})
            }else{
                notification.warning({
                    message: '请选择分项节点',
                    duration: 2
                })
            }
        }else if(type==='delete'){
            this.setState({deleteVisiable:true})
        }
    }
    covertURLRelative = (originUrl) => {
        return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }
    generate(attachment){
        let atta = attachment[0].response;
        return {
            a_file:this.covertURLRelative(atta.a_file),
            download_url:this.covertURLRelative(atta.download_url),
            mime_type:atta.mime_type,
            preview_url:this.covertURLRelative(atta.preview_url),
            create_time:atta.create_time,
            name:atta.name
        }
    }
    onAddCheck(){
        const {
            actions: {
                createFlow,
                getWorkflowById,
                putFlow,
            },
        } = this.props;
        let user = getUser();//当前登录用户
        let postData = {};
        this.props.form.validateFields((err,values) =>{
            if(!err){
                const currentUser = {
                    "username": user.username,
                    "person_code": user.code,
                    "person_name": user.name,
                    "id": parseInt(user.id)
                };
                let subject = [{
                    "littleban":JSON.stringify(values.littleban),
                    "thinban":JSON.stringify(values.thinban),
                    "number":JSON.stringify(values.number),
                    "doctype":JSON.stringify(values.doctype),
                    "attachment":JSON.stringify(this.generate(values.attachment)),
                    "dataReview":JSON.stringify(values.dataReview),
                }];
                const nextUser = this.member;
                let WORKFLOW_MAP = {
                    name: "检验批验收审批流程",
                    desc: "质量模块检验批验收审批流程",
                    code: WORKFLOW_CODE.检验批验收审批流程
                };
                let workflowdata = {
                    name: WORKFLOW_MAP.name,
                    description: WORKFLOW_MAP.desc,
                    subject: subject,
                    code: WORKFLOW_MAP.code,
                    creator: currentUser,
                    plan_start_time: null,
                    deadline: null,
                    "status": 2
                }
                createFlow({}, workflowdata).then((instance) => {
                    if (!instance.id) {
                        notification.error({
                            message: '数据提交失败',
                            duration: 2
                        })
                        return;
                    }
                    const { id, workflow: { states = [] } = {} } = instance;
                    const [{ id: state_id, actions: [action] }] = states;

                    getWorkflowById({ id: id }).then(instance => {
                        if (instance && instance.current) {
                            let currentStateId = instance.current[0].id;
                            let nextStates = getNextStates(instance, currentStateId);
                            let stateid = nextStates[0].to_state[0].id;

                            let postInfo = {
                                next_states: [{
                                    state: stateid,
                                    participants: [nextUser],
                                    deadline: null,
                                    remark: null
                                }],
                                state: instance.workflow.states[0].id,
                                executor: currentUser,
                                action: nextStates[0].action_name,
                                note: "提交",
                                attachment: null
                            }
                            let data = { pk: id };
                            //提交流程到下一步
                            putFlow(data, postInfo).then(rst => {
                                if (rst && rst.creator) {
                                    notification.success({
                                        message: '流程提交成功',
                                        duration: 2
                                    });
                                    this.setState({
                                        addVisiable: false
                                    })
                                } else {
                                    notification.error({
                                        message: '流程提交失败',
                                        duration: 2
                                    });
                                    this.setState({
                                        addVisiable: false
                                    })
                                    return;
                                }
                            });
                        }
                    });

                });
            }
        })
        
    }
    doQuery(){
        debugger
        this.props.form.validateFields((err,values) => {
            if(!err){

            }
        });
    }
    render() {
        const rowSelection = {
            onChange: this.onSelectChange,
        };
        let ds = [];
        return (
            <Main>
                <DynamicTitle title="检验批验收" {...this.props} />
                <Sidebar>
                    <PkCodeTree treeData={this.state.root}
                        selectedKeys={this.state.leftkeycode}
                        onSelect={this.onSelect.bind(this)}
                    />
                </Sidebar>
                <Content>
                    <Spin spinning={false}>
                        <SearchInfo props={this.props} state={this.state} doQuery={this.doQuery}/>
                        <Button onClick={()=>this.onBtnClick("add")}>增加</Button>
                        <Button onClick={()=>this.onBtnClick("delete")}  style={{marginLeft:5}}>删除</Button>
                        <div className='flexBox'>
                            <Table dataSource={ds}
                                rowSelection={rowSelection}
                                style={{ width: '100%',marginTop:10}}
                                columns={this.columns}
                                className="foresttables"
                                bordered
                            />
                        </div>
                    </Spin>
                    <Modal
                        width={800}
                        height={600}
                        title="新增文档"
                        visible={this.state.addVisiable}
                        onOk={()=>this.onAddCheck()}
                        onCancel={() => { this.setState({addVisiable: false}) }}
                        maskClosable={false}
                    >
                        <AddCheckAccept props={this.props} state={this.state}/>
                    </Modal>
                    <Modal
                        width={800}
                        height={600}
                        title="删除文档"
                        visible={this.state.deleteVisiable}
                        onOk={()=>this.onAddCheck()}
                        onCancel={() => { this.setState({deleteVisiable: false}) }}
                        maskClosable={false}
                    >
                        <DeleteCheckAccept props={this.props} state={this.state}/>
                    </Modal>
                </Content>
            </Main>

        );
    }
    
    //树选择
    onSelect(value = []) {
        const { actions: { getLittleBan } } = this.props;
        let keycode = value[0] || '';
        this.setState({ leftkeycode: keycode });
        let len = keycode.split('-').length;
        let littleBan = [];
        if(len === 6){
            this.setState({canopenmodel:true});
            getLittleBan({no:keycode}).then(rst =>{
                if(rst instanceof Array && rst.length >0){
                    for(let i=0;i<rst.length;i++){
                        if(littleBan.indexOf(rst[i].SmallClass) === -1){
                            littleBan.push(rst[i].SmallClass);
                        }
                    }
                    this.setState({littleBan,rst});
                }
            })
            this.props.form.setFieldsValue({
                littleban: undefined,
                thinban: undefined,
            })
        }else{
            this.setState({canopenmodel:false})
        }
    }
}

export default Form.create()(CheckAccept)
