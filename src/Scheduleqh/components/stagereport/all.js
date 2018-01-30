import React, { Component } from 'react';
import { Table, Spin, Button, notification, Modal, Form, Row, Col, Input, Select, Checkbox, Upload, Progress, Icon, Popconfirm } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Link } from 'react-router-dom';
import { getUser } from '../../../_platform/auth';
import { base, SOURCE_API, DATASOURCECODE } from '../../../_platform/api';
import PerSearch from './PerSearch';
import { WORKFLOW_CODE } from '../../../_platform/api';
import { getNextStates } from '../../../_platform/components/Progress/util';
import queryString from 'query-string';
import SearchInfo from './SearchInfo';
import TotleModal from './TotleModal';
const FormItem = Form.Item;
const Dragger = Upload.Dragger;
moment.locale('zh-cn');


class All extends Component {
    static propTypes = {};
    constructor(props) {
        super(props);
        this.state = {
            totolData: [
                {
                    unit: "1111"
                }
            ],
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

    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, dataSourceSelected: selectedRows });
    }
    // 操作
    clickInfo(record) {
        this.setState({ totlevisible: true });
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
        //专业信息
        let attrs = {};
        me.props.form.validateFields((err, values) => {
            if (!err) {
                if (TreatmentData.length === 0) {
                    notification.error({
                        message: '请上传文件',
                        duration: 5
                    })
                    return
                }
                // 共有信息
                for (let value in values) {
                    if (value === 'area') {
                        postData.area = values[value];
                    } else if (value === 'unit') {
                        postData.unit = values[value];
                    } else if (value === 'type') {
                        postData.type = values[value];
                    } else if (value === 'superunit') {
                        postData.superunit = values[value];
                    } else if (value === 'dataReview') {
                        postData.dataReview = values[value];
                    } else if (value === 'numbercode') {
                        postData.numbercode = values[value];
                    } else {
                        console.log("attrs")
                    }
                }
                postData.upload_unit = user.org ? user.org : '';
                postData.type = '总进度计划';
                postData.upload_person = user.name ? user.name : user.username;
                postData.upload_time = moment().format('YYYY-MM-DDTHH:mm:ss');

                let data_list = [];
                for (let i = 0; i < TreatmentData.length; i++) {
                    data_list.push(TreatmentData[i].fileId)
                }

                const currentUser = {
                    "username": user.username,
                    "person_code": user.code,
                    "person_name": user.name,
                    "id": parseInt(user.id)
                };
                let subject = [{
                    //共有属性
                    "postData": JSON.stringify(postData),
                    //专业属性
                    "attrs": JSON.stringify(attrs),
                    //数据清单
                    "TreatmentData": JSON.stringify(TreatmentData),
                    //数据清单id
                    "data_list": JSON.stringify(data_list),
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
                        a_file: '/media' + item.response.a_file.split('/media')[1]
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
                        oncancel={this.totleCancle.bind(this)}
                        onok={this.totleOk.bind(this)}
                    />
                }
                <SearchInfo {...this.props} />
                <Button onClick={this.addClick.bind(this)}>新增</Button>
                <Button onClick={this.deleteClick.bind(this)}>删除</Button>
                <Table
                    columns={this.columns}
                    rowSelection={rowSelection}
                    dataSource={this.state.totolData} />
                <Modal
                    title="新增文档"
                    width={800}
                    visible={this.state.visible}
                    maskClosable={false}
                    onCancel={this.closeModal.bind(this)}
                    onOk={this.sendWork.bind(this)}
                >
                    <div>
                        <Form>
                            <Row>
                                <Col span={24}>
                                    <Row>
                                        <Col span={8}>
                                            <FormItem {...FormItemLayout} label='单位工程'>
                                                {
                                                    getFieldDecorator('unit', {
                                                        rules: [
                                                            { required: true, message: '请选择单位工程' }
                                                        ]
                                                    })
                                                        (<Select placeholder='请选择单位工程' allowClear>
                                                            <Option value='单位工程一'>单位工程一</Option>
                                                            <Option value='单位工程二'>单位工程二</Option>
                                                            <Option value='单位工程三'>单位工程三</Option>
                                                        </Select>)
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
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
                                        <Col span={8}>
                                            <FormItem {...FormItemLayout} label='监理单位'>
                                                {
                                                    getFieldDecorator('superunit', {
                                                        rules: [
                                                            { required: true, message: '请输入监理单位' }
                                                        ]
                                                    })
                                                        (<Input placeholder='请输入监理单位' />)
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={8} offset={4}>
                                            <FormItem {...FormItemLayout}>
                                                <Button type='Primary'>模板下载</Button>
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
                    org:memberValue[5],
                }
            }
        } else {
            this.member = null
        }

        setFieldsValue({
            dataReview: this.member,
            superunit:this.member.org
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
        }, {
            title: '流程状态',
            dataIndex: 'status',
            key: 'status',
            width: '15%',
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
