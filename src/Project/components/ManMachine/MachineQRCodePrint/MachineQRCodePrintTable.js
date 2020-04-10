import React, { Component } from 'react';
import {
    Icon,
    Table,
    Modal,
    Row,
    Col,
    DatePicker,
    Button,
    Input,
    Progress,
    Divider,
    Notification,
    Popconfirm
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import QRCode from 'qrcodejs2';
// import QRCode from 'qrcode.react';
import {getLodop} from '_platform/LodopFuncs';
import {trim} from '_platform/auth';
import '../index.less';
import MachineQRCodeAddModal from './MachineQRCodeAddModal';
import LocationDeviceDetailModal from './LocationDeviceDetailModal';

const { RangePicker } = DatePicker;

export default class MachineQRCodePrintTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            tblData: [],
            pagination: {},
            loading: false,
            percent: 0,
            size: 10,
            exportsize: 100,
            licenseplate: '',
            machineID: '',
            machineSIMID: '',
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59'),
            dataSourceSelected: [],
            selectedRowKeys: [],
            addMachineQRCodeVisible: false,
            locationDeviceDetailVisible: false,
            handleLocationDeviceDetail: ''
        };
        this.qrcode = '';
    }
    columns = [
        {
            title: '序列号',
            dataIndex: 'index'
        },
        {
            title: '设备ID',
            dataIndex: 'CarNo'
        },
        {
            title: 'SIM卡号',
            dataIndex: 'SimNo'
        },
        {
            title: '车牌',
            dataIndex: 'LicensePlate'
        },
        {
            title: '设备类型',
            dataIndex: 'DeviceType'
        },
        {
            title: '登记时间',
            dataIndex: 'SendTime'
        },
        // {
        //     title: '登记人',
        //     dataIndex: 'InputerName',
        //     render: (text, record, index) => {
        //         if (record.InputerUserName && record.InputerName) {
        //             return <sapn>{record.InputerName + '(' + record.InputerUserName + ')'}</sapn>;
        //         } else if (record.InputerName && !record.InputerUserName) {
        //             return <sapn>{record.InputerName}</sapn>;
        //         } else {
        //             return <sapn> / </sapn>;
        //         }
        //     }
        // },
        // {
        //     title: '在场状态',
        //     dataIndex: 'InStatus',
        //     render: (text, record, index) => {
        //         if (text === 1) {
        //             return <sapn>在场</sapn>;
        //         } else if (text === 0) {
        //             return <sapn>离场</sapn>;
        //         } else if (text === -1) {
        //             return <sapn>仅登记</sapn>;
        //         } else {
        //             return <sapn>/</sapn>;
        //         }
        //     }
        // },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record, index) => {
                if (record.QRCode) {
                    return (
                        <div>
                            {/* <a onClick={this.handleView.bind(this, record)}>查看</a>
                            <Divider type='vertical' /> */}
                            <a onClick={this.handlePrintSingle.bind(this, record)}>打印</a>
                            <Divider type='vertical' />
                            <Popconfirm
                                onConfirm={this.handleDeleteLocationDevice.bind(this, record)}
                                title='确定要删除设备吗'
                                okText='确定'
                                cancelText='取消' >
                                <a>删除</a>
                            </Popconfirm>
                        </div>
                    );
                } else {
                    return (
                        <Popconfirm
                            onConfirm={this.handleDeleteLocationDevice.bind(this, record)}
                            title='确定要删除设备吗'
                            okText='确定'
                            cancelText='取消' >
                            <a>删除</a>
                        </Popconfirm>
                    );
                }
            }
        }
    ];
    componentDidMount = async () => {
        await this.query(1);
    }
    // 车牌号
    handleMachineQRCodeIndexChange (value) {
        this.setState({
            licenseplate: trim(value.target.value)
        });
    }
    // 机械设备ID
    handleMachineIDChange (value) {
        this.setState({
            machineID: trim(value.target.value)
        });
    }
    // 机械设备SIM卡号
    handleMachineSIMIDChange (value) {
        this.setState({
            machineSIMID: trim(value.target.value)
        });
    }
    datepick (value) {
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
    // 换页
    handleTableChange (pagination) {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager
        });
        this.query(pagination.current);
    }
    // 搜索
    query = async (page) => {
        const {
            licenseplate,
            machinID,
            machinSIMID
        } = this.state;
        const {
            actions: {
                getLocationDevices,
                getUserDetail
            }
        } = this.props;
        let postdata = {
            carno: machinID || '',
            simno: machinSIMID || '',
            licenseplate: licenseplate || '',
            page,
            size: 10
        };
        this.setState({
            loading: true,
            percent: 0
        });
        let rst = await getLocationDevices({}, postdata);
        if (!(rst && rst.content)) {
            this.setState({
                loading: false,
                percent: 100
            });
            return;
        }
        let contentData = rst.content;
        // 获取填报人唯一性数组
        let userIDList = [];
        let userDataList = [];
        for (let i = 0; i < contentData.length; i++) {
            let plan = contentData[i];
            plan.index = '';
            if (plan.QRCode) {
                let qrcodeList = plan.QRCode.split('-');
                if (qrcodeList && qrcodeList.length === 3) {
                    plan.index = qrcodeList[2];
                }
            }
            plan.liftertime1 = plan.CreateTime
                ? moment(plan.CreateTime).format('YYYY-MM-DD')
                : '/';
            plan.liftertime2 = plan.CreateTime
                ? moment(plan.CreateTime).format('HH:mm:ss')
                : '/';
            if (plan.Creater) {
                // 获取上报人
                let userData = '';
                if (userIDList.indexOf(Number(plan.Creater)) === -1) {
                    userData = await getUserDetail({id: plan.Creater});
                } else {
                    userData = userDataList[Number(plan.Creater)];
                }
                if (userData && userData.ID) {
                    userIDList.push(userData.ID);
                    userDataList[userData.ID] = userData;
                }
                plan.InputerName = (userData && userData.Full_Name) || '';
                plan.InputerUserName = (userData && userData.User_Name) || '';
            }
        }
        const pagination = { ...this.state.pagination };
        pagination.total = (rst.pageinfo && rst.pageinfo.total) || 0;
        pagination.pageSize = 10;
        this.setState({
            tblData: contentData,
            pagination,
            selectedRowKeys: [],
            dataSourceSelected: []
        }, async () => {
            const {
                tblData
            } = this.state;
            for (let t = 0; t < tblData.length; t++) {
                let data = tblData[t];
                if (data && data.QRCode && data.ID) {
                    // var canvas = document.getElementById(`${data.ID}`);
                    // var strDataURI = canvas.toDataURL('image/png');
                    // data.src = strDataURI;
                    if (this.qrcode) {
                        this.qrcode.clear();
                        this.qrcode.makeCode(data.QRCode);
                    } else {
                        this.qrcode = await new QRCode(document.getElementById(data.ID), {
                            text: data.QRCode,
                            width: 210,
                            height: 210,
                            colorDark: '#000000',
                            colorLight: '#ffffff',
                            correctLevel: QRCode.CorrectLevel.H
                        });
                    }

                    console.log('this.qrcode', this.qrcode);
                    console.log('QRCode', data.QRCode);
                    if (this.qrcode && this.qrcode._oDrawing && this.qrcode._oDrawing._elImage && this.qrcode._oDrawing._elImage.src) {
                        let img = this.qrcode._oDrawing._elImage.src;
                        console.log('img', img);
                        data.src = img;
                    } else {
                        this.query(page);
                        return;
                    }
                }
            }
            this.setState({
                loading: false,
                percent: 100,
                tblData
            });
        });
    }
    // 表格的多选设置
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            dataSourceSelected: selectedRows
        });
    }
    // 多个打印
    handlePrinting = () => {
        const {
            dataSourceSelected
        } = this.state;
        let printDataSource = dataSourceSelected;
        this.setState({
            printDataSource
        }, () => {
            this.printPageView();
        });
    }
    // 单个打印
    handlePrintSingle = (record) => {
        this.setState({
            printDataSource: [record]
        }, () => {
            this.printPageView();
        });
    }
    // 打印
    printPageView = () => {
        const {
            printDataSource
        } = this.state;
        // 打印
        let LODOP = getLodop();
        LODOP.PRINT_INIT('react使用打印插件CLodop'); // 打印初始化
        LODOP.SET_PRINT_PAGESIZE(1, 800, 600, 'A8');
        printDataSource.map((printData, index) => {
            if (index % 2 === 0) {
                if (index === 0) {
                    LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%',
                        document.getElementById(`print${printData.ID}`).innerHTML);
                } else {
                    // 下一页
                    LODOP.NewPage();
                    LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%',
                        document.getElementById(`print${printData.ID}`).innerHTML);
                }
            }
        });

        LODOP.PREVIEW(); // 最后一个打印(预览)语句
    }
    // 删除
    handleDeleteLocationDevice = async (record) => {
        const {
            actions: {
                deleteLocationDevice
            }
        } = this.props;
        let data = await deleteLocationDevice({id: record.ID});
        console.log('data', data);
        if (data && data.code && data.code === 1) {
            Notification.success({
                message: '删除设备成功',
                duration: 3
            });
            await this.handleTableChange({current: 1});
        } else {
            Notification.error({
                message: '删除设备失败',
                duration: 3
            });
        }
    }
    // 查看
    handleView = async (record) => {
        this.setState({
            locationDeviceDetailVisible: true,
            handleLocationDeviceDetail: record
        });
    }
    // 取消查看详情
    handleLocationDeviceDetailCancel = async () => {
        this.setState({
            locationDeviceDetailVisible: false,
            handleLocationDeviceDetail: ''
        });
    }
    // 新增机械二维码
    handleAddMachineQRCodeOk = (record) => {
        this.setState({
            addMachineQRCodeVisible: true
        });
    }
    // 关闭新增机械二维码弹窗
    handleAddMachineQRCodeCancel = (status) => {
        this.setState({
            addMachineQRCodeVisible: false
        });
        if (status) {
            this.handleTableChange({current: 1});
        }
    }
    treeTable (details) {
        const {
            licenseplate,
            machinID,
            machinSIMID,
            selectedRowKeys
        } = this.state;
        let header = '';
        header = (
            <div>
                <Row className='ManMachine-search-layout'>
                    <div className='ManMachine-mrg10'>
                        <span className='ManMachine-search-span'>车牌号：</span>
                        <Input
                            value={licenseplate}
                            className='ManMachine-forestcalcw4'
                            onChange={this.handleMachineQRCodeIndexChange.bind(this)}
                        />
                    </div>
                    <div className='ManMachine-mrg10'>
                        <span className='ManMachine-search-span'>设备ID：</span>
                        <Input
                            value={machinID}
                            className='ManMachine-forestcalcw4'
                            onChange={this.handleMachineIDChange.bind(this)}
                        />
                    </div>
                    <div className='ManMachine-mrg10'>
                        <span className='ManMachine-search-span'>SIM卡号：</span>
                        <Input
                            value={machinSIMID}
                            className='ManMachine-forestcalcw4'
                            onChange={this.handleMachineSIMIDChange.bind(this)}
                        />
                    </div>
                    {/* <div className='ManMachine-mrg-datePicker'>
                        <span className='forest-search-span'>申请时间：</span>
                        <RangePicker
                            style={{ verticalAlign: 'middle' }}
                            defaultValue={[
                                moment(this.state.stime, 'YYYY-MM-DD HH:mm:ss'),
                                moment(this.state.etime, 'YYYY-MM-DD HH:mm:ss')
                            ]}
                            className='forest-forestcalcw4'
                            showTime={{ format: 'HH:mm:ss' }}
                            format={'YYYY/MM/DD HH:mm:ss'}
                            onChange={this.datepick.bind(this)}
                            onOk={this.datepick.bind(this)}
                        />
                    </div> */}
                </Row>
                <Row>
                    <Col span={2}>
                        <Button
                            type='primary'
                            onClick={this.handleTableChange.bind(this, {
                                current: 1
                            })}
                        >
                            查询
                        </Button>
                    </Col>
                    <Col span={20} className='ManMachine-quryrstcnt'>
                        <Button
                            type='primary'
                            disabled={selectedRowKeys.length === 0}
                            onClick={this.handlePrinting.bind(this)}
                        >
                            打印
                        </Button>
                    </Col>
                    <Col span={2}>
                        <Button
                            type='primary'
                            onClick={this.handleAddMachineQRCodeOk.bind(this)}
                        >
                            新增
                        </Button>
                    </Col>
                </Row>
            </div>
        );
        return (
            <div>
                {header}
            </div>
        );
    }
    render () {
        const {
            tblData = [],
            selectedRowKeys = [],
            percent,
            loading,
            printDataSource = [],
            addMachineQRCodeVisible,
            locationDeviceDetailVisible
        } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        console.log('tblData', tblData);
        return (
            <div>
                {this.treeTable(tblData)}
                <Row>
                    <Table
                        bordered
                        className='foresttable'
                        columns={this.columns}
                        rowKey='order'
                        loading={{
                            tip: (
                                <Progress
                                    style={{ width: 200 }}
                                    percent={percent}
                                    status='active'
                                    strokeWidth={5}
                                />
                            ),
                            spinning: loading
                        }}
                        locale={{ emptyText: '当前无机械二维码信息' }}
                        dataSource={tblData}
                        rowSelection={rowSelection}
                        onChange={this.handleTableChange.bind(this)}
                        pagination={this.state.pagination}
                    />
                </Row>
                {
                    addMachineQRCodeVisible
                        ? <MachineQRCodeAddModal
                            {...this.props}
                            {...this.state}
                            handleAddMachineQRCodeCancel={this.handleAddMachineQRCodeCancel.bind(this)}
                        /> : ''
                }
                {
                    locationDeviceDetailVisible
                        ? <LocationDeviceDetailModal
                            {...this.props}
                            {...this.state}
                            handleLocationDeviceDetailCancel={this.handleLocationDeviceDetailCancel.bind(this)}
                        /> : ''
                }
                {
                    tblData.map((data) => {
                        if (data && data.QRCode && data.ID) {
                            return <div
                                id={data.ID}
                                style={{
                                    display: 'none',
                                    marginBottom: 5
                                }}
                            />;
                            // SIM卡号-设备ID-顺序码
                            // return <QRCode
                            //     key={data.ID}
                            //     id={data.ID}
                            //     style={{display: 'none'}}
                            //     value={data.QRCode} />;
                        }
                    })
                }
                {
                    printDataSource.map((printData, index) => {
                        if (index % 2 === 0) {
                            let secondStatus = false;
                            let secondData = '';
                            if (printDataSource[index + 1] && printDataSource[index + 1].ID) {
                                secondStatus = true;
                                secondData = printDataSource[index + 1];
                            }
                            return (
                                <div
                                    key={`print${printData.ID}`}
                                    id={`print${printData.ID}`}
                                    style={{
                                        display: 'none',
                                        width: '8cm',
                                        height: '6cm',
                                        fontSize: '12.5'
                                    }}>
                                    <Row>
                                        <div
                                            style={{display: 'inline-block'}}
                                        >
                                            <div
                                                style={{
                                                    width: 'calc(4cm - 0.2cm)',
                                                    display: 'inline-block',
                                                    paddingTop: '10px',
                                                    paddingRight: '0.1cm'
                                                }}
                                            >
                                                <div>
                                                    <div
                                                        style={{
                                                            textAlign: 'center'
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: 'inline-block',
                                                                textAlign: 'center',
                                                                verticalAlign: 'top',
                                                                fontSize: '15px',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            {`雄安森林定位设备`}
                                                        </div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            textAlign: 'center',
                                                            paddingTop: '10px'
                                                        }}
                                                    >
                                                        <img
                                                            src={printData.src}
                                                            alt='uu'
                                                            style={{
                                                                height: '3cm',
                                                                width: '3cm',
                                                                margin: '0 auto'
                                                            }} />
                                                    </div>
                                                    <div
                                                        style={{
                                                            textAlign: 'center'
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: 'inline-block',
                                                                textAlign: 'center',
                                                                verticalAlign: 'top',
                                                                paddingTop: '10px'
                                                            }}
                                                        >
                                                            {`序列号：${printData && printData.index}`}
                                                            {/* {`序列号：0001`} */}
                                                        </div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            textAlign: 'center'
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: 'inline-block',
                                                                textAlign: 'center',
                                                                verticalAlign: 'top',
                                                                paddingTop: '10px',
                                                                fontSize: '13px',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            {`严禁涂鸦和撕毁!`}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                secondStatus
                                                    ? <div
                                                        style={{
                                                            width: 'calc(4cm - 0.2cm)',
                                                            display: 'inline-block',
                                                            paddingTop: '10px',
                                                            paddingLeft: '0.1cm'
                                                        }}
                                                    >
                                                        <div>
                                                            <div
                                                                style={{
                                                                    textAlign: 'center'
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        display: 'inline-block',
                                                                        textAlign: 'center',
                                                                        verticalAlign: 'top',
                                                                        fontSize: '15px',
                                                                        fontWeight: 'bold'
                                                                    }}
                                                                >
                                                                    {`雄安森林定位设备`}
                                                                </div>
                                                            </div>
                                                            <div
                                                                style={{
                                                                    textAlign: 'center',
                                                                    paddingTop: '10px'
                                                                }}
                                                            >
                                                                <img
                                                                    src={secondData.src}
                                                                    alt='uu'
                                                                    style={{
                                                                        height: '3cm',
                                                                        width: '3cm',
                                                                        margin: '0 auto'
                                                                    }} />
                                                            </div>
                                                            <div
                                                                style={{
                                                                    textAlign: 'center'
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        display: 'inline-block',
                                                                        textAlign: 'center',
                                                                        verticalAlign: 'top',
                                                                        paddingTop: '10px'
                                                                    }}
                                                                >
                                                                    {`序列号：${secondData && secondData.index}`}
                                                                    {/* {`序列号：0002`} */}
                                                                </div>
                                                            </div>
                                                            <div
                                                                style={{
                                                                    textAlign: 'center'
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        display: 'inline-block',
                                                                        textAlign: 'center',
                                                                        verticalAlign: 'top',
                                                                        paddingTop: '10px',
                                                                        fontSize: '13px',
                                                                        fontWeight: 'bold'
                                                                    }}
                                                                >
                                                                    {`严禁涂鸦和撕毁!`}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> : ''
                                            }
                                        </div>
                                    </Row>
                                </div>
                            );
                        } else {

                        }
                    })
                }

            </div>
        );
    }
}
