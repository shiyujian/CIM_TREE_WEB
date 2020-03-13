import React, { Component } from 'react';
import {
    Tabs,
    Modal,
    Row,
    Col,
    Button,
    Input,
    Select,
    Form,
    Notification,
    Upload,
    Icon,
    Card
} from 'antd';
import {getFieldValue} from '_platform/store/util';
import { getUser } from '_platform/auth';
import {getSectionNameBySection} from '_platform/gisAuth';
import moment from 'moment';
const { TextArea } = Input;
const { Option } = Select;
const FormItem = Form.Item;
const { TabPane } = Tabs;
const newDateTimeFormat = 'YYYY/MM/DD HH:mm:ss';
class Details extends Component {
    static layout = {
        labelCol: {span: 8},
        wrapperCol: {span: 16}
    };
    constructor (props) {
        super(props);
        this.state = {
            executor: '', // 下一步执行人
            userInfo: {}, // 用户信息
            FileName: '', //  附件名称
            CheckFile: '', //  附件地址
            Meeting: '', // 关联会议
            Remark: '', // 备注
            // CheckStatus: '', // 审核结果
            Works: [], // 流程列表
            CurrentNode: '', // 当前节点ID
            CurrentNodeName: '', // 当前节点名称
            passNodeID: '', // 通过节点ID
            noPassNodeID: '', // 不通过节点ID
            meetingList: [], // 会议列表
            TechnicalDirectorList: [],
            ProjectManagerList: [],
            SupervisorList: [],
            CostList: [],
            ConstructionList: []
        };
    }
    componentDidMount () {
        this.getWorkDetails();
    }
    getWorkDetails = async () => {
        const {
            detailRow,
            actions: { getWorkDetails }
        } = this.props;
        let workDetails = await getWorkDetails({ID: detailRow.ID}, {});
        if (workDetails && workDetails.StarterObj && workDetails.Works) {
            let DrawingNo = '', VersionNum = '', Section = '', Remark = '', CheckFile = '', FileName = '', MajorName = '', Meeting = '';
            // 获取表单信息
            if (workDetails.Works.length && workDetails.Works[0].FormValues && workDetails.Works[0].FormValues.length) {
                let FormParams = workDetails.Works[0].FormValues[0].FormParams;
                FormParams.map(item => {
                    if (item.Key === 'DrawingNo') {
                        DrawingNo = item.Val;
                    } else if (item.Key === 'VersionNum') {
                        VersionNum = item.Val;
                    } else if (item.Key === 'Section') {
                        Section = item.Val;
                    } else if (item.Key === 'CheckContent') {
                        Remark = item.Val;
                    } else if (item.Key === 'CheckFile') {
                        CheckFile = item.Val;
                    } else if (item.Key === 'FileName') {
                        FileName = item.Val;
                    } else if (item.Key === 'MajorName') {
                        MajorName = item.Val;
                    } else if (item.Key === 'Meeting') {
                        Meeting = item.Val;
                    }
                });
            };
            this.setState({
                Title: workDetails.Title,
                constructionOrg: workDetails.StarterObj.OrgObj && workDetails.StarterObj.OrgObj.OrgName,
                Starter: workDetails.StarterObj.Full_Name,
                StarterPhone: workDetails.StarterObj.Phone,
                Createtime: moment(workDetails.CreateTime, newDateTimeFormat),
                DrawingNo,
                VersionNum,
                Section,
                Remark,
                MajorName,
                Meeting,
                userInfo: getUser(),
                CheckFile,
                FileName,
                CurrentNode: workDetails.CurrentNode,
                CurrentNodeName: workDetails.CurrentNodeName,
                Works: workDetails.Works
            });
            this.getAuditor(Section);
            this.getNextNode();
            this.getMeetingList();
        }
    }
    getAuditor = async (Section) => {
        const {
            actions: {
                getUsers,
                getRoles
            }
        } = this.props;
        let userInfo = await getUser();
        let userRoles = userInfo.roles;
        let userRoleName = (userInfo && userInfo.roles && userRoles.RoleName) || '';
        if (userRoleName) {
            let roles = await getRoles();
            let constructionRoleID = ''; // 施工文书ID
            let supervisorRoleID = ''; // 监理文书ID
            let costRoleID = ''; // 造价文书ID
            let technicalDirectorRoleID = ''; // 项目技术负责人ID
            let projectManagerRoleID = ''; // 项目经理ID

            roles.map((role) => {
                if (role && role.ID && role.ParentID && role.RoleName) {
                    if (role.RoleName === '施工文书') {
                        constructionRoleID = role.ID;
                    } else if (role.RoleName === '监理文书') {
                        supervisorRoleID = role.ID;
                    } else if (role.RoleName === '造价文书') {
                        costRoleID = role.ID;
                    } else if (role.RoleName === '项目技术负责人') {
                        technicalDirectorRoleID = role.ID;
                    } else if (role.RoleName === '项目经理') {
                        projectManagerRoleID = role.ID;
                    }
                }
            });
            let TechnicalDirectorList = []; // 项目技术负责人
            let ProjectManagerList = []; // 项目经理
            let SupervisorList = []; // 监理文书
            let CostList = []; // 造价文书
            let ConstructionList = []; // 施工文书
            if (userRoleName === '设计文书') {
                // 获取项目技术负责人
                let postTechnicalDirectorData = {
                    role: technicalDirectorRoleID,
                    section: '',
                    status: 1,
                    page: '',
                    size: ''
                };
                let TechnicalDirectorData = await getUsers({}, postTechnicalDirectorData);
                if (TechnicalDirectorData && TechnicalDirectorData.code && TechnicalDirectorData.code === 200) {
                    TechnicalDirectorData.content.map(item => {
                        TechnicalDirectorList.push({
                            Full_Name: item.Full_Name,
                            User_Name: item.User_Name,
                            id: item.ID
                        });
                    });
                }
            } else if (userRoleName === '项目技术负责人') {
                // 获取项目经理
                let postProjectManagerData = {
                    role: projectManagerRoleID,
                    section: '',
                    status: 1,
                    page: '',
                    size: ''
                };
                let ProjectManagerData = await getUsers({}, postProjectManagerData);
                if (ProjectManagerData && ProjectManagerData.code && ProjectManagerData.code === 200) {
                    ProjectManagerData.content.map(item => {
                        ProjectManagerList.push({
                            Full_Name: item.Full_Name,
                            User_Name: item.User_Name,
                            id: item.ID
                        });
                    });
                }
            } else if (userRoleName === '项目经理') {
                // 获取本标段的监理文书
                let postSupervisorData = {
                    role: supervisorRoleID,
                    section: Section,
                    status: 1,
                    page: '',
                    size: ''
                };
                let SupervisorData = await getUsers({}, postSupervisorData);
                if (SupervisorData && SupervisorData.code && SupervisorData.code === 200) {
                    SupervisorData.content.map(item => {
                        SupervisorList.push({
                            Full_Name: item.Full_Name,
                            User_Name: item.User_Name,
                            id: item.ID
                        });
                    });
                }
                // 获取本标段的造价文书
                let postCostData = {
                    role: costRoleID,
                    section: Section,
                    status: 1,
                    page: '',
                    size: ''
                };
                let CostData = await getUsers({}, postCostData);
                if (CostData && CostData.code && CostData.code === 200) {
                    CostData.content.map(item => {
                        CostList.push({
                            Full_Name: item.Full_Name,
                            User_Name: item.User_Name,
                            id: item.ID
                        });
                    });
                }
            } else if (userRoleName === '监理文书' || userRoleName === '造价文书') {
                // 获取本标段的施工文书
                let postConstructionData = {
                    role: constructionRoleID,
                    section: Section,
                    status: 1,
                    page: '',
                    size: ''
                };
                let ConstructionData = await getUsers({}, postConstructionData);
                if (ConstructionData && ConstructionData.code && ConstructionData.code === 200) {
                    ConstructionData.content.map(item => {
                        ConstructionList.push({
                            Full_Name: item.Full_Name,
                            User_Name: item.User_Name,
                            id: item.ID
                        });
                    });
                }
            }

            this.setState({
                TechnicalDirectorList,
                ProjectManagerList,
                SupervisorList,
                CostList,
                ConstructionList
            });
        }
    }
    getNextNode () {
        const {
            // flowID,
            detailRow,
            actions: { getDirectionList }
        } = this.props;
        const { CurrentNode } = this.state;
        let param = {
            fiowid: detailRow.FlowID,
            fromnodeid: CurrentNode,
            name: '',
            status: '',
            page: '',
            size: ''
        };
        getDirectionList({}, param).then(rep => {
            if (rep && rep.length) {
                let passNodeID = '', noPassNodeID = '';
                rep.map(item => {
                    // if (item.Name === '同意') {
                    if (item.Name === '通过') {
                        passNodeID = item.ToNode;
                    } else {
                        noPassNodeID = item.ToNode;
                    }
                });
                this.setState({
                    passNodeID,
                    noPassNodeID
                });
            }
        });
    }
    // save(){
    //     this.props.DetailsReturn();
    // }

