import React, { Component } from 'react';
import {
    Button,
    Table,
    Modal,
    Progress,
    Row,
    Col,
    DatePicker,
    Form,
    Select
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class HandleNurseryInCar extends Component {
    constructor (props) {
        super(props);
        this.state = {
            details: [],
            loading1: false,
            pagination1: {},
            size: 10,
            percent1: 0,
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59')
        };
    }
    FormItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };
    FormItemLayout1 = {
        labelCol: { span: 0 },
        wrapperCol: { span: 24 }
    };
    columns = [
        {
            title: '序号',
            dataIndex: 'order'
        },
        {
            title: '顺序码',
            dataIndex: 'ZZBM'
        },
        {
            title: '树种',
            dataIndex: 'TreeTypeObj.TreeTypeName'
        },
        {
            title: '苗龄',
            dataIndex: 'Age',
            render: (text, record) => {
                if (record.BD.indexOf('P010') !== -1) {
                    return <p>{text}</p>;
                } else {
                    return <p> / </p>;
                }
            }
        },
        {
            title: '产地',
            dataIndex: 'TreePlace'
        },
        {
            title: '供应商',
            dataIndex: 'Factory'
        },
        {
            title: '苗圃名称',
            dataIndex: 'NurseryName'
        },
        {
            title: '填报人',
            dataIndex: 'Inputer',
            render: (text, record) => {
                const { users } = this.props;
                return (
                    <span>
                        {users && users[text] ? users[text].Full_Name : ''}
                    </span>
                );
            }
        },
        {
            title: '创建时间',
            render: (text, record) => {
                const { liftertime1 = '', liftertime2 = '' } = record;
                return (
                    <div>
                        <div>{liftertime1}</div>
                        <div>{liftertime2}</div>
                    </div>
                );
            }
        },
        {
            title: (
                <div>
                    <div>高度</div>
                    <div>(cm)</div>
                </div>
            ),
            render: (text, record) => {
                if (record.GD != 0) return <span>{record.GD}</span>;
                else {
                    return <span>/</span>;
                }
            }
        },
        {
            title: (
                <div>
                    <div>冠幅</div>
                    <div>(cm)</div>
                </div>
            ),
            render: (text, record) => {
                if (record.GF != 0) return <span>{record.GF}</span>;
                else {
                    return <span>/</span>;
                }
            }
        },
        {
            title: (
                <div>
                    <div>胸径</div>
                    <div>(cm)</div>
                </div>
            ),
            render: (text, record) => {
                if (record.XJ != 0) return <span>{record.XJ}</span>;
                else {
                    return <span>/</span>;
                }
            }
        },
        {
            title: (
                <div>
                    <div>地径</div>
                    <div>(cm)</div>
                </div>
            ),
            render: (text, record) => {
                if (record.DJ != 0) return <span>{record.DJ}</span>;
                else {
                    return <span>/</span>;
                }
            }
        },
        {
            title: (
                <div>
                    <div>土球厚度</div>
                    <div>(cm)</div>
                </div>
            ),
            dataIndex: 'tqhd',
            render: (text, record) => {
                if (record.TQHD != 0) return <span>{record.TQHD}</span>;
                else {
                    return <span>/</span>;
                }
            }
        },
        {
            title: (
                <div>
                    <div>土球直径</div>
                    <div>(cm)</div>
                </div>
            ),
            dataIndex: 'tqzj',
            render: (text, record) => {
                if (record.TQZJ != 0) return <span>{record.TQZJ}</span>;
                else {
                    return <span>/</span>;
                }
            }
        }
    ];
    componentDidMount = async () => {
        const { pagination1 } = this.state;
        await this.getNurseryData(1);
        pagination1.current = 1;
        this.setState({
            pagination1: pagination1
        });
    }
    getNurseryData = async (page) => {
        const {
            actions: {
                getNurserysByPack
            },
            currentCarID
        } = this.props;
        const { size } = this.state;
        let postData = {
            packid: currentCarID,
            page,
            size
        };
        this.setState({
            loading1: true,
            percent1: 0
        });
        try {
            let rst = await getNurserysByPack({}, postData);
            this.setState({ loading1: false, percent1: 100 });
            if (!rst) return;
            let details = rst.content;
            if (details instanceof Array) {
                details.forEach((plan, i) => {
                    plan.order = (page - 1) * size + i + 1;
                    plan.liftertime1 = plan.CreateTime
                        ? moment(plan.CreateTime).format('YYYY-MM-DD')
                        : '/';
                    plan.liftertime2 = plan.CreateTime
                        ? moment(plan.CreateTime).format('HH:mm:ss')
                        : '/';
                });
                const pagination1 = { ...this.state.pagination1 };
                pagination1.total = rst.pageinfo.total;
                pagination1.pageSize = size;
                this.setState({ details, pagination1 });
            }
        } catch (e) {
            console.log('e', e);
        }
    }
    handleTableChange1 (pagination) {
        const pager = { ...this.state.pagination1 };
        pager.current = pagination.current;
        this.setState({
            pagination1: pager
        });
        this.getNurseryData(pagination.current);
    }
    handleDatePick = async (value) => {
        this.setState({
            stime: value[0]
                ? moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
                : ''
        });
        this.setState({
            etime: value[1]
                ? moment(value[1]).format('YYYY-MM-DD HH:mm:ss')
                : ''
        });
    }
    query = async () => {

    }
    handleDetailModalCancel = () => {
        this.props.onChangeNurseryInCarModalCancel();
    }
    render () {
        const {
            form: { getFieldDecorator },
            treetypes = []
        } = this.props;
        const {
            details,
            loading1,
            percent1
        } = this.state;
        return (
            <Modal
                width={1080}
                title='修改苗木'
                visible
                footer={null}
                maskClosable={false}
                onCancel={this.handleDetailModalCancel.bind(this)}
            >
                <div>
                    <Form>
                        <Row>
                            <Col span={6}>
                                <FormItem
                                    {...this.FormItemLayout}
                                    label='树种'
                                >
                                    {getFieldDecorator(
                                        'treeType',
                                        {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请选择树种'
                                                }
                                            ]
                                        }
                                    )(<Select
                                        allowClear
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.props.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {
                                            treetypes.map((type) => {
                                                return <Option key={type.ID} value={type.ID}>
                                                    {type.TreeTypeName}
                                                </Option>;
                                            })
                                        }
                                    </Select>)}
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem
                                    {...this.FormItemLayout}
                                    label='创建时间'
                                >
                                    {getFieldDecorator(
                                        'time',
                                        {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请选择创建时间'
                                                }
                                            ]
                                        }
                                    )(<RangePicker
                                        style={{ verticalAlign: 'middle' }}
                                        defaultValue={[
                                            moment(this.state.stime, 'YYYY-MM-DD HH:mm:ss'),
                                            moment(this.state.etime, 'YYYY-MM-DD HH:mm:ss')
                                        ]}
                                        showTime={{ format: 'HH:mm:ss' }}
                                        format={'YYYY/MM/DD HH:mm:ss'}
                                        onChange={this.handleDatePick.bind(this)}
                                    />)}
                                </FormItem>
                            </Col>
                            {/* <Col span={12} /> */}
                            <Col span={8}>
                                <FormItem {...HandleNurseryInCar.FormItemLayout1} >
                                    {getFieldDecorator('button', {
                                    })(
                                        <div style={{float: 'right'}}>
                                            <Button
                                                type='primary'
                                                style={{marginLeft: 30}}
                                                onClick={this.query.bind(this, 1)}
                                            >
                                                查询
                                            </Button>
                                            <Button
                                                type='primary'
                                                style={{marginLeft: 30}}
                                                onClick={this.query.bind(this)}>
                                                移动
                                            </Button>
                                            <Button
                                                type='primary'
                                                style={{marginLeft: 30}}
                                                onClick={this.query.bind(this)}>
                                                修改
                                            </Button>
                                        </div>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <Table
                        bordered
                        className='foresttable'
                        columns={this.columns}
                        rowKey='order'
                        loading={{
                            tip: (
                                <Progress
                                    style={{ width: 200 }}
                                    percent={percent1}
                                    status='active'
                                    strokeWidth={5}
                                />
                            ),
                            spinning: loading1
                        }}
                        locale={{ emptyText: '当天无苗圃测量信息' }}
                        dataSource={details}
                        onChange={this.handleTableChange1.bind(this)}
                        pagination={this.state.pagination1}
                    />
                    <Row style={{ marginTop: 10 }}>
                        <Button
                            onClick={this.handleDetailModalCancel.bind(this)}
                            style={{ float: 'right' }}
                            type='primary'
                        >
                            关闭
                        </Button>
                    </Row>
                </div>
            </Modal>
        );
    }
}
export default Form.create()(HandleNurseryInCar);
