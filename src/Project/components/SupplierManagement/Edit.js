
import React, { Component } from 'react';
import {
    Row,
    Col,
    Icon,
    Input,
    Button,
    Select,
    Modal,
    Form,
    Upload,
    Cascader,
    Switch,
    Notification,
    Spin
} from 'antd';
import { checkTel, isCardNo, layoutT } from '../common';
import { getForestImgUrl, getUser } from '_platform/auth';
const FormItem = Form.Item;
const Option = Select.Option;

class Edit extends Component {
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
    componentDidMount = async () => {
        const {
            actions: {
                getNb2ss
            },
            form: {
                setFieldsValue
            },
            optionList,
            RegionCodeList,
            record
        } = this.props;
        // 获取本用户的姓名，电话作为联系人，联系方式
        const user = getUser();
        this.Contacter = (user && user.name) || '';
        this.ContacterPhone = (user && user.phone) || '';
        this.setState({
            optionList: optionList,
            RegionCodeList: RegionCodeList
        });
        // 修改信息回显
        if (record) {
            this.setState({
                loading: true
            });
            const {
                LegalPersonCard = '',
                LegalPersonCardBack = '',
                BusinessLicense = '',
                Facade = ''
            } = record;
            let RegionCode = record.RegionCode || '';
            let provinceCode = '';
            let sityCode = '';
            if (RegionCode) {
                provinceCode = RegionCode.slice(0, 2) + '0000';
                sityCode = RegionCode.slice(0, 4) + '00';
            }
            let regionCode = '';
            if (provinceCode && sityCode && RegionCode) {
                regionCode = [provinceCode, sityCode, RegionCode];
            }

            let legalPersonImg = LegalPersonCard ? getForestImgUrl(LegalPersonCard) : '';
            let legalPersonBackImg = LegalPersonCardBack ? getForestImgUrl(LegalPersonCardBack) : '';
            let businessLicenseImg = BusinessLicense ? getForestImgUrl(BusinessLicense) : (Facade ? getForestImgUrl(Facade) : '');
            setFieldsValue({
                SupplierName: record.SupplierName || '',
                USCC: record.USCC || '',
                RegionCode: regionCode,
                Address: record.Address || '',
                LegalPerson: record.LegalPerson || '',
                LegalPersonPhone: record.LegalPersonPhone || '',
                LegalPersonCardNo: record.LegalPersonCardNo || '',
                LegalPersonCard: legalPersonImg,
                LegalPersonCardBack: legalPersonBackImg,
                BusinessLicense: businessLicenseImg
            });
            const fileList = {
                uid: '-1',
                status: 'done'
            };
            if (record.Facade) {
                this.setState({
                    isSwitch: false
                });
            }

            this.Contacter = record.Contacter;
            this.ContacterPhone = record.ContacterPhone;
            this.setState({
                isAmend: true,
                record: record,
                RegionCode: record.RegionCode || '',
                LegalPersonCard: record.LegalPersonCard || '',
                LegalPersonCardBack: record.LegalPersonCardBack || '',
                BusinessLicense: record.BusinessLicense || record.Facade || '',
                fileList: legalPersonImg ? [{...fileList, thumbUrl: `${legalPersonImg}`}] : [],
                fileListBack: legalPersonBackImg ? [{...fileList, thumbUrl: `${legalPersonBackImg}`}] : [],
                fileListLicense: businessLicenseImg ? [{...fileList, thumbUrl: `${businessLicenseImg}`}] : []
            });
            // 根据供应商id获取绑定苗圃
            getNb2ss({}, {supplierid: record.ID}).then(rep => {
                let Nurserys = [];
                rep.map(item => {
                    Nurserys.push(item.NurseryBaseID);
                });
                this.setState({
                    Nurserys
                });
            });
            this.setState({
                loading: false
            });
        }
    }
    // 切换法人负责人时，修改校验规则
    onSwitch (boolean) {
        this.setState({
            isSwitch: boolean
        }, () => {
            this.props.form.validateFields(['USCC'], { force: true });
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
            actions: { putSupplier }
        } = this.props;

        this.props.form.validateFields((err, values) => {
            console.log('values', values);
            console.log('err', err);
            if (err) {
                return;
            }
            const {
                LegalPersonCard,
                LegalPersonCardBack,
                BusinessLicense,
                RegionCode,
                record,
                Nurserys,
                isSwitch
            } = this.state;
            if (!LegalPersonCard || !LegalPersonCardBack) {
                Notification.error({
                    message: '请上传身份证正反面',
                    duration: 2
                });
                return;
            }
            if (!BusinessLicense) {
                Notification.error({
                    message: '请上传营业执照或门店照片',
                    duration: 2
                });
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
            postdata.ID = record.ID;
            putSupplier({}, postdata).then(rep => {
                if (rep && rep.code === 2) {
                    if (rep.msg === '供应商已存在！') {
                        Notification.error({
                            message: '供应商已存在！'
                        });
                    } else {
                        Notification.error({
                            message: '编辑供应商失败'
                        });
                    }
                } else if (rep.code === 1) {
                    Notification.success({
                        message: '编辑供应商成功'
                    });
                    this.props.onSearch();
                    this.props.handleCancel();
                } else {
                    Notification.error({
                        message: '编辑供应商失败'
                    });
                }
            });
        });
    }
    checkPhone () {
        const LegalPersonPhone = this.props.form.getFieldValue('LegalPersonPhone');
        if (!checkTel(LegalPersonPhone)) {
            this.props.form.setFieldsValue({LegalPersonPhone: ''});
            Notification.error({
                message: '手机号输入错误',
                duration: 2
            });
        }
    }
    checkCardNo () {
        const LegalPersonCardNo = this.props.form.getFieldValue('LegalPersonCardNo');
        if (!isCardNo(LegalPersonCardNo)) {
            this.props.form.setFieldsValue({LegalPersonCardNo: ''});
            Notification.error({
                message: '身份证输入错误',
                duration: 2
            });
        }
    }
    handleRegion (value) {
        let RegionCode = value[value.length - 1];
        this.setState({
            RegionCode
        });
    }
    checkPersonSupplierName = async (rule, value, callback) => {
        if (value) {
            if (value.length > 30) {
                callback(`请输入30个字以下`);
            } else {
                callback();
            }
        } else {
            callback();
        }
    }
    checkPersonTelephone = async (rule, value, callback) => {
        if (value) {
            // 手机号正则
            let reg = /^[1]([3-9])[0-9]{9}$/;
            console.log('reg.test(value)', reg.test(value));
            // isNaN(value);
            if (!isNaN(value) && reg.test(value)) {
                if (value > 0) {
                    callback();
                } else {
                    callback(`请输入正确的手机号`);
                }
            } else {
                callback(`请输入正确的手机号`);
            }
        } else {
            callback();
        }
    }
    checkPersonName = async (rule, value, callback) => {
        if (value) {
            if (value.length > 15) {
                callback(`请输入15个字以下`);
            } else {
                callback();
            }
        } else {
            callback();
        }
    }
    checkPersonAddress = async (rule, value, callback) => {
        if (value) {
            if (value.length > 30) {
                callback(`请输入30个字以下`);
            } else {
                callback();
            }
        } else {
            callback();
        }
    }
    render () {
        const {
            fileList,
            fileListBack,
            fileListLicense,
            RegionCodeList,
            optionList,
            record,
            isAmend,
            Nurserys,
            isSwitch,
            loading
        } = this.state;
        const {
            form: {
                getFieldDecorator,
                setFieldsValue
            }
        } = this.props;

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
                setFieldsValue({
                    LegalPersonCard: ''
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
                setFieldsValue({
                    LegalPersonCardBack: ''
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
                setFieldsValue({
                    BusinessLicense: ''
                });
            }
        };
        return (
            <div className='add-edit'>
                <Modal
                    title={this.props.visibleTitle}
                    width={920}
                    visible
                    maskClosable={false}
                    onOk={this.toSave}
                    onCancel={this.handleCancel}
                >
                    <Spin spinning={loading}>
                        <Form>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        {...layoutT}
                                        label='法人/负责人'
                                    >
                                        <Switch
                                            checkedChildren='法人'
                                            unCheckedChildren='负责人'
                                            checked={isSwitch}
                                            onChange={this.onSwitch.bind(this)} />
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...layoutT}
                                        label='供应商名称'
                                    >
                                        {getFieldDecorator('SupplierName', {
                                            initialValue: record && record.SupplierName,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入供应商名称（30个字以下）'
                                                },
                                                {
                                                    validator: this.checkPersonSupplierName
                                                }
                                            ]
                                        })(
                                            <Input placeholder='请输入供应商名称（30个字以下）'
                                                disabled={isAmend} />
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
                                            rules: [{
                                                required: isSwitch,
                                                message: '请输入社会统一信用码'
                                            }]
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
                                            rules: [{
                                                required: true,
                                                message: '选择您所在的城市'
                                            }]
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
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入地址（30个字以下）'
                                                },
                                                {
                                                    validator: this.checkPersonAddress
                                                }
                                            ],
                                            initialValue: record && record.Address
                                        })(
                                            <Input placeholder='请输入地址（30个字以下）' />
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
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入姓名（15个字以下）'
                                                },
                                                {
                                                    validator: this.checkPersonName
                                                }
                                            ]
                                        })(
                                            <Input
                                                placeholder={isSwitch ? '请输入法人姓名（15个字以下）' : '请输入负责人姓名（15个字以下）'} />
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
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入手机号'
                                                },
                                                {
                                                    validator: this.checkPersonTelephone
                                                }
                                            ]
                                        })(
                                            <Input
                                                placeholder={isSwitch ? '请输入法人手机号' : '请输入负责人手机号'}
                                                maxLength='11'
                                                onBlur={this.checkPhone} />
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
                                            <Input
                                                placeholder={isSwitch ? '请输入法人身份证号' : '请输入负责人身份证号'}
                                                maxLength='18'
                                                onBlur={this.checkCardNo} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...layoutT}
                                        label='绑定的苗圃基地'
                                    >
                                        <Select
                                            disabled
                                            value={Nurserys}
                                            mode='multiple'
                                            filterOption={false}
                                            onChange={this.handleNursery.bind(this)}
                                            onSearch={this.searchNursery.bind(this)}
                                            placeholder='请在绑定管理模块绑定苗圃基地'>
                                            {
                                                optionList.map(item => {
                                                    return <Option
                                                        key={item.ID}
                                                        value={item.ID}>
                                                        {item.NurseryName}
                                                    </Option>;
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
                                        {getFieldDecorator('LegalPersonCard', {
                                            rules: [{required: true, message: '请上传身份证正面'}]
                                        })(
                                            <Upload {...props}>
                                                <Button>
                                                    <Icon type='upload' /> upload
                                                </Button>
                                            </Upload>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...layoutT}
                                        label={isSwitch ? '法人身份证反面' : '负责人身份证反面'}
                                    >
                                        {getFieldDecorator('LegalPersonCardBack', {
                                            rules: [{
                                                required: true,
                                                message: '请上传身份证反面'}]
                                        })(
                                            <Upload {...propsBack}>
                                                <Button>
                                                    <Icon type='upload' /> upload
                                                </Button>
                                            </Upload>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...layoutT}
                                        label={isSwitch ? '营业执照' : '门店照片'}
                                    >
                                        {getFieldDecorator('BusinessLicense', {
                                            rules: [{
                                                required: true,
                                                message: `请上传${isSwitch ? '营业执照' : '门店照片'}`}]
                                        })(
                                            <Upload {...propsLicense}>
                                                <Button>
                                                    <Icon type='upload' /> upload
                                                </Button>
                                            </Upload>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Spin>
                </Modal>
            </div>
        );
    }
}

export default Form.create()(Edit);