    cancel () {
        this.props.DetailsReturn();
    }

    changeFormField (key, event) {
        let value = getFieldValue(event);
        if (key === 'executor') {
            this.setState({
                executor: value
            });
        }
    }

    onReturn () {
        const {
            flowID,
            flowName,
            workID,
            actions: { postSendwork },
            form: { validateFields },
            detailRow
        } = this.props;
        const { CurrentNode, CurrentNodeName, noPassNodeID, CheckFile, FileName } = this.state;
        validateFields((err, values) => {
            if (!err) {
                let FormParams = [
                    {
                        Key: 'CheckStatus', // 审核结果
                        FieldType: 0,
                        Val: '不同意'
                    },
                    {
                        Key: 'CheckContent', // 审核意见
                        FieldType: 0,
                        Val: values.CheckContent
                    },
                    {
                        Key: 'CheckFile', // 审核附件
                        FieldType: 0,
                        Val: CheckFile
                    },
                    {
                        Key: 'FileName', // 附件名称
                        FieldType: 0,
                        Val: FileName
                    }
                ];
                let params = {
                    FlowID: flowID, // 流程ID
                    FlowName: flowName, // 流程名称
                    WorkID: detailRow.ID, // 任务ID
                    CurrentNode: CurrentNode, // 当前节点
                    CurrentNodeName: CurrentNodeName, // 当前节点名称
                    NextNode: noPassNodeID,
                    NextNodeName: '',
                    FormValue: {
                        FormParams: FormParams,
                        NodeID: '' // 下一节点ID
                    }, // 表单值
                    NextExecutor: 0, // 下一节点执行人
                    Executor: getUser().ID // 当前节点执行人
                };
                postSendwork({}, params).then(rep => {
                    if (rep && rep.code === 1) {
                        Notification.success({
                            message: '审核操作成功'
                        });
                        this.props.reloadList();
                        this.props.DetailsReturn();
                    } else {
                        Notification.error({
                            message: `操作失败，${rep.msg}`
                        });
                    }
                });
            }
        });
    }

