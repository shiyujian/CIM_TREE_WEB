import React, { Component } from 'react';
import {
    Row,
    Col,
    Button,
    Input,
    Select,
    Form,
    Notification
} from 'antd';
import './Examine.css';
import {getFieldValue} from '_platform/store/util';
const { Option } = Select;
const { TextArea } = Input;
const FormItem = Form.Item;
class Examine extends Component {
    static layout = {
        labelCol: {span: 8},
        wrapperCol: {span: 16}
    };
    constructor (props) {
        super(props);
        this.state = {
            status: '', // 审核状态
            checkinfo: '', // 审核说明
            stocknum: '', // 库存量
            startNo: '', // 起始编码
            endNo: '', // 截止编码
            distributeNum: '', // 派发量 实际派发量默认为申请量的2倍
            storeId: '', // 库存id
            currentStore: '', // 当前库存
            storeList: [] // 库存列表
        };
    }

    componentWillReceiveProps (nextProps) {
        if (!nextProps.distributeNum) {
            this.props.form.resetFields();
        }
        if (nextProps.detailRow !== this.props.detailRow) {
            this.getQrcodestores(nextProps.detailRow);
        }
    }

    getQrcodestores (detailRow) { // 获取二维码库存量
        const {actions: {getQrcodestores}} = this.props;
        let params = '';
        let section = detailRow.Section;
        let isgarden = detailRow.IsGarden;
        let gardentype = detailRow.GardenType;
        //let distributeNum = detailRow.PlanNum * 2; // 实际派发量默认为申请量的2倍
        let distributeNum = detailRow.PlanNum;
        if (gardentype === 0) { // 苗木不需要考虑标段
            params = {
                isgarden: isgarden
            };
        } else {
            params = {
                section: section,
                isgarden: isgarden,
                gardentype: gardentype
            };
        }
        getQrcodestores({}, params)
            .then((data) => {
                if (data && data.content && data.content.length > 0) {
                    this.setState({
                        distributeNum: distributeNum,
                        storeList: data.content
                    });
                } else {
                    Notification.error({
                        message: '当前标段二维码库存为空',
                        duration: 3
                    });
                    return false;
                }
            });
    }

    getCalqrcodenum (startNo, endNo) { // 根据起始编码和截止编码计算派发量
        const {actions: {getCalqrcodenum}} = this.props;
        let params = {
            startno: startNo,
            endno: endNo
        };
        getCalqrcodenum({}, params)
            .then((data) => {
                if (data === 0) {
                    Notification.error({
                        message: '当前输入的编码有误,请重新输入',
                        duration: 3
                    });
                    return false;
                } else if (data.length > 100) {
                    Notification.error({
                        message: '当前输入的编码有误,请重新输入',
                        duration: 3
                    });
                    return false;
                }
                this.setState({
                    distributeNum: data
                });
            });
    }

    getCalqrcode (qrcode, step) { // 根据起始编码和派发量计算截止编码
        const {actions: {getCalqrcode}} = this.props;
        step = step - 1;
        let params = {
            qrcode: qrcode,
            step: step
        };
        getCalqrcode({}, params)
            .then((data) => {
                this.setState({
                    endNo: data
                });
            });
    }

