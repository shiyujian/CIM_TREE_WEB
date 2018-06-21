import React, { Component } from 'react';
import {
    Table,
    notification,
    Input,
    Modal,
    TreeSelect
} from 'antd';
import './TableOrg.less';
const TreeNode = TreeSelect.TreeNode;
export default class ToggleModalUpdate extends Component {
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
        const { visibleUpdate } = this.props;
        return (
            <Modal
                visible={visibleUpdate}
                width={1280}
                okText='确定'
                cancelText='取消'
                onOk={this.onok.bind(this)}
                onCancel={this.cancel.bind(this)}
            >
                <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
                    申请变更
                </h1>
                <Table
                    style={{ textAlign: 'center' }}
                    columns={this.columns}
                    bordered
                    dataSource={this.state.dataSource}
                    rowKey='code'
                />
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
        const { dataSource } = this.state;
        const {
            actions: { putOrgList, ModalVisibleUpdate }
        } = this.props;
        let data_list = [];
        dataSource.map((item, index) => {
            data_list.push({
                code: '' + item.code,
                name: '' + item.name,
                extra_params: {
                    project: item.extra_params.project,
                    unit: item.extra_params.unit
                },
                version: 'A'
            });
        });
        putOrgList({}, { data_list: data_list }).then(res => {
            notification.success({
                message: `更新成功`
            });
        });
        ModalVisibleUpdate(false);
    }
    cancel () {
        const {
            actions: { ModalVisibleUpdate }
        } = this.props;
        ModalVisibleUpdate(false);
    }
    componentDidMount () {
        const {
            EditOriginData
        } = this.props;
        this.setState({ dataSource: [EditOriginData] });
    }
    columns = [
        {
            title: '组织机构编码',
            dataIndex: 'code'
        },
        {
            title: '组织机构名称',
            // dataIndex: 'name',
            render: (text, record, index) => {
                return (
                    <Input
                        value={record.name || ''}
                        onChange={ele => {
                            record.name = ele.target.value;
                            this.forceUpdate();
                        }}
                    />
                );
            }
        },
        {
            title: '组织机构类型',
            dataIndex: 'extra_params.org_type'
        },
        {
            title: '参建单位名称',
            dataIndex: 'extra_params.canjian'
        },
        {
            title: '直属部门',
            dataIndex: 'extra_params.direct',
            key: 'Direct'
        },
        {
            title: '备注',
            dataIndex: 'extra_params.remarks',
            key: 'Remarks'
        }
    ];
    static lmyloop (data = [], depth = 1) {
        if (data.length <= 0 || depth > 1) {
            return;
        }
        return data.map(item => {
            if (item.children && item.children.length > 0) {
                return (
                    <TreeNode
                        data={item}
                        key={`${item.code}--${item.name}`}
                        value={`${item.code}--${item.name}`}
                        title={`${item.code} ${item.name}`}
                    >
                        {ToggleModalUpdate.lmyloop(item.children, depth++)}
                    </TreeNode>
                );
            } else {
                return (
                    <TreeNode
                        data={item}
                        key={`${item.code}--${item.name}`}
                        value={`${item.code}--${item.name}`}
                        title={`${item.code} ${item.name}`}
                    />
                );
            }
        });
    }
}
