import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../store';
import '../components/index.less';
import {
    Table,
    Row,
    Col,
    Button,
    Upload,
    message,
    Notification
} from 'antd';
import { actions as platformActions } from '_platform/store/global';
import {
    Main,
    Body,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import { NURSERYLOCATION_DOWLOAD } from '_platform/api';
import {getUser} from '_platform/auth';
import * as XLSX from 'xlsx';

@connect(
    state => {
        const { forest, platform } = state;
        return { ...forest, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class Dataimport extends Component {
    constructor (props) {
        super(props);
        this.state = {
            imgvisible: false,
            imgsrc: '',
            title: '',
            dataSource: [],
            loginUser: '',
            loginUserSection: ''
        };
    }
    componentDidMount = async () => {
        const loginUser = getUser();
        let loginUserSection = loginUser && loginUser.section;
        this.setState({
            loginUser,
            loginUserSection
        });
    }
    analysisProps = {
        headers: {},
        showUploadList: false,
        beforeUpload: (file, fileList) => {
            try {
                const {
                    loginUserSection
                } = this.state;
                let that = this;
                if (
                    file.name.indexOf('xls') !== -1 ||
                    file.name.indexOf('xlxs') !== -1
                ) {
                    if (!loginUserSection) {
                        Notification.info({
                            message: `该用户未关联标段，不能上传文件。`
                        });
                        return false;
                    }
                    const f = fileList[0];
                    let reader = new FileReader();
                    reader.onload = function (e) {
                        console.log('e', e);
                        if (e && e.target && e.target.result) {
                            let data = e.target.result;
                            let workbook = XLSX.read(data, {type: 'binary'});
                            // 假设我们的数据在第一个标签
                            let firstWorksheet = workbook.Sheets[workbook.SheetNames[0]];
                            // XLSX自带了一个工具把导入的数据转成json
                            let jsonData = XLSX.utils.sheet_to_json(firstWorksheet, {header: 1});
                            let filterData = jsonData.filter((data) => {
                                return (data && data instanceof Array && data.length > 0);
                            });
                            that.handleExcelData(filterData);
                        } else {
                            Notification.error({
                                message: `解析失败`
                            });
                        }
                    };
                    reader.readAsBinaryString(f);
                    return false;
                } else {
                    message.warning('只能上传excel文件');
                    return false;
                }
            } catch (err) {
                console.log('err', err);
            }
        }
    };
    handleExcelData = async (data) => {
        const {
            loginUser,
            loginUserSection = ''
        } = this.state;
        if (!(loginUser)) {
            Notification.error({
                message: `当前登录用户数据错误，请确认后再次上传`
            });
            return;
        }
        let flag = false;
        let patt = /^\d{4,}-(?:0?\d|1[12])-(?:[012]?\d|3[01]) (?:[01]?\d|2[0-4]):(?:[0-5]?\d|60):(?:[0-5]?\d|60)$/;
        data.splice(0, 1);
        let dataSource = [];
        data.map((item, index) => {
            if (item[1] !== '') {
                let single = {
                    index: item[0] || (index + 1),
                    Section: loginUserSection,
                    SXM: item[1] || '',
                    X: item[2] || '',
                    Y: item[3] || '',
                    H: item[4] || '',
                    CreateTime: item[5] || ''
                };
                if (!patt.test(single.CreateTime)) {
                    message.info(
                        single.index +
                            '信息时间格式错误，请确认后再次提交'
                    );
                    flag = true;
                    return;
                }
                dataSource.push(single);
            }
        });

        if (!flag) {
            // 没有错误再更新数据
            Notification.success({
                message: '解析成功'
            });
            this.setState({ dataSource });
        }
    }
    postData = async () => {
        const {
            actions: { postPositionData, getTreeMess }
        } = this.props;
        const {
            dataSource,
            loginUserSection,
            loginUser
        } = this.state;
        if (dataSource.length === 0) {
            message.info('上传数据不能为空');
            return;
        }
        let sectionCheckStatus = false;
        let gettreeMessArr = [];
        for (let i = 0; i < 5; i++) {
            if (dataSource[i]) {
                gettreeMessArr.push(getTreeMess({sxm: dataSource[i].SXM}));
            };
        }
        let checkDatas = await Promise.all(gettreeMessArr);
        checkDatas.map((checkData) => {
            if (checkData && checkData.Section && checkData.Section !== loginUserSection) {
                sectionCheckStatus = true;
            }
        });
        if (sectionCheckStatus) {
            Notification.error({
                message: `当前登录用户与上传数据不属于同一标段，请确认后再上传`
            });
            return;
        }
        let rst = await postPositionData({ id: loginUser.ID }, dataSource);
        if (rst.code) {
            message.info('定位数据导入成功');
        } else {
            message.error('定位信息导入失败，请确认模板正确！');
        }
    }
    onDownloadClick () {
        window.open(NURSERYLOCATION_DOWLOAD);
    }
    render () {
        let columns = [
            {
                title: '序号',
                dataIndex: 'index'
            },
            {
                title: '编号',
                dataIndex: 'SXM'
            },
            {
                title: 'X',
                dataIndex: 'X'
            },
            {
                title: 'Y',
                dataIndex: 'Y'
            },
            {
                title: 'H',
                dataIndex: 'H'
            },
            {
                title: '定位时间',
                dataIndex: 'CreateTime'
            }
        ];
        return (
            <Body>
                <Main>
                    <DynamicTitle title='定位数据导入' {...this.props} />
                    <Row
                        style={{
                            fontSize: '20px',
                            margin: '30px 20px 20px 20px'
                        }}
                    >
                        <Col>
                            <span>请按照数据格式要求上传定位数据：</span>
                        </Col>
                    </Row>
                    <Row style={{ fontSize: '20px', marginTop: '20px' }}>
                        <Col span={2}>
                            <Upload {...this.analysisProps}>
                                <Button
                                    type='primary'
                                    style={{ fontSize: '14px', marginLeft: 21 }}
                                >
                                    点击上传
                                </Button>
                            </Upload>
                        </Col>
                        <Col span={18}>
                            <span>
                                只能上传xls/xlsx文件，且不超过10Mb，苗木定位数据模板
                            </span>
                            <a onClick={this.onDownloadClick.bind(this)}>
                                下载。
                            </a>
                        </Col>
                    </Row>
                    <Content>
                        <Table
                            bordered
                            rowKey='index'
                            columns={columns}
                            pagination={{ showQuickJumper: true, pageSize: 10 }}
                            dataSource={this.state.dataSource}
                        />
                    </Content>
                </Main>
                <Button
                    type='primary'
                    onClick={this.postData.bind(this)}
                    style={{ marginLeft: 21 }}
                >
                    确定上传
                </Button>
            </Body>
        );
    }
}
