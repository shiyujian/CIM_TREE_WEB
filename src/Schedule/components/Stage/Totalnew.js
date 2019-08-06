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
 * @Last Modified time: 2019-08-06 10:54:32
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
import TotleModal from './TotleModal';
import './index.less';
import {
    TOTAL_ID,
    TOTAL_NAME,
    WFStatusList
} from '_platform/api';
const FormItem = Form.Item;
const Dragger = Upload.Dragger;
const { RangePicker } = DatePicker;
const { Option } = Select;
moment.locale('zh-cn');
const dateFormat = 'YYYY-MM-DD';
class TotalNew extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            originNodeID: '', // 起点ID
            originNodeName: '', // 起点name
            section: '', // 用户所在标段
            username: '', // 用户名
            formItem: [], // 表单项
            workID: '', // 任务ID
            visibleLook: false, // 查看弹框
            totolData: [],
            TotleModaldata: [],
            selectedRowKeys: [],
            dataSourceSelected: [],
            visible: false,
            fileList: [],
            isCopyMsg: false, // 接收人员是否发短信
            TreatmentData: [],
            sectionArray: [], // 标段列表
            TableList: [], // 表格信息
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
        this.getOriginNode = this.getOriginNode.bind(this); // 获取流程起点ID
        this.onAdd = this.onAdd.bind(this); // 新增
        this.onDelete = this.onDelete.bind(this); // 删除
        this.onLook = this.onLook.bind(this); // 查看
        this.handleCancel = this.handleCancel.bind(this); // 取消新增
        this.handleOK = this.handleOK.bind(this); // 新增任务
        this.getWorkList = this.getWorkList.bind(this); // 获取任务
        this.onSearch = this.onSearch.bind(this); // 查询
    }
    async componentDidMount () {
        this.getSection(); // 获取当前登陆用户的标段
        this.getWorkList(); // 获取任务列表
        this.getOriginNode(); // 获取流程起点ID
    }
    getOriginNode () {
        const { getNodeList } = this.props.actions;
        getNodeList({}, {
            flowid: TOTAL_ID, // 流程ID
            name: '', // 节点名称
            type: 1, // 节点类型
            status: 1 // 节点状态
        }).then(rep => {
            if (rep.length === 1) {
                this.setState({
                    originNodeID: rep[0].ID,
                    originNodeName: rep[0].Name
                });
            }
        });
    }
    getSection () {
        const {
            platform: { tree = {} },
            leftkeycode
        } = this.props;
        let sectionData = (tree && tree.bigTreeList) || [];
        let user = getUser();
        let section = user.section;
        let currentSectionName = '';
        let projectName = '';
        let sectionArray = [];

        if (section) {
            let code = section.split('-');
            if (code && code.length === 3) {
                // 获取当前标段所在的项目
                sectionData.map(item => {
                    if (code[0] === item.No) {
                        projectName = item.Name;
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
            this.setState({
                section,
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
    getWorkList (pro = {}) {
        const { getWorkList } = this.props.actions;
        let params = {
            workid: '', // 任务ID
            title: '', // 任务名称
            flowid: TOTAL_ID, // 流程类型或名称
            // flowid: '', // 流程类型或名称
            starter: '', // 发起人
            currentnode: '', // 节点ID
            prevnode: '', // 上一结点ID
            executor: '', // 执行人
            sender: '', // 上一节点发送人
            wfstate: '', // 待办 0,1
            stime: pro.stime || '', // 开始时间
            etime: pro.etime || '', // 结束时间
            keys: pro.keys || '', // 查询键
            values: pro.values || '', // 查询值
            page: '', // 页码
            size: '' // 页数
        };
        getWorkList({}, params).then(rep => {
            if (rep.code === 200) {
                let workDataList = [];
                rep.content.map(item => {
                    workDataList.push(item);
                });
                this.setState({
                    workDataList
                });
            }
        });
    }
    onSearch () {
        const { validateFields } = this.props.form;
        validateFields((err, values) => {
            if (!err) {
            }
            let stime = '';
            let etime = '';
            if (values.submitDate) {
                stime = moment(values.submitDate[0]).format(dateFormat);
                etime = moment(values.submitDate[1]).format(dateFormat);
            }
            // 表单查询
            let key = '';
            let value = '';
            if (values.section) {
                key = 'Section';
                value = values.section;
                if (values.numberCode) {
                    key += '|' + 'NumberCode';
                    value += '|' + values.numberCode;
                }
            } else if (values.numberCode) {
                key = 'NumberCode';
                value = values.numberCode;
            }
            let params = {
                keys: key, // 表单项
                values: value, // 表单值
                stime, // 开始时间
                etime, // 结束时间
                status: values.status || '' // 流程状态
            };
            this.getWorkList(params);
        });
    }
    render () {
        const {
            section,
            workDataList,
            sectionArray
        } = this.state;
        const {
            auditorList,
            form: { getFieldDecorator }
        } = this.props;

        const FormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        return (
            <div>
                {this.state.visibleLook && (
                    <TotleModal
                        {...this.props}
                        {...this.state}
                        oncancel={this.totleCancle.bind(this)}
                        onok={this.totleOk.bind(this)}
                    />
                )}
                <Form layout='inline'>
                    <FormItem label='标段'>
                        {getFieldDecorator('section')(
                            <Select
                                placeholder='请选择标段'
                                style={{width: 220}}
                                allowClear
                            >
                                {sectionArray.map(item => {
                                    return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                })}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label='编号'>
                        {getFieldDecorator('numberCode')(
                            <Input placeholder='请输入编号' style={{width: 220}} />
                        )}
                    </FormItem>
                    <FormItem label='提交日期'>
                        {getFieldDecorator('submitDate')(
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
                        {getFieldDecorator('status')(
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
                    onCancel={this.handleCancel.bind(this)}
                    onOk={this.handleOK.bind(this)}
                >
                    <div>
                        <Form>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        {...FormItemLayout}
                                        label='任务名称'
                                    >
                                        {getFieldDecorator(
                                            'Title'
                                        )(
                                            <Input
                                                style={{width: 220}}
                                                placeholder='请输入'
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...FormItemLayout}
                                        label='标段'
                                    >
                                        {getFieldDecorator(
                                            'Section',
                                            {
                                                initialValue: section,
                                                rules: [{required: true}]
                                            }
                                        )(
                                            <Select
                                                disabled
                                                style={{width: 220}}
                                                placeholder='请选择'
                                                allowClear
                                            >
                                                {sectionArray.map(item => {
                                                    return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                                })}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...FormItemLayout}
                                        label='编号'
                                    >
                                        {getFieldDecorator(
                                            'NumberCode',
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
                                <Col span={12}>
                                    <FormItem
                                        {...FormItemLayout}
                                        label='文档类型'
                                    >
                                        {getFieldDecorator(
                                            'FileType',
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
                                    columns={this.columnsModal}
                                    rowKey='cid'
                                    pagination
                                    dataSource={
                                        this.state.TableList
                                    }
                                    className='foresttable'
                                />
                            </Row>
                            <Row style={{ marginTop: 20 }}>
                                <Col span={8}>
                                    <FormItem
                                        {...FormItemLayout}
                                        label='审核人'
                                    >
                                        {getFieldDecorator(
                                            'Auditor'
                                        )(
                                            <Select style={{ width: 150 }}>
                                                {
                                                    auditorList.map(item => {
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
    handleOK () {
        const {
            actions: { postStartwork },
            form: { validateFields }
        } = this.props;
        validateFields((err, values) => {
            if (!err) {
                const { TableList, originNodeID } = this.state;
                let newTableList = [];
                TableList.map(item => {
                    newTableList.push({
                        uid: item.uid,
                        name: item.name,
                        remark: item.remark,
                        url: item.url
                    });
                });
                let FormParams = [{
                    Key: 'Section', // 标段
                    FieldType: 0,
                    Val: values.Section
                }, {
                    Key: 'NumberCode', // 编号
                    FieldType: 0,
                    Val: values.NumberCode
                }, {
                    Key: 'FileType', // 文档类型
                    FieldType: 0,
                    Val: values.FileType
                }, {
                    Key: 'TableInfo', // 文档列表
                    FieldType: 2,
                    Val: JSON.stringify(newTableList)
                }];
                postStartwork({}, {
                    FlowID: TOTAL_ID, // 模板ID
                    FlowName: TOTAL_NAME, // 模板名称
                    FormValue: { // 表单值
                        FormParams: FormParams,
                        NodeID: originNodeID
                    },
                    NextExecutor: values.Auditor, // 下一节点执行人
                    Starter: getUser().ID, // 发起人
                    Title: values.Title, // 任务标题
                    WFState: 1 // 流程状态 1运行中
                }).then(rep => {
                    if (rep.code === 1) {
                        notification.success({
                            message: '新增任务成功',
                            duration: 3
                        });
                        this.getWorkList();
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
    // 取消
    totleCancle () {
        this.setState({ visibleLook: false });
    }
    // 确定
    totleOk () {
        this.setState({ visibleLook: false });
    }

    // 新增按钮
    onAdd = () => {
        this.setState({
            visible: true
        });
    };
    // 关闭弹框
    handleCancel () {
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
                let { TableList } = this.state;
                file.url = rep;
                file.remark = ''; // 备注
                TableList.push(file);
                this.setState({
                    TableList
                });
            });
            return false;
        }
    };

    // 删除文件表格中的某行
    deleteFile = (uid) => {
        const { TableList } = this.state;
        let newTableList = [];
        TableList.map(item => {
            if (item.uid !== uid) {
                newTableList.push(item);
            }
        });
        this.setState({
            TableList: newTableList
        });
    };

    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            render: (text, record, index) => {
                return index + 1;
            }
        },
        {
            title: '任务名称',
            dataIndex: 'Title'
        },
        {
            title: '进度类型',
            dataIndex: 'FlowName'
        },
        {
            title: '标段',
            dataIndex: 'Section'
        },
        {
            title: '编号',
            dataIndex: 'NumberCode'
        },
        {
            title: '提交人',
            dataIndex: 'StarterObj',
            render: (text, record) => {
                return `${text.Full_Name}(${text.User_Name})`;
            }
        },
        {
            title: '提交时间',
            dataIndex: 'CreateTime'
        },
        {
            title: '流程状态',
            dataIndex: 'WFState',
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
                        <a onClick={this.onLook.bind(this, record.ID)}>
                            查看
                        </a>
                    </span>
                    <span style={{marginLeft: 10}}>
                        <a onClick={this.onDelete.bind(this, record.ID)}>
                            删除
                        </a>
                    </span>
                </div>
                );
            }
        }
    ];
    onLook (workID) {
        this.setState({ visibleLook: true, workID });
    }
    onDelete (workID) {
        const { deleteWork } = this.props.actions;
        deleteWork({
            ID: workID
        }, {}).then(rep => {
            if (rep.code === 1) {
                notification.success({
                    message: '删除任务成功',
                    duration: 3
                });
                this.getWorkList();
            } else {
                notification.error({
                    message: '删除任务失败',
                    duration: 3
                });
            }
        });
    }
    columnsModal = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: '10%',
            render: (text, record, index) => {
                return index + 1;
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

export default Form.create()(TotalNew);
