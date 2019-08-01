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
import ChangeNurseryInfoModal from './ChangeNurseryInfoModal'; // 修改车内的苗木
import MoveTreeInCarModal from './MoveTreeInCarModal'; // 移动车内的苗木
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class HandleChangeDetailModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            details: [],
            detailModalVisible: true,
            searchDetails: [],
            searchStatus: false,
            detailModalLoading: false,
            detailModalPercent: 0,
            stime: '',
            etime: '',
            selectedRowKeys: [],
            selectedRows: [],
            selectedRowSXM: [],
            changeNurseryInfoVisible: false,
            example: '',
            moveTreeInCarVisible: false
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
            dataIndex: 'InputerName',
            render: (text, record) => {
                if (record.InputerUserName && record.InputerName) {
                    return <p>{record.InputerName + '(' + record.InputerUserName + ')'}</p>;
                } else if (record.InputerName && !record.InputerUserName) {
                    return <p>{record.InputerName}</p>;
                } else {
                    return <p> / </p>;
                }
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
        await this.getNurseryData();
    }
    getNurseryData = async () => {
        const {
            actions: {
                getNurserysByPack,
                getUserDetail
            },
            currentRecord
        } = this.props;
        let postData = {
            packid: currentRecord.ID
        };
        this.setState({
            detailModalLoading: true,
            detailModalPercent: 0
        });
        try {
            let rst = await getNurserysByPack({}, postData);
            if (rst && rst.content) {
                let details = rst.content;
                if (details && details instanceof Array && details.length > 0) {
                    for (let i = 0; i < details.length; i++) {
                        let plan = details[i];
                        plan.order = i + 1;
                        plan.liftertime1 = plan.CreateTime
                            ? moment(plan.CreateTime).format('YYYY-MM-DD')
                            : '/';
                        plan.liftertime2 = plan.CreateTime
                            ? moment(plan.CreateTime).format('HH:mm:ss')
                            : '/';
                        let userData = await getUserDetail({id: plan.Inputer});
                        plan.InputerName = (userData && userData.Full_Name) || '';
                        plan.InputerUserName = (userData && userData.User_Name) || '';
                    }
                    this.setState({ details });
                }
            }
            this.setState({ detailModalLoading: false, detailModalPercent: 100 });
        } catch (e) {
            console.log('e', e);
        }
    }
    handleDatePick = async (value) => {
        console.log('value', value);
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
        const {
            details,
            stime,
            etime
        } = this.state;
        const {
            form: {
                getFieldValue
            }
        } = this.props;
        try {
            let treeType = getFieldValue('treeType');
            if (treeType || stime || etime) {
                let searchDetails = [];
                for (let i = 0; i < details.length; i++) {
                    let detail = details[i];
                    let findStatus = false;
                    if (treeType) {
                        if (detail && detail.TreeType === treeType) {
                            findStatus = true;
                            if (stime && etime) {
                                if (detail && moment(detail.CreateTime).isBetween(stime, etime)) {
                                    findStatus = true;
                                } else {
                                    findStatus = false;
                                }
                            }
                        } else {
                            findStatus = false;
                        }
                    }
                    if (findStatus) {
                        searchDetails.push(detail);
                    }
                }
                this.setState({
                    searchDetails,
                    searchStatus: true
                });
            } else {
                this.setState({
                    searchDetails: [],
                    searchStatus: false
                });
            }
            this.setState({
                selectedRowKeys: [],
                selectedRows: [],
                selectedRowSXM: []
            });
        } catch (e) {
            console.log('query', e);
        }
    }
    // 打开修改苗木信息弹窗
    handlChangeNurseryInfoClick = async () => {
        const {
            details = []
        } = this.state;
        try {
            let example = details[0];
            this.setState({
                example,
                changeNurseryInfoVisible: true,
                detailModalVisible: false
            });
        } catch (e) {
            console.log('handlChangeNurseryInfoClick', e);
        }
    }
    // 修改苗木信息成功
    handleChangeNurseryInfoModalOk = async () => {
        this.setState({
            example: '',
            changeNurseryInfoVisible: false,
            detailModalVisible: true,
            selectedRowKeys: [],
            selectedRows: [],
            selectedRowSXM: []
        });
        await this.getNurseryData();
    }
    // 修改苗木信息取消
    handleChangeNurseryInfoModalCancel = async () => {
        this.setState({
            example: '',
            changeNurseryInfoVisible: false,
            detailModalVisible: true
        });
    }
    // 移动选中苗木弹窗
    handleMoveTreeInCarCilck = async () => {
        try {
            this.setState({
                moveTreeInCarVisible: true,
                detailModalVisible: false
            });
        } catch (e) {
            console.log('handleMoveTreeInCarCilck', e);
        }
    }
    // 移动选中苗木弹窗完成
    handleMoveTreeInCarModalOk = async () => {
        await this.setState({
            moveTreeInCarVisible: false,
            detailModalVisible: true,
            selectedRowKeys: [],
            selectedRows: [],
            selectedRowSXM: []
        });
        await this.getNurseryData();
    }
    // 移动选中苗木弹窗取消
    handleMoveTreeInCarModalCancel = async () => {
        this.setState({
            moveTreeInCarVisible: false,
            detailModalVisible: true
        });
    }
    // 关闭车辆包详情页面弹窗
    handleChangeDetailModalCancel = async () => {
        this.props.onChangeDetailModalCancel();
    }
    // 表格多选
    onSelectChange = async (selectedRowKeys, selectedRows) => {
        let selectedRowSXM = [];
        for (let i = 0; i < selectedRows.length; i++) {
            selectedRowSXM.push(selectedRows[i].ZZBM);
        }
        this.setState({
            selectedRowKeys,
            selectedRows,
            selectedRowSXM
        });
    }
    render () {
        const {
            form: { getFieldDecorator },
            treetypes = []
        } = this.props;
        const {
            details = [],
            detailModalLoading,
            detailModalPercent,
            changeNurseryInfoVisible,
            selectedRowKeys = [],
            searchDetails = [],
            searchStatus,
            detailModalVisible = true,
            moveTreeInCarVisible
        } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        let dataSource = details;
        if (searchStatus) {
            dataSource = searchDetails;
        }
        return (
            <div>
                {
                    changeNurseryInfoVisible
                        ? <ChangeNurseryInfoModal
                            {...this.props}
                            {...this.state}
                            onChangeNurseryInfoModalOk={this.handleChangeNurseryInfoModalOk.bind(this)}
                            onChangeNurseryInfoModalCancel={this.handleChangeNurseryInfoModalCancel.bind(this)}
                        /> : ''
                }
                {
                    moveTreeInCarVisible
                        ? <MoveTreeInCarModal
                            {...this.props}
                            {...this.state}
                            onMoveTreeInCarModalOk={this.handleMoveTreeInCarModalOk.bind(this)}
                            onMoveTreeInCarModalCancel={this.handleMoveTreeInCarModalCancel.bind(this)}
                        /> : ''
                }
                <Modal
                    width={1080}
                    title='车辆包详情'
                    visible={detailModalVisible}
                    footer={null}
                    maskClosable={false}
                    onCancel={this.handleChangeDetailModalCancel.bind(this)}
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
                                            showTime={{ format: 'HH:mm:ss' }}
                                            format={'YYYY/MM/DD HH:mm:ss'}
                                            onChange={this.handleDatePick.bind(this)}
                                        />)}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...HandleChangeDetailModal.FormItemLayout1} >
                                        {getFieldDecorator('button', {
                                        })(
                                            <div style={{float: 'right'}}>
                                                <Button
                                                    type='primary'
                                                    style={{marginLeft: 30}}
                                                    onClick={this.query.bind(this)}
                                                >
                                                查询
                                                </Button>
                                                <Button
                                                    type='primary'
                                                    disabled={!selectedRowKeys.length > 0}
                                                    style={{marginLeft: 30}}
                                                    onClick={this.handleMoveTreeInCarCilck.bind(this)}>
                                                    移动
                                                </Button>
                                                <Button
                                                    type='primary'
                                                    disabled={!selectedRowKeys.length > 0}
                                                    style={{marginLeft: 30}}
                                                    onClick={this.handlChangeNurseryInfoClick.bind(this)}>
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
                            rowSelection={rowSelection}
                            rowKey='order'
                            loading={{
                                tip: (
                                    <Progress
                                        style={{ width: 200 }}
                                        percent={detailModalPercent}
                                        status='active'
                                        strokeWidth={5}
                                    />
                                ),
                                spinning: detailModalLoading
                            }}
                            locale={{ emptyText: '当天无苗圃测量信息' }}
                            dataSource={dataSource}
                            pagination={false}
                        />
                        <Row style={{ marginTop: 10 }}>
                            <Button
                                onClick={this.handleChangeDetailModalCancel.bind(this)}
                                style={{ float: 'right' }}
                                type='primary'
                            >
                            关闭
                            </Button>
                        </Row>
                    </div>
                </Modal>
            </div>

        );
    }
}
export default Form.create()(HandleChangeDetailModal);
