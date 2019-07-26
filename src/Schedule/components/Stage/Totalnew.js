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
 * @Last Modified time: 2019-07-18 14:43:35
 */
import React, { Component } from 'react';
import {
    Table,
    Select,
    Button,
    notification,
    Modal,
    Form,
    Row,
    Col,
    Input,
    Checkbox,
    Upload,
    Icon,
    DatePicker,
    Popconfirm
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { getUser } from '_platform/auth';
import {
    UPLOAD_API,
    WORKFLOW_CODE
} from '_platform/api';
import PerSearch from './PerSearch';
import { getNextStates } from '_platform/components/Progress/util';
import SearchInfo from './SearchInfo';
import TotleModal from './TotleModal';
import './index.less';
import { SSL_OP_NO_TLSv1_1 } from 'constants';
import { WFStatusList } from '../common';
const FormItem = Form.Item;
const Dragger = Upload.Dragger;
const { RangePicker } = DatePicker;
const { Option } = Select;
moment.locale('zh-cn');
class Total extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            section: '', // 用户所在标段
            username: '', // 用户名
            formItem: [], // 表单项
            workID: '', // 任务ID
            totolData: [],
            TotleModaldata: [],
            selectedRowKeys: [],
            dataSourceSelected: [],
            visible: false,
            totlevisible: false,
            fileList: [],
            isCopyMsg: false, // 接收人员是否发短信
            TreatmentData: [],
            sectionArray: [], // 标段列表
            fileDataList: [], // 文件表格
            newFileLists: [],
            key: Math.random(),
            sectionSchedule: [], // 当前用户的标段信息
            file: '',
            projectName: '', // 当前用户的项目信息
            filterData: [], // 对流程信息根据项目进行过滤
            currentSection: '',
            currentSectionName: '',
            loading: false
        };
    }
    async componentDidMount () {
        this.getSection(); // 获取当前登陆用户的标段
        this.getWorkList(); // 获取任务列表
    }
    getSection () {
        const {
            platform: { tree = {} },
            leftkeycode
        } = this.props;
        console.log('获取用户所属标段', tree, 'leftkeycode');
        let sectionData = (tree && tree.bigTreeList) || [];
        let user = getUser();

        let section = user.section;
        let currentSectionName = '';
        let projectName = '';
        let sectionArray = [];

        if (section) {
            console.log(section, '用户所在标段');
            let code = section.split('-');
            if (code && code.length === 3) {
                // 获取当前标段所在的项目
                sectionData.map(item => {
                    if (code[0] === item.No) {
                        projectName = item.Name;
                        console.log(item.children, 'item.children');
                        item.children.map(item => {
                            // 获取当前标段的名字
                            if (item.No === section) {
                                currentSectionName = item.Name;
                                sectionArray.push(item);
                            }
                        });
                    }
                });
            }
            console.log('sectionArray', sectionArray);
            this.setState({
                section: section,
                sectionArray,
                currentSection: section,
                currentSectionName: currentSectionName,
                projectName: projectName
            });
        } else {
            sectionData.map(project => {
                if (leftkeycode === project.No) {
                    project.children.map(item =>
                        sectionArray.push(item)
                    );
                }
            });
            this.setState({
                sectionArray
            });
        }
    }
    getWorkList () {
        const { getWorkList } = this.props.actions;
        let params = {
            workid: '', // 任务ID
            title: '', // 任务名称
            flowname: '总进度计划报批流程', // 流程类型或名称
            starter: '', // 发起人
            currentnode: '', // 节点ID
            prevnode: '', // 上一结点ID
            executor: '', // 执行人
            sender: '', // 上一节点发送人
            haveexecuted: '', // 是否已执行 1已办
            stime: '', // 开始时间
            etime: '', // 结束时间
            page: '', // 页码
            size: '' // 页数
        };
        getWorkList({}, params).then(rep => {
            if (rep.code === 200) {
                let workDataList = [];
                rep.content.map(item => {
                    workDataList.push(item);
                });
                console.log('任务列表', workDataList);
                this.setState({
                    workDataList
                });
            }
        });
    }
    async componentDidUpdate (prevProps, prevState) {
        const { leftkeycode } = this.props;
        if (leftkeycode != prevProps.leftkeycode) {
            this.filterTask();
        }
    }
    // 获取总进度进度计划流程信息
    gettaskSchedule = async () => {
        const {
            actions: { getTaskSchedule },
            leftkeycode
        } = this.props;
        let reqData = {};
        this.props.form.validateFields((err, values) => {
            values.sunitproject
                ? (reqData.subject_sectionName__contains = values.sunitproject)
                : '';
            values.snumbercode
                ? (reqData.subject_numbercode__contains = values.snumbercode)
                : '';
            // values.ssuperunit?reqData.subject_superunit__contains = values.ssuperunit : '';
            values.stimedate
                ? (reqData.real_start_time_begin = moment(
                    values.stimedate[0]._d
                ).format('YYYY-MM-DD 00:00:00'))
                : '';
            values.stimedate
                ? (reqData.real_start_time_end = moment(
                    values.stimedate[1]._d
                ).format('YYYY-MM-DD 23:59:59'))
                : '';
            values.sstatus
                ? (reqData.status = values.sstatus)
                : values.sstatus === 0
                    ? (reqData.status = 0)
                    : '';
        });

        let tmpData = Object.assign({}, reqData);

        let task = await getTaskSchedule(
            { code: WORKFLOW_CODE.总进度计划报批流程 },
            tmpData
        );
        let subject = [];
        let totledata = [];
        let arrange = {};
        if (task && task instanceof Array) {
            task.map((item, index) => {
                let itemdata = item.subject[0];
                let itempostdata = itemdata.postData
                    ? JSON.parse(itemdata.postData)
                    : null;
                let itemtreatmentdata = itemdata.TreatmentData
                    ? JSON.parse(itemdata.TreatmentData)
                    : null;
                let itemarrange = {
                    index: index + 1,
                    id: item.id,
                    section: itemdata.section
                        ? JSON.parse(itemdata.section)
                        : '',
                    sectionName: itemdata.sectionName
                        ? JSON.parse(itemdata.sectionName)
                        : '',
                    projectName: itemdata.projectName
                        ? JSON.parse(itemdata.projectName)
                        : '',
                    type: itempostdata.type,
                    numbercode: itemdata.numbercode
                        ? JSON.parse(itemdata.numbercode)
                        : '',
                    // remarks:itemtreatmentdata[0].remarks||"--",
                    submitperson: item.creator.person_name,
                    submittime: moment(item.workflow.created_on)
                        .utc()
                        .zone(-8)
                        .format('YYYY-MM-DD'),
                    status: item.status,
                    // totlesuperunit:itemdata.superunit?JSON.parse(itemdata.superunit):'',
                    totledocument: itemdata.totledocument
                        ? JSON.parse(itemdata.totledocument)
                        : '',
                    treatmentdata: itemtreatmentdata,
                    dataReview: itemdata.dataReview
                        ? JSON.parse(itemdata.dataReview).person_name
                        : ''
                };
                totledata.push(itemarrange);
            });
            this.setState(
                {
                    totolData: totledata
                },
                () => {
                    this.filterTask();
                }
            );
        }
    };
    // 对流程信息根据选择项目进行过滤
    filterTask () {
        const { totolData } = this.state;
        const { leftkeycode } = this.props;
        let filterData = [];
        let user = getUser();

        let section = user.section;
        let selectCode = '';
        // 关联标段的人只能看自己项目的进度流程
        if (section) {
            let code = section.split('-');
            selectCode = code[0] || '';

            totolData.map(task => {
                let projectName = task.projectName;
                let projectCode = this.getProjectCode(projectName);

                if (
                    projectCode === selectCode &&
                    task.section === section
                ) {
                    filterData.push(task);
                }
            });
        } else {
            // 不关联标段的人可以看选择项目的进度流程
            selectCode = leftkeycode;
            totolData.map(task => {
                let projectName = task.projectName;
                let projectCode = this.getProjectCode(projectName);

                if (projectCode === selectCode) {
                    filterData.push(task);
                }
            });
        }

        this.setState({
            filterData
        });
    }
    // 获取项目code
    getProjectCode (projectName) {
        const {
            platform: { tree = {} }
        } = this.props;
        let sectionData = (tree && tree.bigTreeList) || [];
        let projectCode = '';
        sectionData.map(item => {
            if (projectName === item.Name) {
                projectCode = item.No;
            }
        });
        return projectCode;
    }
    // 获取当前登陆用户的标段的下拉选项
    getSectionOption () {
        const { sectionSchedule } = this.state;
        console.log('sectionSchedule', sectionSchedule);
        let option = [];
        sectionSchedule.map(section => {
            option.push(
                <Option key={section.value} value={section.value}>
                    {section.name}
                </Option>
            );
        });
        return option;
    }
    onSearch () {
        let params = {
            flowname: '总进度计划报批流程', // 流程类型或名称
            stime: '', // 开始时间
            etime: '' // 结束时间
        };
        this.getWorkList();
    }
    render () {
        const {
            workDataList,
            sectionArray,
            formItem,
            selectedRowKeys,
            sectionSchedule = [],
            filterData,
            TotleModaldata,
            currentSectionName
        } = this.state;
        const { auditorList } = this.props;
        const {
            form: { getFieldDecorator },
            fileList = []
        } = this.props;

        let user = getUser();
        let username = user.username;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };

        const FormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        let fileName = '暂无文件';
        if (this.state.file) {
            fileName = this.state.file.name;
        }
        return (
            <div>
                {this.state.totlevisible && (
                    <TotleModal
                        {...this.props}
                        {...this.state}
                        oncancel={this.totleCancle.bind(this)}
                        onok={this.totleOk.bind(this)}
                    />
                )}
                <Form layout='inline'>
                    <FormItem label='标段'>
                        {getFieldDecorator('sunitproject', {
                            rules: [
                                {
                                    required: false,
                                    message: '请选择标段'
                                }
                            ]
                        })(
                            <Select placeholder='请选择标段' style={{width: 220}}>
                                {sectionArray.map(item => {
                                    return <Option value={item.Name} key={item.No}>{item.Name}</Option>;
                                })}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label='编号'>
                        {getFieldDecorator('snumbercode', {
                            rules: [
                                {
                                    required: false,
                                    message: '请输入编号'
                                }
                            ]
                        })(<Input placeholder='请输入编号' style={{width: 220}} />)}
                    </FormItem>
                    <FormItem label='日期'>
                        {getFieldDecorator('stimedate', {
                            rules: [
                                {
                                    type: 'array',
                                    required: false,
                                    message: '请选择日期'
                                }
                            ]
                        })(
                            <RangePicker
                                size='default'
                                format='YYYY-MM-DD'
                                style={{
                                    width: '100%',
                                    height: '100%'
                                }}
                            />
                        )}
                    </FormItem>
                    <FormItem
                        label='流程状态'
                    >
                        {getFieldDecorator('sstatus', {
                            rules: [
                                {
                                    required: false,
                                    message: '请选择流程状态'
                                }
                            ]
                        })(
                            <Select
                                style={{width: 220}}
                                placeholder='请选择流程类型'
                                allowClear
                            >
                                {WFStatusList.map(item => {
                                    return <Option key={item.value} value={item.value}>
                                        {item.label}
                                    </Option>;
                                })}
                            </Select>
                        )}
                    </FormItem>
                </Form>
                <Button type='primary' onClick={this.onSearch.bind(this)}>查询</Button>
                <Button style={{marginLeft: 20}} onClick={this.onAdd.bind(this)}>新增</Button>
                <Table
                    columns={this.columns}
                    rowSelection={username === 'admin' ? rowSelection : null}
                    dataSource={workDataList}
                    bordered
                    rowKey='ID'
                    className='foresttable'
                />
                <Modal
                    title='新增文档'
                    width={800}
                    visible={this.state.visible}
                    maskClosable={false}
                    onCancel={this.closeModal.bind(this)}
                    onOk={this.sendWork.bind(this)}
                >
                    <div>
                        <Form>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        {...FormItemLayout}
                                        label='标段'
                                    >
                                        {getFieldDecorator(
                                            'Tsection',
                                            {
                                                rules: [{required: true}],
                                                initialValue: currentSectionName
                                            }
                                        )(
                                            <Input
                                                style={{width: 220}}
                                                placeholder='请输入标段'
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...FormItemLayout}
                                        label='编号'
                                    >
                                        {getFieldDecorator(
                                            'Tnumbercode',
                                            {
                                                rules: [{required: true}]
                                            }
                                        )(
                                            <Input
                                                style={{width: 220}}
                                                placeholder='请输入编号'
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        {...FormItemLayout}
                                        label='文档类型'
                                    >
                                        {getFieldDecorator(
                                            'Ttotledocument',
                                            {
                                                rules: [{required: true}],
                                                initialValue: `总计划进度`
                                            }
                                        )(
                                            <Input style={{width: 220}} readOnly />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Dragger {...this.uploadProps}>
                                    <p className='ant-upload-drag-icon'>
                                        <Icon type='inbox' />
                                    </p>
                                    <p className='ant-upload-text'>
                                        点击或者拖拽开始上传
                                    </p>
                                    <p className='ant-upload-hint'>
                                        支持 pdf、doc、docx 文件
                                    </p>
                                </Dragger>
                                <Table
                                    columns={this.columnFile}
                                    rowKey='cid'
                                    pagination
                                    dataSource={
                                        this.state.fileDataList
                                    }
                                    className='foresttable'
                                />
                            </Row>
                            <Row style={{ marginTop: 20 }}>
                                <Col span={8} offset={4}>
                                    <FormItem
                                        {...FormItemLayout}
                                        label='审核人'
                                    >
                                        {getFieldDecorator(
                                            'TdataReview'
                                        )(
                                            <Select style={{ width: 120 }}>
                                                {auditorList.map(item => {
                                                    return <Option value={item.id} key={item.id}>{item.name}</Option>;
                                                })}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8} offset={4}>
                                    <Checkbox
                                        onChange={this.changeNote.bind(
                                            this
                                        )}
                                    >
                                        短信通知
                                    </Checkbox>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Modal>
            </div>
        );
    }
    // 确认新增
    sendWork () {
        const {
            actions: { postStartwork },
            form: { validateFields }
        } = this.props;
        validateFields((err, values) => {
            if (!err) {
                console.log('确认', values.Tsection, values.Tnumbercode, values.Ttotledocument, values.TdataReview);
                const { section, fileDataList } = this.state;
                let newFileDataList = [];
                fileDataList.map(item => {
                    newFileDataList.push({
                        name: item.name,
                        remark: item.remark,
                        url: item.url
                    });
                });
                let FormParams = [{
                    Key: 'Tsection', // 标段
                    FieldType: 0,
                    Val: section
                }, {
                    Key: 'Tnumbercode', // 编号
                    FieldType: 0,
                    Val: values.Tnumbercode
                }, {
                    Key: 'Ttotledocument', // 文档类型
                    FieldType: 0,
                    Val: values.Ttotledocument
                }, {
                    Key: 'fileDataList', // 文档列表
                    FieldType: 0,
                    Val: JSON.stringify(newFileDataList)
                }, {
                    Key: 'TdataReview', // 审核人
                    FieldType: 0,
                    Val: values.TdataReview
                }];
                postStartwork({}, {
                    FlowID: 'dd50b1a8-8b39-4733-8677-10251fd7d9b4', // 模板ID
                    FlowName: '总进度计划报批流程', // 模板名称
                    FormValue: { // 表单值
                        FormParams: FormParams,
                        NodeID: ''
                    },
                    NextExecutor: 14, // 下一节点执行人
                    Starter: getUser().ID, // 发起人
                    Title: section + ' 总计划进度', // 任务标题
                    WFState: 1 // 流程状态 1运行中
                }).then(rep => {
                    if (rep.code === 1) {
                        notification.success({
                            message: '新增任务成功',
                            duration: 3
                        });
                        this.setState({
                            visible: false
                        });
                    } else {
                        notification.error({
                            message: '新增任务失败',
                            duration: 3
                        });
                    }
                });
            }
        });
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, dataSourceSelected: selectedRows });
    };

    // 操作--查看
    clickInfo (workID) {
        // TotleModaldata: record,
        this.setState({ totlevisible: true, workID });
    }
    // 取消
    totleCancle () {
        this.setState({ totlevisible: false });
    }
    // 确定
    totleOk () {
        this.setState({ totlevisible: false });
    }

    // 新增按钮
    onAdd = () => {
        this.setState({
            visible: true
        });
    };
    // 关闭弹框
    closeModal () {
        this.setState({
            visible: false,
            TreatmentData: []
        });
    }

    // 短信
    changeNote (e) {
        this.setState({
            isCopyMsg: e.target.checked
        });
    }

    // 上传文件
    uploadProps = {
        name: 'file',
        multiple: true,
        showUploadList: false,
        action: '',
        beforeUpload: (file, fileList) => {
            const { uploadFileHandler } = this.props.actions;
            const formdata = new FormData();
            formdata.append('file', fileList[0]);
            uploadFileHandler({}, formdata).then(rep => {
                let { fileDataList } = this.state;
                file.url = rep;
                file.remark = ''; // 备注
                fileDataList.push(file);
                console.log('fileDataList', fileDataList);
                this.setState({
                    fileDataList
                });
            });
            return false;
        }
        // onChange: ({ file, fileList, event }) => {
        //     this.setState({
        //         loading: true
        //     });
        //     const status = file.status;
        //     // const { newFileLists } = this.state;
        //     const { TreatmentData = [] } = this.state;
        //     if (status === 'done') {
        //         let len = TreatmentData.length;
        //         TreatmentData.push({
        //             index: len + 1,
        //             fileName: file.name,
        //             file_id: file.response.id,
        //             file_partial_url:
        //                 '/media' + file.response.a_file.split('/media')[1],
        //             send_time: moment().format('YYYY-MM-DD HH:mm:ss'),
        //             a_file: '/media' + file.response.a_file.split('/media')[1],
        //             download_url:
        //                 '/media' +
        //                 file.response.download_url.split('/media')[1],
        //             misc: file.response.misc,
        //             mime_type: file.response.mime_type
        //         });
        //         notification.success({
        //             message: '文件上传成功',
        //             duration: 3
        //         });
        //         this.setState({
        //             TreatmentData: TreatmentData,
        //             loading: false
        //         });
        //     } else if (status === 'error') {
        //         notification.error({
        //             message: '文件上传失败',
        //             duration: 3
        //         });
        //         this.setState({
        //             loading: false
        //         });
        //     }
        // }
    };
    // 修改备注

    onDelete (workID) {
        console.log('删除workID', workID);
        const { deleteWork } = this.props.actions;
        deleteWork({
            ID: workID
        }, {}).then(rep => {

        });
    }
    // 删除文件表格中的某行
    deleteFile = (uid) => {
        const { fileDataList } = this.state;
        let newFileDataList = [];
        fileDataList.map(item => {
            if (item.uid !== uid) {
                newFileDataList.push(item);
            }
        });
        console.log('newFileDataList', newFileDataList);
        this.setState({
            fileDataList: newFileDataList
        });
        // TreatmentData.splice(index, 1);
        // let array = [];
        // TreatmentData.map((item, index) => {
        //     let data = {
        //         index: index + 1,
        //         fileName: item.fileName,
        //         file_id: item.file_id,
        //         file_partial_url: item.file_partial_url,
        //         send_time: item.send_time,
        //         a_file: item.a_file,
        //         download_url: item.download_url,
        //         misc: item.misc,
        //         mime_type: item.mime_type
        //     };
        //     array.push(data);
        // });
        // this.setState({ TreatmentData: array });
    };

    // 选择人员
    selectMember (memberInfo) {
        console.log('memberInfo', memberInfo);
        const {
            form: { setFieldsValue }
        } = this.props;
        this.member = null;
        if (memberInfo) {
            let memberValue = memberInfo.toString().split('#');
            if (memberValue[0] === 'C_PER') {
                this.member = {
                    username: memberValue[4],
                    person_code: memberValue[1],
                    person_name: memberValue[2],
                    id: parseInt(memberValue[3]),
                    org: memberValue[5]
                };
            }
        } else {
            this.member = null;
        }

        setFieldsValue({
            TdataReview: this.member
            // Tsuperunit: this.member.org
        });
    }

    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            render: (text, record, index) => {
                return index;
            }
        },
        {
            title: '标段',
            dataIndex: 'Title',
            width: '10%',
            render: (text, record, index) => {
                let section = text.split(' ');
                return section[0];
            }
        },
        {
            title: '进度类型',
            dataIndex: 'FlowName',
            key: 'FlowName',
            width: '15%'
        },
        {
            title: '编号',
            dataIndex: 'numbercode',
            key: 'numbercode',
            width: '15%'
        },
        {
            title: '提交人',
            dataIndex: 'submitperson',
            key: 'submitperson',
            width: '10%'
        },
        {
            title: '提交时间',
            dataIndex: 'CreateTime',
            key: 'CreateTime',
            width: '15%'
        },
        {
            title: '流程状态',
            dataIndex: 'WFState',
            key: 'WFState',
            width: '10%',
            render: (text, record, index) => {
                let statusValue = '';
                WFStatusList.find(item => {
                    if (item.value === text) {
                        statusValue = item.label;
                    }
                });
                return statusValue;
            }
        },
        {
            title: '操作',
            render: (text, record, index) => {
                return (<div>
                    <span>
                        <a onClick={this.clickInfo.bind(this, record.WorkID)}>
                            查看
                        </a>
                    </span>
                    <span style={{marginLeft: 10}}>
                        <a onClick={this.onDelete.bind(this, record.WorkID)}>
                            删除
                        </a>
                    </span>
                </div>
                );
            }
        }
    ];
    columnFile = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: '10%',
            render: (text, record, index) => {
                return index;
            }
        },
        {
            title: '文件名称',
            dataIndex: 'name',
            key: 'name',
            width: '35%'
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            width: '30%',
            render: (text, record, index) => {
                return (
                    <Input onChange={e => {
                            record.remark = e.target.value;
                        }}
                    />
                );
            }
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: '10%',
            render: (text, record, index) => {
                return (
                    <div>
                        <Popconfirm
                            placement='rightTop'
                            title='确定删除吗？'
                            onConfirm={this.deleteFile.bind(
                                this,
                                record.uid
                            )}
                            okText='确认'
                            cancelText='取消'
                        >
                            <a>删除</a>
                        </Popconfirm>
                    </div>
                );
            }
        }
    ];
}

export default Form.create()(Total);