    onSubmit () {
        const {
            flowID,
            flowName,
            workID,
            detailRow,
            actions: { postSendwork },
            form: { validateFields }
        } = this.props;
        const { CurrentNode, CurrentNodeName, passNodeID, CheckFile, FileName } = this.state;
        validateFields((err, values) => {
            if (!err) {
                let FormParams = [
                    {
                        Key: 'CheckStatus', // 审核结果
                        FieldType: 0,
                        Val: '同意'
                    },
                    {
                        Key: 'CheckContent', // 审核意见
                        FieldType: 0,
                        Val: values.CheckContent
                    },
                    {
                        Key: 'CheckFile', // 审核附件
                        FieldType: 0,
                        Val: CheckFile
                    },
                    {
                        Key: 'FileName', // 附件名称
                        FieldType: 0,
                        Val: FileName
                    }
                ];
                let executor = values.executor1 !== '' && values.executor1 !== undefined ? values.executor + '|' + values.executor1 : values.executor;
                let params = {
                    FlowID: flowID, // 流程ID
                    FlowName: flowName, // 流程名称
                    WorkID: detailRow.ID, // 任务ID
                    CurrentNode: CurrentNode, // 当前节点
                    CurrentNodeName: CurrentNodeName, // 当前节点名称
                    NextNode: passNodeID,
                    NextNodeName: '',
                    FormValue: {
                        FormParams: FormParams,
                        NodeID: '' // 下一节点ID
                    }, // 表单值
                    NextExecutor: executor || 0, // 下一节点执行人
                    Executor: getUser().ID // 当前节点执行人
                };
                postSendwork({}, params).then(rep => {
                    if (rep && rep.code === 1) {
                        Notification.success({
                            message: '审核操作成功'
                        });
                        this.props.reloadList();
                        this.props.DetailsReturn();
                    } else {
                        Notification.error({
                            message: `操作失败，${rep.msg}`
                        });
                    }
                });
            }
        });
    }

