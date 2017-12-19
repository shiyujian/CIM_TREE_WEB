import React, { Component } from 'react';

import { Input, Form, Spin, Upload, Icon, Button, Select, message, Table, Row, Col, notification } from 'antd';
import { UPLOAD_API, SERVICE_API } from '_platform/api';
const FormItem = Form.Item;
const Option = Select.Option;
export default class AddFile extends Component {

    constructor(props, state) {
        super(props);
        this.state = {
            subDataSource: [],
        };
    }
    // componentDidMount(){
    //     this.setState({
    //         subDataSource:[],
    //     })
    // }
    beforeUpload = (info) => {
        if (info.name.indexOf("xls") !== -1 || info.name.indexOf("xlsx") !== -1) {
            return true;
        } else {
            notification.warning({
                message: '只能上传Excel文件！',
                duration: 2
            });
            return false;
        }
    }
    uplodachange = (info) => {
        if (info && info.file && info.file.status === 'done') {
            let name = Object.keys(info.file.response);
            let dataList = info.file.response[name[0]];
            let subDataSource = [];
            // 模板头部的校验
            if (
                dataList[1][1] !== "序号" && dataList[1][2] !== "项目/子项目名称" &&
                dataList[1][3] !== "单位工程" && dataList[1][4] !== "项目/方案名称" &&
                dataList[1][5] !== "编制单位" && dataList[1][6] !== "评审时间" &&
                dataList[1][7] !== "评审意见" && dataList[1][8] !== "评审人员" &&
                dataList[1][9] !== "备注"
            ) {
                notification.error({
                    message: '所模板不符合规则',
                    duration: 2
                })
                return;
            }           
            for (let i = 2; i < dataList.length; i++) {
                subDataSource.push({
                    key: i,
                    index: dataList[i][1] ? dataList[i][1] : '',
                    projectName: dataList[i][2] ? dataList[i][2] : '',
                    unitProject: dataList[i][3] ? dataList[i][3] : '',
                    scenarioName: dataList[i][4] ? dataList[i][4] : '',
                    organizationUnit: dataList[i][5] ? dataList[i][5] : '',
                    reviewTime: dataList[i][6] ? dataList[i][6] : '',
                    reviewComments: dataList[i][7] ? dataList[i][7] : '',
                    reviewPerson: dataList[i][8] ? dataList[i][8] : '',
                    remark: dataList[i][9] ? dataList[i][9] : '',
                })
            }
            this.setState({ subDataSource });
            const {actions:{ShowTable}} = this.props.props;
            ShowTable(subDataSource);
        }
    }

    handleChange = (value) => {
        console.log(value);
    }

    paginationOnChange(e) {
        console.log('vip-分页', e);
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const {
			form: { getFieldDecorator }
		} = this.props.props;
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
                <h1 style={{ textAlign: 'center', fontSize: 14, marginBottom: 16, color: '#333' }}>导入结果预览</h1>
                <Row style={{ marginBottom: 16 }}>
                    <Table
                        className='AddFileTable'
                        columns={columns}
                        dataSource={this.state.subDataSource}
                        bordered
                        pagination={paginationInfoModal}
                    />
                </Row>
                <Row style={{ marginBottom: "30px" }} type="flex">
                    <Col><Button style={{ marginRight: "30px" }}>模板下载</Button></Col>
                    <Col>
                        <Upload
                            style={{ margin: '10px' }}
                            onChange={this.uplodachange.bind(this)}
                            name='file'
                            showUploadList={false}
                            action={`${SERVICE_API}/excel/upload-api/`}
                            beforeUpload={this.beforeUpload.bind(this)}
                        >
                            <Button>
                                <Icon type="upload" />上传并预览(文件名需为英文)
                     </Button>
                        </Upload>
                    </Col>
                    <Col span={10}>
                        <Form>
                            <Row>
                                <Col span={10}>
                                    <FormItem {...formItemLayout} label="审核人">
                                        {getFieldDecorator('projectName', {
                                            initialValue: '方建明',
                                        })(
                                            <Select style={{ marginRight: "30px" }} defaultValue="刘亦菲">
                                                <Option value="张晓明">张晓明</Option>
                                                <Option value="刘亦菲">刘亦菲</Option>
                                                <Option value="迪丽热巴">迪丽热巴</Option>
                                            </Select>
                                            )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
                <Row style={{ marginBottom: "30px" }}>
                    <p><span>注：</span>1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；</p>
                    <p style={{ paddingLeft: "25px" }}>2、数值用半角阿拉伯数字，如：1.2</p>
                    <p style={{ paddingLeft: "25px" }}>3、日期必须带年月日，如2017年1月1日</p>
                    <p style={{ paddingLeft: "25px" }}>4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为Chrome/edge/IE11.</p>
                </Row>
            </div>
        )
    }
}
