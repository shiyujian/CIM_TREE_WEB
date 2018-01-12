import React, {Component} from 'react';
import {Form, Input, Spin, Row, Col,Card,Table} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;

export default class Detail extends Component {

    static propTypes = {};

    static layout = {
        labelCol: {span: 4},
        wrapperCol: {span: 20},
    };

    render() {
        const {detail = {}, detail: {subject = []} = {}} = this.props;

        return (
            <div>
                <Row gutter={24}>
                    <Col span={20}>
                        <FormItem label="工程名称" {...Detail.layout}>
                            <Input value={detail.name} readOnly/>
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={20}>
                        <FormItem label="验收部位" {...Detail.layout}>
                            {
                                subject.map((item) => {
                                    return <Input value={item.qilocation} readOnly/>
                                })
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={20}>
                        <FormItem label="验收内容" {...Detail.layout}>
                            {
                                subject.map((item) => {
                                    return <Input value={item.workContent} readOnly/>
                                })
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={20}>
                        <FormItem label="验收内容" {...Detail.layout}>
                            {
                                subject.map((item) => {
                                    let newqiclist = JSON.parse(item.qiclist);
                                    return <Table columns={this.colums} dataSource={newqiclist}
                                                  pagination={false} showHeader={false} bordered={true}/>
                                })
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={20}>
                        <FormItem label="发起时间" {...Detail.layout}>
                            <Input value={moment(detail.real_start_time).utc().zone(-8).format('YYYY-MM-DD')} readOnly/>
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={20}>
                        <FormItem label="现场照片" {...Detail.layout}>
                            <Input readOnly/>
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={20}>
                        <FormItem label="审核时间" {...Detail.layout}>
                            <Input value={detail.deadline} readOnly/>
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={20}>
                        <FormItem label="状态" {...Detail.layout}>
                            <Input value={this.getStatusName(detail.status)} readOnly/>
                        </FormItem>
                    </Col>
                </Row>
            </div>
        );
    }

    colums=[{
        title:'',
        dataIndex:'name',
    },{
        title:'',
        render:(record) =>{
            let nodes = [];
            nodes.push(<a onClick={this.previewFile.bind(this,record)}>预览</a>);
            return nodes;
        }
    }];

    getStatusName(type) {
        let name;
        switch (type) {
            case 2:
                name = '审核中';
                break;
            case 3:
                name = '已审核';
                break;
            default:
                name = '';
        }
        return name;
    }

    previewFile(file) {
        const partscode = file.serial_code.split('_')[0];
        console.log('partcode',file.serial_code.split('_')[0]);    //code  CR17  模型code
        const code = file.code.substring(0,18);         //分项code
        const {actions:{gettemplatedoc}} = this.props;
        let condition = {
            search: partscode,
        };
        gettemplatedoc({code:`qtemplist_${code}`},condition)
            .then((rst) => {
                console.log('rst1',rst);
                let detail = file.detail;
                const {actions:{postdocs}} = this.props;
                console.log('doc_template_url',rst.metalist[0].templatedoc);
                postdocs({},{
                    ...detail,
                    doc_template_url:rst.metalist[0].templatedoc,
                }).then((rst) =>{
                    let newrst = JSON.parse(rst);
                    const {actions: {openPreview}} = this.props;
                    console.log('newrst',newrst);
                    openPreview(newrst);
                });
            });
    }
}
 