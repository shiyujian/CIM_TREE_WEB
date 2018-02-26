import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions, ID } from '../store';
import { actions as actions2 } from '../store/cells';
import { actions as platformActions } from '_platform/store/global';
import { message, Select, Table, Input, Button, Upload, Modal, Spin, Radio, Carousel, Row, Col, Form, notification, Popconfirm } from 'antd';
import { Main, Content, Sidebar, DynamicTitle } from '_platform/components/layout';
import { getUser } from '_platform/auth';
import { PkCodeTree } from '../components';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import SearchInfo from '../components/CheckAccept/SearchInfo';
import AddCheckAccept from '../components/CheckAccept/AddCheckAccept';
import DeleteCheckAccept from '../components/CheckAccept/DeleteCheckAccept';
import './common.less';
import { getNextStates } from '_platform/components/Progress/util';
import WorkflowHistory from '../components/WorkflowHistory.js';
import { USER_API, SERVICE_API, WORKFLOW_API, JYPMOD_API, UPLOADFILE_API, SOURCE_API, STATIC_DOWNLOAD_API, WORKFLOW_CODE } from '_platform/api';
import '../../Datum/components/Datum/index.less'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

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
                render: (text, record, index) => {
                    if (text === 2) {
                        return <p>执行中</p>
                    } else if (text === 3) {
                        return <p>已完成</p>
                    } else if (text === 4) {
                        return <p>已废止</p>
                    } else {
                        return <p>未知</p>
                    }
                }
            }, {
                title: '操作',
                render: (text, record, index) => {
                    return (
                        <div>
                            <Button onClick={this.view.bind(this, record)} >
                                查看
                            </Button>

                            <Button onClick={this.download.bind(this, record)}>
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
            deleteVisiable: false,
            addVisiable: false,
            root: [],
            littleBan: [],
            thinBan: [],
            canopenmodel: false,
            user: {},
            dataSource: [],
            area: [], project: [], unitProject: [], fenbu: [], fenxiang: [], selectedKeys: [],rst:[],rst1:[]
        };
    }
    view(record) {
        const { actions: { openPreview } } = this.props;
        let filed = {};
        // filed.misc = record.attachment.misc;
        filed.a_file = `${SOURCE_API}` + (record.attachment.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (record.attachment.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        // filed.name = record.attachment.name;
        filed.mime_type = record.attachment.mime_type;
        openPreview(filed);
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
    download(record) {
        let apiGet = `${STATIC_DOWNLOAD_API}` + (record.attachment.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        this.createLink(this, apiGet);
    }
    componentDidMount() {
        const { actions: { getTreeNodeList, getTasksList } } = this.props;
        let user = getUser();//当前登录用户
        let dataSource = [];
        this.setState({ user });
        let postData = {
            code: WORKFLOW_CODE["检验批验收审批流程"],
            creator: user.username,
            status:2
        }
        getTasksList(postData).then(rst => {
            if (rst instanceof Array && rst.length > 0) {
                rst.map((item, i) => {
                    let single = {};
                    single.key = i;
                    single.number = item.subject[0].number;
                    single.docType = item.subject[0].doctype;
                    single.flow_status = item.status;
                    single.thinban = item.subject[0].thinban;
                    single.littleban = item.subject[0].littleban;
                    single.area = item.subject[0].area;
                    single.unitProject = item.subject[0].unitProject;
                    single.project = item.subject[0].project;
                    single.fenbu = item.subject[0].fenbu;
                    single.fenxiang = item.subject[0].fenxiang;
                    single.attachment = JSON.parse(item.subject[0].attachment);
                    single.id = item.id;
                    dataSource.push(single);
                })
                this.setState({ dataSource })
            }
        })
        getTreeNodeList().then(rst => {
            let nodeLevel = [];
            if (rst instanceof Array && rst.length > 0) {
                let root, level2, level3, level4, level5, level6 = [];
                root = rst.filter(node => {
                    return node.Type === '项目工程' && nodeLevel.indexOf(node.No)===-1 && nodeLevel.push(node.No);
                })
                level2 = rst.filter(node => {
                    return node.Type === '子项目工程' && nodeLevel.indexOf(node.No)===-1 && nodeLevel.push(node.No);
                })
                level3 = rst.filter(node => {
                    return node.Type === '单位工程' && nodeLevel.indexOf(node.No)===-1 && nodeLevel.push(node.No);
                })
                level4 = rst.filter(node => {
                    return node.Type === '子单位工程' && nodeLevel.indexOf(node.No)===-1 && nodeLevel.push(node.No);
                })
                level5 = rst.filter(node => {
                    return node.Type === '分部工程' && nodeLevel.indexOf(node.No)===-1 && nodeLevel.push(node.No);
                })
                level6 = rst.filter(node => {
                    return node.Type === '分项工程' && nodeLevel.indexOf(node.No)===-1 && nodeLevel.push(node.No);
                })
                for (let i = 0; i < level5.length; i++) {
                    level5[i].children = level6.filter(node => {
                        return node.Parent === level5[i].No;
                    })
                }
                for (let i = 0; i < level4.length; i++) {
                    level4[i].children = level5.filter(node => {
                        return node.Parent === level4[i].No;
                    })
                }
                for (let i = 0; i < level3.length; i++) {
                    level3[i].children = level4.filter(node => {
                        return node.Parent === level3[i].No;
                    })
                }
                for (let i = 0; i < level2.length; i++) {
                    level2[i].children = level3.filter(node => {
                        return node.Parent === level2[i].No;
                    })
                }
                root[0].children = level2;
                this.setState({ root, rst });
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

    onBtnClick(type) {
        let deleteArray = [];
        let num = 0;
        if (type === 'add') {
            const { canopenmodel } = this.state;
            if (canopenmodel) {
                this.setState({ addVisiable: true })
            } else {
                notification.warning({
                    message: '请选择分项节点',
                    duration: 2
                })
            }
        } else if (type === 'delete') {
            const { actions: { deleteTasksList } } = this.props;
            const { dataSource, selectedKeys } = this.state;
            let promiseArr = [];
            if (selectedKeys instanceof Array && selectedKeys.length === 0) {
                notification.warning({
                    message: '请选择至少选择一条数据！',
                    duration: 2
                })
                return
            }
            promiseArr = selectedKeys.map(count => {
                return deleteTasksList({ id: dataSource[count].id })
            })
            const newData = this.state.dataSource;
            if (promiseArr.length) {
                Promise.all(promiseArr).then(res => {
                    let result = true;
                    let num = 0;
                    if(res instanceof Array){
                        for(let i=0;i<res.length;i++){
                            result = result && (res[i] === "")
                            if(res[i] === ""){   //可以缓存中清除该条
                                let current = num + selectedKeys[i];
                                const newData = this.state.dataSource;
                                num --;
                                newData.splice(current,1);
                                this.setState({dataSource:newData})
                            }
                        }
                        if(result){
                            notification.warning({
                                message: '删除成功！',
                                duration: 2
                            })
                        }else{
                            notification.warning({
                                message: '删除失败！',
                                duration: 2
                            })
                        }
                    }else{
                        notification.warning({
                            message: '删除失败！',
                            duration: 2
                        })
                    }
                })
            }
        }
    }
    covertURLRelative = (originUrl) => {
        return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }
    generate(attachment) {
        let atta = attachment[0].response;
        return {
            a_file: this.covertURLRelative(atta.a_file),
            download_url: this.covertURLRelative(atta.download_url),
            mime_type: atta.mime_type,
            preview_url: this.covertURLRelative(atta.preview_url),
            create_time: atta.create_time,
            name: atta.name
        }
    }
    onAddCheck() {
        const {
            actions: {
                createFlow,
                getWorkflowById,
                putFlow,
                getTasksList
            },
        } = this.props;
        const { area, project, unitProject, fenbu, fenxiang } = this.state;
        let user = this.state.user;
        let postData = {};
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const currentUser = {
                    "username": user.username,
                    "person_code": user.code,
                    "person_name": user.name,
                    "id": parseInt(user.id)
                };
                let subject = [{
                    "littleban": values.littleban,
                    "thinban": values.thinban,
                    "number": values.number,
                    "doctype": values.doctype,
                    "attachment": JSON.stringify(this.generate(values.attachment)),
                    "dataReview": values.dataReview,
                    "area": area[0].Name,
                    "project": project[0].Name,
                    "unitProject": unitProject[0].Name,
                    "fenbu": fenbu[0].Name,
                    "fenxiang": fenxiang[0].Name,
                }];
                const userNext = JSON.parse(values.dataReview)
                const nextUser = {
                    "username": userNext.username,
                    "id": userNext.id,
                    "person_code": userNext.account.person_code,
                    "person_name": userNext.account.person_name
                }
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
                                    let dataSource = [];
                                    let { user } = this.state;
                                    let postData = {
                                        code: WORKFLOW_CODE["检验批验收审批流程"],
                                        creator: user.username,
                                        status:2
                                    }
                                    getTasksList(postData).then(rst => {
                                        if (rst instanceof Array && rst.length > 0) {
                                            rst.map((item, i) => {
                                                let single = {};
                                                single.key = i;
                                                single.number = item.subject[0].number;
                                                single.docType = item.subject[0].doctype;
                                                single.flow_status = item.status;
                                                single.thinban = item.subject[0].thinban;
                                                single.littleban = item.subject[0].littleban;
                                                single.area = item.subject[0].area;
                                                single.unitProject = item.subject[0].unitProject;
                                                single.project = item.subject[0].project;
                                                single.fenbu = item.subject[0].fenbu;
                                                single.fenxiang = item.subject[0].fenxiang;
                                                single.attachment = JSON.parse(item.subject[0].attachment);
                                                single.id = item.id;
                                                dataSource.push(single);
                                            })
                                            this.setState({ dataSource })
                                        }
                                    })
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
    doQuery() {
        const { actions: { getTasksList } } = this.props;
        const {user,fenxiang} = this.state;
        debugger
        let dataSource = [];
        let me = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let littleban = values.littleban ? values.littleban : '';
                let thinban = values.thinban ? values.thinban : '';
                let number = values.number ? values.number : '';
                let status = values.status ? values.status : 2;
                let real_start_time_begin = '',real_start_time_end = '';
                if(values.date){
                    real_start_time_begin =  moment(values.date[0]).format('YYYY-MM-DD') + " 00:00:00" 
                    real_start_time_end = moment(values.date[1]).format('YYYY-MM-DD') + " 00:00:00" 
                }
                let postData = {
                    real_start_time_begin:real_start_time_begin,
                    real_start_time_end:real_start_time_end,
                    status:status,
                    littleban:littleban,
                    thinban:thinban,
                    number:number,
                    code: WORKFLOW_CODE["检验批验收审批流程"],
                    creator: user.username,
                    fenxiang:fenxiang[0].Name
                }
                getTasksList(postData).then(rst => {
                    if (rst instanceof Array && rst.length > 0) {
                        rst.map((item, i) => {
                            let single = {};
                            single.key = i;
                            single.number = item.subject[0].number;
                            single.docType = item.subject[0].doctype;
                            single.flow_status = item.status;
                            single.thinban = item.subject[0].thinban;
                            single.littleban = item.subject[0].littleban;
                            single.area = item.subject[0].area;
                            single.unitProject = item.subject[0].unitProject;
                            single.project = item.subject[0].project;
                            single.fenbu = item.subject[0].fenbu;
                            single.fenxiang = item.subject[0].fenxiang;
                            single.attachment = JSON.parse(item.subject[0].attachment);
                            single.id = item.id;
                            dataSource.push(single);
                        })
                        me.setState({ dataSource })
                    }
                    me.setState({dataSource})
                })
            }
        });
    }
    onSelectChange(keys) {
        this.setState({ selectedKeys: keys })
    }
    render() {
        const rowSelection = {
            onChange: this.onSelectChange.bind(this),
        };
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
                        <SearchInfo props={this.props} state={this.state} doQuery={this.doQuery.bind(this)} />
                        <Button onClick={() => this.onBtnClick("add")}>增加</Button>
                        <Popconfirm
                            placement="topRight"
                            title="确定要删除吗？"
                            onConfirm={() => this.onBtnClick("delete")}
                            okText="确定"
                            cancelText="取消"
                            style={{ marginLeft: 5 }}>
                            <Button style={{ marginLeft: 5 }}>删除</Button>
                        </Popconfirm>
                        <div className='flexBox'>
                            <Table dataSource={this.state.dataSource}
                                rowSelection={rowSelection}
                                style={{ width: '100%', marginTop: 10 }}
                                columns={this.columns}
                                className="foresttables"
                                bordered
                            />
                        </div>
                    </Spin>
                    <Preview />
                    <Modal
                        width={800}
                        height={600}
                        title="新增文档"
                        key = {Math.random()}
                        visible={this.state.addVisiable}
                        onOk={() => this.onAddCheck()}
                        onCancel={() => { this.setState({ addVisiable: false }) }}
                        maskClosable={false}
                    >
                        <AddCheckAccept props={this.props} state={this.state} />
                    </Modal>
                    <Modal
                        width={800}
                        height={600}
                        title="删除文档"
                        visible={this.state.deleteVisiable}
                        onOk={() => this.onAddCheck()}
                        onCancel={() => { this.setState({ deleteVisiable: false }) }}
                        maskClosable={false}
                    >
                        <DeleteCheckAccept props={this.props} state={this.state} />
                    </Modal>
                </Content>
            </Main>

        );
    }
    searchReverseTree(code) {
        let { rst, area, project, unitProject, fenbu, fenxiang } = this.state;
        fenxiang = rst.filter(node => {
            return node.No === code
        })
        fenbu = rst.filter(node => {
            return node.No === fenxiang[0].Parent
        })
        unitProject = rst.filter(node => {
            return node.No === fenbu[0].Parent
        })
        project = rst.filter(node => {
            return node.No === unitProject[0].Parent
        })
        area = rst.filter(node => {
            return node.No === project[0].Parent
        })
        this.setState({ area, project, unitProject, fenbu, fenxiang });
    }

    //树选择
    onSelect(value = []) {
        const { actions: { getLittleBan } } = this.props;
        let keycode = value[0] || '';
        this.setState({ leftkeycode: keycode });
        let len = keycode.split('-').length;
        let littleBan = [];
        if (len === 6) {
            this.setState({ canopenmodel: true });
            getLittleBan({ no: keycode }).then(rst => {
                if (rst instanceof Array && rst.length > 0) {
                    for (let i = 0; i < rst.length; i++) {
                        if (littleBan.indexOf(rst[i].SmallClass) === -1) {
                            littleBan.push(rst[i].SmallClass);
                        }
                    }
                    this.setState({ littleBan, rst1:rst });
                }
            })
            this.props.form.setFieldsValue({
                littleban: undefined,
                thinban: undefined,
            })
            this.searchReverseTree(keycode);
        } else {
            this.setState({ canopenmodel: false })
        }
    }
}

export default Form.create()(CheckAccept)
