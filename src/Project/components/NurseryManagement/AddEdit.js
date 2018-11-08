
import React, { Component } from 'react';
import { Row, Col, Icon, Input, Button, Select, Modal, Form, Upload, Cascader, notification, message } from 'antd';
import { checkTel, isCardNo, layoutT } from '../common';
import { FOREST_API } from '_platform/api';
import { getForestImgUrl } from '_platform/auth';
const FormItem = Form.Item;
const Option = Select.Option;

class AddEdit extends Component {
    constructor (props) {
        super(props);
        this.state = {
            fileList: [],
            fileListBack: [],
            RegionCodeList: [], // 行政区划option
            optionList: [], // 绑定供应商列表
            Suppliers: [], // 绑定的供应商
            record: null,
            isAmend: false, // 是否编辑
            LeaderCard: '', // 身份证正面url
            LeaderCardBack: '', // 身份证反面url
            RegionCode: '' // 行政区划
        };
        this.Contacter = ''; // 联系人
        this.ContacterPhone = ''; // 联系方式
        this.toSave = this.toSave.bind(this); // 新增苗圃
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
        if (this.props.optionList) {
            this.setState({
                optionList: this.props.optionList,
                RegionCodeList: this.props.RegionCodeList
            });
        }
        // 修改信息回显
        if (this.props.record) {
            const { getNb2ss } = this.props.actions;
            const {
                LeaderCard = '',
                LeaderCardBack = ''
            } = this.props.record;
            const fileList = {
                uid: '-1',
                status: 'done'
            };
            let leaderCardImg = getForestImgUrl(LeaderCard);
            let leaderCardBackImg = getForestImgUrl(LeaderCardBack);
            this.setState({
                isAmend: true,
                record: this.props.record,
                RegionCode: this.props.record.RegionCode,
                LeaderCard: this.props.record.LeaderCard,
                LeaderCardBack: this.props.record.LeaderCardBack,
                fileList: [{...fileList, thumbUrl: `${leaderCardImg}`}],
                fileListBack: [{...fileList, thumbUrl: `${leaderCardBackImg}`}]
            });
            // 根据供应商id获取绑定苗圃
            getNb2ss({}, {nurserybaseid: this.props.record.ID}).then(rep => {
                let Suppliers = [];
                rep.map(item => {
                    Suppliers.push(item.SupplierID);
                });
                this.setState({
                    Suppliers
                });
            });
        }
    }
    render () {
        const { fileList, fileListBack, Suppliers, RegionCode, RegionCodeList, record, isAmend, optionList } = this.state;
        const { getFieldDecorator } = this.props.form;
        let provinceCode = '';
        let sityCode = '';
        if (RegionCode) {
            provinceCode = RegionCode.slice(0, 2) + '0000';
            sityCode = RegionCode.slice(0, 4) + '00';
        }
        const props = {
            action: `${FOREST_API}/UploadHandler.ashx?filetype=org`,
            listType: 'picture',
            fileList: fileList,
            beforeUpload: (file, fileList) => {
                const formdata = new FormData();
                formdata.append('a_file', file);
                const { postUploadImage } = this.props.actions;
                postUploadImage({}, formdata).then((rep) => {
                    fileList[0].url = getForestImgUrl(rep);
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
                    fileList[0].url = getForestImgUrl(rep);
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
                                        <Input placeholder='请输入苗圃名称' disabled={isAmend} />
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
                                    label='负责人'
                                >
                                    {getFieldDecorator('Leader', {
                                        initialValue: record && record.Leader,
                                        rules: [{required: true, message: '必填项'}]
                                    })(
                                        <Input placeholder='请输入负责人姓名' disabled={isAmend} />
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
                                        <Input placeholder='请输入负责人身份证号' disabled={isAmend} maxLength='18' onBlur={this.checkCardNo} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='绑定的供应商'
                                >
                                    <Select
                                        mode='multiple'
                                        value={Suppliers}
                                        filterOption={false}
                                        onChange={this.handleSuppliers.bind(this)}
                                        onSearch={this.searchSuppliers.bind(this)}
                                        placeholder='请选择想要绑定的供应商'>
                                        {
                                            optionList.map(item => {
                                                return <Option key={item.ID} value={item.ID}>{item.SupplierName}</Option>;
                                            })
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='负责人身份证正面'
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
                                    label='负责人身份证反面'
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
    handleSuppliers (value) {
        this.setState({
            Suppliers: value,
            optionList: this.props.optionList
        });
    }
    searchSuppliers (value) {
        let optionList = [];
        this.props.optionList.map(item => {
            if (item.SupplierName.includes(value)) {
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
            actions: { postNursery, putNursery }
        } = this.props;

        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const { LeaderCard, LeaderCardBack, RegionCode, record, Suppliers } = this.state;
            if (!LeaderCard || !LeaderCardBack) {
                message.error('请上传身份证正反面');
                return;
            }
            let arr = [];
            if (Suppliers.length > 0) {
                Suppliers.map(item => {
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
                Contacter: this.Contacter,
                ContacterPhone: this.ContacterPhone,
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
}

export default Form.create()(AddEdit);
