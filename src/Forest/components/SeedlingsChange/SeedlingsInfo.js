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
    message,
    Upload,
    Popconfirm,
    Divider
} from 'antd';
import moment from 'moment';
import { FOREST_API } from '_platform/api';
import { getUser, getForestImgUrl } from '_platform/auth';
import '../index.less';
import {
    getSmallThinNameByPlaceData
} from '../auth';
import {
    getSectionNameBySection,
    getProjectNameBySection
} from '_platform/gisAuth';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const Dragger = Upload.Dragger;

export default class SeedlingsChange extends Component {
    constructor (props) {
        super(props);
        this.state = {
            imgvisible: false,
            tblData: [],
            pagination: {},
            loading: false,
            size: 10,
            exportsize: 100,
            leftkeycode: '',
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59'),
            sxm: '',
            section: '',
            percent: 0,
            remark: '',
            changevisible: false,
            changeRecord: '',
            remarkvisible: false,
            remarkRecord: '',
            remarkInfo: '',
            imgArr: [],
            TreatmentData: []
        };
    }
    componentDidMount () {
    }

    columns1 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index'
            // width: '10%',
        },
        {
            title: '文件名称',
            dataIndex: 'fileName',
            key: 'fileName'
            // width: '35%',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            // width: '10%',
            render: (text, record, index) => {
                return (
                    <div>
                        <a onClick={this.onImgClick.bind(this, record.a_file)}>
                            查看
                        </a>
                        <Divider type='vertical' />
                        <Popconfirm
                            placement='rightTop'
                            title='确定删除吗？'
                            onConfirm={this.deleteTreatmentFile.bind(
                                this,
                                record,
                                index
                            )}
                            okText='确认'
                            cancelText='取消'
                        >
                            <a>删除</a>
                        </Popconfirm>
                    </div>
                );
            }
        }
    ];

    // 删除文件表格中的某行
    deleteTreatmentFile = (record, index) => {
        const { TreatmentData } = this.state;

        TreatmentData.splice(index, 1);
        let array = [];
        TreatmentData.map((item, index) => {
            let data = {
                index: index + 1,
                fileName: item.fileName,
                a_file: item.a_file
            };
            array.push(data);
        });
        this.setState({ TreatmentData: array });
    };

    // 上传文件
    uploadProps = {
        name: 'a_file',
        multiple: true,
        showUploadList: false,
        action: `${FOREST_API}/UploadHandler.ashx?filetype=leader`,
        beforeUpload: file => {
            const {
                actions: { postForsetPic }
            } = this.props;
            const { TreatmentData = [] } = this.state;
            let type = file.name.toString().split('.');
            let len = type.length;
            if (
                type[len - 1] === 'jpg' ||
                type[len - 1] === 'jpeg' ||
                type[len - 1] === 'png' ||
                type[len - 1] === 'JPG' ||
                type[len - 1] === 'JPEG' ||
                type[len - 1] === 'PNG'
            ) {
                const formdata = new FormData();
                formdata.append('a_file', file);
                formdata.append('name', file.name);
                postForsetPic({}, formdata).then(rst => {
                    let len = TreatmentData.length;
                    TreatmentData.push({
                        index: len + 1,
                        fileName: file.name,
                        a_file: rst
                    });
                    // notification.success({
                    // 	message:'文件上传成功',
                    // 	duration:3
                    // })
                    this.setState({
                        TreatmentData: TreatmentData,
                        loading: false
                    });
                    return false;
                });
            } else {
                message.error('请上传jpg,jpeg,png 文件');
                this.setState({
                    loading: false
                });
                return false;
            }
        },
        onChange: ({ file, fileList, event }) => {
            this.setState({
                loading: true
            });
        }
    };

    render () {
        const { tblData, remarkInfo } = this.state;
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
                <Modal
                    width={522}
                    title='修改备注信息'
                    visible={this.state.remarkvisible}
                    onOk={this.remarkOK.bind(this)}
                    onCancel={this.remarkCancel.bind(this)}
                >
                    <div>
                        <div style={{ textAlign: 'left' }}>备注：</div>
                        <div style={{ marginBottom: 10 }}>
                            <TextArea
                                rows={4}
                                value={remarkInfo}
                                id='remarkID'
                                onChange={this.remarkInfochange.bind(this)}
                            />
                        </div>
                        <Dragger {...this.uploadProps}>
                            <p className='ant-upload-drag-icon'>
                                <Icon type='inbox' />
                            </p>
                            <p className='ant-upload-text'>
                                点击或者拖拽开始上传
                            </p>
                            <p className='ant-upload-hint'>
                                支持 jpg,jpeg,png 文件
                            </p>
                        </Dragger>
                        <Table
                            style={{ marginTop: 10 }}
                            columns={this.columns1}
                            pagination
                            dataSource={this.state.TreatmentData}
                            className='foresttable'
                        />
                    </div>
                </Modal>
            </div>
        );
    }
    treeTable (details) {
        let columns = [];
        let header = '';
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
                title: '项目',
                dataIndex: 'Project'
            },
            {
                title: '标段',
                dataIndex: 'sectionName'
            },
            {
                title: '位置',
                dataIndex: 'place'
            },
            {
                title: '树种',
                dataIndex: 'TreeTypeObj.TreeTypeName'
            },
            {
                title: '状态',
                dataIndex: 'statusname'
            },
            {
                title: '定位',
                dataIndex: 'islocation'
            },
            {
                title: '测量人',
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
                title: '测量时间',
                render: (text, record) => {
                    const { createtime1 = '', createtime2 = '' } = record;
                    return (
                        <div>
                            <div>{createtime1}</div>
                            <div>{createtime2}</div>
                        </div>
                    );
                }
            },
            {
                title: '定位时间',
                render: (text, record) => {
                    const { createtime3 = '', createtime4 = '' } = record;
                    return (
                        <div>
                            <div>{createtime3}</div>
                            <div>{createtime4}</div>
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
                    if (record.GD != 0) {
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
            },
            {
                title: (
                    <div>
                        <div>冠幅</div>
                        <div>(cm)</div>
                    </div>
                ),
                render: (text, record) => {
                    if (record.GF != 0) {
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
            },
            {
                title: (
                    <div>
                        <div>胸径</div>
                        <div>(cm)</div>
                    </div>
                ),
                render: (text, record) => {
                    if (record.XJ != 0) {
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
            },
            {
                title: (
                    <div>
                        <div>地径</div>
                        <div>(cm)</div>
                    </div>
                ),
                render: (text, record) => {
                    if (record.DJ != 0) {
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
                    if (record.TQHD != 0) {
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
                    if (record.TQZJ != 0) {
                        return (
                            <a
                                disabled={!record.TQHDFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.TQHDFJ
                                )}
                            >
                                {record.TQZJ}
                            </a>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            },
            {
                title: '操作',
                render: (text, record) => {
                    return (
                        <div>
                            <a onClick={this.remarkDefault.bind(this, record)}>
                                备注
                            </a>
                        </div>
                    );
                }
            }
        ];
        header = (
            <div>
                <Row className='forest-search-layout'>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>顺序码：</span>
                        <Input className='forest-forestcalcw4' id='sxmID' />
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>备注关键字：</span>
                        <Input
                            className='forest-forestcalcw4'
                            id='remarkValueID'
                        />
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>时间选择：</span>
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
                    <Col span={20} className='forest-quryrstcnt' />
                    <Col span={2}>
                        <Button
                            type='primary'
                            onClick={this.resetinput.bind(this)}
                        >
                            重置
                        </Button>
                    </Col>
                </Row>
            </div>
        );
        return (
            <div>
                <Row>{header}</Row>
                <Row>
                    <Table
                        bordered
                        className='foresttable'
                        columns={columns}
                        rowKey='order'
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
                        locale={{ emptyText: '当天无业主抽查信息' }}
                        dataSource={details}
                        onChange={this.handleTableChange.bind(this)}
                        pagination={this.state.pagination}
                    />
                </Row>
            </div>
        );
    }

    remarkInfochange (value) {
        this.setState({ remarkInfo: value.target.value });
    }

    remarkDefault (record) {
        try {
            let TreatmentData = [];
            let remarkPics = (record && record.RemarkPics) || '';
            if (remarkPics) {
                let arr = remarkPics.split(',');
                arr.map((rst, index) => {
                    let src = getForestImgUrl(rst);
                    let data = {
                        index: index + 1,
                        fileName: `图片${index + 1}`,
                        a_file: src
                    };
                    TreatmentData.push(data);
                });
            }
            this.setState({
                remarkRecord: record,
                remarkvisible: true,
                remarkInfo: record.Remark ? record.Remark : '',
                TreatmentData: TreatmentData
            });
        } catch (e) {
            console.log('remarkDefault', e);
        }
    }

    async remarkOK () {
        const {
            actions: { getSeedlingInfo }
        } = this.props;
        const { remarkRecord, remarkInfo, TreatmentData } = this.state;

        let remarkPics = '';
        try {
            TreatmentData.map(data => {
                if (data.a_file) {
                    if (remarkPics) {
                        remarkPics = remarkPics + ',' + data.a_file;
                    } else {
                        remarkPics = data.a_file;
                    }
                }
            });
        } catch (e) {}

        let postdata = {
            remark: remarkInfo,
            pics: remarkPics,
            sxm: remarkRecord.ZZBM
        };
        let rst = await getSeedlingInfo(postdata);
        if (rst && rst.code && rst.code == 1) {
            message.success('修改备注和图片成功');
            this.setState(
                {
                    remarkvisible: false,
                    TreatmentData: []
                },
                () => {
                    document.querySelector('#remarkID').value = '';
                    this.handleTableChange({ current: 1 });
                }
            );
        } else {
            message.success('修改备注和图片失败');
        }
    }

    remarkCancel () {
        this.setState({
            remarkvisible: false
        });
    }

    remarkchange (value) {
        this.setState({ remark: value.target.value });
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

    handleTableChange (pagination) {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager
        });
        this.query(pagination.current);
    }

    handleCancel () {
        this.setState({ imgvisible: false });
    }
    resetinput () {
        const { resetinput, leftkeycode } = this.props;
        resetinput(leftkeycode);
    }
    query = async (page) => {
        const { stime = '', etime = '', size } = this.state;
        const {
            actions: {
                getqueryTree,
                getUserDetail
            },
            keycode = '',
            platform: { tree = {} }
        } = this.props;
        let thinClassTree = tree.thinClassTree;

        let sxm = document.querySelector('#sxmID').value;
        let remark = document.querySelector('#remarkValueID').value;
        let user = getUser();
        let section = '';
        if (user.username !== 'admin') {
            message.info('没有权限进行查询');
            return;
        }
        if (!keycode && !sxm) {
            message.info('请选择项目或者输入顺序码进行查询');
            return;
        }

        let postdata = {
            no: keycode,
            sxm,
            section,
            stime: stime && moment(stime).format('YYYY-MM-DD HH:mm:ss'),
            etime: etime && moment(etime).format('YYYY-MM-DD HH:mm:ss'),
            page,
            size,
            remark
        };

        this.setState({ loading: true, percent: 0 });
        let rst = await getqueryTree({}, postdata);
        if (!(rst && rst.content)) {
            this.setState({
                loading: false,
                percent: 100
            });
            return;
        }

        let tblData = rst.content;
        if (tblData instanceof Array) {
            let sxmArr = [];
            for (let i = 0; i < tblData.length; i++) {
                let plan = tblData[i];
                sxmArr.push(plan.ZZBM);
                plan.order = (page - 1) * size + i + 1;
                plan.Project = getProjectNameBySection(plan.Section, thinClassTree);
                plan.sectionName = getSectionNameBySection(plan.Section, thinClassTree);
                plan.place = getSmallThinNameByPlaceData(plan.Section, plan.SmallClass, plan.ThinClass, thinClassTree);

                let statusname = '';
                if (plan.SupervisorCheck == -1) statusname = '未抽查';
                else if (plan.SupervisorCheck == 0) { statusname = '抽查未通过'; } else if (plan.SupervisorCheck === 1) {
                    statusname = '抽查通过';
                }
                plan.statusname = statusname;
                let islocation = plan.LocationTime ? '已定位' : '未定位';
                plan.islocation = islocation;
                let createtime1 = plan.CreateTime
                    ? moment(plan.CreateTime).format('YYYY-MM-DD')
                    : '/';
                let createtime2 = plan.CreateTime
                    ? moment(plan.CreateTime).format('HH:mm:ss')
                    : '/';
                let createtime3 = plan.LocationTime
                    ? moment(plan.LocationTime).format('YYYY-MM-DD')
                    : '/';
                let createtime4 = plan.LocationTime
                    ? moment(plan.LocationTime).format('HH:mm:ss')
                    : '/';
                plan.createtime1 = createtime1;
                plan.createtime2 = createtime2;
                plan.createtime3 = createtime3;
                plan.createtime4 = createtime4;
                let userData = await getUserDetail({id: plan.Inputer});
                plan.InputerName = (userData && userData.Full_Name) || '';
                plan.InputerUserName = (userData && userData.User_Name) || '';
            }

            const pagination = { ...this.state.pagination };
            pagination.total = rst.pageinfo.total;
            pagination.pageSize = size;
            this.setState({
                tblData,
                pagination: pagination,
                loading: false,
                percent: 100
            });
        }
    }
}
