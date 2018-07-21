import React, { Component } from 'react';

import {
    Input, Form, Spin, Upload, Icon, Button, Modal,
    Cascader, Select, Popconfirm, message, Table, Row, Col, notification, Checkbox
} from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
import { getUser } from '_platform/auth';
import Preview from '../../../_platform/components/layout/Preview';
const FormItem = Form.Item;
const Option = Select.Option;

export default class DeleteCheckAccept extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataSource: [],
            checkers: [], // 审核人下拉框选项
            check: null, // 审核人
            project: {},
            unit: {},
            options: [],
            isCopyMsg: ''
        };
    }

    componentDidMount () {
        const { actions: { getUsers } } = this.props.props;
        getUsers().then(rst => {
            let checkers = rst.map((o, index) => {
                return (
                    <Option key={index} value={JSON.stringify(o)}>{o.account.person_name}</Option>
                );
            });
            this.setState({ checkers });
        });
    }
    beforeUpload = (info) => {
        if (info.name.indexOf('xls') !== -1 || info.name.indexOf('xlsx') !== -1) {
            return true;
        } else {
            notification.warning({
                message: '只能上传Excel文件！',
                duration: 2
            });
            return false;
        }
    }
    uplodachange = async (info) => {
        const { actions: { getOrg } } = this.props;
        if (info && info.file && info.file.status === 'done') {
            let name = Object.keys(info.file.response);
            let dataList = info.file.response[name[0]];
            // 模板判断
            if (dataList[0][0] !== '安全文档') {
                notification.warning({
                    message: 'Excel模板不相符，请下载最新模板！',
                    duration: 2
                });
                this.setState({ loading: false });
                return;
            }
            let dataSource = [];
            for (let i = 2; i < dataList.length; i++) {
                let judge = await getOrg({ code: dataList[i][2] });
                if (!judge.code) {
                    notification.warning({
                        message: '您的第' + i + '条发布单位输入有误，请确认'
                    });
                    return;
                }
                dataSource.push({
                    code: dataList[i][0] ? dataList[i][0] : '',
                    filename: dataList[i][1] ? dataList[i][1] : '',
                    pubUnit: {
                        code: judge.code ? judge.code : dataList[i][2],
                        name: judge.name ? judge.name : '',
                        type: judge.type ? judge.type : ''
                    },
                    type: dataList[i][3] ? dataList[i][3] : '',
                    doTime: dataList[i][4] ? dataList[i][4] : '',
                    remark: dataList[i][5] ? dataList[i][5] : '',
                    upPeople: getUser().username,
                    project: {
                        code: '',
                        name: '',
                        obj_type: ''
                    },
                    unit: {
                        code: '',
                        name: '',
                        obj_type: ''
                    },
                    file: {

                    },
                    key: i - 2
                });
            }
            notification.success({
                message: '上传成功！',
                duration: 2
            });
            this.setState({ dataSource });
        }
    }

    beforeUploadPicFile = (file) => {
        const fileName = file.name;
        const { actions: { uploadStaticFile, deleteStaticFile } } = this.props.props;

        const formdata = new FormData();
        formdata.append('a_file', file);
        formdata.append('name', fileName);

        uploadStaticFile({}, formdata).then(resp => {
            if (!resp || !resp.id) {
                message.error('文件上传失败');
                return;
            };
            const filedata = resp;
            filedata.a_file = this.covertURLRelative(filedata.a_file);
            filedata.download_url = this.covertURLRelative(filedata.a_file);
            const attachment = [{
                uid: file.uid,
                name: resp.name,
                status: 'done',
                a_file: resp.a_file,
                thumbUrl: resp.a_file,
                mime_type: resp.mime_type
            }];
            // 删除 之前的文件
            if (this.state.currInitialData) {
                deleteStaticFile({ id: this.state.currInitialData.id });
            }
            this.setState({ currInitialData: filedata });
            this.props.props.form.setFieldsValue({ attachment: resp.id ? attachment : null });
        });
        return false;
    }

    // 下拉框选择人
    selectChecker (value) {
        let check = JSON.parse(value);
        this.setState({ check });
    }

    onok () {
        if (!this.state.check) {
            notification.warning({
                message: '请选择审核人'
            });
            return;
        }
        if (this.state.dataSource.length === 0) {
            notification.warning({
                message: '请上传Excel表'
            });
            return;
        }
        let temp = this.state.dataSource.some((o, index) => {
            return !o.file.id;
        });
        if (temp) {
            notification.warning({
                message: '有数据未上传附件'
            });
            return;
        }
        const { project, unit } = this.state;
        if (!project.name) {
            notification.warning({
                message: '请选择项目和单位工程'
            });
            return;
        }

        let { check } = this.state;
        let per = {
            id: check.id,
            username: check.username,
            person_name: check.account.person_name,
            person_code: check.account.person_code,
            organization: check.account.organization
        };
        for (let i = 0; i < this.state.dataSource.length; i++) {
            this.state.dataSource[i].project = project;
            this.state.dataSource[i].unit = unit;
        }
        this.props.onok(this.state.dataSource, per);
    }

    // 删除
    delete (index) {
        let { dataSource } = this.state;
        dataSource.splice(index, 1);
        this.setState({ dataSource });
    }

    // 预览
    handlePreview (record) {
        const { actions: { openPreview } } = this.props;
        let f = record.file;
        let filed = {};
        filed.misc = f.misc;
        filed.a_file = `${SOURCE_API}` + (f.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (f.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = f.name;
        filed.mime_type = f.mime_type;
        openPreview(filed);
    }

    // 短信
    _cpoyMsgT (e) {
        this.setState({
            isCopyMsg: e.target.checked
        });
    }

    covertURLRelative = (originUrl) => {
        return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }

    render () {
        const {
            form: { getFieldDecorator }
        } = this.props.props;
        return (
            <Form>
                <Row>
                    <Col span={10}>
                        <FormItem label='小班'>
                            {getFieldDecorator('littleban', {
                                rules: [
                                    { required: true, message: '请选择小班！' }
                                ]
                            })
                            (<Select placeholder='请选择小班'>
                                <Option value='单位工程一'>单位工程一</Option>
                                <Option value='单位工程二'>单位工程二</Option>
                                <Option value='单位工程三'>单位工程三</Option>
                            </Select>)
                            }
                        </FormItem>
                    </Col>
                    <Col span={10}>
                        <FormItem label='细班'>
                            {getFieldDecorator('thinban', {
                                rules: [
                                    { required: true, message: '请选择细班！' }
                                ]
                            })
                            (<Select placeholder='请选择细班'>
                                <Option value='单位工程一'>单位工程一</Option>
                                <Option value='单位工程二'>单位工程二</Option>
                                <Option value='单位工程三'>单位工程三</Option>
                            </Select>)
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <FormItem label='编号'>
                            {getFieldDecorator('number', {
                                rules: [
                                    { required: true, message: '请输入编号！' }
                                ]
                            })
                            (<Input />)
                            }
                        </FormItem>
                    </Col>
                    <Col span={10}>
                        <FormItem label='文档类型'>
                            {getFieldDecorator('doctype', {
                                rules: [
                                    { required: true, message: '请选择文档类型！' }
                                ]
                            })
                            (<Select placeholder='请选择细班'>
                                <Option value='检验批验收'>检验批验收</Option>
                                <Option value='质量缺陷'>质量缺陷</Option>
                                <Option value='质量分析'>质量分析</Option>
                            </Select>)
                            }
                        </FormItem>
                    </Col>
                </Row>
                <FormItem label='附件'>
                    {getFieldDecorator('attachment', {
                        valuePropName: 'fileList',
                        getValueFromEvent: this.coverFile,
                        rules: [
                            { required: true, message: '请上传附件' }
                        ]
                    }, {})(
                        <Upload beforeUpload={this.beforeUploadPicFile.bind(this)}>
                            <Button>
                                <Icon type='upload' />添加文件
                            </Button>
                        </Upload>
                    )}
                </FormItem>
                <Row>
                    <Col span={8} offset={4}>
                        <FormItem label='审核人'>
                            {
                                getFieldDecorator('dataReview', {
                                    rules: [
                                        { required: true, message: '请选择审核人员' }
                                    ]
                                })
                                (
                                    <Select style={{ width: '200px' }} className='btn' onSelect={this.selectChecker.bind(this)}>
                                        {
                                            this.state.checkers
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8} offset={4}>
                        <Checkbox onChange={this._cpoyMsgT.bind(this)}>短信通知</Checkbox>
                    </Col>
                </Row>
            </Form>
        );
    }
}
