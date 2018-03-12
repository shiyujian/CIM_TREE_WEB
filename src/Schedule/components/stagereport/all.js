/**
 *
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @Author: ecidi.mingey
 * @Date: 2018-02-20 10:14:05
 * @Last Modified by: ecidi.mingey
 * @Last Modified time: 2018-03-12 15:39:51
 */
import React, { Component } from 'react';
import { Table, Spin, Button, notification, Modal, Form, Row, Col, Input, Select, Checkbox, Upload, Progress, Icon, Popconfirm } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Link } from 'react-router-dom';
import { getUser } from '../../../_platform/auth';
import { base, SOURCE_API, DATASOURCECODE,UNITS } from '../../../_platform/api';
import PerSearch from './PerSearch';
import { WORKFLOW_CODE } from '../../../_platform/api';
import { getNextStates } from '../../../_platform/components/Progress/util';
import queryString from 'query-string';
import SearchInfo from './SearchInfo';
import TotleModal from './TotleModal';
import './index.less';
const FormItem = Form.Item;
const Dragger = Upload.Dragger;
moment.locale('zh-cn');


class All extends Component {
    static propTypes = {};
    constructor(props) {
        super(props);
        this.state = {
            totolData: [],
            TotleModaldata:[],
            selectedRowKeys: [],
            dataSourceSelected: [],
            visible: false,
            totlevisible: false,
            fileList: [],
            isCopyMsg: false, //接收人员是否发短信
            TreatmentData: [],
            newFileLists: [],
        };
    }
    async componentDidMount() {
        this.gettaskSchedule();
    }
    // 获取总进度进度计划流程信息
    gettaskSchedule = async ()=>{
        const { actions: { getTaskSchedule } } = this.props;
        let reqData={};
        this.props.form.validateFields((err, values) => {
			console.log("总进度进度计划流程信息", values);
            console.log("err", err);
            
            values.sunitproject?reqData.subject_unit__contains = values.sunitproject : '';
            values.snumbercode?reqData.subject_numbercode__contains = values.snumbercode : '';
            values.ssuperunit?reqData.subject_superunit__contains = values.ssuperunit : '';
            values.stimedate?reqData.real_start_time_begin = moment(values.stimedate[0]._d).format('YYYY-MM-DD HH:MM:SS') : '';
            values.stimedate?reqData.real_start_time_end = moment(values.stimedate[1]._d).format('YYYY-MM-DD HH:MM:SS') : '';
            values.sstatus?reqData.status = values.sstatus : (values.sstatus === 0? reqData.status = 0 : '');
        })
        
        console.log('reqData',reqData)

        let tmpData = Object.assign({}, reqData);


        let task = await getTaskSchedule({ code: WORKFLOW_CODE.总进度计划报批流程 },tmpData);
        let subject = [];
        let totledata = [];
        let arrange = {};
        if(task && task instanceof Array){
            task.map((item,index)=>{
                let itemdata = item.workflowactivity.subject[0];
                let itempostdata = itemdata.postData?JSON.parse(itemdata.postData):null;
                let itemtreatmentdata = itemdata.TreatmentData ? JSON.parse(itemdata.TreatmentData) : null;
                let itemarrange = {
                    index:index+1,
                    id:item.workflowactivity.id,
                    unit: itemdata.unit?JSON.parse(itemdata.unit):'',
                    type: itempostdata.type,
                    numbercode:itemdata.numbercode?JSON.parse(itemdata.numbercode):'',
                    remarks:itemtreatmentdata[0].remarks||"--",
                    submitperson:item.workflowactivity.creator.person_name,
                    submittime:item.workflowactivity.real_start_time,
                    status:item.workflowactivity.status,
                    totlesuperunit:itemdata.superunit?JSON.parse(itemdata.superunit):'',
                    totledocument:itemdata.totledocument?JSON.parse(itemdata.totledocument):'',
                    treatmentdata:itemtreatmentdata,
                    dataReview:itemdata.dataReview?JSON.parse(itemdata.dataReview).person_name:''
                }
                totledata.push(itemarrange);
            })
            this.setState({
                totolData:totledata
            })
        }
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, dataSourceSelected: selectedRows });
    }
    // 操作--查看
    clickInfo(record) {
        this.setState({ totlevisible: true ,TotleModaldata:record});
    }
    // 取消
    totleCancle() {
        this.setState({ totlevisible: false });
    }
    // 确定
    totleOk() {
        this.setState({ totlevisible: false });
    }
    // 删除
    deleteClick = () => {
        const { selectedRowKeys } = this.state
        if (selectedRowKeys.length === 0) {
            notification.warning({
                message: '请先选择数据！',
                duration: 2
            });
            return
        } else {
            alert('还未做删除功能')
        }
    }

    // 新增按钮
    addClick = () => {
        const { actions: { postUploadFilesAc } } = this.props;
        postUploadFilesAc([]);
        this.setState({
            visible: true,
            TreatmentData: [],
        })
        this.props.form.setFieldsValue({
            superunit: undefined,
            unit: undefined,
            dataReview: undefined,
            numbercode: undefined
        })

    }
    // 关闭弹框
    closeModal() {
        const { actions: { postUploadFilesAc } } = this.props;
        postUploadFilesAc([]);

        this.setState({
            visible: false,
            TreatmentData: [],
        })
    }
    // 确认提交
    sendWork() {
        const {
            actions: {
                createFlow,
            getWorkflowById,
            putFlow
            },
            location,
        } = this.props
        const {
            TreatmentData,
        } = this.state
        let user = getUser();//当前登录用户
        let me = this;
        //共有信息
        let postData = {};
        me.props.form.validateFields((err, values) => {
            console.log('asdasddddddddddddddddddddd',values)
            if (!err) {
                if (TreatmentData.length === 0) {
                    notification.error({
                        message: '请上传文件',
                        duration: 5
                    })
                    return
                }

                postData.upload_unit = user.org ? user.org : '';
                postData.type = '总进度计划';
                postData.upload_person = user.name ? user.name : user.username;
                postData.upload_time = moment().format('YYYY-MM-DDTHH:mm:ss');


                const currentUser = {
                    "username": user.username,
                    "person_code": user.code,
                    "person_name": user.name,
                    "id": parseInt(user.id)
                };
                let subject = [{
                    "unit": JSON.stringify(values.unit),
					"superunit": JSON.stringify(values.superunit),
					"dataReview": JSON.stringify(values.dataReview),
					"numbercode": JSON.stringify(values.numbercode),
					"timedate": JSON.stringify(moment().format('YYYY-MM-DD')),
					"totledocument": JSON.stringify(values.totledocument),
					"postData": JSON.stringify(postData),
                    "TreatmentData": JSON.stringify(TreatmentData),
                    
                }];
                const nextUser = this.member;
                let WORKFLOW_MAP = {
                    name: "总进度计划报批流程",
                    desc: "进度管理模块总进度计划报批流程",
                    code: WORKFLOW_CODE.总进度计划报批流程
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
                                    this.gettaskSchedule();//重新更新流程列表
                                    this.setState({
                                        visible: false
                                    })
                                } else {
                                    notification.error({
                                        message: '流程提交失败',
                                        duration: 2
                                    });
                                    return;
                                }
                            });


                        }
                    });

                });


            }
        })


    }
    // 短信
    _cpoyMsgT(e) {
        this.setState({
            isCopyMsg: e.target.checked,
        })
    }
    //选择审核人员
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
                    "id": parseInt(memberValue[3])
                }
            }
        } else {
            this.member = null
        }

        setFieldsValue({
            dataReview: this.member,
            // superunit:
        });
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
                const { actions: { postUploadFilesAc } } = this.props;
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
                postUploadFilesAc(newFileLists)

            }
        },
    };
    // 修改备注

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
    render() {
        const { selectedRowKeys, } = this.state;
        const {
            form: { getFieldDecorator },
            fileList = [],
        } = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const FormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        }
        return (
            <div>
                {
                    this.state.totlevisible &&
                    <TotleModal {...this.props}
                        {...this.state.TotleModaldata}
                        oncancel={this.totleCancle.bind(this)}
                        onok={this.totleOk.bind(this)}
                    />
                }
                <SearchInfo {...this.props} gettaskSchedule={this.gettaskSchedule.bind(this)}/>
                <Button onClick={this.addClick.bind(this)}>新增</Button>
                {/* <Button onClick={this.deleteClick.bind(this)}>删除</Button> */}
                <Table
                    columns={this.columns}
                    // rowSelection={rowSelection}
                    dataSource={this.state.totolData} 
                    bordered
                    rowKey='index'
                    className='foresttable'/>
                <Modal
                    title="新增文档"
                    width={800}
                    visible={this.state.visible}
                    maskClosable={false}
                    onCancel={this.closeModal.bind(this)}
                    onOk={this.sendWork.bind(this)}
                    key={Math.random*3}
                >
                    <div>
                        <Form>
                            <Row>
                                <Col span={24}>
                                    <Row>
                                        <Col span={12}>
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
                                        <Col span={12}>
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
                                    </Row>
                                    <Row>
                                        <Col span={12}>
                                            <FormItem {...FormItemLayout} label='文档类型'>
                                                {
                                                    getFieldDecorator('totledocument', {
                                                        initialValue: `总计划进度`,
                                                        rules: [
                                                            { required: true, message: '请选择文档类型' }
                                                        ]
                                                    })
                                                        (<Input readOnly/>)
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem {...FormItemLayout} label='监理单位'>
                                                {
                                                    getFieldDecorator('superunit', {
                                                        rules: [
                                                            { required: true, message: '请选择审核人员' }
                                                        ]
                                                    })
                                                        (<Input placeholder='系统自动识别，无需手输' readOnly/>)
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
                                            rowKey='index'
                                            className='foresttable'
                                        />
                                    </Row>
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
                                </Col>
                            </Row>

                        </Form>
                    </div>
                </Modal>
            </div>
        )
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

    columns = [
        {
            title: '单位工程',
            dataIndex: 'unit',
            key: 'unit',
            width: '15%'
        }, {
            title: '进度类型',
            dataIndex: 'type',
            key: 'type',
            width: '10%'
        }, {
            title: '编号',
            dataIndex: 'numbercode',
            key: 'numbercode',
            width: '10%'
        }, {
            title: '备注',
            dataIndex: 'remarks',
            key: 'remarks',
            width: '10%'
        }, {
            title: '提交人',
            dataIndex: 'submitperson',
            key: 'submitperson',
            width: '10%'
        }, {
            title: '提交时间',
            dataIndex: 'submittime',
            key: 'submittime',
            width: '10%',
            sorter: (a, b) => moment(a['submittime']).unix() - moment(b['submittime']).unix(),
			render: text => {
				return moment(text).format('YYYY-MM-DD');
			}
        }, {
            title: '流程状态',
            dataIndex: 'status',
            key: 'status',
            width: '15%',
            render:(record,index)=>{
                if(record===1){
                    return '已提交'
                }else if(record===2){
                    return '执行中'
                }else if(record===3){
                    return '已完成'
                }else{
                    return ''
                }
            }
        }, {
            title: '操作',
            render: record => {
                return (
                    <span>
                        <a onClick={this.clickInfo.bind(this, record)}>查看</a>
                    </span>
                )
            }
        },
    ];
    columns1 = [{
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
    }]
}

export default Form.create()(All)
