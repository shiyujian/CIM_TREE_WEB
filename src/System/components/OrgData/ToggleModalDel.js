import React, { Component } from 'react';
import {
    Table,
    notification,
    Input,
    Modal,
    Select,
    Row,
    Col
} from 'antd';
import './TableOrg.less';
const Option = Select.Option;
const { TextArea } = Input;
export default class ToggleModalDel extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataSource: [],
            users: [],
            projects: [],
            checkers: [],
            defaultPro: '',
            defaultchecker: '',
            units: [],
            selectPro: [],
            selectUnit: [],
            description: ''
        };
    }
    render () {
        const { visibleDel } = this.props;
        return (
            <Modal
                visible={visibleDel}
                width={1280}
                okText='确定'
                cancelText='取消'
                onOk={this.onok.bind(this)}
                onCancel={this.cancel.bind(this)}
            >
                <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
                    申请删除
                </h1>
                <Table
                    style={{ textAlign: 'center' }}
                    columns={this.columns}
                    bordered
                    dataSource={this.state.dataSource}
                />
                <span>
                    审核人：
                    <Select
                        defaultValue={this.state.defaultchecker}
                        style={{ width: '200px' }}
                        className='btn'
                        onSelect={ele => {
                            this.setState({ passer: ele });
                        }}
                    >
                        {this.state.checkers}
                    </Select>
                </span>
                <Row style={{ margin: '20px 0' }}>
                    <Col>
                        <TextArea
                            placeholder='删除原因'
                            rows={2}
                            onChange={this.description.bind(this)}
                        />
                    </Col>
                </Row>
                <div style={{ marginTop: '30px' }}>
                    <p>
                        <span>注：</span>1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；
                    </p>
                    <p style={{ paddingLeft: '25px' }}>
                        2、数值用半角阿拉伯数字，如：1.2
                    </p>
                    <p style={{ paddingLeft: '25px' }}>
                        3、日期必须带年月日，如2017年1月1日
                    </p>
                    <p style={{ paddingLeft: '25px' }}>
                        4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.
                    </p>
                </div>
            </Modal>
        );
    }
    description (e) {
        this.setState({ description: e.target.value });
    }
    // 处理上传excel的数据
    onok () {
        const {
            actions: { ModalVisibleDel }
        } = this.props;
        if (!this.state.passer) {
            notification.warning({
                message: '审批人未选择'
            });
            return;
        }
        this.props.setDataDel(
            this.state.dataSource,
            JSON.parse(this.state.passer),
            this.state.description
        );
        ModalVisibleDel(false);
    }
    cancel () {
        const {
            actions: { ModalVisibleDel }
        } = this.props;
        ModalVisibleDel(false);
    }
    componentDidMount () {
        const {
            deleteOrg,
            actions: { getAllUsers }
        } = this.props;
        getAllUsers().then(rst => {
            if (rst.length) {
                let checkers = rst.map(o => {
                    return (
                        <Option value={JSON.stringify(o)}>
                            {o.account.person_name}
                        </Option>
                    );
                });
                this.setState({
                    checkers,
                    defaultchecker: rst[0].account.person_name
                });
            }
        });
        this.setState({
            dataSource: deleteOrg
        });
    }
    // 删除数据
    delete (index) {
        let dataSource = this.state.dataSource;
        dataSource.splice(index, 1);
        this.setState({ dataSource });
    }
    columns = [
        {
            title: '组织机构编码',
            dataIndex: 'code',
            key: 'Code'
        },
        {
            title: '组织机构类型',
            dataIndex: 'extra_params.org_type',
            key: 'Type'
        },
        {
            title: '参建单位名称',
            dataIndex: 'extra_params.canjian',
            key: 'Canjian'
        },
        {
            title: '组织机构部门',
            dataIndex: 'name',
            key: 'Name'
        },
        {
            title: '直属部门',
            dataIndex: 'extra_params.direct',
            key: 'Direct'
        },
        {
            title: '负责项目/子项目名称',
            dataIndex: 'extra_params.project',
            key: 'Project'
        },
        {
            title: '负责单位工程名称',
            dataIndex: 'extra_params.unit',
            key: 'Unit'
        },
        {
            title: '备注',
            dataIndex: 'extra_params.remarks',
            key: 'Remarks'
        }
    ];
}
