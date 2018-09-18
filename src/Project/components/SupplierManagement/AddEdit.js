
import React, { Component } from 'react';
import { Row, Col, Icon, Input, Button, Select, Modal, Form, Upload, Cascader, notification, message } from 'antd';
import { checkTel, isCardNo, layoutT } from '../common';
import { FOREST_API } from '../../../_platform/api';
const FormItem = Form.Item;

class AddEdit extends Component {
    constructor (props) {
        super(props);
        this.state = {
            fileList: [],
            fileListBack: [],
            fileListLicense: [],
            options: [],
            record: null,
            LegalPersonCard: '', // 身份证正面url
            LegalPersonCardBack: '', // 身份证反面url
            BusinessLicense: '',
            RegionCode: ''
        };
        this.toSave = this.toSave.bind(this); // 新增供应商
        this.checkPhone = this.checkPhone.bind(this); // 校验手机号
        this.checkCardNo = this.checkCardNo.bind(this); // 校验身份证
        this.handleRegion = this.handleRegion.bind(this); // 行政区划
        this.loadRegion = this.loadRegion.bind(this); // 加载市县
        this.handleCancel = this.handleCancel.bind(this); // 取消弹框
    }
    componentDidMount () {
        console.log(this.props.record);
        this.setState({
            record: this.props.record,
            options: this.props.options
        });
    }
    render () {
        const { fileList, fileListBack, fileListLicense, options, record } = this.state;
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
                        LegalPersonCard: rep,
                        fileList: fileList
                    });
                });
                return false;
            },
            onRemove: () => {
                this.setState({
                    LegalPersonCard: '',
                    fileList: []
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
                        LegalPersonCardBack: rep,
                        fileListBack: fileList
                    });
                });
                return false;
            },
            onRemove: () => {
                this.setState({
                    LegalPersonCardBack: '',
                    fileListBack: []
                });
            }
        };
        const propsLicense = {
            action: `${FOREST_API}/UploadHandler.ashx?filetype=org`,
            listType: 'picture',
            fileList: fileListLicense,
            beforeUpload: (file, fileList) => {
                const formdata = new FormData();
                formdata.append('a_file', file);
                const { postUploadImage } = this.props.actions;
                postUploadImage({}, formdata).then((rep) => {
                    fileList[0].url = FOREST_API + '/' + rep;
                    this.setState({
                        BusinessLicense: rep,
                        fileListLicense: fileList
                    });
                });
                return false;
            },
            onRemove: () => {
                this.setState({
                    BusinessLicense: '',
                    fileListLicense: []
                });
            }
        };
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
                                    label='供应商名称'
                                >
                                    {getFieldDecorator('SupplierName', {
                                        initialValue: record && record.SupplierName,
                                        rules: [{required: true, message: '必填项'}]
                                    })(
                                        <Input placeholder='请输入供应商名称' />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='社会统一信用码'
                                >
                                    {getFieldDecorator('USCC', {
                                        initialValue: record && record.USCC,
                                        rules: [{required: true, message: '必填项'}]
                                    })(
                                        <Input placeholder='请输入社会统一信用码' />
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
                                        initialValue: record && record.TreePlace,
                                        rules: [{required: true, message: '必填项'}]
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
                                    {getFieldDecorator('LegalPerson', {
                                        initialValue: record && record.LegalPerson
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
                                    {getFieldDecorator('LegalPersonPhone', {
                                        initialValue: record && record.LegalPersonPhone
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
                                    {getFieldDecorator('LegalPersonCardNo', {
                                        initialValue: record && record.LegalPersonCardNo
                                    })(
                                        <Input placeholder='请输入负责人身份证号' maxLength='18' onBlur={this.checkCardNo} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='绑定的苗圃基地'
                                >
                                    {getFieldDecorator('NB2Ss', {
                                    })(
                                        <Select mode='multiple' placeholder='请选择想要绑定的苗圃基地'>
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
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='营业执照'
                                >
                                    <Upload {...propsLicense}>
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
        this.props.form.setFieldsValue({
            SupplierName: '',
            USCC: '',
            Address: '',
            Leader: '',
            LeaderPhone: '',
            LegalPersonCardNo: ''
        });
        this.setState({
            fileList: [],
            fileListBack: [],
            fileListLicense: [],
            LegalPersonCard: '',
            LegalPersonCardBack: '',
            BusinessLicense: ''
        });
    }
    toSave () {
        const {
            actions: { postSupplier, putSupplier }
        } = this.props;

        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const { LegalPersonCard, LegalPersonCardBack, BusinessLicense, RegionCode, record } = this.state;
            if (!LegalPersonCard || !LegalPersonCardBack || !BusinessLicense) {
                message.error('请上传身份证正反面');
                return;
            }
            let arr = [];
            if (values.NB2Ss && values.NB2Ss.length > 0) {
                values.NB2Ss.map(item => {
                    arr.push({
                        NurseryBaseID: item
                    });
                });
            }
            let postdata = {
                SupplierName: values.SupplierName,
                USCC: values.USCC,
                RegionCode,
                Address: values.Address,
                LegalPerson: values.LegalPerson,
                LegalPersonPhone: values.LegalPersonPhone,
                LegalPersonCardNo: values.LegalPersonCardNo,
                LegalPersonCard,
                LegalPersonCardBack,
                BusinessLicense,
                NB2Ss: arr
            };
            console.log(record);
            if (record) {
                postdata.ID = record.ID;
                putSupplier({}, postdata).then(rep => {
                    if (rep && rep.code === 2) {
                        notification.error({
                            message: '供应商已存在！'
                        });
                    } else if (rep.code === 1) {
                        notification.success({
                            message: '编辑供应商成功'
                        });
                        this.props.handleCancel();
                    } else {
                        notification.error({
                            message: '编辑失败'
                        });
                    }
                });
            } else {
                postSupplier({}, postdata).then(rep => {
                    if (rep && rep.code === 2) {
                        notification.error({
                            message: '供应商已存在！'
                        });
                    } else if (rep.code === 1) {
                        notification.success({
                            message: '新增供应商成功'
                        });
                        this.props.handleCancel();
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
        const LegalPersonPhone = this.props.form.getFieldValue('LegalPersonPhone');
        if (!checkTel(LegalPersonPhone)) {
            this.props.form.setFieldsValue({LegalPersonPhone: ''});
            message.error('手机号输入错误');
        }
    }
    checkCardNo () {
        const LegalPersonCardNo = this.props.form.getFieldValue('LegalPersonCardNo');
        if (!isCardNo(LegalPersonCardNo)) {
            this.props.form.setFieldsValue({LegalPersonCardNo: ''});
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
        console.log(1);
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