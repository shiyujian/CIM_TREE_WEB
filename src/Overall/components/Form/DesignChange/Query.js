import React, { Component } from 'react';
import {
    Modal,
    Row,
    Col,
    Table,
    Button,
    Input,
    Select,
    Form,
    Notification,
    DatePicker,
    Upload,
    Icon,
    Checkbox
} from 'antd';
import {getFieldValue} from '_platform/store/util';
import { getUser } from '_platform/auth';
import moment from 'moment';
const { TextArea } = Input;
const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
class Query extends Component {
    static layout = {
        labelCol: {span: 8},
        wrapperCol: {span: 16}
    };
    constructor (props) {
        super(props);
        this.state = {
            ModalVisible: false,
            filelist: [],
            MeetingModalVisible: false,
            datalist: [], // 会议数据
            name: '', // 会议名称
            stime: '', // 开始时间
            etime: '', // 结束时间
            checkmeeting: false, // 是否关联了会议
            checkdatalist: [] // 选择的会议
        };
        this._queryParams = {};
        this.checkList = [];
    }
    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            render: (text, record, index) => {
                return index + 1;
            }
        },
        {
            title: '会议名称',
            dataIndex: 'MeetingName'
        },
        {
            title: '会议地点',
            dataIndex: 'Location'
        },
        {
            title: '计划开始时间',
            dataIndex: 'StartTime'
        },
        {
            title: '计划结束时间',
            dataIndex: 'EndTime'
        },
        {
            title: '参会人数',
            dataIndex: 'Num'
        },
        {
            title: '选择',
            dataIndex: 'active',
            render: (text, record, index) => {
                return <Checkbox checked={record.ischeck} onChange={this.checkMeeting.bind(this, record)} />;
            }
        }
    ];
    componentDidMount () {
        this.getMeetingList();
    }

    getMeetingList () {
        const { getMeetingList } = this.props.actions;
        const { name, stime, etime } = this.state;
        let params = {
            name: name,
            stime: stime,
            etime: etime
        };
        getMeetingList({}, params).then(rep => {
            if (rep && rep.code === 1) {
                let data = rep.content;
                for (let i = 0; i < data.length; i++) {
                    data[i]['ischeck'] = false;
                }
                let datalist = this.state.checkdatalist;
                for (let j = 0; j < data.length; j++) {
                    for (let k = 0; k < datalist.length; k++) {
                        if (data[j]['ischeck'] != datalist[k]['ischeck'] && data[j].ID == datalist[k].ID) {
                            data[j]['ischeck'] = datalist[k]['ischeck'];
                        }
                    }
                }
                this.setState({
                    datalist: data
                });
            }
        });
    }

    onQuery () {
        if (this.props.query) {
            this.props.query(this._queryParams);
        }
    }
    onClean () {
        this.props.form.resetFields();
        this.props.query();
        this._queryParams = {};
    }
    onAdd () {
        if (this.props.sectionList.length < 1) {
            Notification.error({
                message: '请先选择项目！'
            });
            return false;
        }
        this.setState({
            ModalVisible: true
        });
    }

    save () {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {
                    actions: {postStartwork}
                } = this.props;
                if (values.name === '' || values.name === undefined) {
                    Notification.error({
                        message: '变更名称不能为空！'
                    });
                    return false;
                }
                if (values.DrawNo === '' || values.DrawNo === undefined) {
                    Notification.error({
                        message: '图号不能为空！'
                    });
                    return false;
                }
                if (values.section === '' || values.section === undefined) {
                    Notification.error({
                        message: '标段不能为空！'
                    });
                    return false;
                }
                if (values.major === '' || values.major === undefined) {
                    Notification.error({
                        message: '专业名称不能为空！'
                    });
                    return false;
                }
                if (this.checkList.length < 1) {
                    Notification.error({
                        message: '关联会议不能为空！'
                    });
                    return false;
                }
                if (values.executor === '' || values.executor === undefined) {
                    Notification.error({
                        message: '项目技术负责人不能为空！'
                    });
                    return false;
                }
                let meeting = this.checkList[0].ID;
                for (let i = 1; i < this.checkList.length; i++) {
                    meeting = meeting + ',' + this.checkList[i].ID;
                }
                let FormParams = [
                    // {
                    //     Key: 'DesignOrg', // 设计单位
                    //     FieldType: 0,
                    //     Val: this.props.org
                    // },
                    {
                        Key: 'Section', // 标段
                        FieldType: 0,
                        Val: values.section
                    },
                    {
                        Key: 'DrawingNo', // 图号
                        FieldType: 0,
                        Val: values.DrawNo
                    },
                    {
                        Key: 'MajorName', // 专业
                        FieldType: 0,
                        Val: values.major
                    },
                    // {
                    //     Key: 'FormNo', // 表单编号
                    //     FieldType: 0,
                    //     Val: values.No
                    // },
                    // {
                    //     Key: 'Phone', // 联系电话
                    //     FieldType: 0,
                    //     Val: this.props.phone
                    // },
                    {
                        Key: 'Meeting', // 关联会议
                        FieldType: 0,
                        Val: meeting
                    },
                    {
                        Key: 'CheckContent', // 备注
                        FieldType: 0,
                        Val: values.remake
                    },
                    {
                        Key: 'FileName', // 附件名称
                        FieldType: 0,
                        Val: this.state.FileName
                    },
                    {
                        Key: 'CheckFile', // 附件
                        FieldType: 0,
                        Val: this.state.CheckFile
                    },
                    {
                        Key: 'Construction', // 施工申请
                        FieldType: 0,
                        Val: values.construction
                    },
                    {
                        Key: 'VersionNum', // 版本号
                        FieldType: 0,
                        Val: ''
                    }
                ];
                let data = {
                    FlowID: this.props.flowID, // 模板ID
                    FlowName: this.props.flowName, // 模板名称
                    FormValue: { // 表单值
                        FormParams: FormParams,
                        NodeID: this.props.originNodeID
                    },
                    NextExecutor: values.executor, // 下一节点执行人
                    Starter: getUser().ID, // 发起人
                    Title: values.name, // 变更名称
                    WFState: 1 // 流程状态 1运行中
                };
                // debugger
                postStartwork({}, data).then((res) => {
                    if (res.code === 1) {
                        Notification.success({
                            message: '设计变更申请成功'
                        });
                        this.setState({
                            ModalVisible: false
                        });
                        this.props.reloadList();
                        this.onClean();
                    } else {
                        Notification.error({
                            message: res.msg
                        });
                    }
                });
            }
        });
    }
    cancel () {
        this.onClean();
        this.setState({
            ModalVisible: false
        });
    }
    onCheckMeeting () {
        this.setState({
            MeetingModalVisible: true
        });
        this.getMeetingList();
    }
    MeetingSave () {
        let checkmeeting = false;
        if (this.checkList.length > 0) {
            checkmeeting = true;
        }
        this.setState({
            MeetingModalVisible: false,
            checkmeeting: checkmeeting
        });
    }
    MeetingCancel () { // 取消时清空数据
        this.setState({
            etime: '',
            stime: '',
            name: '',
            checkdatalist: [],
            MeetingModalVisible: false
        });
        this.props.form.resetFields('MeetingName');
        this.props.form.resetFields('Meetingtime');
    }
    onMeetingQuery () {
        this.getMeetingList();
    }

    changeFormField (key, event) {
        let value = getFieldValue(event);
        if (key === 'MeetingName') {
            this.setState({
                name: value
            });
        }
        if (key === 'Meetingtime') {
            if (value.length > 0) {
                this.setState({
                    stime: moment(value[0]).format('YYYY-MM-DD HH:mm:ss'),
                    etime: moment(value[1]).format('YYYY-MM-DD HH:mm:ss')
                });
            } else {
                this.setState({
                    stime: '',
                    etime: ''
                });
            }
        }
        if (key === 'Title') {
            this._queryParams['title'] = value;
        }
        if (key === 'CreateTime') {
            this._queryParams['stime'] = moment(value[0]).format('YYYY-MM-DD HH:mm:ss');
            this._queryParams['etime'] = moment(value[1]).format('YYYY-MM-DD HH:mm:ss');
        }
        if (key === 'Status') {
            this._queryParams['wfstate'] = value;
        }
        if (key === 'Section') {
            this._queryParams['section'] = value;
        }
        if (key === 'No') {
            this._queryParams['no'] = value;
        }
        if (key === 'DrawingNo') {
            this._queryParams['drawingno'] = value;
        }
        if (key === 'Starter') {
            this._queryParams['starter'] = value;
        }
    }

    checkMeeting (record) {
        let list = this.checkList;
        let attention = {
            'ID': record.ID,
            'MeetingName': record.MeetingName
        };
        if (list) {
            if (list.length > 0) {
                for (let i = 0; i < list.length; i++) {
                    if (record.ID === list[i].ID) {
                        list.splice(i, 1);
                        this.checkList = [
                            ...list
                        ];
                    } else {
                        this.checkList = [
                            ...list,
                            attention
                        ];
                    }
                }
            } else {
                this.checkList = [
                    attention
                ];
            }
        }
        for (let j = 0; j < this.state.datalist.length; j++) {
            if (this.state.datalist[j].ID === record.ID) {
                this.state.datalist[j].ischeck = !this.state.datalist[j].ischeck;
            }
        }
        this.setState({
            datalist: this.state.datalist,
            checkdatalist: this.state.datalist
        });
    }

    removeMeeting (ID) {
        let list = this.checkList;
        if (list) {
            if (list.length > 0) {
                for (let i = 0; i < list.length; i++) {
                    if (ID === list[i].ID) {
                        list.splice(i, 1);
                        this.checkList = [
                            ...list
                        ];
                    }
                }
            }
        }
        if (this.checkList.length === 0) {
            this.setState({
                checkmeeting: false
            });
        }
        for (let j = 0; j < this.state.datalist.length; j++) {
            if (this.state.datalist[j].ID === ID) {
                this.state.datalist[j].ischeck = !this.state.datalist[j].ischeck;
            }
        }
        this.setState({
            datalist: this.state.datalist,
            checkdatalist: this.state.datalist
        });
    }

    render () {
        const {
            TechnicalDirectorList,
            currentUserRole = '',
            form: {
                getFieldDecorator
            }
        } = this.props;
        const {
            ModalVisible
        } = this.state;
        let checkmeeting = this.checkList;
        let checkList = [];
        if (checkmeeting.length > 0) {
            checkList = checkmeeting.map((item, index) => {
                return <div style={{border: '1px solid #ccc', borderRadius: 5, color: '#17bfb1', textAlign: 'center', marginBottom: '5px'}} value={item.ID} key={index}>{item.MeetingName}
                    <span style={{float: 'right', marginRight: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer'}} onClick={this.removeMeeting.bind(this, item.ID)}>X</span></div>;
            });
        }
        let createtime = moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss');
        return <div>
            {currentUserRole.indexOf('设计') > -1 || this.props.tabs === 'processed'
                ? <Form>
                    <Row>
                        <Col span={8}>
                            <FormItem {...Query.layout} label='变更名称关键字'>
                                {
                                    getFieldDecorator('Title', {
                                    })(
                                        <Input onChange={this.changeFormField.bind(this,
                                            'Title')} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...Query.layout} label='发起时间'>
                                {
                                    getFieldDecorator('CreateTime', {
                                    })(
                                        <RangePicker showTime onChange={this.changeFormField.bind(this,
                                            'CreateTime')} />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem {...Query.layout} label='流转状态'>
                                {
                                    getFieldDecorator('Status', {
                                    })(
                                        <Select
                                            placeholder='请选择流转状态'
                                            onChange={this.changeFormField.bind(this,
                                                'Status')}
                                        >
                                            <Option value='1'>运行中</Option>
                                            <Option value='2'>已完成</Option>
                                            <Option value='4'>退回</Option>
                                        </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...Query.layout} label='标段'>
                                {
                                    getFieldDecorator('Section', {
                                    })(
                                        <Select
                                            placeholder='请选择标段'
                                            onChange={this.changeFormField.bind(this,
                                                'Section')}
                                        >
                                            {
                                                this.props.sectionList.map(item => {
                                                    return <Option
                                                        value={item.No}
                                                        title={item.Name}
                                                        key={item.No}>
                                                        {item.Name}
                                                    </Option>;
                                                })
                                            }
                                        </Select>
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem {...Query.layout} label='表单编号'>
                                {
                                    getFieldDecorator('No', {
                                    })(
                                        <Input onChange={this.changeFormField.bind(this,
                                            'No')} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...Query.layout} label='图号'>
                                {
                                    getFieldDecorator('DrawingNo', {
                                    })(
                                        <Input onChange={this.changeFormField.bind(this,
                                            'DrawingNo')} />
                                    )}
                            </FormItem>
                        </Col>
                        {this.props.tabs !== 'processed'
                            ? <Button
                                type='primary'
                                style={{float: 'right', marginRight: 10, cursor: 'pointer'}}
                                onClick={this.onAdd.bind(this)}>
                                    新建表单
                            </Button>
                            : ''
                        }
                        <Button
                            type='primary'
                            style={{float: 'right', marginRight: 50, cursor: 'pointer'}}
                            onClick={this.onQuery.bind(this)}>
                                查询
                        </Button>
                        <Button
                            type='primary'
                            style={{float: 'right', marginRight: 10, cursor: 'pointer'}}
                            onClick={this.onClean.bind(this)}>
                            重置
                        </Button>
                    </Row>
                </Form>
                : <Form>
                    <Row>
                        <Col span={8}>
                            <FormItem {...Query.layout} label='变更名称关键字'>
                                {
                                    getFieldDecorator('Title', {
                                    })(
                                        <Input onChange={this.changeFormField.bind(this,
                                            'Title')} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...Query.layout} label='发起时间'>
                                {
                                    getFieldDecorator('CreateTime', {
                                    })(
                                        <RangePicker showTime onChange={this.changeFormField.bind(this,
                                            'CreateTime')} />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem {...Query.layout} label='表单编号'>
                                {
                                    getFieldDecorator('No', {
                                    })(
                                        <Input onChange={this.changeFormField.bind(this,
                                            'No')} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...Query.layout} label='图号'>
                                {
                                    getFieldDecorator('DrawingNo', {
                                    })(
                                        <Input onChange={this.changeFormField.bind(this,
                                            'DrawingNo')} />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        {/* <Col span={8}>
                            <FormItem {...Query.layout} label='发起人'>
                                {
                                    getFieldDecorator('Starter', {
                                    })(
                                        <Select
                                            placeholder='请选择'
                                            onChange={this.changeFormField.bind(this,
                                                'Starter')}
                                            allowClear
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {
                                                this.props.DesignList.map(item => {
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
                        </Col> */}
                        <Button type='primary' style={{float: 'right', marginRight: 50, cursor: 'pointer'}} onClick={this.onQuery.bind(this)}>查询</Button>
                        <Button type='primary' style={{float: 'right', marginRight: 10, cursor: 'pointer'}} onClick={this.onClean.bind(this)}>重置</Button>
                    </Row>
                </Form>
            }
            <Modal
                title='设计变更通知单'
                width={720}
                visible={ModalVisible}
                onOk={this.save.bind(this)}
                onCancel={this.cancel.bind(this)}>
                <Form>
                    <div style={{color: '#ff0000', position: 'absolute', top: '35px', fontSize: '12px'}}>表单编号：</div>
                    <Row>
                        <Col span={12}>
                            <FormItem {...Query.layout} label='变更名称'>
                                {
                                    getFieldDecorator('name', {
                                    })(
                                        <Input
                                            onChange={this.changeFormField.bind(this, 'name')}
                                            style={{width: 'calc(100% * 2)', maxWidth: 'calc(100% * 2)'}} />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...Query.layout} label='设计单位'>
                                <Input
                                    value={this.props.org}
                                    readOnly
                                    style={{width: 'calc(100% * 2)', maxWidth: 'calc(100% * 2)'}} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...Query.layout} label='图号'>
                                {
                                    getFieldDecorator('DrawNo', {
                                    })(
                                        <Input
                                            onChange={this.changeFormField.bind(this, 'DrawNo')} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...Query.layout} label='标段'>
                                {
                                    getFieldDecorator('section', {
                                    })(
                                        <Select
                                            placeholder='请选择标段'
                                            onChange={this.changeFormField.bind(this, 'section')}
                                        >
                                            {
                                                this.props.sectionList.map(item => {
                                                    return <Option
                                                        value={item.No}
                                                        title={item.Name}
                                                        key={item.No}>
                                                        {item.Name}
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
                            <FormItem {...Query.layout} label='专业名称'>
                                {
                                    getFieldDecorator('major', {
                                    })(
                                        <Input
                                            onChange={this.changeFormField.bind(this, 'major')}
                                            style={{width: 'calc(100% * 2)', maxWidth: 'calc(100% * 2)'}} />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...Query.layout} label='发起人'>
                                <Input value={this.props.name} readOnly />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...Query.layout} label='联系电话'>
                                <Input value={this.props.phone} readOnly />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...Query.layout} label='发起时间'>
                                <Input value={createtime} readOnly />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...Query.layout} label='关联会议'>
                                {!this.state.checkmeeting
                                    ? <Button
                                        type='primary'
                                        style={{cursor: 'pointer'}}
                                        onClick={this.onCheckMeeting.bind(this)}>
                                            请选择
                                    </Button>
                                    : <div>
                                        {checkList}
                                    </div>
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...Query.layout} label='备注'>
                                {
                                    getFieldDecorator('remake', {
                                    })(
                                        <TextArea
                                            onChange={this.changeFormField.bind(this, 'remark')}
                                            rows={4}
                                            style={{width: 'calc(100% * 2)', maxWidth: 'calc(100% * 2)'}} />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...Query.layout} label='附件'>
                                <Upload {...this.uploadProps} >
                                    <Button>
                                        <Icon type='upload' /> 上传附件
                                    </Button>
                                </Upload>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...Query.layout} label='项目技术负责人'>
                                {
                                    getFieldDecorator('executor', {
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
                                                TechnicalDirectorList.map(item => {
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
                </Form>
            </Modal>
            <Modal style={{top: 100}}
                title='会议信息'
                width={920} visible={this.state.MeetingModalVisible}
                onOk={this.MeetingSave.bind(this)} onCancel={this.MeetingCancel.bind(this)}>
                <Form>
                    <Row>
                        <Col span={8}>
                            <FormItem {...Query.layout} label='会议名称'>
                                {
                                    getFieldDecorator('MeetingName', {
                                    })(
                                        <Input onChange={this.changeFormField.bind(this,
                                            'MeetingName')} placeholder='请输入会议名称关键字' />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...Query.layout} label='会议时间'>
                                {
                                    getFieldDecorator('Meetingtime', {
                                    })(
                                        <RangePicker showTime onChange={this.changeFormField.bind(this,
                                            'Meetingtime')} />
                                    )}
                            </FormItem>
                        </Col>
                        <Button type='primary' style={{marginTop: 5, float: 'right', marginRight: 20, cursor: 'pointer'}} onClick={this.onMeetingQuery.bind(this)}>查询</Button>
                    </Row>
                    <Table
                        columns={this.columns}
                        dataSource={this.state.datalist}
                        rowKey='ID'
                    />
                </Form>
            </Modal>
        </div>;
    }
    uploadProps = {
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
};
export default Form.create()(Query);
