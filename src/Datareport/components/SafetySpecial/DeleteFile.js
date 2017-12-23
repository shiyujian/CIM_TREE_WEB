import React, { Component } from 'react';
import { Input, Form, Spin, Upload, Icon, Button, Select, message, Table, Row, Col, notification } from 'antd';
import { UPLOAD_API, SERVICE_API } from '_platform/api';
const FormItem = Form.Item;
const Option = Select.Option;

export default class DeleteFile extends Component {

    constructor(props, state) {
        super(props);
        this.state = {
            subDataSource: [],
            deleteInfo: '',
        };
    }
    componentDidMount() {
        const subDataSource = this.props.state.subDataSource;
        this.setState({
            subDataSource,
        })
    }
    onChange(e) {
        this.setState({
            deleteInfo: e.target.value
        });
        const { actions: { DeleteRow } } = this.props.props;
        DeleteRow(e.target.value);
	}

    paginationOnChange(e) {
        console.log('vip-分页', e);
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        // const {
		// 	form: { getFieldDecorator }
		// } = this.props.props;
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                width: '10%',
            },
            {
                title: '单位工程',
                dataIndex: 'unitProject',
                width: '10%',
            },
            {
                title: '项目/子项目名称',
                dataIndex: 'projectName',
                width: '10%',
            }, {
                title: '方案名称',
                dataIndex: 'scenarioName',
                width: '15%',
            }, {
                title: '编制单位',
                dataIndex: 'organizationUnit',
                width: '10%',
            }, {
                title: '评审时间',
                dataIndex: 'reviewTime',
                width: '10%',
            }, {
                title: '评审意见',
                dataIndex: 'reviewComments',
                width: '10%',
            }, {
                title: '评审人员',
                dataIndex: 'reviewPerson',
                width: '10%',
            }, {
                title: '备注',
                dataIndex: 'remark',
                width: '15%',
            }
        ];
        const paginationInfoModal = {
            defaultPageSize: 4,
            onChange: this.paginationOnChange.bind(this),
            showSizeChanger: true,  
            pageSizeOptions: ['4', '8', '16', '32', '64'],
            showQuickJumper: true,
            style: { float: "left", },
        }
        return (
            <div>
                <h1 style={{ textAlign: 'center', fontSize: 14, marginBottom: 16, color: '#333' }}>删除项目申请页面</h1>
                <Row style={{ marginBottom: 16 }}>
                    <Table
                        className='AddFileTable'
                        columns={columns}
                        dataSource={this.state.subDataSource}
                        bordered
                        pagination={paginationInfoModal}
                        rowKey={(item, index) => index}

                    />
                </Row>
                <Row>
                    <Input 
                    type="textarea" 
                    onChange={this.onChange.bind(this)} 
                    autosize={{ minRows: 5, maxRow: 6 }} 
                    placeholder="请填写删除原因"
                    style={{ marginBottom: 40 }}
                     />
                </Row>
            </div>
        )
    }
}
