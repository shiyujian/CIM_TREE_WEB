import React, {PropTypes, Component} from 'react';
import {FILE_API} from '../../../_platform/api';
import {
    Form, Input, Row, Col, Modal, Upload, Button,
    Icon, message, Table,DatePicker,Progress,Select,Checkbox,Popconfirm,notification,Card,Steps
} from 'antd';
import moment from 'moment';
import {DeleteIpPort} from '../../../_platform/components/singleton/DeleteIpPort';
// import PerSearch from '../Task/PerSearch';
import PerSearch from '../../../_platform/components/panels/PerSearch';
import { getUser } from '../../../_platform/auth';
import { WORKFLOW_CODE, UNITS } from '../../../_platform/api';
import { getNextStates } from '../../../_platform/components/Progress/util';
import { base, SOURCE_API, DATASOURCECODE } from '../../../_platform/api';
import queryString from 'query-string';
const Dragger = Upload.Dragger;
const FormItem = Form.Item;
const Step = Steps.Step;


class OverallFormRefill extends Component {

    static propTypes = {};
    constructor(props) {
        super(props);
        this.state = {
            isCopyMsg: false, //接收人员是否发短信
            TreatmentData: [],
            newFileLists: [],
        };
    }

    columns1 = [
        {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: '10%',
        }, {
            title: '文件名称',
            dataIndex: 'fileName',
            key: 'fileName',
            width: '35%',
        }, {
            title: '备注',
            dataIndex: 'remarks',
            key: 'remarks',
            width: '30%',
            render: (text, record, index) => {
                return <Input value={record.remarks || ""} onChange={ele => {
                    record.remarks = ele.target.value
                    this.forceUpdate();
                }} />
            }
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: '10%',
            render: (text, record, index) => {
                return <div>
                    <Popconfirm
                        placement="rightTop"
                        title="确定删除吗？"
                        onConfirm={this.deleteTreatmentFile.bind(this, record, index)}
                        okText="确认"
                        cancelText="取消">
                        <a>删除</a>
                    </Popconfirm>
                </div>
            }
        }
    ]

