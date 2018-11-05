import React, { Component } from 'react';
import { Table, Modal, Form, Row, Col, Select, DatePicker, Button, Progress } from 'antd';
import moment from 'moment';
import '../index.less';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;

class LeaveTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            imgvisible: false,
            tblData: [],
            pagination: {},
            loading: false,
            size: 12,
            leftkeycode: '',
            stime: moment().format('2017-11-23 00:00:00'),
            etime: moment().format('2017-11-23 23:59:59'),
            zzbm: '',
            section: '',
            treety: '',
            treetype: '',
            treetypename: '',
            factory: '',
            isstandard: '',
            percent: 0
        };
    }
    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };
    static layouts = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };
    componentDidMount () {

    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.leftkeycode != this.state.leftkeycode) {
            this.setState({
                leftkeycode: nextProps.leftkeycode
            }, () => {
                this.qury(1);
            });
        }
    }
    render () {
        const { tblData } = this.state;

        return (
            <div>
                {this.treeTable(tblData)}
                <Modal
                    width={522}
                    title='详细信息'
                    style={{ textAlign: 'center' }}
                    visible={this.state.imgvisible}
                    onOk={this.handleCancel.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                >
                    <img style={{ width: '490px', height: '300px' }} src={this.state.src} alt='图片' />
                </Modal>
            </div>
        );
    }
    treeTable (details) {
        const {
            typeoption,
            standardoption
        } = this.props;
        const {
            treety,
            isstandard
        } = this.state;
        const {
            form: { getFieldDecorator }
        } = this.props;

        let columns = [];
        let header = '';
        columns = [{
            title: '序号',
            dataIndex: 'order'
        }, {
            title: '申请人',
            dataIndex: 'attrs.zzbm'
        }, {
            title: '请假开始日期',
            dataIndex: 'section'
        }, {
            title: '请假结束日期',
            dataIndex: 'place'
        }, {
            title: '请假类型',
            dataIndex: 'treetype'
        }, {
            title: '请假原因',
            dataIndex: 'factory'
        }, {
            title: '申请时间',
            dataIndex: 'nurseryname'
        }, {
            title: '状态',
            dataIndex: 'nurseryname'
        }];
        header = <div >
            <Row>
                <Col span={20}>
                    <Col span={12} >
                        <FormItem {...LeaveTable.layout} label='请假时间：'>
                            {getFieldDecorator('titles', {
                                rules: [{ required: true, message: '请输入请假时间：' }],
                                initialValue: ''
                            })(
                                <RangePicker
                                    style={{ verticalAlign: 'middle' }}
                                    defaultValue={[moment(this.state.stime, 'YYYY-MM-DD HH:mm:ss'), moment(this.state.etime, 'YYYY-MM-DD HH:mm:ss')]}
                                    showTime={{ format: 'HH:mm:ss' }}
                                    format={'YYYY/MM/DD HH:mm:ss'}
                                    onChange={this.datepick.bind(this)}
                                    onOk={this.datepick.bind(this)}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6} >
                        <FormItem {...LeaveTable.layouts} label='请假类型：'>
                            {getFieldDecorator('titles1', {
                                rules: [{ required: true, message: '请输入请假类型：' }],
                                initialValue: ''
                            })(
                                <Select style={{ width: '100px' }} allowClear defaultValue='全部' value={treety} onChange={this.ontypechange.bind(this)}>
                                    {typeoption}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6} >
                        <FormItem {...LeaveTable.layouts} label='审批状态：'>
                            {getFieldDecorator('titles2', {
                                rules: [{ required: true, message: '请输入审批状态：' }],
                                initialValue: ''
                            })(
                                <Select style={{ width: '100px' }} allowClear defaultValue='全部' value={isstandard} onChange={this.standardchange.bind(this)}>
                                    {standardoption}
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                </Col>
                <Col style={{ paddingTop: '2px' }}>
                    <Col span={2} >
                        <Button type='primary' onClick={this.handleTableChange.bind(this, { current: 1 })}>
                            查询
                        </Button>
                    </Col>
                    <Col span={2} >
                        <Button type='primary' onClick={this.resetinput.bind(this)}>
                            重置
                        </Button>
                    </Col>
                </Col>
            </Row>
        </div>;
        return <div>
            <Row style={{ marginBottom: 30 }}>
                {header}
            </Row>
            <Row>
                <Col span={8}>
                    个人假期列表
                </Col>
                <Col span={4} offset={12}>
                    <Button style={{ marginRight: '10px' }}>请假申请</Button>
                    <Button style={{ marginRight: '10px' }}>删除</Button>
                    <Button style={{ marginRight: '10px' }}>浏览</Button>
                </Col>
            </Row>
            <Row>
                <Table
                    bordered
                    className='foresttables'
                    columns={columns}
                    loading={{ tip: <Progress style={{ width: 200 }} percent={this.state.percent} status='active' strokeWidth={5} />, spinning: this.state.loading }}
                    locale={{ emptyText: '当天无信息' }}
                    dataSource={details}
                    pagination={this.state.pagination}
                />
            </Row>
        </div>;
    }

    ontypechange (value) {
        this.setState({ treety: value || '' });
    }

    standardchange (value) {
        this.setState({ isstandard: value || '' });
    }

    datepick (value) {
        this.setState({ stime: value[0] ? moment(value[0]).format('YYYY-MM-DD HH:mm:ss') : '' });
        this.setState({ etime: value[1] ? moment(value[1]).format('YYYY-MM-DD HH:mm:ss') : '' });
    }

    handleTableChange (pagination) {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager
        });
        this.qury(pagination.current);
    }

    handleCancel () {
        this.setState({ imgvisible: false });
    }

    resetinput () {
        const { resetinput, leftkeycode } = this.props;
        resetinput(leftkeycode);
    }

    qury (page) {
        const {
            zzbm = '',
            section = '',
            treety = '',
            treetype = '',
            factory = '',
            isstandard = '',
            stime = '',
            etime = '',
            size
        } = this.state;
        const { actions: { getfactoryAnalyse }, keycode = '' } = this.props;
        let postdata = {
            no: keycode,
            zzbm,
            section,
            treety,
            treetype,
            factory,
            isstandard,
            liftime_min: stime && moment(stime).add(8, 'h').unix(),
            liftime_max: etime && moment(etime).add(8, 'h').unix(),
            page,
            per_page: size
        };
        this.setState({ loading: true, percent: 0 });
        // getfactoryAnalyse({}, postdata)
        // 	.then(rst => {
        // 		this.setState({ loading: false, percent: 100 })
        // 		if (!rst)
        // 			return
        // 		let tblData = rst.result;
        // 		if (tblData instanceof Array) {
        // 			tblData.forEach((plan, i) => {
        // 				const { attrs = {} } = plan;
        // 				tblData[i].order = ((page - 1) * size) + i + 1;
        // 				let place = `${~~plan.land.replace('P', '')}地块${~~plan.region}区块${~~attrs.smallclass}小班${~~attrs.thinclass}细班`;
        // 				tblData[i].place = place;
        // 				let liftertime1 = !!plan.liftertime ? moment(plan.liftertime).format('YYYY-MM-DD') : '/';
        // 				let liftertime2 = !!plan.liftertime ? moment(plan.liftertime).format('HH:mm:ss') : '/';
        // 				tblData[i].liftertime1 = liftertime1;
        // 				tblData[i].liftertime2 = liftertime2;
        // 			})
        // 			const pagination = { ...this.state.pagination };
        // 			pagination.total = rst.total;
        // 			pagination.pageSize = size;
        // 			this.setState({ tblData, pagination: pagination });
        // 		}
        // 	})
    }
}
export default Form.create()(LeaveTable);
