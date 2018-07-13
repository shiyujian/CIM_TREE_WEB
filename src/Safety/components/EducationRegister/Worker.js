import React, { Component } from 'react';
import {
    Table,
    Button,
    Row,
    Col,
    Modal,
    Popconfirm,
    Card,
    Form,
    Input,
    message,
    Divider
} from 'antd';
import moment from 'moment';
import { getUser } from '../../../_platform/auth';
import AddWorker from './AddWorker';
import WorkerDetail from './WorkerDetail';
import { STATIC_DOWNLOAD_API, SOURCE_API } from '../../../_platform/api';
import Preview from '../../../_platform/components/layout/Preview';
import * as previewActions from '../../../_platform/store/global/preview';

const Search = Input.Search;

class Worker extends Component {
    constructor (props) {
        super(props);
        this.state = {
            index: '-1',
            newKey: Math.random(),
            newKey1: Math.random() * 5,
            setVisible: false,
            setEditVisible: false,
            dataSource: [],
            record: {},
            code: '',
            detailVisible: false
        };
    }

    componentWillReceiveProps (props) {
        const { code, pcode } = props;
        const {
            actions: { getSafetyWorkTrain }
        } = this.props;
        const tempcode =
            code === ''
                ? `?project_code=${pcode}`
                : `?project_unit_code=${code}`;
        getSafetyWorkTrain({ code: tempcode }).then(rst => {
            let dataSource = this.handleData(rst) || [];
            this.setState({ code, dataSource });
        });
    }
    addClick = () => {
        if (!this.state.code) {
            message.info('请选择单位工程');
        } else {
            this.setState({
                newKey: Math.random() * 2,
                setVisible: true
            });
        }
    };

    delete (index) {
        const {
            actions: { delSafetyWorkTrain }
        } = this.props;
        let datas = this.state.dataSource;
        delSafetyWorkTrain({ id: datas[index].id }).then(rst => {
            datas.splice(index, 1);
            this.setState({ dataSource: datas });
        });
    }

