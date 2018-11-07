import React, { Component } from 'react';
import { Button, Form, Row, Col, Input, Icon, Card } from 'antd';
import { STATIC_DOWNLOAD_API, SOURCE_API } from '../../../_platform/api';
import Preview from '../../../_platform/components/layout/Preview';

const FormItem = Form.Item;

class QulityCheckDetail extends Component {
    constructor (props) {
        super(props);
        this.state = {
            visible: false,
            data: [],
            indexSelect: '',
            record: {}
        };
    }

    static layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
    };

    render () {
        const {
            form: { getFieldDecorator },
            platform: { task = {} } = {}
        } = this.props;
        let record = {};
        if (task && task.subject) {
            record = this.getTable(task);
        }
        return (
            <Card title={'流程详情'}>
                <Row gutter={24}>
                    <Col span={24} >
                        <Row gutter={15} >
                            <Col span={8}>
                                <FormItem {...QulityCheckDetail.layout} label='小班:'>
                                    {getFieldDecorator('littleban', {
                                        initialValue: `${record.littleban ? record.littleban : '暂无小班'}`
                                    })(<Input readOnly />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...QulityCheckDetail.layout} label='细班:'>
                                    {getFieldDecorator('thinban', {
                                        initialValue: `${record.thinban ? record.thinban : '暂无细班'}`
                                    })(<Input readOnly />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...QulityCheckDetail.layout} label='编号:'>
                                    {getFieldDecorator('number', {
                                        initialValue: `${record.number ? record.number : '暂无编号'}`
                                    })(<Input readOnly />)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={15}>
                            <Col span={8}>
                                <FormItem {...QulityCheckDetail.layout} label='日期:'>
                                    {getFieldDecorator('flow_date', {
                                        initialValue: `${record.flow_date ? record.flow_date : '暂无日期'}`
                                    })(<Input readOnly />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...QulityCheckDetail.layout} label='文档类型:'>
                                    {getFieldDecorator('doctype', {
                                        initialValue: `${record.doctype ? record.doctype : '暂无文档类型'}`
                                    })(<Input readOnly />)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <FormItem {...QulityCheckDetail.layout} label='附件'>
                        {getFieldDecorator('attachment', {
                        }, {})(
                            <Button onClick={() => { this.view(); }}>
                                <Icon type='file' />查看文件
                            </Button>
                        )}
                    </FormItem>
                </Row>
                <Preview />
            </Card>
        );
    }
    view () {
        const { actions: { openPreview } } = this.props;
        let filed = {};
        // filed.misc = this.attachmentFile.misc;
        filed.a_file = `${SOURCE_API}` + (this.attachmentFile.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (this.attachmentFile.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        // filed.name = this.attachmentFile.name;
        filed.mime_type = this.attachmentFile.mime_type;
        openPreview(filed);
    }

    getTable (instance) {
        let subject = instance.subject[0];
        let record = {
            'id': instance.id,
            'doctype': subject.doctype,
            'littleban': subject.littleban,
            'thinban': subject.thinban,
            'flow_date': instance.real_start_time.slice(0, 10),
            'number': subject.number,
            'attachment': JSON.parse(subject.attachment)
        };
        this.attachmentFile = record.attachment;
        return record;
    }
}
export default Form.create()(QulityCheckDetail);
