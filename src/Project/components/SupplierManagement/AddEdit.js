
import React, { Component } from 'react';
import { Row, Col, Icon, Input, Button, Select, Modal, Form, Upload, Cascader, Switch, notification, message } from 'antd';
import { checkTel, isCardNo, layoutT } from '../common';
import { getForestImgUrl } from '_platform/auth';
const FormItem = Form.Item;
const Option = Select.Option;

class AddEdit extends Component {
    constructor (props) {
        super(props);
        this.state = {
            fileList: [],
            fileListBack: [],
            fileListLicense: [],
            RegionCodeList: [], // 行政区划option
            optionList: [], // 绑定苗圃基地列表
            Nurserys: [], // 绑定的苗圃基地
            record: null,
            isAmend: false,
            LegalPersonCard: '', // 身份证正面url
            LegalPersonCardBack: '', // 身份证反面url
            BusinessLicense: '',
            RegionCode: '', // 行政编码
            isSwitch: true // true为法人，false为自然人
        };
        this.toSave = this.toSave.bind(this); // 新增供应商
        this.checkPhone = this.checkPhone.bind(this); // 校验手机号
        this.checkCardNo = this.checkCardNo.bind(this); // 校验身份证
        this.handleRegion = this.handleRegion.bind(this); // 行政区划
        this.handleCancel = this.handleCancel.bind(this); // 取消弹框
    }
    componentDidMount () {
        // 获取本用户的姓名，电话作为联系人，联系方式
        const user = JSON.parse(localStorage.getItem('QH_USER_DATA'));
        if (user.account) {
            this.Contacter = user.account.person_name;
            this.ContacterPhone = user.account.person_telephone;
        }
        this.setState({
            optionList: this.props.optionList,
            RegionCodeList: this.props.RegionCodeList
        });
        // 修改信息回显
        if (this.props.record) {
            const { getNb2ss } = this.props.actions;
            const {
                LegalPersonCard = '',
                LegalPersonCardBack = '',
                BusinessLicense = '',
                Facade = ''
            } = this.props.record;
            const fileList = {
                uid: '-1',
                status: 'done'
            };
            if (this.props.record.Facade) {
                this.setState({
                    isSwitch: false
                });
            }
            let legalPersonImg = getForestImgUrl(LegalPersonCard);
            let legalPersonBackImg = getForestImgUrl(LegalPersonCardBack);
            let businessLicenseImg = BusinessLicense ? getForestImgUrl(BusinessLicense) : getForestImgUrl(Facade);
            this.setState({
                isAmend: true,
                record: this.props.record,
                RegionCode: this.props.record.RegionCode,
                LegalPersonCard: this.props.record.LegalPersonCard,
                LegalPersonCardBack: this.props.record.LegalPersonCardBack,
                BusinessLicense: this.props.record.BusinessLicense || this.props.record.Facade,
                fileList: [{...fileList, thumbUrl: `${legalPersonImg}`}],
                fileListBack: [{...fileList, thumbUrl: `${legalPersonBackImg}`}],
                fileListLicense: [{...fileList, thumbUrl: `${businessLicenseImg}`}]
            });
            // 根据供应商id获取绑定苗圃
            getNb2ss({}, {supplierid: this.props.record.ID}).then(rep => {
                let Nurserys = [];
                rep.map(item => {
                    Nurserys.push(item.NurseryBaseID);
                });
                this.setState({
                    Nurserys
                });
            });
        }
    }
    render () {
        const { fileList, fileListBack, fileListLicense, RegionCodeList, optionList, record, isAmend, Nurserys, isSwitch, RegionCode } = this.state;
        const { getFieldDecorator } = this.props.form;
        let provinceCode = '';
        let sityCode = '';
        if (RegionCode) {
            provinceCode = RegionCode.slice(0, 2) + '0000';
            sityCode = RegionCode.slice(0, 4) + '00';
        }
        const props = {
            action: '',
            listType: 'picture',
            fileList: fileList,
            beforeUpload: (file, fileList) => {
                const formdata = new FormData();
                formdata.append('a_file', file);
                const { postUploadImage } = this.props.actions;
                postUploadImage({}, formdata).then((rep) => {
                    fileList[0].url = getForestImgUrl(rep);
                    this.setState({
                        LegalPersonCard: rep,
                        fileList
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
            action: '',
            listType: 'picture',
            fileList: fileListBack,
            beforeUpload: (file, fileList) => {
                const formdata = new FormData();
                formdata.append('a_file', file);
                const { postUploadImage } = this.props.actions;
                postUploadImage({}, formdata).then((rep) => {
                    fileList[0].url = getForestImgUrl(rep);
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
            action: '',
            listType: 'picture',
            fileList: fileListLicense,
            beforeUpload: (file, fileList) => {
                const formdata = new FormData();
                formdata.append('a_file', file);
                const { postUploadImage } = this.props.actions;
                postUploadImage({}, formdata).then((rep) => {
                    fileList[0].url = getForestImgUrl(rep);
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
                                    label='法人/负责人'
                                >
                                    <Switch checkedChildren='法人' unCheckedChildren='负责人' checked={isSwitch} onChange={this.onSwitch.bind(this)} />
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='供应商名称'
                                >
                                    {getFieldDecorator('SupplierName', {
                                        initialValue: record && record.SupplierName,
                                        rules: [{required: true, message: '必填项'}]
                                    })(
                                        <Input placeholder='请输入供应商名称' disabled={isAmend} />
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
                                        rules: [{required: isSwitch, message: '必填项'}]
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
                                        rules: [{required: true, message: '必填项'}],
                                        initialValue: [provinceCode, sityCode, RegionCode]
                                    })(
                                        <Cascader placeholder='选择您所在的城市'
                                            options={RegionCodeList}
                                            onChange={this.handleRegion}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='详细地址'
                                >
                                    {getFieldDecorator('Address', {
                                        rules: [{required: true, message: '必填项'}],
                                        initialValue: record && record.Address
                                    })(
                                        <Input placeholder='请输入详细地址' />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label={isSwitch ? '法人姓名' : '负责人姓名'}
                                >
                                    {getFieldDecorator('LegalPerson', {
                                        initialValue: record && record.LegalPerson,
                                        rules: [{required: true, message: '必填项'}]
                                    })(
                                        <Input placeholder={isSwitch ? '请输入法人姓名' : '请输入负责人姓名'} disabled={isAmend} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label={isSwitch ? '法人手机号' : '负责人手机号'}
                                >
                                    {getFieldDecorator('LegalPersonPhone', {
                                        initialValue: record && record.LegalPersonPhone,
                                        rules: [{required: true, message: '必填项'}]
                                    })(
                                        <Input placeholder={isSwitch ? '请输入法人手机号' : '请输入负责人手机号'} maxLength='11' onBlur={this.checkPhone} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label={isSwitch ? '法人身份证号' : '负责人身份证号'}
                                >
                                    {getFieldDecorator('LegalPersonCardNo', {
                                        initialValue: record && record.LegalPersonCardNo,
                                        rules: [{required: true, message: '必填项'}]
                                    })(
                                        <Input placeholder={isSwitch ? '请输入法人身份证号' : '请输入负责人身份证号'} maxLength='18' disabled={isAmend} onBlur={this.checkCardNo} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='绑定的苗圃基地'
                                >
                                    <Select
                                        value={Nurserys}
                                        mode='multiple'
                                        filterOption={false}
                                        onChange={this.handleNursery.bind(this)}
                                        onSearch={this.searchNursery.bind(this)}
                                        placeholder='请选择想要绑定的苗圃基地'>
                                        {
                                            optionList.map(item => {
                                                return <Option key={item.ID} value={item.ID}>{item.NurseryName}</Option>;
                                            })
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label={isSwitch ? '法人身份证正面' : '负责人身份证正面'}
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
                                    label={isSwitch ? '法人身份证反面' : '负责人身份证反面'}
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
                                    label={isSwitch ? '营业执照' : '门店照片'}
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
    onSwitch (boolean) {
        this.setState({
            isSwitch: boolean
        });
    }
    handleNursery (value) {
        this.setState({
            Nurserys: value,
            optionList: this.props.optionList
        });
    }
    searchNursery (value) {
        let optionList = [];
        this.props.optionList.map(item => {
            if (item.NurseryName.includes(value)) {
                optionList.push(item);
            }
        });
        this.setState({
            optionList
        });
    }
    handleCancel () {
        this.props.handleCancel();
    }
    toSave () {
        const {
            actions: { postSupplier, putSupplier }
        } = this.props;

        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const { LegalPersonCard, LegalPersonCardBack, BusinessLicense, RegionCode, record, Nurserys, isSwitch } = this.state;
            if (!LegalPersonCard || !LegalPersonCardBack) {
                message.error('请上传身份证正反面');
                return;
            }
            if (!BusinessLicense) {
                message.error('请上传营业执照或门店照片');
                return;
            }
            let arr = [];
            if (Nurserys.length > 0) {
                Nurserys.map(item => {
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
                Contacter: this.Contacter,
                ContacterPhone: this.ContacterPhone,
                LegalPerson: values.LegalPerson,
                LegalPersonPhone: values.LegalPersonPhone,
                LegalPersonCardNo: values.LegalPersonCardNo,
                LegalPersonCard,
                LegalPersonCardBack,
                NB2Ss: arr
            };
            if (isSwitch) {
                postdata.BusinessLicense = BusinessLicense;
            } else {
                postdata.Facade = BusinessLicense;
            }
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
                        this.props.onSearch();
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
                        this.props.onSearch();
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
}

export default Form.create()(AddEdit);
