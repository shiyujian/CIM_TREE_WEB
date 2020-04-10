import React, { Component } from 'react';
import {
    Table,
    Modal,
    Row,
    Col,
    Select,
    Button,
    Input,
    Divider,
    Notification,
    Popconfirm,
    Progress,
    DatePicker
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import QRCode from 'qrcodejs2';
// import QRCode from 'qrcode.react';
import {getLodop} from '_platform/LodopFuncs';
import {
    getForestImgUrl,
    trim
} from '_platform/auth';
import EditPersonModal from './EditPersonModal.js';
const { Option } = Select;
const { RangePicker } = DatePicker;

export default class ManGroupTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            tblData: [],
            picViewVisible: false,
            imgSrcs: [],
            pagination: {},
            loading: false,
            size: 10,
            exportsize: 100,
            workType: '',
            workManName: '',
            workManCreater: '',
            userOptions: [],
            percent: 0,
            recordDetail: '',
            dataSourceSelected: [],
            selectedRowKeys: [],
            viewPersonEntrysRecord: '',
            bloodType: '',
            gender: '',
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59'),
            editPersonVisible: false,
            editPersonRecord: ''
        };
        this.qrcode = '';
    }

    columns = [
        {
            title: '序号',
            dataIndex: 'order'
        },
        {
            title: '姓名',
            dataIndex: 'Name'
        },
        {
            title: '性别',
            dataIndex: 'Gender'
        },
        {
            title: '身份证号',
            dataIndex: 'ID_Card'
        },
        {
            title: '工种',
            dataIndex: 'WorkTypeName'
        },
        {
            title: '登记时间',
            dataIndex: 'CreateTime'
        },
        {
            title: '班组',
            dataIndex: 'workGroupName'
        },
        {
            title: '登记人',
            dataIndex: 'InputerName',
            render: (text, record, index) => {
                if (record.InputerUserName && record.InputerName) {
                    return <sapn>{record.InputerName + '(' + record.InputerUserName + ')'}</sapn>;
                } else if (record.InputerName && !record.InputerUserName) {
                    return <sapn>{record.InputerName}</sapn>;
                } else {
                    return <sapn>无</sapn>;
                }
            }
        },
        {
            title: '手机号',
            dataIndex: 'Phone'
        },
        {
            title: '血型',
            dataIndex: 'BloodType',
            render: (text, record, index) => {
                if (text) {
                    return <sapn>{text}</sapn>;
                } else {
                    return <sapn>无</sapn>;
                }
            }
        },
        {
            title: '职业证书',
            dataIndex: 'FaceSN',
            render: (text, record, index) => {
                if (text) {
                    return <a onClick={this.handlePicView.bind(this, text)}>查看</a>;
                } else {
                    return <sapn>无</sapn>;
                }
            }
        },
        {
            title: '人脸照片',
            dataIndex: 'ImagePath',
            render: (text, record, index) => {
                if (text) {
                    return <a onClick={this.handlePicView.bind(this, text)}>查看</a>;
                } else {
                    return <sapn>无</sapn>;
                }
            }
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record, index) => {
                return <div>
                    <a onClick={this.handlePrintSingle.bind(this, record)}>打印</a>
                    <Divider type='vertical' />
                    <Popconfirm
                        onConfirm={this.handleDeleteWorkMan.bind(this, record)}
                        title='确定要删除人员吗'
                        okText='确定'
                        cancelText='取消' >
                        <a>删除</a>
                    </Popconfirm>
                    <Divider type='vertical' />
                    <a onClick={this.handleEditPerson.bind(this, record)}>编辑</a>
                </div>;
            }
        }

    ];

    componentDidUpdate = async (prevProps, prevState) => {
        const {
            selectMemGroup
        } = this.props;
        if (selectMemGroup !== prevProps.selectMemGroup) {
            this.query(1);
        }
    }
    // 人员姓名
    handleWorkManNameChange (value) {
        this.setState({
            workManName: trim(value.target.value)
        });
    }
    // 工种
    handleWorkTypeChange (value) {
        this.setState({
            workType: value
        });
    }
    // 人员搜索
    handleUserSearch = async (value) => {
        const {
            actions: {
                getUsers
            }
        } = this.props;
        let userList = [];
        let userOptions = [];
        if (value.length >= 2) {
            let postData = {
                fullname: trim(value)
            };
            let userData = await getUsers({}, postData);
            if (userData && userData.content && userData.content instanceof Array) {
                userList = userData.content;
                userList.map((user) => {
                    userOptions.push(
                        <Option
                            key={user.ID}
                            title={`${user.Full_Name}(${user.User_Name})`}
                            value={user.ID}>
                            {`${user.Full_Name}(${user.User_Name})`}
                        </Option>
                    );
                });
            }
            this.setState({
                userOptions
            });
        }
    }
    // 登记人
    onCreaterChange (value) {
        this.setState({
            workManCreater: value
        });
    }
    // 性别
    handleGenderChange (value) {
        this.setState({
            gender: value
        });
    }
    // 血型
    handleBloodTypeChange (value) {
        this.setState({
            bloodType: value
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
    // 获取班组人员
    query = async (page) => {
        const {
            workType = '',
            workManName = '',
            workManCreater = '',
            bloodType = '',
            gender = '',
            stime,
            etime
        } = this.state;
        const {
            workTypesList,
            parentOrgID = '',
            parentOrgData = '',
            selectMemGroup = '',
            workGroupsData,
            actions: {
                getWorkMans,
                getUserDetail
            }
        } = this.props;
        try {
            this.setState({
                loading: true,
                percent: 0
            });
            if (!selectMemGroup) {
                const pagination = { ...this.state.pagination };
                pagination.current = 1;
                pagination.total = 0;
                pagination.pageSize = 10;
                this.setState({
                    tblData: [],
                    pagination,
                    selectedRowKeys: [],
                    dataSourceSelected: [],
                    loading: false,
                    percent: 100
                });
                return;
            };
            let postData = {
                org: parentOrgID,
                team: selectMemGroup,
                worktypeid: workType || '',
                name: workManName || '',
                creater: workManCreater || '',
                stime,
                etime,
                bloodtype: bloodType || '',
                sex: gender || '',
                page,
                size: 10
            };
            let rst = await getWorkMans({}, postData);
            let tblData = [];
            if (rst && rst.content) {
                tblData = rst.content;
            }
            let orgName = (parentOrgData && parentOrgData.OrgName) || '/';
            let userIDList = [];
            let userDataList = [];
            for (let i = 0; i < tblData.length; i++) {
                let plan = tblData[i];
                plan.order = (page - 1) * 10 + i + 1;
                // 公司名
                plan.orgName = orgName;
                // 打印公司名
                plan.printOrgName = (orgName && orgName.slice(0, 24)) || '';
                // 工种
                let typeName = '/';
                if (plan.WorkTypeID) {
                    workTypesList.map((type) => {
                        if (type.ID === plan.WorkTypeID) {
                            typeName = type.Name;
                        }
                    });
                }
                plan.WorkTypeName = typeName;
                // 班组
                let groupName = '';
                if (plan.TeamID) {
                    workGroupsData.map((group) => {
                        if (group.ID === plan.TeamID) {
                            groupName = group.Name;
                        }
                    });
                }
                plan.workGroupName = groupName;
                plan.liftertime1 = plan.CreateTime
                    ? moment(plan.CreateTime).format('YYYY-MM-DD')
                    : '/';
                plan.liftertime2 = plan.CreateTime
                    ? moment(plan.CreateTime).format('HH:mm:ss')
                    : '/';
                if (plan.BloodType === '请选择血型') {
                    plan.BloodType = '/';
                }
                // 获取上报人
                if (plan.Creater) {
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
            pagination.current = page;
            pagination.total = (rst.pageinfo && rst.pageinfo.total) || 0;
            pagination.pageSize = 10;
            this.setState({
                tblData,
                pagination,
                selectedRowKeys: [],
                dataSourceSelected: []
            }, async () => {
                const {
                    tblData
                } = this.state;
                for (let t = 0; t < tblData.length; t++) {
                    let data = tblData[t];
                    if (data.ID) {
                        // let canvas = document.getElementById(`${data.ID}`);
                        // let strDataURI = canvas.toDataURL('image/png');
                        // data.src = strDataURI;
                        if (this.qrcode) {
                            this.qrcode.clear();
                            this.qrcode.makeCode(data.ID);
                        } else {
                            this.qrcode = await new QRCode(document.getElementById(data.ID), {
                                text: data.ID,
                                width: 210,
                                height: 210,
                                colorDark: '#000000',
                                colorLight: '#ffffff',
                                correctLevel: QRCode.CorrectLevel.H
                            });
                        }
                        console.log('this.qrcode', this.qrcode);
                        console.log('data.ID', data.ID);

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
        } catch (e) {
            console.log('e', e);
        }
    }
    // 查看图片
    handlePicView = (data) => {
        let imgSrcs = [];
        try {
            let arr = data.split(',');
            arr.map(rst => {
                let src = getForestImgUrl(rst);
                imgSrcs.push(src);
            });
            this.setState({
                imgSrcs,
                picViewVisible: true
            });
        } catch (e) {
            console.log('处理图片', e);
        }
    }
    // 关闭查看图片Modal
    handlePicCancel = () => {
        this.setState({
            imgSrcs: [],
            picViewVisible: false
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
        LODOP.SET_PRINT_PAGESIZE(1, 800, 300, 'A8');
        printDataSource.map((printData, index) => {
            if (index === 0) {
                LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%',
                    document.getElementById(`print${printData.ID}`).innerHTML);
            } else {
                // 下一页
                LODOP.NewPage();
                LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%',
                    document.getElementById(`print${printData.ID}`).innerHTML);
            }
        });

        LODOP.PREVIEW(); // 最后一个打印(预览)语句
    }
    handleDeleteWorkMan = async (record) => {
        const {
            actions: {
                deleteWorkman
            }
        } = this.props;
        let data = await deleteWorkman({id: record.ID});
        console.log('data', data);
        if (data && data.code && data.code === 1) {
            Notification.success({
                message: '删除人员成功',
                duration: 3
            });
            await this.handleTableChange({current: 1});
        } else {
            Notification.error({
                message: '删除人员失败',
                duration: 3
            });
        }
    }
    // 编辑
    handleEditPerson (record) {
        this.setState({
            editPersonVisible: true,
            editPersonRecord: record
        });
    }
    // 关闭编辑
    handleCloseEditModal () {
        this.setState({
            editPersonVisible: false,
            editPersonRecord: ''
        });
    }
    // 编辑成功
    handleCloseEditModalOK () {
        this.setState({
            editPersonVisible: false,
            editPersonRecord: ''
        }, () => {
            this.query(1);
        });
    }
    treeTable (details) {
        const {
            workTypesList
        } = this.props;
        const {
            workType,
            workManName,
            workManCreater,
            userOptions,
            selectedRowKeys,
            bloodType,
            gender,
            stime,
            etime
        } = this.state;
        let header = '';
        header = (
            <div>
                <Row className='ManMachine-search-layout'>
                    <div className='ManMachine-mrg10'>
                        <span className='ManMachine-search-span'>姓名：</span>
                        <Input
                            value={workManName}
                            className='ManMachine-forestcalcw4'
                            onChange={this.handleWorkManNameChange.bind(this)}
                        />
                    </div>
                    <div className='ManMachine-mrg10'>
                        <span className='ManMachine-search-span'>工种：</span>
                        <Select
                            allowClear
                            showSearch
                            filterOption={(input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                            className='ManMachine-forestcalcw4'
                            defaultValue='全部'
                            value={workType}
                            onChange={this.handleWorkTypeChange.bind(this)}
                        >
                            {
                                workTypesList.map((type) => {
                                    return <Option key={type.ID} value={type.ID} title={type.Name}>
                                        {type.Name}
                                    </Option>;
                                })
                            }
                        </Select>
                    </div>
                    <div className='ManMachine-mrg10'>
                        <span className='ManMachine-search-span'>登记人：</span>
                        <Select
                            allowClear
                            showSearch
                            className='ManMachine-forestcalcw4'
                            placeholder={'请输入姓名搜索'}
                            onSearch={this.handleUserSearch.bind(this)}
                            onChange={this.onCreaterChange.bind(this)}
                            showArrow={false}
                            filterOption={false}
                            notFoundContent={null}
                            value={workManCreater || undefined}
                        >
                            {userOptions}
                        </Select>
                    </div>
                    <div className='ManMachine-mrg10'>
                        <span className='ManMachine-search-span'>性别：</span>
                        <Select
                            allowClear
                            showSearch
                            className='ManMachine-forestcalcw4'
                            defaultValue='全部'
                            value={gender}
                            onChange={this.handleGenderChange.bind(this)}
                        >
                            <Option key={'男'} value={'男'} title={'男'}>
                            男
                            </Option>
                            <Option key={'女'} value={'女'} title={'女'}>
                                女
                            </Option>
                        </Select>
                    </div>
                    <div className='ManMachine-mrg10'>
                        <span className='ManMachine-search-span'>血型：</span>
                        <Select
                            allowClear
                            showSearch
                            className='ManMachine-forestcalcw4'
                            defaultValue='全部'
                            value={bloodType}
                            onChange={this.handleBloodTypeChange.bind(this)}
                        >
                            <Option key={'A型'} value={'A型'} title={'A型'}>
                            A型
                            </Option>
                            <Option key={'B型'} value={'B型'} title={'B型'}>
                            B型
                            </Option>
                            <Option key={'AB型'} value={'AB型'} title={'AB型'}>
                            AB型
                            </Option>
                            <Option key={'O型'} value={'O型'} title={'O型'}>
                            O型
                            </Option>
                            <Option key={'RH型'} value={'RH型'} title={'RH型'}>
                            RH型
                            </Option>
                            <Option key={'未知'} value={'未知'} title={'未知'}>
                            未知
                            </Option>
                        </Select>
                    </div>
                    <div className='ManMachine-mrg-datePicker'>
                        <span className='ManMachine-search-span'>登记时间：</span>
                        <RangePicker
                            style={{ verticalAlign: 'middle' }}
                            defaultValue={[
                                moment(stime, 'YYYY-MM-DD HH:mm:ss'),
                                moment(etime, 'YYYY-MM-DD HH:mm:ss')
                            ]}
                            className='ManMachine-forestcalcw4'
                            showTime={{ format: 'HH:mm:ss' }}
                            format={'YYYY/MM/DD HH:mm:ss'}
                            onChange={this.datepick.bind(this)}
                            onOk={this.datepick.bind(this)}
                        />
                    </div>
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
            selectState
        } = this.props;
        const {
            tblData = [],
            selectedRowKeys = [],
            percent,
            loading,
            printDataSource = [],
            imgSrcs,
            picViewVisible,
            editPersonVisible
        } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        return (
            <div>
                {this.treeTable(tblData)}
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
                    locale={{ emptyText: '当前无登记人信息' }}
                    dataSource={tblData}
                    rowSelection={rowSelection}
                    onChange={this.handleTableChange.bind(this)}
                    pagination={this.state.pagination}
                />
                {
                    editPersonVisible
                        ? <EditPersonModal
                            {...this.props}
                            {...this.state}
                            handleCloseEditModal={this.handleCloseEditModal.bind(this)}
                            handleCloseEditModalOK={this.handleCloseEditModalOK.bind(this)}
                        /> : ''
                }
                {
                    picViewVisible
                        ? (<Modal
                            width={522}
                            title='图片详情'
                            style={{ textAlign: 'center' }}
                            visible
                            onOk={this.handlePicCancel.bind(this)}
                            onCancel={this.handlePicCancel.bind(this)}
                            footer={null}
                        >
                            {
                                imgSrcs.map((img) => {
                                    return (
                                        <img style={{ width: '490px' }} src={img} alt='图片' />
                                    );
                                })
                            }
                            <Row style={{ marginTop: 10 }}>
                                <Button
                                    onClick={this.handlePicCancel.bind(this)}
                                    style={{ float: 'right' }}
                                    type='primary'
                                >
                                        关闭
                                </Button>
                            </Row>
                        </Modal>)
                        : ''
                }
                {
                    tblData.map((data) => {
                        if (data.ID) {
                            return <div
                                id={data.ID}
                                style={{display: 'none'}}
                            />;
                            // return <QRCode
                            //     key={data.ID}
                            //     id={data.ID}
                            //     style={{display: 'none'}}
                            //     value={data.ID} />;
                        }
                    })
                }
                {
                    printDataSource.map((printData) => {
                        return (
                            <div
                                key={`print${printData.ID}`}
                                id={`print${printData.ID}`}
                                style={{
                                    display: 'none',
                                    width: '8cm',
                                    height: '3cm',
                                    fontSize: '10px'
                                }}>
                                <Row>
                                    <div
                                        style={{
                                            width: '8cm',
                                            display: 'inline-block'
                                        }}>
                                        <div
                                            style={{
                                                width: 'calc(5cm - 5px)',
                                                display: 'inline-block',
                                                marginLeft: '5px',
                                                paddingTop: '3px'
                                            }}
                                        >
                                            <div>
                                                <div>
                                                    <div
                                                        style={{
                                                            width: '50px',
                                                            display: 'inline-block',
                                                            textAlign: 'right',
                                                            verticalAlign: 'top'
                                                        }}
                                                    >
                                                姓名：
                                                    </div>
                                                    <div
                                                        style={{
                                                            width: 'calc(100% - 50px)',
                                                            display: 'inline-block'
                                                        }}
                                                    >
                                                        {printData && printData.Name}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div>
                                                <div
                                                    style={{
                                                        width: '50px',
                                                        display: 'inline-block',
                                                        textAlign: 'right',
                                                        verticalAlign: 'top'
                                                    }}
                                                >
                                                性别：
                                                </div>
                                                <div
                                                    style={{
                                                        width: 'calc(100% - 50px)',
                                                        display: 'inline-block'
                                                    }}
                                                >
                                                    {printData && printData.Gender}
                                                </div>
                                            </div> */}
                                            <div>
                                                <div
                                                    style={{
                                                        width: '50px',
                                                        display: 'inline-block',
                                                        textAlign: 'right',
                                                        verticalAlign: 'top'
                                                    }}
                                                >
                                                工种：
                                                </div>
                                                <div
                                                    style={{
                                                        width: 'calc(100% - 50px)',
                                                        display: 'inline-block'
                                                    }}
                                                >
                                                    {printData.WorkTypeName}
                                                </div>
                                            </div>
                                            <div>
                                                <div
                                                    style={{
                                                        width: '50px',
                                                        display: 'inline-block',
                                                        textAlign: 'right',
                                                        verticalAlign: 'top'
                                                    }}
                                                >
                                                班组：
                                                </div>
                                                <div
                                                    style={{
                                                        width: 'calc(100% - 50px)',
                                                        display: 'inline-block'
                                                    }}
                                                >
                                                    {printData.workGroupName}
                                                </div>
                                            </div>
                                            <div>
                                                <div
                                                    style={{
                                                        width: '50px',
                                                        display: 'inline-block',
                                                        textAlign: 'right',
                                                        verticalAlign: 'top'
                                                    }}
                                                >
                                                单位：
                                                </div>
                                                <div
                                                    style={{
                                                        width: 'calc(100% - 50px)',
                                                        display: 'inline-block'
                                                    }}
                                                >
                                                    {printData.printOrgName}
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                width: 'calc(3cm - 15px)',
                                                display: 'inline-block',
                                                textAlign: 'right',
                                                verticalAlign: 'top',
                                                marginRight: '10px',
                                                marginLeft: '5px',
                                                paddingTop: '5px',
                                                paddingBottom: '2px'
                                            }}
                                        >
                                            <div>
                                                <img
                                                    src={printData.src}
                                                    id='myImg1'
                                                    alt='uu'
                                                    style={{
                                                        height: '2.6cm',
                                                        width: '2.6m',
                                                        margin: '0 auto'
                                                    }} />
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div>
                                        <div style={{
                                            display: 'inline-block',
                                            paddingLeft: '5px',
                                            paddingRight: '5px'
                                        }}>
                                            <div
                                                style={{
                                                    width: '50px',
                                                    display: 'inline-block',
                                                    textAlign: 'right',
                                                    verticalAlign: 'top'
                                                }}
                                            >
                                        单位：
                                            </div>
                                            <div
                                                style={{
                                                    width: 'calc(100% - 50px)',
                                                    display: 'inline-block'
                                                }}
                                            >
                                                {printData.printOrgName}
                                            </div>
                                        </div>
                                    </div> */}

                                </Row>
                            </div>
                        );
                    })
                }
            </div>

        );
    }
}