    render() {

        const { platform: { task = {}, users = {} } = {}, location, actions, form: { getFieldDecorator } } = this.props;
		const { history = [], transitions = [], states = [] } = task;
		const user = getUser();
        
        const FormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        }
        return (
            <div>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Card title='流程详情'>
                        <Row>
                            <Col span={24}>
                                <Row>
                                    <Col span={10}>
                                        <FormItem {...FormItemLayout} label='单位工程'>
                                            {
                                                getFieldDecorator('unit', {
                                                    rules: [
                                                        { required: true, message: '请选择单位工程' }
                                                    ]
                                                })
                                                    (<Select placeholder='请选择单位工程' allowClear>
                                                        {UNITS.map(d => <Option key={d.value} value={d.value}>{d.value}</Option>)}
                                                    </Select> )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={10}>
                                        <FormItem {...FormItemLayout} label='名称'>
                                            {
                                                getFieldDecorator('name', {
                                                    rules: [
                                                        { required: true, message: '请输入名称' }
                                                    ]
                                                })
                                                    (<Input placeholder='请输入名称' />)
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={10}>
                                        <FormItem {...FormItemLayout} label='编号'>
                                            {
                                                getFieldDecorator('numbercode', {
                                                    rules: [
                                                        { required: true, message: '请输入编号' }
                                                    ]
                                                })
                                                    (<Input placeholder='请输入编号' />)
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={10}>
                                        <FormItem {...FormItemLayout} label='文档类型'>
                                            {
                                                getFieldDecorator('document', {
                                                    rules: [
                                                        { required: true, message: '请选择文档类型' }
                                                    ]
                                                })
                                                    (<Select placeholder='请选择文档类型' allowClear>
                                                        <Option key={3} value={'施工组织设计'}>施工组织设计</Option>
                                                        <Option key={4} value={'施工方案'}>施工方案</Option>
                                                    </Select>)
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Dragger
                                        {...this.uploadProps}
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <Icon type="inbox" />
                                        </p>
                                        <p className="ant-upload-text">点击或者拖拽开始上传</p>
                                        <p className="ant-upload-hint">
                                            支持 pdf、doc、docx 文件
                                        </p>
                                    </Dragger>

                                    <Table
                                        columns={this.columns1}
                                        pagination={true}
                                        dataSource={this.state.TreatmentData}
                                        className='foresttable'
                                    />
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                    <Card title={'审批流程'} style={{marginTop:10}}>
                        <Steps direction="vertical" size="small" current={history.length - 1}>
                            {
                                history.map((step, index) => {
                                    const { state: { participants: [{ executor = {} } = {}] = [] } = {} } = step;
                                    const { id: userID } = executor || {};
                                    if (step.status === 'processing') { // 根据历史状态显示
                                        const state = this.getCurrentState();
                                        return (
                                            <Step 
                                                title={
                                                    <div style={{ marginBottom: 8 }}>
                                                        <span>{step.state.name}-(执行中)</span>
                                                        <span style={{ paddingLeft: 20 }}>当前执行人: </span>
                                                        <span style={{ color: '#108ee9' }}> {`${executor.person_name}` || `${executor.username}`}</span>
                                                    </div>}
                                                description={userID === +user.id &&
                                                    <div>
                                                        <Row>
                                                            <Col span={8} offset={4}>
                                                                <FormItem {...FormItemLayout} label='审核人'>
                                                                    {
                                                                        getFieldDecorator('dataReview', {
                                                                            rules: [
                                                                                { required: true, message: '请选择审核人员' }
                                                                            ]
                                                                        })
                                                                            (
                                                                            <PerSearch selectMember={this.selectMember.bind(this)} />
                                                                            )
                                                                    }
                                                                </FormItem>
                                                            </Col>
                                                            <Col span={8} offset={4}>
                                                                <Checkbox onChange={this._cpoyMsgT.bind(this)}>短信通知</Checkbox>
                                                            </Col>
                                                        </Row>
                                                        <FormItem>
                                                            <Row>
                                                                <Col span={24} style={{ textAlign: 'center' }}>
                                                                    <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">提交</Button>
                                                                </Col>
                                                            </Row>
                                                        </FormItem>
                                                    </div>} 
                                                key={index} 
                                            />

                                        )
                                    } else {
                                        const { records: [record] } = step;
                                        const { log_on = '', participant: { executor = {} } = {}, note = '' } = record || {};
                                        const { person_name: name = '', organization = '' } = executor;
                                        return (
                                            <Step key={index} title={`${step.state.name}-(${step.status})`}
                                                description={
                                                    <div style={{ lineHeight: 2.6 }}>
                                                        <div>审核意见：{note}</div>
                                                        <div>
                                                            <span>审核人:{`${name}` || `${executor.username}`} [{organization}]</span>
                                                            <span
                                                                style={{ paddingLeft: 20 }}>审核时间：{moment(log_on).format('YYYY-MM-DD HH:mm:ss')}</span>
                                                        </div>
                                                    </div>} />);
                                    }
                                }).filter(h => !!h)
                            }
                        </Steps>
                    </Card>
                </Form>
            </div>
            
				
        );
    }

    getCurrentState() {
		const { platform: { task = {} } = {}, location = {} } = this.props;
		const { state_id = '0' } = queryString.parse(location.search) || {};
		const { states = [] } = task;
		return states.find(state => state.status === 'processing' && state.id === +state_id);
	}


    handleSubmit = (e) =>{
        e.preventDefault();
        const {
            platform: { task = {} } = {},
            actions: {
                putFlow,
                postSubject
            },
            location
        } = this.props;
        const{
            TreatmentData
        } = this.state
        let user = getUser();//当前登录用户
        let me = this;
        let postData = {};
        me.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
            if (!err) {
                //存储新的流程详情
                if (TreatmentData.length === 0) {
                    notification.error({
                        message: '请上传文件',
                        duration: 5
                    })
                    return
                }
                
                postData.upload_unit = user.org ? user.org : '';
                postData.upload_person = user.name ? user.name : user.username;
                postData.upload_time = moment().format('YYYY-MM-DDTHH:mm:ss');

                let subject = [{
                    "unit": JSON.stringify(values.unit),
                    "name": JSON.stringify(values.name),
					"numbercode": JSON.stringify(values.numbercode),
                    "document": JSON.stringify(values.document),
                    "dataReview": JSON.stringify(values.dataReview),
					"postData": JSON.stringify(postData),
                    "TreatmentData": JSON.stringify(TreatmentData),
                }];
                let newSubject = {
                    subject:subject
                }

                const { state_id = '0' } = queryString.parse(location.search) || {};
                console.log('state_id', state_id)
                let executor = {
                    "username": user.username,
                    "person_code": user.code,
                    "person_name": user.name,
                    "id": parseInt(user.id),
                    "org": user.org,
                };
                let nextUser = {};
                
                nextUser = values.dataReview;
                // 获取流程的action名称
                let action_name = '';
                let nextStates = getNextStates(task, Number(state_id));
                console.log('nextStates',nextStates)
                let stateid = 0
                action_name = nextStates[0].action_name
                stateid = nextStates[0].to_state[0].id
                console.log('nextStates', nextStates)

                
                let note = action_name + '。';
                
                let state = task.current[0].id;
                let postdata = {
                    next_states: [
                        {
                            state: stateid,
                            participants: [nextUser],
                            dealine: null,
                            remark: null,
                        }
                    ],
                    state: state,
                    executor: executor,
                    action: action_name,
                    note: note,
                    attachment: null
                }


                
                let data = {
                    pk: task.id
                }
                postSubject(data,newSubject).then( value=>{
                    console.log('value',value)
                })

                putFlow(data,postdata).then( rst=>{
                    console.log('rst',rst)
                    if(rst && rst.creator){
                        notification.success({
                            message: '流程提交成功',
                            duration: 2
                        }) 
                        let to = `/selfcare`;
                        me.props.history.push(to)
                    } else {
                        notification.error({
                            message: '流程通过失败',
                            duration: 2
                        })
                        return
                    }
                })
            }
        })
        
    }

    //选择人员
    selectMember(memberInfo) {
        const {
            form: {
                setFieldsValue
            }
        } = this.props
        this.member = null;
        if (memberInfo) {
            let memberValue = memberInfo.toString().split('#');
            if (memberValue[0] === 'C_PER') {
                this.member = {
                    "username": memberValue[4],
                    "person_code": memberValue[1],
                    "person_name": memberValue[2],
                    "id": parseInt(memberValue[3]),
                    org: memberValue[5],
                }
            }
        } else {
            this.member = null
        }

        setFieldsValue({
            dataReview: this.member,
            superunit: this.member.org
        });
    }

    //删除文件表格中的某行
    deleteTreatmentFile = (record, index) => {
        let newFileLists = this.state.newFileLists;
        let newdata = [];
        newFileLists.splice(index, 1);
        newFileLists.map((item, index) => {
            let data = {
                index: index + 1,
                fileName: item.file_name,
                fileId: item.file_id,
                fileUrl: item.file_partial_url,
                fileTime: item.send_time
            }
            newdata.push(data)
        })
        this.setState({ newFileLists, TreatmentData: newdata })
    }

    //上传文件
    uploadProps = {
        name: 'a_file',
        multiple: true,
        showUploadList: false,
        action: base + "/service/fileserver/api/user/files/",
        onChange: ({ file, fileList, event }) => {

            const status = file.status;
            const { newFileLists } = this.state;
            let newdata = [];
            if (status === 'done') {
                let newFileLists = fileList.map(item => {
                    return {
                        file_id: item.response.id,
                        file_name: item.name,
                        send_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                        file_partial_url: '/media' + item.response.a_file.split('/media')[1],
                        download_url: '/media' + item.response.download_url.split('/media')[1],
                        a_file: '/media' + item.response.a_file.split('/media')[1],
                        misc: item.response.misc,
                        mime_type: item.response.mime_type,
                    }
                })
                newFileLists.map((item, index) => {
                    let data = {
                        index: index + 1,
                        fileName: item.file_name,
                        file_id: item.file_id,
                        file_partial_url: item.file_partial_url,
                        send_time: item.send_time,
                        a_file: item.a_file,
                        download_url: item.download_url,
                        misc: item.misc,
                        mime_type: item.mime_type,
                    }
                    newdata.push(data)
                })
                this.setState({ newFileLists, TreatmentData: newdata })
            }
        },
    };

    // 短信
    _cpoyMsgT(e) {
        this.setState({
            isCopyMsg: e.target.checked,
        })
    }

}
export default Form.create()(OverallFormRefill)