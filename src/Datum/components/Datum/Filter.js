import React, { Component } from 'react';
import { STATIC_DOWNLOAD_API } from '../../../_platform/api';
import { Form, Input, Button, Row, Col, message, Popconfirm } from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;

export default class Filter extends Component {
    static propTypes = {};

    render () {
        const {
            Doc = []
        } = this.props;
        return (
            <Form style={{ marginBottom: 24 }}>
                <Row gutter={24}>
                    <FormItem>
                        <Col span={14}>
                            <Search
                                placeholder='请输入名称进行搜索'
                                onSearch={this.query.bind(this)}
                            />
                        </Col>
                    </FormItem>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        {!this.props.isTreeSelected ? (
                            <Button style={{ marginRight: 10 }} disabled>
                                新增
                            </Button>
                        ) : (
                            <Button
                                style={{ marginRight: 10 }}
                                type='primary'
                                onClick={this.addVisible.bind(this)}
                            >
                                新增
                            </Button>
                        )}
                        {/* </Col> */}·
                        {/* <Col span ={2}> */}
                        {/* {
							(Doc.length === 0 )?
								<Button style={{marginRight: 10}} disabled>下载</Button>:
								<Button style={{marginRight: 10}} type="primary" onClick={this.download.bind(this)}>下载</Button>
						} */}
                        {/* </Col> */}
                        {/* <Col span ={2}> */}
                        {Doc.length === 0 ? (
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
                                onConfirm={this.confirm.bind(this)}
                                onCancel={this.cancel.bind(this)}
                                okText='Yes'
                                cancelText='No'
                            >
                                <Button
                                    style={{ marginRight: 10 }}
                                    type='danger'
                                    onClick={this.delete.bind(this)}
                                >
                                    删除
                                </Button>
                            </Popconfirm>
                        )}
                    </Col>
                </Row>
            </Form>
        );
    }

    addVisible () {
        const {
            actions: {
                toggleAddition
            }
        } = this.props;
        toggleAddition(true);
    }

    query (value) {
        const {
            actions: { getdocument },
            currentcode
        } = this.props;
        let search = {};
        if (value) {
            search = {
                doc_name: value
            };
        }

        getdocument({ code: currentcode.code }, search);
    }
    cancel () {}

    delete () {
    }
    confirm () {
        const {
            coded = [],
            selected = [],
            currentcode = {},
            actions: { deletedoc, getdocument }
        } = this.props;
        debugger;
        if (selected === undefined || selected.length === 0) {
            message.warning('请先选择要删除的文件！');
            return;
        }
        selected.map(rst => {
            coded.push(rst.code);
        });
        let promises = coded.map(function (code) {
            return deletedoc({ code: code });
        });
        message.warning('删除文件中...');
        Promise.all(promises)
            .then(() => {
                message.success('删除文件成功！');
                getdocument({ code: currentcode.code }).then(() => {});
            })
            .catch(() => {
                message.error('删除失败！');
                getdocument({ code: currentcode.code }).then(() => {});
            });
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

    download () {
        const {
            selected = [],
            file = [],
            files = []
        } = this.props;
        if (selected.length === 0) {
            message.warning('没有选择无法下载');
        }
        selected.map(rst => {
            file.push(rst.basic_params.files);
        });
        file.map(value => {
            value.map(cot => {
                files.push(cot.download_url);
            });
        });
        files.map(down => {
            let download =
                STATIC_DOWNLOAD_API + '/media' + down.split('/media')[1];
            this.createLink(this, download);
        });
    }
}
