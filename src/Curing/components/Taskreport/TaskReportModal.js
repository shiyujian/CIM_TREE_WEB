import React, { Component } from 'react';
import { Button, Modal, Form, Row, Input, Notification, Spin, Upload, Icon } from 'antd';
import { FOREST_API } from '_platform/api';
const FormItem = Form.Item;
const Dragger = Upload.Dragger;

class TaskReportModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: true,
            fileList: []
        };
    }

    componentDidMount = async () => {

    };

    componentDidUpdate (prevProps, prevState) {
        const {
            noLoading
        } = this.props;
        if (noLoading && noLoading !== prevProps.noLoading) {
            this._setFormData();
            this.setState({
                loading: false,
                fileList: []
            });
        }
    }
    _setFormData () {
        const {
            form: {
                setFieldsValue
            },
            taskMess,
            polygonData,
            regionArea,
            // treeNum,
            regionThinName,
            regionSectionName
        } = this.props;
        console.log('taskMess', taskMess);
        if (taskMess) {
            if (polygonData) {
                setFieldsValue({
                    taskType: taskMess.typeName ? taskMess.typeName : '',
                    taskCreateTime: taskMess.CreateTime ? taskMess.CreateTime : '',
                    taskPlanTime: (taskMess.PlanStartTime && taskMess.PlanEndTime) ? `${taskMess.PlanStartTime} ~ ${taskMess.PlanEndTime}` : '',
                    taskRealTime: (taskMess.StartTime && taskMess.EndTime) ? `${taskMess.StartTime} ~ ${taskMess.EndTime}` : '',
                    taskStatus: taskMess.status ? taskMess.status : '',
                    taskSection: regionSectionName || '',
                    taskThinClass: regionThinName || '',
                    // taskNum: treeNum || 0,
                    taskCuringMans: taskMess.CuringMans ? taskMess.CuringMans : '',
                    taskTreeArea: regionArea || 0,
                    attachment: undefined
                });
            } else {
                setFieldsValue({
                    taskType: taskMess.typeName ? taskMess.typeName : '',
                    taskCreateTime: taskMess.CreateTime ? taskMess.CreateTime : '',
                    taskPlanTime: (taskMess.PlanStartTime && taskMess.PlanEndTime) ? `${taskMess.PlanStartTime} ~ ${taskMess.PlanEndTime}` : '',
                    taskRealTime: (taskMess.StartTime && taskMess.EndTime) ? `${taskMess.StartTime} ~ ${taskMess.EndTime}` : '',
                    taskStatus: taskMess.status ? taskMess.status : '',
                    taskSection: taskMess.sectionName ? taskMess.sectionName : '',
                    taskThinClass: taskMess.thinClassName ? taskMess.thinClassName : '',
                    // taskNum: taskMess.Num ? taskMess.Num : 0,
                    taskCuringMans: taskMess.CuringMans ? taskMess.CuringMans : '',
                    taskTreeArea: taskMess.Area ? taskMess.Area : 0,
                    attachment: undefined
                });
            }
        } else {
            this.resetForm();
        }
    }

    render () {
        const {
            form: { getFieldDecorator },
            isShowTaskModal,
            taskMess
        } = this.props;

        // 上传文件
        const uploadProps = {
            name: 'a_file',
            fileList: this.state.fileList,
            action: `${FOREST_API}/UploadHandler.ashx?filetype=leader`,
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList
                    };
                });
            },
            beforeUpload: async (file) => {
                this.setState({
                    loading: true
                });
                const {
                    actions: { postForsetPic },
                    form: { setFieldsValue }
                } = this.props;
                const { fileList = [] } = this.state;
                let type = file.name.toString().split('.');
                let len = type.length;
                if (
                    type[len - 1] === 'jpg' ||
                type[len - 1] === 'jpeg' ||
                type[len - 1] === 'png' ||
                type[len - 1] === 'JPG' ||
                type[len - 1] === 'JPEG' ||
                type[len - 1] === 'PNG'
                ) {
                    const formdata = new FormData();
                    formdata.append('a_file', file);
                    formdata.append('name', file.name);
                    let rst = await postForsetPic({}, formdata);
                    console.log('rst', rst);
                    let len = fileList.length;
                    fileList.push({
                        uid: len + 1,
                        fileName: file.name,
                        a_file: rst,
                        name: file.name
                    });
                    setFieldsValue({
                        attachment: fileList
                    });
                    this.setState({
                        fileList: fileList,
                        loading: false
                    });
                    return false;
                } else {
                    Notification.error({
                        message: '请上传jpg,jpeg,png 文件',
                        duration: 3
                    });
                    this.setState({
                        loading: false
                    });
                    return false;
                }
            },
            onChange: ({ file, fileList, event }) => {
                const status = file.status;
                if (status === 'done') {
                    this.setState({
                        loading: false
                    });
                } else if (status === 'error') {
                    this.setState({
                        loading: false
                    });
                }
            }
        };
        const FormItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        let status = false;
        if (taskMess && taskMess.status === '已完成且未上报' && taskMess.Status === 1) {
            status = true;
        }

        return (
            <Modal
                title='任务详情'
                visible={isShowTaskModal}
                width='700px'
                closable={false}
                footer={null}
                maskClosable={false}
            >
                <Spin spinning={this.state.loading}>
                    <Form>
                        <Row>
                            <FormItem {...FormItemLayout} label='养护类型'>
                                {getFieldDecorator('taskType', {
                                    rules: [
                                        { required: true, message: '请选择养护类型' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...FormItemLayout} label='养护人员'>
                                {getFieldDecorator('taskCuringMans', {
                                    rules: [
                                        { required: true, message: '请输入养护人员' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...FormItemLayout} label='任务创建时间'>
                                {getFieldDecorator('taskCreateTime', {
                                    rules: [
                                        { required: true, message: '请输入任务创建时间' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...FormItemLayout} label='状态'>
                                {getFieldDecorator('taskStatus', {
                                    rules: [
                                        { required: true, message: '请输入状态' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...FormItemLayout} label='任务计划时间'>
                                {getFieldDecorator('taskPlanTime', {
                                    rules: [
                                        { required: true, message: '请输入任务计划时间' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...FormItemLayout} label='任务实际时间'>
                                {getFieldDecorator('taskRealTime', {
                                    rules: [
                                        { required: true, message: '请输入任务实际时间' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...FormItemLayout} label='面积(亩)'>
                                {getFieldDecorator('taskTreeArea', {
                                    rules: [
                                        { required: true, message: '请输入面积' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row>
                        {/* <Row>
                            <FormItem {...FormItemLayout} label='树木数量(棵)'>
                                {getFieldDecorator('taskNum', {
                                    rules: [
                                        { required: true, message: '请输入面积' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row> */}
                        <Row>
                            <FormItem {...FormItemLayout} label='细班'>
                                {getFieldDecorator('taskThinClass', {
                                    rules: [
                                        { required: true, message: '请输入细班名称' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...FormItemLayout} label='标段'>
                                {getFieldDecorator('taskSection', {
                                    rules: [
                                        { required: true, message: '请输入标段名称' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row>
                        {
                            status
                                ? (
                                    <Row>
                                        <FormItem {...FormItemLayout} label='图片上传'>
                                            {getFieldDecorator('attachment', {
                                                rules: [
                                                    { required: false, message: '请上传图片' }
                                                ],
                                                getValueFromEvent: this.normFile
                                            })(
                                                <Dragger {...uploadProps}>
                                                    <p className='ant-upload-drag-icon'>
                                                        <Icon type='inbox' />
                                                    </p>
                                                    <p className='ant-upload-text'>
                                            点击或者拖拽开始上传
                                                    </p>
                                                    <p className='ant-upload-hint'>
                                            支持 jpg,jpeg,png 文件
                                                    </p>
                                                </Dragger>
                                            )}
                                        </FormItem>
                                    </Row>
                                ) : ''
                        }
                        {
                            status
                                ? <Row style={{ marginTop: 10 }}>
                                    <Button
                                        onClick={this._handleTaskModalOk.bind(this)}
                                        style={{ float: 'right', marginLeft: 10 }}
                                        type='primary'
                                    >
                                        上报
                                    </Button>
                                    <Button
                                        onClick={this._handleTaskModalCancel.bind(this)}
                                        style={{ float: 'right' }}
                                    >
                                        关闭
                                    </Button>
                                </Row>
                                : <Row style={{ marginTop: 10 }}>
                                    <Button
                                        onClick={this._handleTaskModalCancel.bind(this)}
                                        style={{ float: 'right' }}
                                    >
                                        关闭
                                    </Button>
                                </Row>
                        }
                    </Form>
                </Spin>
            </Modal>

        );
    }

    normFile = e => {
        if (Array.isArray(e)) {
            return e;
        }
        let len = e.fileList.length;
        if (len > 0) {
            return e && [e.fileList[len - 1]];
        } else {
            return e && e.fileList;
        }
    };

    _handleTaskModalCancel = async () => {
        await this.props.onCancel();
        await this.resetForm();
        this.setState({
            loading: true
        });
    }

    // 上报任务
    _handleTaskModalOk = async () => {
        const {
            actions: {
                postComplete
            },
            taskMess,
            wkt,
            polygonData,
            regionThinNo,
            regionArea
            // treeNum
        } = this.props;
        const {
            fileList
        } = this.state;
        this.props.form.validateFields(async (err, values) => {
            console.log('err', err);
            console.log('values', values);
            if (!err) {
                let remarkPics = '';
                try {
                    fileList.map(data => {
                        if (data.a_file) {
                            if (remarkPics) {
                                remarkPics = remarkPics + ',' + data.a_file;
                            } else {
                                remarkPics = data.a_file;
                            }
                        }
                    });
                } catch (e) {
                    console.log('图片处理', e);
                }

                console.log('remarkPics', remarkPics);
                let postData = {};
                if (polygonData) {
                    postData = {
                        'ID': taskMess.ID,
                        // 'Num': treeNum || 0,
                        'Num': 0,
                        'ThinClass': regionThinNo,
                        'Area': regionArea || 0,
                        'WKT': wkt,
                        'Pics': remarkPics
                    };
                } else {
                    postData = {
                        'ID': taskMess.ID,
                        'Num': taskMess.Num,
                        'ThinClass': taskMess.ThinClass,
                        'Area': taskMess.Area,
                        'WKT': taskMess.PlanWKT,
                        'Pics': remarkPics
                    };
                }
                this.setState({
                    loading: true
                });
                console.log('postData', postData);
                let data = await postComplete({}, postData);
                console.log('data', data);
                if (data && data.code && data.code === 1) {
                    Notification.success({
                        message: '任务上报成功',
                        duration: 3
                    });
                    await this.props.onOk();
                } else {
                    Notification.error({
                        message: '任务上报失败',
                        duration: 3
                    });
                    await this.props.onCancel();
                }
                this.setState({
                    loading: false
                });
                await this.resetForm();
                this.setState({
                    loading: true
                });
            }
        });
    }

    resetForm = () => {
        const {
            form: {
                setFieldsValue
            }
        } = this.props;
        setFieldsValue({
            taskType: '',
            taskCreateTime: '',
            taskPlanTime: '',
            taskRealTime: '',
            taskStatus: '',
            taskSection: '',
            taskThinClass: '',
            // taskNum: '',
            taskCuringMans: '',
            taskTreeArea: ''
        });
    }
}
export default Form.create()(TaskReportModal);