    getCheckStatusVal (FormValues) {
        let CheckStatusVal = '已完成';
        if (FormValues.length && FormValues[0].FormParams) {
            FormValues[0].FormParams.map(item => {
                if (item.Key === 'CheckStatus') {
                    CheckStatusVal = item.Val;
                }
            });
        }
        return CheckStatusVal;
    }
    getCheckContentVal (FormValues) {
        let CheckContentVal = '';
        if (FormValues.length && FormValues[0].FormParams) {
            FormValues[0].FormParams.map(item => {
                if (item.Key === 'CheckContent') {
                    CheckContentVal = item.Val;
                }
            });
        }
        return CheckContentVal;
    }
    getCheckFileVal (FormValues) {

        let CheckFileVal = '', FileNameVal = '';
        if (FormValues.length && FormValues[0].FormParams) {
            FormValues[0].FormParams.map(item => {
                if (item.Key === 'CheckFile') {
                    CheckFileVal = item.Val;
                } else if (item.Key === 'FileName') {
                    FileNameVal = item.Val;
                }
            });
        }
        let node = '';
        if (FileNameVal && CheckFileVal) {
            node = (<div style={{float: 'left'}}>
                <Icon type='link' />
                <a
                    target='_blank'
                    href={CheckFileVal}
                    style={{marginLeft: 10}}
                >
                    {FileNameVal}
                </a>
            </div>);
        }

        return node;
    }
    getFormatTime (time) {
        return moment(time).format('YYYY-MM-DD HH:mm:ss');
    }

    getMeetingList () {
        const { getMeetingList } = this.props.actions;
        getMeetingList({}).then(rep => {
            if (rep && rep.code === 1) {
                this.setState({
                    meetingList: rep.content
                });
            }
        });
    }

