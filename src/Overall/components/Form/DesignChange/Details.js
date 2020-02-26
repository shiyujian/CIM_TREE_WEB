import React, { Component } from 'react';
import {
    Tabs,
    Modal,
    Row,
    Col,
    Table,
    Button,
    Popconfirm,
    Input,
    Progress,
    Select,
    Form,
    message,
    InputNumber,
    Notification,
    DatePicker,
    Upload,
    Icon,
    Checkbox,
    Card 
} from 'antd';
import {getFieldValue} from '../../../../_platform/store/util';
import { getUser } from '_platform/auth';
import moment from 'moment'; 
const { TextArea } = Input;
const { Option } = Select;
const FormItem = Form.Item;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
const newDateTimeFormat = 'YYYY/MM/DD HH:mm:ss';
const Dragger = Upload.Dragger;
class Details extends Component {
    static layout = {
        labelCol: {span: 8},
        wrapperCol: {span: 16}
    };
    constructor (props) {
        super(props);
        this.state = {
            executor:'',  //下一步执行人
            userInfo: {}, // 用户信息
            FileName: '', //  附件名称
            CheckFile: '', //  附件地址
            Meeting:'',  //关联会议
            Remark: '', // 备注
            // CheckStatus: '', // 审核结果
            Works: [], // 流程列表
            CurrentNode: '', // 当前节点ID
            CurrentNodeName: '', // 当前节点名称
            passNodeID: '', // 通过节点ID
            noPassNodeID: '', // 不通过节点ID
            meetingList:[],  //会议列表
        };
        this.Row = {};
    }
    componentDidMount () {
        // this.getWorkDetails();
        // // 获取下一个执行节点ID
        // this.getNextNode();
    }
    componentWillReceiveProps (nextProps) {
        if(nextProps.detailRow != this.props.detailRow){
            this.Row = nextProps.detailRow;
            this.getWorkDetails();
            // 获取下一个执行节点ID
            //this.getNextNode();
        }

    }
    getNextNode () {
        const {
            //flowID,
            actions: { getDirectionList }
        } = this.props;
        const { CurrentNode } = this.state;
        let param = {
            fiowid: this.Row.FlowID,
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
                    //if (item.Name === '同意') {
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
    getWorkDetails = async () => {
        const {
            detailRow,
            actions: { getWorkDetails }
        } = this.props;
        let workDetails = await getWorkDetails({ID:this.Row.ID}, {});
        if (workDetails && workDetails.StarterObj && workDetails.Works) {
            let DrawingNo = '', VersionNum = '', Section = '', Remark = '', CheckFile = '',FileName = '', MajorName = '', Meeting = '';
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
                    } else if (item.Key === 'MajorName'){
                        MajorName = item.Val;
                    } else if (item.Key === 'Meeting'){
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
            this.getNextNode();
            this.getMeetingList();
        }
    }
    // save(){
    //     this.props.DetailsReturn();
    // }

    cancel(){
        this.props.DetailsReturn();
    }

    changeFormField (key, event) {
        let value = getFieldValue(event);
        if(key == "executor"){
            this.setState({
                executor:value
            })
          
        }
    }

    onReturn(){
        const {
            flowID,
            flowName,
            workID,
            actions: { postSendwork },
            form: { validateFields }
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
                    WorkID: this.Row.ID, // 任务ID
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

    onSubmit(){
        const {
            flowID,
            flowName,
            workID,
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
                let executor = values.executor1!=""&&values.executor1!=undefined?values.executor + '|'+values.executor1:values.executor;
                let params = {
                    FlowID: flowID, // 流程ID
                    FlowName: flowName, // 流程名称
                    WorkID: this.Row.ID, // 任务ID
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

    getMeetingList(){
        const { getMeetingList } = this.props.actions;
        getMeetingList({}).then(rep => {
            if (rep && rep.code === 1) {
                this.setState({
                    meetingList: rep.content,
                });
            }
        });
    }

    render () {
        const { getFieldDecorator } = this.props.form;
        const {
            Title,
            DrawingNo,
            constructionOrg,
            Starter,
            Section,
            VersionNum,
            Remark,
            StarterPhone,
            Createtime,
            Works,
            CurrentNodeName,
            userInfo,
            CheckFile,
            FileName,
            MajorName,
            Meeting,
            meetingList,
        } = this.state;
        let detailRow = this.props.detailRow;
        let meeting = [];   
        if(Meeting){
            meeting = Meeting.split(",");
        }
        let meetingArr = [];
        if(meetingList&&Meeting){
            for(let i=0;i<meetingList.length;i++){
                for(let j=0;j<meeting.length;j++){
                    if(meetingList[i].ID == meeting[j]){
                        meetingArr.push(meetingList[i]);
                    }
                }
            }
        }
        let checkList = [];
        if(meetingArr && meetingArr.length>0){
            checkList = meetingArr.map((item, index) => {
                return <div style={{border:'1px solid #ccc',borderRadius:5,color:'#17bfb1',textAlign:'center',marginBottom:'5px'}} value={item.ID} key={index}>{item.MeetingName}
                    </div>;
            });
        }
        let NextExecutorObjs = [];   //通过NextExecutorObjs数组长度来判断是否需要选择下一步执行人，只有最后一个人需要选择
        if(JSON.stringify(detailRow) !== "{}"){
            NextExecutorObjs = detailRow.NextExecutorObjs;
        }
        let projectList = this.props.projectList;
        let sections = "";
        if (projectList.length > 0 &&Section) {
            for (let i = 0; i < projectList.length; i++) {
                if (projectList[i].No == Section.split('-')[0]) {
                    let list = projectList[i].children;
                    for (let j = 0; j < list.length; j++) {
                        if (list[j].No == Section) {
                            sections = list[j].Name;
                        }
                    }
                }
            }
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
                    console.log(rep);
                    this.setState({
                        FileName: file.name,
                        CheckFile: rep
                    });
                });
                return false;
            }
        };
        return <div>
            <Modal style={{top: 100}}
                title="设计变更通知单"
                width={720} visible={this.props.DetailsModalVisible}
                //onOk={this.save.bind(this)} 
                okButtonProps={{disabled: true}}
                onCancel={this.cancel.bind(this)}
                >
                <div style={{color:'#ff0000',position:'absolute',top:'35px',fontSize:'12px'}}>表单编号：{detailRow.WorkNo}</div>
                <Tabs
                    defaultActiveKey='formdetails'
                    >
                    <TabPane tab='表单详情' key='formdetails'>
                        <Form>
                            <Row>
                                <Col span={12}>
                                    <FormItem {...Details.layout} label='变更名称'>
                                        <Input value={Title} readOnly style={{width: 'calc(100% * 2)', maxWidth: 'calc(100% * 2)'}}/>
                                    </FormItem>
                                </Col> 
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem {...Details.layout} label='设计单位'>
                                        <Input value={constructionOrg} readOnly style={{width: 'calc(100% * 2)', maxWidth: 'calc(100% * 2)'}}/>
                                    </FormItem>
                                </Col> 
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem {...Details.layout} label='图号'>
                                        <Input value={DrawingNo} readOnly/>
                                    </FormItem>
                                </Col> 
                                <Col span={12}>
                                    <FormItem {...Details.layout} label='标段'>
                                        <Input value={sections} readOnly/>
                                    </FormItem>
                                </Col>  
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem {...Details.layout} label='专业名称'>
                                        <Input value={MajorName} readOnly style={{width: 'calc(100% * 2)', maxWidth: 'calc(100% * 2)'}}/>
                                    </FormItem>
                                </Col> 
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem {...Details.layout} label='发起人'>
                                        <Input value={Starter} readOnly/>
                                    </FormItem>
                                </Col> 
                                <Col span={12}>
                                    <FormItem {...Details.layout} label='联系电话'>
                                        <Input value={StarterPhone} readOnly/>
                                    </FormItem>
                                </Col> 
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem {...Details.layout} label='发起时间'>
                                        <Input value={Createtime} readOnly/>
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
                                        {CheckFile!=""?<a title="点击下载附件" href={CheckFile}>{FileName}</a>:'暂无附件'}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </TabPane>
                    <TabPane tab='流程细节' key='flowdetails' style={{marginBottom:'20px'}}>
                        {
                            Works.map((item, index) => {
                                if(item.CurrentNodeName == "监理和造价咨询"){
                                    if(item.ExecutorObj.Roles[0].RoleName.indexOf("监理")>-1){
                                        item.CurrentNodeName = "监理";
                                    }else if(item.ExecutorObj.Roles[0].RoleName.indexOf("造价")>-1){
                                        item.CurrentNodeName = "造价咨询";
                                    }
                                }
                                if (CurrentNodeName === item.CurrentNodeName) {
                                    if(item.FormValues.length>0){
                                        return <Card size='small' key={index} style={{width: '100%'}} title={item.CurrentNodeName} extra={<div>
                                            <span>{item.ExecutorObj && item.ExecutorObj.Full_Name}</span>
                                            <span style={{display: 'inline-block', marginLeft: 20, width: 130}}>
                                                {this.getFormatTime(item.RunTime)}
                                            </span>
                                        </div>}>
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
                                    }else{
                                        return '';
                                    }
                                } else {
                                    return <Card size='small' key={index} style={{width: '100%'}} title={item.CurrentNodeName} extra={<div>
                                        <span>{item.ExecutorObj && item.ExecutorObj.Full_Name}</span>
                                        <span style={{display: 'inline-block', marginLeft: 20, width: 130}}>
                                            {this.getFormatTime(item.RunTime)}
                                        </span>
                                    </div>}>
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
                    {this.props.role.indexOf("业主")>-1&&detailRow.CurrentNodeName == "项目技术负责人"&&this.props.tabs == 'pending'?
                        <Row>
                            <Col span={12}>
                                <FormItem {...Details.layout} label='项目经理选择'>
                                    {
                                        getFieldDecorator('executor', {
                                            rules: [
                                                { required: true, message: '请选择项目经理' }
                                            ]
                                        })(
                                            <Select
                                                placeholder="请选择"
                                                onChange={this.changeFormField.bind(this,
                                            'executor')}
                                                allowClear
                                                showSearch
                                                filterOption={(input, option) =>
                                                   option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {
                                                    this.props.OwnerList.map(item => {
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
                        :
                        ''
                    }
                    {this.props.role.indexOf("业主")>-1&&detailRow.CurrentNodeName == "项目经理"&&this.props.tabs == 'pending'?
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
                                                placeholder="请选择"
                                                onChange={this.changeFormField.bind(this,
                                            'executor')}
                                                allowClear
                                                showSearch
                                                filterOption={(input, option) =>
                                                   option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {
                                                    this.props.SupervisorList.map(item => {
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
                        :
                        ''
                    }
                    {this.props.role.indexOf("业主")>-1&&detailRow.CurrentNodeName == "项目经理"&&this.props.tabs == 'pending'?
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
                                                placeholder="请选择"
                                                onChange={this.changeFormField.bind(this,
                                            'executor1')}
                                                allowClear
                                                showSearch
                                                filterOption={(input, option) =>
                                                   option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {
                                                    this.props.CostList.map(item => {
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
                        :
                        ''
                    }
                    {(this.props.role.indexOf("造价")>-1||this.props.role.indexOf("监理")>-1)&&this.props.tabs == 'pending'&&NextExecutorObjs.length == 1?
                        <Row>
                            <Col span={12}>
                                <FormItem {...Details.layout} label='施工文书选择'>
                                    {
                                        getFieldDecorator('executor', {
                                            rules: [
                                                { required: true, message: '请选择施工文书' }
                                            ]
                                        })(
                                            <Select
                                                placeholder="请选择"
                                                onChange={this.changeFormField.bind(this,
                                            'executor')}
                                                allowClear
                                                showSearch
                                                filterOption={(input, option) =>
                                                   option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {
                                                    this.props.ConstructionList.map(item => {
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
                        :
                        ''
                    }
                    {this.props.tabs == 'pending'?
                        <Row>
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
                        :''
                    }
                    {this.props.tabs == 'pending'?
                        <Row>
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
                        :''
                    }
                </Form>
                {this.props.tabs == 'pending'?
                    <Row>
                        <Col span={24} style={{textAlign:'center'}}>
                            <Button style={{marginRight: 150, cursor: 'pointer'}} onClick={this.onReturn.bind(this)}>不通过</Button>
                            <Button type='primary' style={{cursor: 'pointer'}} onClick={this.onSubmit.bind(this)}>通过</Button>     
                        </Col>
                    </Row>
                    :''
                }
            </Modal>
        </div>;
    }

};
Details = Form.create()(Details);
export default Details;
