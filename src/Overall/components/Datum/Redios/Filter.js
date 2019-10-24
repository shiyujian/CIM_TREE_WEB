import React, { Component } from 'react';
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    Notification,
    Popconfirm
} from 'antd';
import moment from 'moment';
import AddDoc from './AddDoc';

const FormItem = Form.Item;
const Search = Input.Search;

export default class Filter extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            addVisible: false
        };
    }

    handleAddDoc () {
        this.setState({
            addVisible: true
        });
    }
    handleCancelAddDoc () {
        this.setState({
            addVisible: false
        });
    }

    query (value) {
        let search = {};
        if (value) {
            search = {
                doc_name: value
            };
        }
    }
    cancel () {}

    // 删除
    deleteClick = async () => {
        const {
            actions: {
                deleteDoc,
                setGetDocsStatus
            },
            dataSourceSelected
        } = this.props;
        if (dataSourceSelected.length === 0) {
            Notification.warning({
                message: '请先选择数据！',
                duration: 3
            });
        } else {
            let dataList = dataSourceSelected.map((data) => {
                if (data && data.ID) {
                    return data.ID;
                }
            });

            let promises = dataList.map((detail) => {
                let data = detail;
                let postdata = {
                    id: data
                };
                return deleteDoc(postdata);
            });

            Promise.all(promises).then(rst => {
                console.log('rst', rst);
                Notification.success({
                    message: '删除文档成功',
                    duration: 3
                });
                // 在删除之后需要将选中数组清空
                this.props.handleDeleteDocs();
                setGetDocsStatus(moment().unix());
            });
        }
    }

    render () {
        const {
            dataSourceSelected,
            leftKeyCode,
            isPermission,
            isLeaf,
            addDocPermission
        } = this.props;
        const {
            addVisible
        } = this.state;
        return (
            <div>
                <Form style={{ marginBottom: 24 }}>
                    {/* <Row>
                        <FormItem>
                            <Col span={14}>
                                <Search
                                    placeholder='请输入名称进行搜索'
                                    onSearch={this.query.bind(this)}
                                />
                            </Col>
                        </FormItem>
                    </Row> */}
                    <Row gutter={24}>
                        <Col span={24}>
                            <Button
                                disabled={!(leftKeyCode && isLeaf && (addDocPermission || isPermission))}
                                style={{ marginRight: 10 }}
                                type='primary'
                                onClick={this.handleAddDoc.bind(this)}
                            >
                            新增
                            </Button>
                            {
                                isPermission
                                    ? (
                                        dataSourceSelected.length === 0 ? (
                                            <Button
                                                style={{ marginRight: 10 }}
                                                disabled
                                                type='danger'
                                            >
                                        删除
                                            </Button>
                                        ) : (
                                            <Popconfirm
                                                title='确定要删除文件吗？'
                                                onConfirm={this.deleteClick.bind(this)}
                                                onCancel={this.cancel.bind(this)}
                                                okText='Yes'
                                                cancelText='No'
                                            >
                                                <Button
                                                    style={{ marginRight: 10 }}
                                                    type='danger'
                                                >
                                            删除
                                                </Button>
                                            </Popconfirm>
                                        )
                                    ) : ''
                            }

                        </Col>
                    </Row>
                </Form>
                {
                    addVisible
                        ? <AddDoc
                            {...this.state}
                            {...this.props}
                            handleCancelAddDoc={this.handleCancelAddDoc.bind(this)}
                        />
                        : ''
                }
            </div>

        );
    }
}
