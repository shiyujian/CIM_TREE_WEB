import React, { Component } from 'react';
import {
    Table,
    Modal,
    Row,
    Col,
    Button,
    Input,
    Progress,
    message,
    Popconfirm,
    Card,
    Notification
} from 'antd';
import moment from 'moment';
import '../index.less';
import { getUser, getForestImgUrl } from '_platform/auth';
import {
    getSectionNameBySection,
    getProjectNameBySection
} from '_platform/gisAuth';

export default class TreeDataClearTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            imgvisible: false,
            tblData: [],
            pagination: {},
            loading: false,
            status: '',
            sxm: '',
            percent: 0,
            keyword: '',
            seedlingMess: [],
            treeMess: [],
            flowMess: [],
            curingMess: [],
            srcs: '',
            update: 0,
            imgArr: [],
            remark: '',
            remarkPics: ''
        };
        this.flowColumns = [
            {
                title: '流程',
                render: (text, record) => {
                    let flowName = '';
                    if (record.Status) {
                        if (record.Status === -1) {
                            flowName = '施工提交';
                        } else if (record.Status === 0) {
                            flowName = '监理大数据未通过';
                        } else if (record.Status === 1) {
                            flowName = '监理大数据合格';
                        } else if (record.Status === 2) {
                            flowName = '业主合格';
                        } else if (record.Status === 3) {
                            flowName = '业主不合格';
                        } else if (record.Status === 4) {
                            flowName = '施工结缘入库';
                        } else if (record.Status === 5) {
                            flowName = '监理质量不合格';
                        } else if (record.Status === 6) {
                            flowName = '监理质量合格';
                        } else if (record.Status === 100) {
                            flowName = '苗圃提交';
                        }
                    }
                    if (record && record.Node && record.Node === '苗圃提交') {
                        flowName = '苗圃提交';
                    }
                    return <span>{flowName}</span>;
                }
            },
            {
                title: '人员',
                render: (text, record) => {
                    if (record.FromUserObj) {
                        return (
                            <span>{`${record.FromUserObj.Full_Name} (${
                                record.FromUserObj.User_Name
                            })`}</span>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            },
            {
                title: '意见',
                dataIndex: 'Info'
            },
            {
                title: '时间',
                dataIndex: 'CreateTime',
                render: (text, record) => {
                    if (record.CreateTime) {
                        return (
                            <span>
                                {moment(record.CreateTime).format(
                                    'YYYY-MM-DD HH:mm:ss'
                                )}
                            </span>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            },
            {
                title: '备注',
                dataIndex: 'Remark',
                render: (text, record) => {
                    if (record.Node) {
                        if (record.Node === '种树') {
                            return (
                                <a
                                    disabled={!this.state.remarkPics}
                                    onClick={this.remarkImgClick.bind(this)}
                                >
                                    {this.state.remark}
                                </a>
                            );
                        }
                    }
                }
            }
        ];
        this.seedlingColumns = [
            {
                title: '顺序码',
                dataIndex: 'sxm'
            },
            {
                title: '树种',
                dataIndex: 'TreeTypeName'
            },
            {
                title: '苗龄',
                dataIndex: 'Age'
            },
            {
                title: '打包车牌',
                dataIndex: 'car'
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
                title: '起苗时间',
                dataIndex: 'LifterTime'
            },
            {
                title: '起苗地点',
                dataIndex: 'location'
            },
            {
                title: '土球厚度(cm)',
                render: (text, record) => {
                    if (record.TQHD) {
                        return (
                            <a
                                disabled={!record.GDFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.GDFJ
                                )}
                            >
                                {record.TQHD}
                            </a>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            },
            {
                title: '土球直径(cm)',
                render: (text, record) => {
                    if (record.TQZJ) {
                        return (
                            <a
                                disabled={!record.TQZJFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.TQZJFJ
                                )}
                            >
                                {record.TQZJ}
                            </a>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            }
        ];
        this.treeColumns = [
            {
                title: '顺序码',
                dataIndex: 'sxm'
            },
            {
                title: '树种',
                dataIndex: 'TreeTypeName'
            },
            {
                title: '项目',
                dataIndex: 'landName'
            },
            {
                title: '标段',
                dataIndex: 'sectionName'
            },
            {
                title: '小班',
                dataIndex: 'SmallClass'
            },
            {
                title: '细班',
                dataIndex: 'ThinClass'
            },
            {
                title: '位置',
                // dataIndex: 'Location',
                render: (text, record) => {
                    if (record.Location) {
                        return (
                            <span>{`${record.LocationX},${
                                record.LocationY
                            }`}</span>
                        );
                    } else if (record.locationCoord) {
                        return <span>{record.locationCoord}</span>;
                    } else {
                        return <span>未定位</span>;
                    }
                }
            }
        ];
        this.curingColumns = [
            {
                title: '养护类型',
                dataIndex: 'typeName'
            },
            {
                title: '起始时间',
                render: (text, record, index) => {
                    return (
                        <span>
                            {`${moment(record.StartTime).format(
                                'YYYY-MM-DD HH:mm:ss'
                            )} ~ ${moment(record.EndTime).format(
                                'YYYY-MM-DD HH:mm:ss'
                            )}`}
                        </span>
                    );
                }
            },
            {
                title: '养护人员',
                dataIndex: 'CuringMans'
            },
            {
                title: '照片',
                render: (text, record) => {
                    if (record.Pics) {
                        return (
                            <a
                                disabled={!record.Pics}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.Pics
                                )}
                            >
                                点击查看
                            </a>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            }
        ];
    }
    componentDidMount () {
    }
    render () {
        const {
            seedlingMess = [],
            treeMess = [],
            flowMess,
            curingMess,
            sxm
        } = this.state;
        let selected = false;
        try {
            if (sxm && seedlingMess.length > 0 && treeMess.length > 0) {
                console.log('sxm', sxm);
                console.log('seedlingMess', seedlingMess);
                console.log('treeMess', treeMess);

                selected = true;
            }
        } catch (e) {
            console.log('e', e);
        }

        return (
            <div>
                <Row>
                    <Row>
                        <Col xl={3} lg={4} md={5} className='forest-mrg10'>
                            <span>顺序码：</span>
                            <Input
                                value={sxm}
                                className='forest-forestcalcw2'
                                style={{width: 100}}
                                onChange={this.sxmChange.bind(this)}
                            />
                        </Col>
                        <Col span={2} className='forest-mrg10'>
                            <Button
                                type='primary'
                                onClick={this.query.bind(this)}
                            >
                                查询
                            </Button>
                        </Col>
                        <Col span={2} className='forest-mrg10'>
                            <Button
                                type='primary'
                                onClick={this.resetinput.bind(this)}
                            >
                                重置
                            </Button>
                        </Col>
                        <Col span={2} className='forest-mrg10'>
                            {
                                !selected
                                    ? (
                                        <Button
                                            className='buttonStyle'
                                            type='danger'
                                            disabled={!selected}>
                                            删除苗木
                                        </Button>
                                    ) : (
                                        <Popconfirm
                                            onConfirm={this.deleteTreeData.bind(this)}
                                            title='确定要删除该苗木么'
                                            okText='确定'
                                            disabled={!selected}
                                            cancelText='取消' >
                                            <Button
                                                className='buttonStyle'
                                                type='danger'>
                                            删除苗木
                                            </Button>
                                        </Popconfirm>
                                    )
                            }
                        </Col>
                    </Row>
                    <Row />
                </Row>
                <Card title='苗圃测量信息' style={{ marginTop: 10 }}>
                    <Table
                        bordered
                        className='foresttable'
                        columns={this.seedlingColumns}
                        loading={{
                            tip: (
                                <Progress
                                    style={{ width: 200 }}
                                    percent={this.state.percent}
                                    status='active'
                                    strokeWidth={5}
                                />
                            ),
                            spinning: this.state.loading
                        }}
                        locale={{ emptyText: '暂无信息' }}
                        dataSource={seedlingMess}
                        pagination={false}
                    />
                </Card>
                <Card title='现场测量信息' style={{ marginTop: 10 }}>
                    <Table
                        bordered
                        className='foresttable'
                        columns={this.treeColumns}
                        loading={{
                            tip: (
                                <Progress
                                    style={{ width: 200 }}
                                    percent={this.state.percent}
                                    status='active'
                                    strokeWidth={5}
                                />
                            ),
                            spinning: this.state.loading
                        }}
                        locale={{ emptyText: '暂无信息' }}
                        dataSource={treeMess}
                        pagination={false}
                    />
                </Card>
                <Card title='流程信息' style={{ marginTop: 10 }}>
                    <Table
                        bordered
                        className='foresttable'
                        columns={this.flowColumns}
                        loading={{
                            tip: (
                                <Progress
                                    style={{ width: 200 }}
                                    percent={this.state.percent}
                                    status='active'
                                    strokeWidth={5}
                                />
                            ),
                            spinning: this.state.loading
                        }}
                        locale={{ emptyText: '暂无信息' }}
                        dataSource={flowMess}
                        pagination={false}
                    />
                </Card>
                <Card title='养护信息' style={{ marginTop: 10 }}>
                    <Table
                        bordered
                        className='foresttable'
                        columns={this.curingColumns}
                        loading={{
                            tip: (
                                <Progress
                                    style={{ width: 200 }}
                                    percent={this.state.percent}
                                    status='active'
                                    strokeWidth={5}
                                />
                            ),
                            spinning: this.state.loading
                        }}
                        locale={{ emptyText: '暂无信息' }}
                        dataSource={curingMess}
                        pagination={false}
                    />
                </Card>
                <Modal
                    width={522}
                    title='详细信息'
                    style={{ textAlign: 'center', overflow: 'auto' }}
                    visible={this.state.imgvisible}
                    // onOk={this.handleCancel.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    footer={null}
                >
                    {this.state.imgArr}
                    <Row style={{ marginTop: 10 }}>
                        <Button
                            onClick={this.handleCancel.bind(this)}
                            style={{ float: 'right' }}
                            type='primary'
                        >
                            关闭
                        </Button>
                    </Row>
                </Modal>
            </div>
        );
    }

    sxmChange (value) {
        this.setState({ sxm: value.target.value });
    }

    resetinput () {
        const { resetinput } = this.props;
        resetinput();
    }

    onImgClick (data) {
        let srcs = [];
        try {
            let arr = data.split(',');
            arr.map(rst => {
                let src = getForestImgUrl(rst);
                srcs.push(src);
            });
        } catch (e) {
            console.log('处理图片', e);
        }

        let imgArr = [];
        srcs.map(src => {
            imgArr.push(
                <img style={{ width: '490px' }} src={src} alt='图片' />
            );
        });

        this.setState({
            imgvisible: true,
            imgArr: imgArr
        });
    }

    remarkImgClick () {
        const { remarkPics } = this.state;

        let srcs = [];
        try {
            let arr = remarkPics.split(',');
            arr.map(rst => {
                let src = getForestImgUrl(rst);
                srcs.push(src);
            });
        } catch (e) {
            console.log('处理图片', e);
        }

        let imgArr = [];
        srcs.map(src => {
            imgArr.push(
                <img style={{ width: '490px' }} src={src} alt='图片' />
            );
        });

        this.setState({
            imgvisible: true,
            imgArr: imgArr
        });
    }

    handleCancel () {
        this.setState({ imgvisible: false });
    }

    changeColumn () {
        const { seedlingMess, treeMess, flowMess } = this.state;
        this.seedlingColumns = [
            {
                title: '顺序码',
                dataIndex: 'sxm'
            },
            {
                title: '树种',
                dataIndex: 'TreeTypeName'
            },
            {
                title: '苗龄',
                dataIndex: 'Age'
            },
            {
                title: '打包车牌',
                dataIndex: 'car'
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
                title: '起苗时间',
                dataIndex: 'LifterTime'
            },
            {
                title: '起苗地点',
                dataIndex: 'location'
            }
        ];

        let seedling = seedlingMess[0];
        if (seedling.GD) {
            this.seedlingColumns.push({
                title: '高度(cm)',
                render: (text, record) => {
                    if (record.GD) {
                        return (
                            <a
                                disabled={!record.GDFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.GDFJ
                                )}
                            >
                                {record.GD}
                            </a>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            });
        }
        if (seedling.GF) {
            this.seedlingColumns.push({
                title: '冠幅(cm)',
                render: (text, record) => {
                    if (record.GF) {
                        return (
                            <a
                                disabled={!record.GFFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.GFFJ
                                )}
                            >
                                {record.GF}
                            </a>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            });
        }
        if (seedling.XJ) {
            this.seedlingColumns.push({
                title: '胸径(cm)',
                render: (text, record) => {
                    if (record.XJ) {
                        return (
                            <a
                                disabled={!record.XJFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.XJFJ
                                )}
                            >
                                {record.XJ}
                            </a>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            });
        }
        if (seedling.DJ) {
            this.seedlingColumns.push({
                title: '地径(cm)',
                render: (text, record) => {
                    if (record.DJ) {
                        return (
                            <a
                                disabled={!record.DJFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.DJFJ
                                )}
                            >
                                {record.DJ}
                            </a>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            });
        }
        if (seedling.TQHD) {
            this.seedlingColumns.push({
                title: '土球厚度(cm)',
                render: (text, record) => {
                    if (record.TQHD) {
                        return (
                            <a
                                disabled={!record.TQHDFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.TQHDFJ
                                )}
                            >
                                {record.TQHD}
                            </a>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            });
        }
        if (seedling.TQZJ) {
            this.seedlingColumns.push({
                title: '土球直径(cm)',
                render: (text, record) => {
                    if (record.TQZJ) {
                        return (
                            <a
                                disabled={!record.TQZJFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.TQZJFJ
                                )}
                            >
                                {record.TQZJ}
                            </a>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            });
        }

        this.treeColumns = [
            {
                title: '顺序码',
                dataIndex: 'sxm'
            },
            {
                title: '树种',
                dataIndex: 'TreeTypeName'
            },
            {
                title: '项目',
                dataIndex: 'landName'
            },
            {
                title: '标段',
                dataIndex: 'sectionName'
            },
            {
                title: '小班',
                dataIndex: 'SmallClass'
            },
            {
                title: '细班',
                dataIndex: 'ThinClass'
            },
            {
                title: '位置',
                render: (text, record) => {
                    if (record.Location) {
                        return (
                            <span>{`${record.LocationX},${
                                record.LocationY
                            }`}</span>
                        );
                    } else if (record.locationCoord) {
                        return <span>{record.locationCoord}</span>;
                    } else {
                        return <span>未定位</span>;
                    }
                }
            }
        ];

        let tree = treeMess[0];
        if (tree.GD) {
            this.treeColumns.push({
                title: '高度(cm)',
                render: (text, record) => {
                    if (record.GD) {
                        return (
                            <a
                                disabled={!record.GDFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.GDFJ
                                )}
                            >
                                {record.GD}
                            </a>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            });
        }
        if (tree.GF) {
            this.treeColumns.push({
                title: '冠幅(cm)',
                render: (text, record) => {
                    if (record.GF) {
                        return (
                            <a
                                disabled={!record.GFFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.GFFJ
                                )}
                            >
                                {record.GF}
                            </a>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            });
        }
        if (tree.XJ) {
            this.treeColumns.push({
                title: '胸径(cm)',
                render: (text, record) => {
                    if (record.XJ) {
                        return (
                            <a
                                disabled={!record.XJFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.XJFJ
                                )}
                            >
                                {record.XJ}
                            </a>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            });
        }
        if (tree.DJ) {
            this.treeColumns.push({
                title: '地径(cm)',
                render: (text, record) => {
                    if (record.DJ) {
                        return (
                            <a
                                disabled={!record.DJFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.DJFJ
                                )}
                            >
                                {record.DJ}
                            </a>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            });
        }
        if (tree.MD) {
            this.treeColumns.push({
                title: '密度(棵/m^3)',
                render: (text, record) => {
                    if (record.MD) {
                        return (
                            <a
                                disabled={!record.MDFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.MDFJ
                                )}
                            >
                                {record.MD}
                            </a>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            });
        }
        if (tree.MJ) {
            this.treeColumns.push({
                title: '面积(m^2)',
                render: (text, record) => {
                    if (record.MJ) {
                        return (
                            <a
                                disabled={!record.MJFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.MJFJ
                                )}
                            >
                                {record.MJ}
                            </a>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            });
        }
        if (tree.TQHD) {
            this.treeColumns.push({
                title: '土球厚度(cm)',
                render: (text, record) => {
                    if (record.TQHD) {
                        return (
                            <a
                                disabled={!record.TQHDFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.TQHDFJ
                                )}
                            >
                                {record.TQHD}
                            </a>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            });
        }
        if (tree.TQZJ) {
            this.treeColumns.push({
                title: '土球直径(cm)',
                render: (text, record) => {
                    if (record.TQZJ) {
                        return (
                            <a
                                disabled={!record.TQZJFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.TQZJFJ
                                )}
                            >
                                {record.TQZJ}
                            </a>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            });
        }

        this.setState({
            update: Math.random()
        });
    }

    async query () {
        const { sxm = '' } = this.state;

        const {
            actions: {
                getTreeMess,
                getTreeflows,
                getnurserys,
                getCarpackbysxm,
                getThinClassList,
                getCuringTreeInfo,
                getCuringTypes,
                getCuringMessage,
                getTreeLocationCoord
            },
            platform: { tree = {} }
        } = this.props;
        if (!sxm) {
            message.warning('请输入顺序码');
            return;
        }
        let postdata = {
            sxm
        };

        this.setState({
            loading: true,
            percent: 0
        });

        let queryTreeData = await getTreeMess(postdata);
        if (!queryTreeData) {
            queryTreeData = {};
        }
        let treeflowDatas = await getTreeflows({}, postdata);
        let nurserysDatas = await getnurserys({}, postdata);
        let carData = await getCarpackbysxm(postdata);
        let curingTreeData = await getCuringTreeInfo({}, postdata);
        let curingTypesData = await getCuringTypes();
        let curingTypeArr = (curingTypesData && curingTypesData.content) || [];
        // 获取树的地理坐标信息
        let treeLocationData = await getTreeLocationCoord(postdata);

        let SmallClassName = queryTreeData.SmallClass
            ? queryTreeData.SmallClass + '号小班'
            : '';
        let ThinClassName = queryTreeData.ThinClass
            ? queryTreeData.ThinClass + '号细班'
            : '';
        if (
            queryTreeData &&
            queryTreeData.Section &&
            queryTreeData.SmallClass &&
            queryTreeData.ThinClass
        ) {
            let sections = queryTreeData.Section.split('-');
            let parentNo = sections[0] + '-' + sections[1];
            let noList = await getThinClassList({ no: parentNo }, {section: sections[2]});

            let No =
                sections[0] +
                '-' +
                sections[1] +
                '-' +
                queryTreeData.SmallClass +
                '-' +
                queryTreeData.ThinClass +
                '-' +
                sections[2];
            noList.map(rst => {
                if (rst.No.indexOf(No) !== -1) {
                    SmallClassName = rst.SmallClassName
                        ? rst.SmallClassName + '号小班'
                        : SmallClassName;
                    ThinClassName = rst.ThinClassName
                        ? rst.ThinClassName + '号细班'
                        : ThinClassName;
                }
            });
        }

        let treeflowData = {};
        let nurserysData = {};
        let curingTaskArr = [];
        let curingTaskData = [];
        if (
            treeflowDatas &&
            treeflowDatas.content &&
            treeflowDatas.content instanceof Array &&
            treeflowDatas.content.length > 0
        ) {
            treeflowData = treeflowDatas.content;
        }
        if (
            nurserysDatas &&
            nurserysDatas.content &&
            nurserysDatas.content instanceof Array &&
            nurserysDatas.content.length > 0
        ) {
            nurserysData = nurserysDatas.content[0];
        }

        if (
            curingTreeData && curingTreeData.content && curingTreeData.content instanceof Array &&
            curingTreeData.content.length > 0
        ) {
            let content = curingTreeData.content;
            content.map((task) => {
                if (curingTaskArr.indexOf(task.CuringID) === -1) {
                    curingTaskData.push(task);
                    curingTaskArr.push(task.CuringID);
                }
            });
        }

        let remarkPics = queryTreeData.RemarkPics
            ? queryTreeData.RemarkPics
            : '';
        let remark = queryTreeData.Remark ? queryTreeData.Remark : '';

        let seedlingMess = [
            {
                sxm: queryTreeData.ZZBM ? queryTreeData.ZZBM : '',
                car: carData.LicensePlate ? carData.LicensePlate : '',
                TreeTypeName: nurserysData.TreeTypeObj
                    ? nurserysData.TreeTypeObj.TreeTypeName
                    : '',
                TreePlace: nurserysData.TreePlace ? nurserysData.TreePlace : '',
                Factory: nurserysData.Factory ? nurserysData.Factory : '',
                NurseryName: nurserysData.NurseryName
                    ? nurserysData.NurseryName
                    : '',
                Age: nurserysData.Age ? nurserysData.Age : '',
                LifterTime: nurserysData.LifterTime
                    ? moment(nurserysData.LifterTime).format(
                        'YYYY-MM-DD HH:mm:ss'
                    )
                    : '',
                location: nurserysData.location ? nurserysData.location : '',
                InputerObj: nurserysData.InputerObj
                    ? nurserysData.InputerObj
                    : '',
                GD: nurserysData.GD ? nurserysData.GD : '',
                GDFJ: nurserysData.GDFJ ? nurserysData.GDFJ : '',
                GF: nurserysData.GF ? nurserysData.GF : '',
                GFFJ: nurserysData.GFFJ ? nurserysData.GFFJ : '',
                TQZJ: nurserysData.TQZJ ? nurserysData.TQZJ : '',
                TQZJFJ: nurserysData.TQZJFJ ? nurserysData.TQZJFJ : '',
                TQHD: nurserysData.TQHD ? nurserysData.TQHD : '',
                TQHDFJ: nurserysData.TQHDFJ ? nurserysData.TQHDFJ : '',
                DJ: nurserysData.DJ ? nurserysData.DJ : '',
                DJFJ: nurserysData.DJFJ ? nurserysData.DJFJ : '',
                XJ: nurserysData.XJ ? nurserysData.XJ : '',
                XJFJ: nurserysData.XJFJ ? nurserysData.XJFJ : ''
            }
        ];

        // 项目code
        let land = queryTreeData.Land ? queryTreeData.Land : '';
        // 查到的标段code
        let Section = queryTreeData.Section ? queryTreeData.Section : '';
        // 细班树
        let thinClassTree = tree.thinClassTree;
        // 标段名称
        let sectionName = getSectionNameBySection(Section, thinClassTree);
        // 项目名称
        let landName = getProjectNameBySection(Section, thinClassTree);
        // 根据树木的定位坐标获取定位地址
        let location = '';
        if (treeLocationData && treeLocationData.X && treeLocationData.Y) {
            location = `${treeLocationData.X},${treeLocationData.Y}`;
        }
        queryTreeData.locationCoord = location;

        let treeMess = [
            {
                sxm: queryTreeData.ZZBM ? queryTreeData.ZZBM : '',
                landName: landName,
                sectionName: sectionName,
                SmallClass: SmallClassName,
                ThinClass: ThinClassName,
                TreeTypeName: nurserysData.TreeTypeObj
                    ? nurserysData.TreeTypeObj.TreeTypeName
                    : '',
                Location: queryTreeData.LocationTime
                    ? queryTreeData.LocationTime
                    : '',
                LocationX: queryTreeData.Location
                    ? queryTreeData.Location.X
                    : '',
                LocationY: queryTreeData.Location
                    ? queryTreeData.Location.Y
                    : '',
                DJ: queryTreeData.DJ ? queryTreeData.DJ : '',
                DJFJ: queryTreeData.DJFJ ? queryTreeData.DJFJ : '',
                GD: queryTreeData.GD ? queryTreeData.GD : '',
                GDFJ: queryTreeData.GDFJ ? queryTreeData.GDFJ : '',
                GF: queryTreeData.GF ? queryTreeData.GF : '',
                GFFJ: queryTreeData.GFFJ ? queryTreeData.GFFJ : '',
                MD: queryTreeData.MD ? queryTreeData.MD : '',
                MDFJ: queryTreeData.MDFJ ? queryTreeData.MDFJ : '',
                MJ: queryTreeData.MJ ? queryTreeData.MJ : '',
                MJFJ: queryTreeData.MJFJ ? queryTreeData.MJFJ : '',
                TQHD: queryTreeData.TQHD ? queryTreeData.TQHD : '',
                TQHDFJ: queryTreeData.TQHDFJ ? queryTreeData.TQHDFJ : '',
                TQZJ: queryTreeData.TQZJ ? queryTreeData.TQZJ : '',
                TQZJFJ: queryTreeData.TQZJFJ ? queryTreeData.TQZJFJ : '',
                XJ: queryTreeData.XJ ? queryTreeData.XJ : '',
                XJFJ: queryTreeData.XJFJ ? queryTreeData.XJFJ : ''
            }
        ];

        let flowMess = [];

        if (treeflowData instanceof Array) {
            let len = treeflowData.length - 1;
            for (let i = len; i >= 0; i--) {
                flowMess.push(treeflowData[i]);
            }
        }

        try {
            flowMess.unshift({
                Node: '苗圃提交',
                FromUserObj: nurserysData.InputerObj
                    ? nurserysData.InputerObj
                    : '',
                Info: '',
                CreateTime: nurserysData.CreateTime
                    ? nurserysData.CreateTime
                    : ''
            });
        } catch (e) {}

        let curingMess = [];
        for (let i = 0; i < curingTaskData.length; i++) {
            let task = curingTaskData[i];
            let taskID = {
                id: task.CuringID
            };
            let data = await getCuringMessage(taskID);
            for (let t = 0; t < curingTypeArr.length; t++) {
                let type = curingTypeArr[t];
                if (type.ID === data.CuringType) {
                    data.typeName = type.Base_Name;
                }
            }
            data.Pics = data.Pics;
            curingMess.push(data);
        }

        this.setState(
            {
                seedlingMess,
                treeMess,
                flowMess,
                curingMess,
                loading: false,
                percent: 100,
                remarkPics,
                remark
            },
            () => {
                this.changeColumn();
            }
        );
    }
    // 删除苗木信息
    deleteTreeData = async () => {
        const {
            actions: {
                clearTreeData
            }
        } = this.props;
        const {
            sxm
        } = this.state;
        try {
            let user = getUser();
            if (user && user.username === 'admin') {
                this.setState({
                    loading: true
                });
                // 清除类型 0:清除苗木  1：清除现场测量  2：清除苗木、现场测量  3：清除苗木、现场测量、位置
                let postData = {
                    sxm: sxm,
                    cleartype: 3
                };
                console.log('postData', postData);
                let data = await clearTreeData({}, postData);
                console.log('data', data);
                this.setState({
                    loading: true
                });
                if (data && data.code && data.code === 1) {
                    Notification.success({
                        message: '删除信息成功',
                        duration: 3
                    });
                    await this.resetinput();
                } else {
                    Notification.error({
                        message: '删除信息失败',
                        duration: 3
                    });
                }
            } else {
                Notification.error({
                    message: '非管理员不得删除',
                    duration: 3
                });
            }
        } catch (e) {
            console.log('deleteTreeData', e);
        }
    }
}
