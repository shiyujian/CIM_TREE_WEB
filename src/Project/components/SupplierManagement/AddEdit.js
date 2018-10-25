
import React, { Component } from 'react';
import { Row, Col, Icon, Input, Button, Select, Modal, Form, Upload, Cascader, notification, message } from 'antd';
import { checkTel, isCardNo, layoutT } from '../common';
import { FOREST_API } from '../../../_platform/api';
const FormItem = Form.Item;
const Option = Select.Option;

class AddEdit extends Component {
    constructor (props) {
        super(props);
        this.state = {
            fileList: [],
            fileListBack: [],
            fileListLicense: [],
            options: [], // 行政区划
            optionList: [], // 绑定苗圃基地列表
            Nurserys: [], // 绑定的苗圃基地
            record: null,
            isAmend: false,
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
        // 获取本用户的姓名，电话作为联系人，联系方式
        const user = JSON.parse(localStorage.getItem('QH_USER_DATA'));
        if (user.account) {
            this.Contacter = user.account.person_name;
            this.ContacterPhone = user.account.person_telephone;
        }
        this.setState({
            options: this.props.options,
            optionList: this.props.optionList
        });
        // 修改信息回显
        if (this.props.record) {
            const { getNb2ss } = this.props.actions;
            const fileList = {
                uid: '-1',
                status: 'done'
            };
            this.setState({
                isAmend: true,
                record: this.props.record,
                LegalPersonCard: this.props.record.LegalPersonCard,
                LegalPersonCardBack: this.props.record.LegalPersonCardBack,
                BusinessLicense: this.props.record.BusinessLicense,
                fileList: [{...fileList, thumbUrl: `${FOREST_API}/${this.props.record.LegalPersonCard}`}],
                fileListBack: [{...fileList, thumbUrl: `${FOREST_API}/${this.props.record.LegalPersonCardBack}`}],
                fileListLicense: [{...fileList, thumbUrl: `${FOREST_API}/${this.props.record.BusinessLicense}`}]
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
        const { fileList, fileListBack, fileListLicense, options, optionList, record, isAmend, Nurserys } = this.state;
        const { getFieldDecorator } = this.props.form;
        console.log(record);
        const props = {
            action: '',
            listType: 'picture',
            fileList: fileList,
            beforeUpload: (file, fileList) => {
                console.log(fileList, '----');
                const formdata = new FormData();
                formdata.append('a_file', file);
                const { postUploadImage } = this.props.actions;
                postUploadImage({}, formdata).then((rep) => {
                    fileList[0].url = FOREST_API + '/' + rep;
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
        console.log(props.defaultFileList, '---');
        const propsBack = {
            action: '',
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
            action: '',
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
                                        initialValue: record && record.Address
                                    })(
                                        <Input placeholder='请输入地址' />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='法人代表'
                                >
                                    {getFieldDecorator('LegalPerson', {
                                        initialValue: record && record.LegalPerson,
                                        rules: [{required: true, message: '必填项'}]
                                    })(
                                        <Input placeholder='请输入负责人姓名' disabled={isAmend} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='法人手机号'
                                >
                                    {getFieldDecorator('LegalPersonPhone', {
                                        initialValue: record && record.LegalPersonPhone,
                                        rules: [{required: true, message: '必填项'}]
                                    })(
                                        <Input placeholder='请输入负责人手机号' maxLength='11' onBlur={this.checkPhone} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='法人身份证号'
                                >
                                    {getFieldDecorator('LegalPersonCardNo', {
                                        initialValue: record && record.LegalPersonCardNo,
                                        rules: [{required: true, message: '必填项'}]
                                    })(
                                        <Input placeholder='请输入负责人身份证号' maxLength='18' disabled={isAmend} onBlur={this.checkCardNo} />
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
                                    label='法人身份证正面'
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
                                    label='法人身份证反面'
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
            const { LegalPersonCard, LegalPersonCardBack, BusinessLicense, RegionCode, record, Nurserys } = this.state;
            if (!LegalPersonCard || !LegalPersonCardBack || !BusinessLicense) {
                message.error('请上传身份证正反面');
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
                BusinessLicense,
                NB2Ss: arr
            };
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
