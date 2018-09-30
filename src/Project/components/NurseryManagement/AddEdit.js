
import React, { Component } from 'react';
import { Row, Col, Icon, Input, Button, Select, Modal, Form, Upload, Cascader, notification, message } from 'antd';
import { checkTel, isCardNo, layoutT } from '../common';
import { FOREST_API } from '_platform/api';
const FormItem = Form.Item;

class AddEdit extends Component {
    constructor (props) {
        super(props);
        this.state = {
            fileList: [],
            fileListBack: [],
            options: [],
            record: null,
            LeaderCard: '', // 身份证正面url
            LeaderCardBack: '', // 身份证反面url
            RegionCode: ''
        };
        this.toSave = this.toSave.bind(this); // 新增苗圃
        this.checkPhone = this.checkPhone.bind(this); // 校验手机号
        this.checkCardNo = this.checkCardNo.bind(this); // 校验身份证
        this.handleRegion = this.handleRegion.bind(this); // 行政区划
        this.loadRegion = this.loadRegion.bind(this); // 加载市县
        this.handleCancel = this.handleCancel.bind(this); // 取消弹框
    }
    componentDidMount () {
        this.setState({
            options: this.props.options
        });
        if (this.props.record) {
            this.setState({
                record: this.props.record,
                LeaderCard: this.props.record.LeaderCard,
                LeaderCardBack: this.props.record.LeaderCardBack
            });
        }
    }
    render () {
        const { fileList, fileListBack, options, record } = this.state;
        const { getFieldDecorator } = this.props.form;
        const props = {
            action: `${FOREST_API}/UploadHandler.ashx?filetype=org`,
            listType: 'picture',
            fileList: fileList,
            beforeUpload: (file, fileList) => {
                const formdata = new FormData();
                formdata.append('a_file', file);
                const { postUploadImage } = this.props.actions;
                postUploadImage({}, formdata).then((rep) => {
                    fileList[0].url = FOREST_API + '/' + rep;
                    this.setState({
                        LeaderCard: rep,
                        fileList: fileList
                    });
                });
                return false;
            },
            onRemove: () => {
                this.setState({
                    fileList: [],
                    LeaderCard: ''
                });
            }
        };
        const propsBack = {
            action: `${FOREST_API}/UploadHandler.ashx?filetype=org`,
            listType: 'picture',
            fileList: fileListBack,
            beforeUpload: (file, fileList) => {
                const formdata = new FormData();
                formdata.append('a_file', file);
                const { postUploadImage } = this.props.actions;
                postUploadImage({}, formdata).then((rep) => {
                    fileList[0].url = FOREST_API + '/' + rep;
                    this.setState({
                        LeaderCardBack: rep,
                        fileListBack: fileList
                    });
                });
                return false;
            },
            onRemove: () => {
                this.setState({
                    fileListBack: [],
                    LeaderCardBack: ''
                });
            }
        };
        console.log(record);
        return (
            <div className='add-edit'>
                <Modal
                    title={this.props.visibleTitle}
                    width={920}
                    visible
                    onOk={this.toSave}
                    onCancel={this.handleCancel}
                >
                    <Form>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='苗圃名称'
                                >
                                    {getFieldDecorator('NurseryName', {
                                        initialValue: record && record.NurseryName,
                                        rules: [{required: true, message: '必填项'}]
                                    })(
                                        <Input placeholder='请输入苗圃名称' disabled={record} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='产地'
                                >
                                    {getFieldDecorator('TreePlace', {
                                        initialValue: record && record.TreePlace,
                                        rules: [{required: true, message: '必填项'}]
                                    })(
                                        <Input placeholder='请输入产地' />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='行政区划'
                                >
                                    {getFieldDecorator('RegionCode', {
                                        rules: [{required: true, message: '必填项'}]
                                    })(
                                        <Cascader placeholder='选择您所在的城市'
                                            loadData={this.loadRegion}
                                            options={options}
                                            onChange={this.handleRegion}
                                            changeOnSelect
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='地址'
                                >
                                    {getFieldDecorator('Address', {
                                        initialValue: record && record.TreePlace
                                    })(
                                        <Input placeholder='请输入地址' />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='负责人'
                                >
                                    {getFieldDecorator('Leader', {
                                        initialValue: record && record.Leader,
                                        rules: [{required: true, message: '必填项'}]
                                    })(
                                        <Input placeholder='请输入负责人姓名' />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='负责人手机号'
                                >
                                    {getFieldDecorator('LeaderPhone', {
                                        initialValue: record && record.LeaderPhone,
                                        rules: [{required: true, message: '必填项'}]
                                    })(
                                        <Input placeholder='请输入负责人手机号' maxLength='11' onBlur={this.checkPhone} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='负责人身份证号'
                                >
                                    {getFieldDecorator('LeaderCardNo', {
                                        initialValue: record && record.LeaderCardNo,
                                        rules: [{required: true, message: '必填项'}]
                                    })(
                                        <Input placeholder='请输入负责人身份证号' maxLength='18' onBlur={this.checkCardNo} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='绑定的供应商'
                                >
                                    {getFieldDecorator('Suppliers', {
                                    })(
                                        <Select mode='multiple' placeholder='请选择想要绑定的供应商'>
                                            {this.props.optionList}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='身份证正面'
                                >
                                    <Upload {...props}>
                                        <Button>
                                            <Icon type='upload' /> upload
                                        </Button>
                                    </Upload>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='身份证反面'
                                >
                                    <Upload {...propsBack}>
                                        <Button>
                                            <Icon type='upload' /> upload
                                        </Button>
                                    </Upload>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    }
    handleCancel () {
        this.props.handleCancel();
    }
    toSave () {
        const {
            actions: { postNursery, putNursery }
        } = this.props;

        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const { LeaderCard, LeaderCardBack, RegionCode, record } = this.state;
            if (!LeaderCard || !LeaderCardBack) {
                message.error('请上传身份证正反面');
                return;
            }
            let arr = [];
            if (values.Suppliers && values.Suppliers.length > 0) {
                values.Suppliers.map(item => {
                    arr.push({
                        ID: item
                    });
                });
            }
            let postdata = {
                NurseryName: values.NurseryName,
                TreePlace: values.TreePlace,
                RegionCode: RegionCode,
                Address: values.Address || '',
                Leader: values.Leader,
                LeaderPhone: values.LeaderPhone,
                LeaderCardNo: values.LeaderCardNo,
                LeaderCard: LeaderCard,
                LeaderCardBack: LeaderCardBack,
                Suppliers: arr
            };
            if (record) {
                postdata.ID = record.ID;
                postdata.WKT = 'POINT(120 30)';
                putNursery({}, postdata).then(rep => {
                    if (rep && rep.code === 2) {
                        notification.error({
                            message: '苗圃基地已存在！'
                        });
                    } else if (rep.code === 1) {
                        notification.success({
                            message: '编辑苗圃成功'
                        });
                        this.props.handleCancel();
                        this.props.onSearch();
                    } else {
                        notification.error({
                            message: '编辑失败'
                        });
                    }
                });
            } else {
                postNursery({}, postdata).then(rep => {
                    if (rep && rep.code === 2) {
                        notification.error({
                            message: '苗圃基地已存在！'
                        });
                    } else if (rep.code === 1) {
                        notification.success({
                            message: '新增苗圃成功'
                        });
                        this.props.handleCancel();
                        this.props.onSearch();
                    } else {
                        notification.error({
                            message: '新增失败'
                        });
                    }
                });
            }
        });
    }
    checkPhone () {
        const LeaderPhone = this.props.form.getFieldValue('LeaderPhone');
        if (!checkTel(LeaderPhone)) {
            this.props.form.setFieldsValue({LeaderPhone: ''});
            message.error('手机号输入错误');
        }
    }
    checkCardNo () {
        const LeaderCardNo = this.props.form.getFieldValue('LeaderCardNo');
        if (!isCardNo(LeaderCardNo)) {
            this.props.form.setFieldsValue({LeaderCardNo: ''});
            message.error('身份证输入错误');
        }
    }
    handleRegion (value) {
        let RegionCode = value[value.length - 1];
        this.setState({
            RegionCode
        });
    }
    loadRegion (selectedOptions) {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        setTimeout(() => {
            targetOption.loading = false;
            const { getRegionCodes } = this.props.actions;
            targetOption.children = [];
            getRegionCodes({}, {parent: targetOption.value}).then(rep => {
                rep.map(item => {
                    if (item.LevelType === '3') {
                        targetOption.children.push({
                            value: item.ID,
                            label: item.Name
                        });
                    } else {
                        targetOption.children.push({
                            value: item.ID,
                            label: item.Name,
                            isLeaf: false
                        });
                    }
                });
                this.setState({
                    options: [...this.state.options]
                });
            });
        }, 100);
    }
}

export default Form.create()(AddEdit);