    render () {
        const { getFieldDecorator } = this.props.form;
        const {
            isSteps,
            dataListNursery,
            stocknum,
            distributeNum,
            startNo,
            endNo
        } = this.state;
        const {
            type,
            detailRow,
            projectList
        } = this.props;
        let dk = detailRow.Section;
        let sections = detailRow.Section;
        if (projectList.length > 0 && dk) {
            for (let i = 0; i < projectList.length; i++) {
                if (projectList[i].No === dk.split('-')[0]) {
                    dk = projectList[i].Name;
                    let list = projectList[i].children;
                    for (let j = 0; j < list.length; j++) {
                        if (list[j].No === sections) {
                            sections = list[j].Name;
                        }
                    }
                }
            }
        }

        let percent = '';
        if (this.state.storenum) {
            percent = ((1 - this.state.distributeNum / this.state.stocknum) * 100).toFixed(2) === 'NaN' ? '' : ((1 - this.state.distributeNum / this.state.stocknum) * 100).toFixed(2) + '%';
        }

        return (
            <div>
                <div>
                    <h3 style={{height: 35, borderBottom: '1px solid #ccc'}}>{dk}{sections}二维码牌申请流程</h3>
                    <Form>
                        <Row>
                            <Col span={8}>
                                <FormItem label='地块' {...Examine.layout}>
                                    <Input disabled value={dk} />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='标段' {...Examine.layout}>
                                    <Input disabled value={sections} />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='计划栽植量' {...Examine.layout}>
                                    <Input disabled value={detailRow.PlanNum} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label='申请单位' {...Examine.layout}>
                                    <Input disabled value={detailRow.ConstructUnit} />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='申请人' {...Examine.layout}>
                                    <Input disabled value={detailRow.ApplierObj ? detailRow.ApplierObj.Full_Name : ''} />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='申请时间' {...Examine.layout}>
                                    <Input disabled value={detailRow.ApplyTime} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label='备注' {...Examine.layout}>
                                    <TextArea disabled value={detailRow.Remark} rows={4} style={{width: 'calc(100% * 4 - 50px)', maxWidth: 'calc(100% * 4 - 50px)'}} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label='库存选择' {...Examine.layout}>
                                    <Select
                                        placeholder='请选择库存'
                                        onChange={this.changeFormField.bind(this,
                                            'currentStore')}
                                    >
                                        {
                                            this.state.storeList.map(item => {
                                                return <Option
                                                    value={item.ID}
                                                    title={`${item.StartNo}-${item.EndNo}`}
                                                    key={item.ID}>
                                                    {`${item.StartNo}-${item.EndNo}`}
                                                </Option>;
                                            })
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label='起始编码' {...Examine.layout}>
                                    {
                                        getFieldDecorator('startNo', {
                                            initialValue: startNo || undefined,
                                            rules: [{ required: true, message: '请输入起始编码!' }]
                                        })(
                                            <Input placeholder='请输入起始编码' onChange={this.changeFormField.bind(this,
                                                'startNo')} />
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='截止编码' {...Examine.layout}>
                                    {
                                        getFieldDecorator('endNo', {
                                            initialValue: endNo || undefined,
                                            rules: [{ required: true, message: '请输入截止编码!' }]
                                        })(
                                            <Input placeholder='请输入截止编码' onChange={this.changeFormField.bind(this,
                                                'endNo')} />
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='库存量' {...Examine.layout}>
                                    <Input disabled value={stocknum} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label='实际派发总量' {...Examine.layout}>
                                    {
                                        getFieldDecorator('distributeNum', {
                                            initialValue: distributeNum || undefined
                                        })(
                                            <Input placeholder='请输入实际派发总量' onChange={this.changeFormField.bind(this,
                                                'distributeNum')} />
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='库存剩余百分比' {...Examine.layout}>
                                    <Input disabled value={percent} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label='派发审核' {...Examine.layout}>
                                    <Select
                                        placeholder='请选择'
                                        onChange={this.changeFormField.bind(this,
                                            'status')}
                                    >
                                        <Option value='1'>通过</Option>
                                        <Option value='0'>不通过</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label='审核说明' {...Examine.layout}>
                                    <TextArea placeholder='请输入审核说明' onChange={this.changeFormField.bind(this,
                                        'checkinfo')} rows={4} style={{width: 'calc(100% * 4 - 50px)', maxWidth: 'calc(100% * 4 - 50px)'}} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{textAlign: 'center'}}>
                                <Button type='primary' style={{marginRight: 20, cursor: 'pointer'}} onClick={this.onBack.bind(this, 'nursery')}>返回</Button>
                                <Button type='primary' style={{cursor: 'pointer'}} onClick={this.onSubmit.bind(this, 'mm')}>提交</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        );
    }
    onBack (type) {
        this.props.onApplyBack(type);
    }
    changeFormField (key, event) {
        let value = getFieldValue(event);
        if (key === 'status') {
            this.setState({
                status: value
            });
        }
        if (key === 'checkinfo') {
            this.setState({
                checkinfo: value
            });
        }
        if (key === 'startNo') {
            if (value !== '' && this.state.endNo !== '') { // 实时计算编码量
                if (value.length === 7) {
                    this.getCalqrcodenum(value, this.state.endNo);
                }
            }
            this.setState({
                startNo: value
            });
        }
        if (key === 'endNo') {
            if (value !== '' && this.state.startNo !== '') { // 实时计算编码量
                if (value.length === 7) {
                    this.getCalqrcodenum(this.state.startNo, value);
                }
            }
            this.setState({
                endNo: value
            });
        }
        if (key === 'distributeNum') {
            if (value !== '') {
                this.getCalqrcode(this.state.startNo, value);
            }
            this.setState({
                distributeNum: value
            });
        }
        if (key === 'currentStore') { // 选择库存
            let storeList = this.state.storeList;
            let distributeNum = this.state.distributeNum;
            for (let i = 0; i < storeList.length; i++) {
                if (storeList[i].ID === value) {
                    this.getCalqrcode(storeList[i].StartNo, distributeNum);
                    this.setState({
                        stocknum: storeList[i].StoreNum,
                        startNo: storeList[i].StartNo,
                        endNo: storeList[i].EndNo,
                        storeId: storeList[i].ID
                    });
                }
            }
            this.setState({
                currentStore: value
            });
        }
    }
    onSubmit (type) {
        if (this.state.currentStore === '' || this.state.currentStore === undefined) {
            Notification.error({
                message: '请先选择二维码库存',
                duration: 3
            });
            return false;
        }
        if (this.state.stocknum === '' || this.state.stocknum === 0) {
            Notification.error({
                message: '当前库存量为空，无法派发',
                duration: 3
            });
            return false;
        }
        if (this.state.startNo === '') {
            Notification.error({
                message: '请填写起始编码',
                duration: 3
            });
            return false;
        } else if (this.state.startNo.length !== 7) {
            Notification.error({
                message: '起始编码长度错误，请审查',
                duration: 3
            });
            return false;
        }
        if (this.state.endNo === '') {
            Notification.error({
                message: '请填写截止编码',
                duration: 3
            });
            return false;
        } else if (this.state.endNo.length !== 7) {
            Notification.error({
                message: '截止编码长度错误，请审查',
                duration: 3
            });
            return false;
        }
        if (this.state.distributeNum < this.props.detailRow.PlanNum) {
            Notification.error({
                message: '实际派发总量不能小于计划量',
                duration: 3
            });
            return false;
        }
        if (this.state.distributeNum > this.state.stocknum) {
            Notification.error({
                message: '实际派发总量不能大于库存量',
                duration: 3
            });
            return false;
        }
        if (type === 'mm') {
            const {
                actions: {postQrcodeCheck}
            } = this.props;
            if (this.state.status === '') {
                Notification.error({
                    message: '请选择审核状态',
                    duration: 3
                });
                return false;
            }
            let data = {
                CheckInfo: this.state.checkinfo,
                Checker: this.props.userid,
                DistributeNum: +this.state.distributeNum, // 派发数量
                Distributes: [{
                    DistributeNum: +this.state.distributeNum,
                    StoreID: this.state.storeId,
                    EndNo: this.state.endNo,
                    StartNo: this.state.startNo
                }],
                ID: this.props.detailRow.ID,
                Status: +this.state.status, // 审核状态
                StockNum: this.state.stocknum
            };
            postQrcodeCheck({}, data).then((res) => {
                if (res.code === 1) {
                    Notification.success({
                        message: '苗木二维码审核成功'
                    });
                    this.props.onApplyBack('nursery');
                    this.props.reloadList();
                } else {
                    Notification.error({
                        message: res.msg
                    });
                }
            });
        }
    }
}
export default Form.create()(Examine);
