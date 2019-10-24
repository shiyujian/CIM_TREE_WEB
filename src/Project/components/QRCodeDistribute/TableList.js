import React, { Component } from 'react';
import {
    Row,
    Col,
    Table,
    Button,
    Input,
    Select,
    Form,
    InputNumber,
    Notification,
    DatePicker
} from 'antd';
import MmChartList from './MmChartList';
import {getFieldValue} from '_platform/store/util';
import moment from 'moment';
const { TextArea } = Input;
const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
class TableList extends Component {
    static layout = {
        labelCol: {span: 8},
        wrapperCol: {span: 16}
    };
    constructor (props) {
        super(props);
        this.state = {
            dataListFacility: [], // 设施列表
            isMmApply: false, // 苗木二维码申请
            isYlApply: false // 园林二维码申请
        };
        this._mmqueryParams = {};
        this._queryParams = {};
    }
    componentDidMount () {

    }
    onYlApply () {
        this.setState({
            isYlApply: true
        });
    }
    onYlBack () {
        this.setState({
            isYlApply: false
        });
    }
    onMmQuery () {
        if (this.props.mmquery) {
            this.props.mmquery(this._mmqueryParams);
        }
    }
    onMmClean () {
        this.props.form.resetFields();
        this.props.mmquery();
        this._mmqueryParams = {};
    }
    onQuery () {
        if (this.props.query) {
            this.props.query(this._queryParams);
        }
    }
    onClean () {
        this.props.form.resetFields();
        this.props.query();
        this._queryParams = {};
    }
    changeFormField (key, event) {
        let value = getFieldValue(event);
        if (key === 'status') {
            this._queryParams['status'] = value;
        }
        if (key === 'mmstatus') {
            this._mmqueryParams['mmstatus'] = value;
        }
        if (key === 'type') {
            this._queryParams['gardentype'] = value;
        }
        if (key === 'time') {
            this._queryParams['stime'] = moment(value[0]).format('YYYY-MM-DD HH:mm:ss');
            this._queryParams['etime'] = moment(value[1]).format('YYYY-MM-DD HH:mm:ss');
        }
        if (key === 'mmtime') {
            this._mmqueryParams['mmstime'] = moment(value[0]).format('YYYY-MM-DD HH:mm:ss');
            this._mmqueryParams['mmetime'] = moment(value[1]).format('YYYY-MM-DD HH:mm:ss');
        }
    }
    onMmApply () {
        this.setState({
            isMmApply: true
        });
    }
    onMmBack () {
        this.setState({
            isMmApply: false
        });
    }
    handleMmSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {
                    actions: {postQrcode}
                } = this.props;
                let data = {
                    GardenType: 0, // 附属设施类型，如果是苗木则为0
                    PlanNum: values.PlanNum,
                    Remark: values.Remark,
                    IsGarden: 0, // 是否园林设施  1是 0否
                    Applier: this.props.userid, // 申请人
                    ConstructUnit: this.props.org, // 申请单位
                    Section: this.props.section // 标段
                };
                postQrcode({}, data).then((res) => {
                    if (res.code === 1) {
                        Notification.success({
                            message: '苗木二维码申请成功'
                        });
                        this.onMmBack();
                        this.props.reloadList();
                    } else {
                        Notification.error({
                            message: res.msg
                        });
                    }
                });
            }
        });
    };
    render () {
        const { getFieldDecorator } = this.props.form;
        let qrcodelist = this.props.qrcodelist; // 获取列表数据
        let mmqrcodelist = this.props.mmqrcodelist; // 获取苗木数据
        if (qrcodelist) {
            qrcodelist.sort((a, b) => { // 表格数据按时间降序排列
                return Date.parse(b.ApplyTime) - Date.parse(a.ApplyTime);
            });
        }
        if (mmqrcodelist) {
            mmqrcodelist.sort((a, b) => { // 表格数据按时间降序排列
                return Date.parse(b.ApplyTime) - Date.parse(a.ApplyTime);
            });
        }
        let dk = this.props.section;
        let sections = this.props.section;
        let projectList = this.props.projectList;
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
        return <div>
            <MmChartList
                projectList={this.props.projectList}
                mmqrcodestat={this.props.mmqrcodestat}
                mmqrcodestatcount={this.props.mmqrcodestatcount}
                mmstorenum={this.props.mmstorenum}
            />
            {!this.state.isMmApply
                ? <div>
                    <div style={{marginTop: 10, height: 32}}>
                        <div style={{float: 'left', marginLeft: 20}}>苗木二维码派发列表</div>
                        {this.props.isApply
                            ? <Button type='primary' style={{float: 'right', marginRight: 20, marginTop: -10, cursor: 'pointer'}} onClick={this.onMmApply.bind(this)}>申请</Button>
                            : ''
                        }
                    </div>
                    <Form>
                        <Row>
                            <Col span={8}>
                                <FormItem {...TableList.layout} label='状态'>
                                    {
                                        getFieldDecorator('mmstatus', {
                                        })(
                                            <Select
                                                placeholder='请选择审核状态'
                                                onChange={this.changeFormField.bind(this,
                                                    'mmstatus')}
                                            >
                                                <Option value='-1'>待审核</Option>
                                                <Option value='0'>未通过</Option>
                                                <Option value='1'>通过</Option>
                                            </Select>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...TableList.layout} label='申请时间'>
                                    {
                                        getFieldDecorator('mmtime', {
                                        })(
                                            <RangePicker showTime onChange={this.changeFormField.bind(this,
                                                'mmtime')} />
                                        )}
                                </FormItem>
                            </Col>
                            <Button type='primary' style={{float: 'right', marginRight: 20, cursor: 'pointer'}} onClick={this.onQuery.bind(this)}>查询</Button>
                            <Button type='primary' style={{float: 'right', marginRight: 10, cursor: 'pointer'}} onClick={this.onClean.bind(this)}>清除</Button>
                        </Row>
                    </Form>
                    <Table
                        columns={this.columnsNursery}
                        dataSource={mmqrcodelist}
                        rowKey='ID'
                    />
                </div>
                : <div>
                    <div style={{marginTop: 10, height: 32}}>
                        <div style={{float: 'left', marginLeft: 20}}>苗木二维码申请</div>
                        {this.props.isApply
                            ? <Button type='primary' style={{float: 'right', marginRight: 20, marginTop: -10}} disabled>申请</Button>
                            : ''
                        }
                    </div>
                    <Form onSubmit={this.handleMmSubmit}>
                        <Row>
                            <Col span={12}>
                                <FormItem {...TableList.layout} label='地块'>
                                    <Input disabled value={dk} />
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...TableList.layout} label='标段'>
                                    <Input disabled value={sections} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem {...TableList.layout} label='计划栽植量'>
                                    {
                                        getFieldDecorator('PlanNum', {
                                            rules: [{ required: true, message: '请填写计划栽植量!' }]
                                        })(
                                            <InputNumber min={1} max={1000000} onChange={this.changeFormField.bind(this,
                                                'PlanNum')} />
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem {...TableList.layout} label='备注'>
                                    {
                                        getFieldDecorator('Remark', {
                                        })(
                                            <TextArea onChange={this.changeFormField.bind(this,
                                                'Remark')} rows={4} style={{width: 'calc(100% * 4 - 50px)', maxWidth: 'calc(100% * 4 - 50px)'}} />
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{textAlign: 'center'}}>
                                <FormItem>
                                    <Button type='primary' style={{marginRight: 20, cursor: 'pointer'}} onClick={this.onMmBack.bind(this)}>返回</Button>
                                    <Button type='primary' htmlType='submit' style={{cursor: 'pointer'}}>提交</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            }
        </div>;
    }
    columnsNursery = [
        {
            title: '序号',
            dataIndex: 'index',
            render: (text, record, index) => {
                return index + 1;
            }
        },
        {
            title: '地块',
            dataIndex: 'Section',
            key: 'dk',
            render: text => {
                let projectList = this.props.projectList;
                if (text) {
                    if (projectList.length > 0) {
                        for (let i = 0; i < projectList.length; i++) {
                            if (projectList[i].No === text.split('-')[0]) {
                                text = projectList[i].Name;
                            }
                        }
                    }
                }
                return text;
            }
        },
        {
            title: '标段',
            dataIndex: 'Section',
            key: 'bd',
            render: text => {
                let projectList = this.props.projectList;
                if (text) {
                    if (projectList.length > 0) {
                        for (let i = 0; i < projectList.length; i++) {
                            if (projectList[i].No === text.split('-')[0]) {
                                let list = projectList[i].children;
                                for (let j = 0; j < list.length; j++) {
                                    if (list[j].No === text) {
                                        text = list[j].Name;
                                    }
                                }
                            }
                        }
                    }
                }
                return text;
            }
        },
        {
            title: '计划栽植量',
            dataIndex: 'PlanNum'
        },
        {
            title: '标段库存量',
            dataIndex: 'StockNum'
        },
        {
            title: '实际派发总量',
            dataIndex: 'DistributeNum'
        },
        {
            title: '申请人',
            dataIndex: 'ApplierObj.Full_Name'
        },
        {
            title: '申请时间',
            dataIndex: 'ApplyTime'
        },
        {
            title: '审核状态',
            dataIndex: 'Status',
            render: text => {
                if (text || text === 0) {
                    if (text === -1) {
                        text = '待审核';
                    } else if (text === 0) {
                        text = '未通过';
                    } else if (text === 1) {
                        text = '通过';
                    }
                }
                return text;
            }
        },
        {
            title: '操作',
            dataIndex: 'active',
            render: (text, record, index) => {
                console.log('record.Status', record.Status);
                console.log('record.Section', record.Section);
                console.log('this.props.section', this.props.section);
                console.log('this.props.isExamine', this.props.isExamine);
                return (<div>
                    <span style={{color: '#1890ff', marginRight: 10, cursor: 'pointer'}} onClick={this.onMmDetails.bind(this, record)}>详情</span>
                    {
                        record.Status === -1 &&
                        ((
                            this.props.isExamine) || this.props.isadmin)
                            ? <span
                                style={{color: '#1890ff', cursor: 'pointer'}}
                                onClick={this.onMmCheck.bind(this, record)}>
                            审核
                            </span> : ''
                    }
                </div>);
            }
        }
    ];
    onMmDetails (record) {
        this.props.onVisibleView('mmxq', record.ID);
    }
    onMmCheck (record) {
        this.props.onExamine('mm', record.ID);
    }
    activeKeyChange (key) {
        this.props.changeTabs(key);
        this.onClean();
        this.onMmClean();
    }
};
export default Form.create()(TableList);