    setAddData () {
        const {
            actions: { getSafetyWorkTrain, addSafetyWorkTrain, getWkByCode }
        } = this.props;
        const { code } = this.state;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                let wkunit = await getWkByCode({ code: code });
                let project =
                    wkunit.parent.obj_type !== 'C_PJ'
                        ? await getWkByCode({ code: wkunit.parent.code })
                        : wkunit.parent;
                values.age =
                    moment().format('YYYY') -
                    moment(values.birthdate._d).format('YYYY');
                values.inTime = moment(values.inTime._d).format('YYYY-MM-DD');
                values.train_date = moment(values.train_date._d).format(
                    'YYYY-MM-DD'
                );
                let putData = {
                    project: {
                        pk: project.pk,
                        code: project.code,
                        name: project.name,
                        obj_type: project.obj_type
                    },
                    project_unit: {
                        pk: wkunit.pk,
                        code: wkunit.code,
                        name: wkunit.name,
                        obj_type: wkunit.obj_type
                    },
                    person: {
                        name: values.name,
                        work: values.class,
                        female: values.gender,
                        enter_time: values.inTime,
                        age: values.age,
                        worktime: values.workage
                    },
                    train_record: values.train_record[0],
                    train_book: values.train_book[0],
                    train_unit: {
                        name: values.train_unit
                    },
                    train_date: values.train_date,
                    train_hour: values.train_hour,

                    scoreone: values.scoreone,
                    scoretwo: '',
                    verify_unit: {
                        name: values.verify_unit
                    },
                    certificate: {
                        code: values.certificate
                    },

                    train_content: values.train_content || '',
                    train_img: values.train_img ? values.train_img : []
                };
                let { dataSource } = this.state;
                addSafetyWorkTrain({}, putData).then(rst => {
                    try {
                        dataSource = dataSource.concat(this.handleData([rst]));
                        this.setState({
                            setVisible: false,
                            dataSource
                        });
                    } catch (e) {
                        message.info('添加失败');
                        this.setState({ setVisible: false });
                    }
                });
            }
        });
    }

    goCancel () {
        this.setState({
            setVisible: false,
            setEditVisible: false
        });
    }

    previewFiles (record, index) {
        const {
            actions: { openPreview }
        } = this.props;
        /* if(JSON.stringify(file.basic_params) == "{}"){
            return
        }else {
            const filed = file.basic_params.files[0];
            openPreview(filed);
        } */
        let data = this.state.dataSource;
        let filed = {};
        if (!data[index].attachment) {
            filed = {
                a_file: `${SOURCE_API}/media/documents/2017/10/%E5%AE%89%E5%85%A8%E5%BA%94%E6%80%A5%E9%A2%84%E6%A1%88.pdf`,
                misc: 'file',
                // "mime_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                mime_type: 'application/pdf',
                download_url: `${STATIC_DOWNLOAD_API}/media/documents/2017/10/%E5%AE%89%E5%85%A8%E5%BA%94%E6%80%A5%E9%A2%84%E6%A1%88.pdf`,
                name: '安全应急预案.pdf'
            };
        } else {
            filed.misc = 'file';
            filed.a_file = `${SOURCE_API}` + data[index].attachment[0].url;
            filed.download_url =
                `${STATIC_DOWNLOAD_API}` + data[index].attachment[0].url;
            filed.name = data[index].attachment[0].name;
            filed.id = data[index].attachment[0].id;
            let type = data[index].attachment[0].url.split('.')[1];
            if (
                type == 'xlsx' ||
                type == 'docx' ||
                type == 'xls' ||
                type == 'doc' ||
                type == 'pptx' ||
                type == 'ppt'
            ) {
                filed.mime_type =
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            }
            if (type == 'pdf') {
                filed.mime_type = 'application/pdf';
            }
        }
        openPreview(filed);
    }

    createLink = (name, url) => {
        // 下载
        let link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', this);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    download (record, index) {
        let data = this.state.dataSource;
        if (data[index].attachment) {
            let apiGet =
                `${STATIC_DOWNLOAD_API}` + data[index].attachment[0].url;
            this.createLink(this, apiGet);
        } else {
            let apiGet = `${STATIC_DOWNLOAD_API}/media/documents/2017/10/%E5%AE%89%E5%85%A8%E5%BA%94%E6%80%A5%E9%A2%84%E6%A1%88.pdf`;
            this.createLink(this, apiGet);
        }
    }

    onSearch (value) {
        const {
            actions: { getSafetyWorkTrain }
        } = this.props;
        let param = '?keyword=' + value;
        getSafetyWorkTrain({ code: param }).then(rst => {
            let dataSource = this.handleData(rst);
            this.setState({ dataSource });
        });
    }
    showDetail (record, index) {
        this.setState({
            record: record,
            detailVisible: true
        });
    }
    // 将数据处理成适用于表格的数据
    handleData (data) {
        return data.map(item => {
            return {
                class: item.person.work,
                name: item.person.name,
                gender: item.person.female,
                age: item.person.age,
                workage: item.person.worktime,
                inTime: item.person.enter_time,
                grade: item.scoreone,
                unit: item.train_unit.name,
                date: item.train_date,
                content: item.train_content,
                code: item.certificate.code,
                corporation: item.verify_unit.name,
                time: item.train_hour,
                ...item
            };
        });
    }
    render () {
        const {
            form: { getFieldDecorator }
        } = this.props;
        console.log('*******', this.state);
        // 安全目标表格
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                width: '5%',
                render: (text, record, index) => {
                    return <div>{index + 1}</div>;
                }
            },
            {
                title: '人员姓名',
                dataIndex: 'name'
                // width:'15%'
            },
            {
                title: '性别',
                dataIndex: 'gender'
                // width:'15%'
            },
            {
                title: '工种',
                dataIndex: 'class'
                // width:'30%'
            },
            {
                title: '培训单位',
                dataIndex: 'unit'
            },
            {
                title: '培训日期',
                dataIndex: 'date'
            },
            {
                title: '培训学时',
                dataIndex: 'time'
            },
            {
                title: '培训主要内容',
                dataIndex: 'content'
            },
            {
                title: '考核成绩',
                dataIndex: 'grade'
            },
            {
                title: '发证单位',
                dataIndex: 'corporation'
            },
            {
                title: '证书编号',
                dataIndex: 'code'
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: '10%',
                render: (text, record, index) => (
                    <span>
                        <a onClick={this.showDetail.bind(this, record, index)}>
                            详情
                        </a>
                        <Divider type='vertical' />
                        <Popconfirm
                            placement='rightTop'
                            title='确定删除吗？'
                            onConfirm={this.delete.bind(this, index)}
                            okText='确认'
                            cancelText='取消'
                        >
                            <a>删除</a>
                        </Popconfirm>
                    </span>
                )
            }
        ];

        return (
            <div>
                {/* <Row>
                    <Col>
                        <h2 style={{ marginBottom: '10px' }}>安全目标管理</h2>
                    </Col>
                </Row> */}
                <Card>
                    <Row>
                        <Col span={12}>
                            <Search
                                placeholder='请输入搜索关键词'
                                style={{ width: '80%', display: 'block' }}
                                onSearch={value => this.onSearch(value)}
                            />
                        </Col>
                        <Col span={12}>
                            <Button
                                type='primary'
                                style={{ float: 'right' }}
                                onClick={this.addClick.bind(this)}
                            >
                                新增
                            </Button>
                        </Col>
                    </Row>
                    <Table
                        style={{ marginTop: '10px' }}
                        columns={columns}
                        dataSource={this.state.dataSource}
                        bordered
                    />
                </Card>

                <Modal
                    title='新增作业人员安全教育培训登记'
                    width={760}
                    maskClosable={false}
                    key={this.state.newKey}
                    visible={this.state.setVisible}
                    onOk={() => this.setAddData()}
                    onCancel={this.goCancel.bind(this)}
                >
                    <AddWorker props={this.props} state={this.state} />
                </Modal>
                <Preview />
                <Modal
                    title='作业人员安全教育培训登记详情'
                    width={760}
                    key={Math.random() * 4}
                    maskClosable={false}
                    visible={this.state.detailVisible}
                    onOk={() =>
                        this.setState({ detailVisible: false, record: {} })
                    }
                    onCancel={() =>
                        this.setState({ detailVisible: false, record: {} })
                    }
                >
                    <WorkerDetail {...this.state.record} />
                </Modal>
                {/* <Modal
					title="编辑安全目标"
					width={760}
                    key={this.state.newKey1}
					maskClosable={false}
					visible={this.state.setEditVisible}
					onOk={()=>this.setEditData()}
					onCancel={()=>this.goCancel()}
					>
					<EditManage props={this.props} state={this.state} />
				</Modal> */}
            </div>
        );
    }
}
export default Form.create()(Worker);