    render () {
        const {
            tabs,
            detailRow,
            DetailsModalVisible,
            currentUserRole = '',
            form: {
                getFieldDecorator
            },
            platform: { tree = {} }
        } = this.props;
        const {
            Title,
            DrawingNo,
            constructionOrg,
            Starter,
            Section,
            Remark,
            StarterPhone,
            Createtime,
            Works,
            CurrentNodeName,
            CheckFile,
            FileName,
            MajorName,
            Meeting,
            meetingList,
            ProjectManagerList,
            SupervisorList,
            CostList,
            ConstructionList
        } = this.state;
        let meeting = [];
        if (Meeting) {
            meeting = Meeting.split(',');
        }
        let meetingArr = [];
        if (meetingList && Meeting) {
            for (let i = 0; i < meetingList.length; i++) {
                for (let j = 0; j < meeting.length; j++) {
                    if (meetingList[i].ID === meeting[j]) {
                        meetingArr.push(meetingList[i]);
                    }
                }
            }
        }
        let checkList = [];
        if (meetingArr && meetingArr.length > 0) {
            checkList = meetingArr.map((item, index) => {
                return <div
                    style={{
                        border: '1px solid #ccc',
                        borderRadius: 5,
                        color: '#17bfb1',
                        textAlign: 'center',
                        marginBottom: '5px'
                    }}
                    value={item.ID}
                    key={index}>
                    {item.MeetingName}
                </div>;
            });
        }
        // 通过NextExecutorObjs数组长度来判断是否需要选择下一步执行人，只有最后一个人需要选择
        let NextExecutorObjs = [];
        if (JSON.stringify(detailRow) !== '{}') {
            NextExecutorObjs = detailRow.NextExecutorObjs;
        }
        let sectionName = '';
        if (Section) {
            let treeList = [];
            if (tree.thinClassTree) {
                treeList = tree.thinClassTree;
            }
            sectionName = getSectionNameBySection(Section, treeList);
        }
        const Uploadprops = {
            name: '',
            action: '',
            beforeUpload: (file) => {
                const {
                    actions: { uploadFileHandler }
                } = this.props;
                const formdata = new FormData();
                formdata.append('a_file', file);
                uploadFileHandler({}, formdata).then(rep => {
                    this.setState({
                        FileName: file.name,
                        CheckFile: rep
                    });
                });
                return false;
            }
        };
        return <div>
            <Modal
                title='设计变更通知单'
                width={720}
                visible={DetailsModalVisible}
                footer={null}
                // onOk={this.save.bind(this)}
                onCancel={this.cancel.bind(this)}
            >
                <div style={{color: '#ff0000', position: 'absolute', top: '35px', fontSize: '12px'}}>
                    表单编号：{detailRow.WorkNo}
                </div>
                <Tabs
                    defaultActiveKey='formdetails'
                >
                    <TabPane tab='表单详情' key='formdetails'>
                        <Form>
                            <Row>
                                <Col span={12}>
                                    <FormItem {...Details.layout} label='变更名称'>
                                        <Input
                                            value={Title}
                                            readOnly
                                            style={{width: 'calc(100% * 2)', maxWidth: 'calc(100% * 2)'}} />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem {...Details.layout} label='设计单位'>
                                        <Input
                                            value={constructionOrg}
                                            readOnly
                                            style={{width: 'calc(100% * 2)', maxWidth: 'calc(100% * 2)'}} />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem {...Details.layout} label='图号'>
                                        <Input value={DrawingNo} readOnly />
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...Details.layout} label='标段'>
                                        <Input value={`${sectionName}(${Section})`} readOnly />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem {...Details.layout} label='专业名称'>
                                        <Input value={MajorName} readOnly style={{width: 'calc(100% * 2)', maxWidth: 'calc(100% * 2)'}} />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem {...Details.layout} label='发起人'>
                                        <Input value={Starter} readOnly />
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...Details.layout} label='联系电话'>
                                        <Input value={StarterPhone} readOnly />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem {...Details.layout} label='发起时间'>
                                        <Input value={Createtime} readOnly />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem {...Details.layout} label='关联会议'>
                                        <div>
                                            {checkList}
                                        </div>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem {...Details.layout} label='备注'>
                                        <TextArea value={Remark} readOnly rows={4} style={{width: 'calc(100% * 2)', maxWidth: 'calc(100% * 2)'}} />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem {...Details.layout} label='附件'>
                                        {CheckFile != '' ? <a title='点击下载附件' href={CheckFile}>{FileName}</a> : '暂无附件'}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </TabPane>
                    <TabPane tab='流程细节' key='flowdetails' style={{marginBottom: '20px'}}>
                        {
                            Works.map((item, index) => {
                                if (item.CurrentNodeName === '监理和造价咨询') {
                                    if (item.ExecutorObj.Roles[0].RoleName.indexOf('监理') > -1) {
                                        item.CurrentNodeNameNew = '监理';
                                    } else if (item.ExecutorObj.Roles[0].RoleName.indexOf('造价') > -1) {
                                        item.CurrentNodeNameNew = '造价咨询';
                                    }
                                } else {
                                    item.CurrentNodeNameNew = item.CurrentNodeName;
                                }
                                if (CurrentNodeName === item.CurrentNodeName) {

                                    if (item.FormValues.length > 0) {
                                        return <Card
                                            size='small'
                                            key={index}
                                            style={{width: '100%'}}
                                            title={item.CurrentNodeNameNew}
                                            extra={
                                                <div>
                                                    <span>{`${item.ExecutorObj && item.ExecutorObj.Full_Name}(${item.ExecutorObj.User_Name})`}</span>
                                                    <span style={{display: 'inline-block', marginLeft: 20, width: 130}}>
                                                        {this.getFormatTime(item.RunTime)}
                                                    </span>
                                                </div>
                                            }>
                                            <div>
                                                <span style={{display: 'inline-block', width: 50}}>
                                                    {this.getCheckStatusVal(item.FormValues)}
                                                </span>
                                                {this.getCheckContentVal(item.FormValues)}
                                            </div>
                                            <div>
                                                {
                                                    this.getCheckFileVal(item.FormValues)
                                                }
                                            </div>
                                        </Card>;
                                    } else {
                                        return '';
                                    }
                                } else {
                                    return <Card
                                        size='small'
                                        key={index}
                                        style={{width: '100%'}}
                                        title={item.CurrentNodeNameNew}
                                        extra={
                                            <div>
                                                <span>{`${item.ExecutorObj && item.ExecutorObj.Full_Name}(${item.ExecutorObj.User_Name})`}</span>
                                                <span style={{display: 'inline-block', marginLeft: 20, width: 130}}>
                                                    {this.getFormatTime(item.RunTime)}
                                                </span>
                                            </div>
                                        }>
                                        <div>
                                            <span style={{display: 'inline-block', width: 50}}>
                                                {this.getCheckStatusVal(item.FormValues)}
                                            </span>
                                            {this.getCheckContentVal(item.FormValues)}
                                        </div>
                                        <div>
                                            {
                                                this.getCheckFileVal(item.FormValues)
                                            }
                                        </div>
                                    </Card>;
                                }
                            })
                        }
                    </TabPane>
                </Tabs>
                <Form>
                    {currentUserRole.indexOf('项目技术负责人') > -1 &&
                        detailRow.CurrentNodeName === '项目技术负责人' &&
                        tabs === 'pending'
                        ? <Row>
                            <Col span={12}>
                                <FormItem {...Details.layout} label='项目经理选择'>
                                    {
                                        getFieldDecorator('executor', {
                                            rules: [
                                                { required: true, message: '请选择项目经理' }
                                            ]
                                        })(
                                            <Select
                                                placeholder='请选择'
                                                onChange={this.changeFormField.bind(this, 'executor')}
                                                allowClear
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {
                                                    ProjectManagerList.map(item => {
                                                        return <Option
                                                            value={item.id}
                                                            title={`${item.Full_Name}(${item.User_Name})`}
                                                            key={item.id}>
                                                            {`${item.Full_Name}(${item.User_Name})`}
                                                        </Option>;
                                                    })
                                                }
                                            </Select>
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        : ''
                    }
                    {currentUserRole.indexOf('项目经理') > -1 &&
                        detailRow.CurrentNodeName === '项目经理' &&
                        tabs === 'pending'
                        ? <Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem {...Details.layout} label='监理选择'>
                                        {
                                            getFieldDecorator('executor', {
                                                rules: [
                                                    { required: true, message: '请选择监理' }
                                                ]
                                            })(
                                                <Select
                                                    placeholder='请选择'
                                                    onChange={this.changeFormField.bind(this,
                                                        'executor')}
                                                    allowClear
                                                    showSearch
                                                    filterOption={(input, option) =>
                                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                >
                                                    {
                                                        SupervisorList.map(item => {
                                                            return <Option
                                                                value={item.id}
                                                                title={`${item.Full_Name}(${item.User_Name})`}
                                                                key={item.id}>
                                                                {`${item.Full_Name}(${item.User_Name})`}
                                                            </Option>;
                                                        })
                                                    }
                                                </Select>
                                            )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem {...Details.layout} label='造价咨询选择'>
                                        {
                                            getFieldDecorator('executor1', {
                                                rules: [
                                                    { required: true, message: '请选择造价咨询' }
                                                ]
                                            })(
                                                <Select
                                                    placeholder='请选择'
                                                    onChange={this.changeFormField.bind(this,
                                                        'executor1')}
                                                    allowClear
                                                    showSearch
                                                    filterOption={(input, option) =>
                                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                >
                                                    {
                                                        CostList.map(item => {
                                                            return <Option
                                                                value={item.id}
                                                                title={`${item.Full_Name}(${item.User_Name})`}
                                                                key={item.id}>
                                                                {`${item.Full_Name}(${item.User_Name})`}
                                                            </Option>;
                                                        })
                                                    }
                                                </Select>
                                            )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Row>
                        : ''
                    }
                    {(currentUserRole.indexOf('造价') > -1 || currentUserRole.indexOf('监理') > -1) &&
                        tabs === 'pending' && NextExecutorObjs.length === 1
                        ? <Row>
                            <Col span={12}>
                                <FormItem {...Details.layout} label='施工文书选择'>
                                    {
                                        getFieldDecorator('executor', {
                                            rules: [
                                                { required: true, message: '请选择施工文书' }
                                            ]
                                        })(
                                            <Select
                                                placeholder='请选择'
                                                onChange={this.changeFormField.bind(this,
                                                    'executor')}
                                                allowClear
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {
                                                    ConstructionList.map(item => {
                                                        return <Option
                                                            value={item.id}
                                                            title={`${item.Full_Name}(${item.User_Name})`}
                                                            key={item.id}>
                                                            {`${item.Full_Name}(${item.User_Name})`}
                                                        </Option>;
                                                    })
                                                }
                                            </Select>
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        : ''
                    }
                    {tabs === 'pending'
                        ? <Row>
                            <Col span={12}>
                                <FormItem
                                    {...Details.layout}
                                    label='备注说明'
                                >
                                    {
                                        getFieldDecorator('CheckContent', {
                                        })(
                                            <TextArea rows={4} />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        : ''
                    }
                    {tabs === 'pending'
                        ? <Row>
                            <Col span={12}>
                                <FormItem
                                    {...Details.layout}
                                    label='上传附件'
                                >
                                    <Upload {...Uploadprops}>
                                        <Button>
                                            <Icon type='upload' /> 上传附件
                                        </Button>
                                    </Upload>
                                </FormItem>
                            </Col>
                        </Row>
                        : ''
                    }
                </Form>
                {tabs === 'pending'
                    ? <Row>
                        <Col span={24} style={{textAlign: 'center'}}>
                            <Button
                                style={{marginRight: 150, cursor: 'pointer'}}
                                onClick={this.onReturn.bind(this)}>
                                    不通过
                            </Button>
                            <Button
                                type='primary'
                                style={{cursor: 'pointer'}}
                                onClick={this.onSubmit.bind(this)}>
                                    通过
                            </Button>
                        </Col>
                    </Row>
                    : ''
                }
            </Modal>
        </div>;
    }
};
export default Form.create()(Details);
