
import React, {Component} from 'react';
import { Form, Input, Button, Tabs, Select, Tag, Table, Upload, Row, Col, Icon } from 'antd';
import './DataList.less';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const TextArea = Input.TextArea;

class DataList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataList: []
        };
        this.toBack = this.toBack.bind(this); // 返回
        this.columns = [{
            title: '胸径（cm）',
            dataIndex: 'name',
            key: '1'
        }, {
            title: '地径（cm）',
            dataIndex: 'name',
            key: '2'
        }, {
            title: '冠幅（cm）',
            dataIndex: 'name',
            key: '3'
        }, {
            title: '自然亮（cm）',
            dataIndex: 'name',
            key: '4'
        }, {
            title: '培育方式',
            dataIndex: 'name',
            key: '5'
        }, {
            title: '价格（元）',
            dataIndex: 'name',
            key: '6'
        }, {
            title: '库存（棵）',
            dataIndex: 'name',
            key: '7'
        }];
    }
    render () {
        const { dataList } = this.state;
        const { getFieldDecorator } = this.props.form;
        const props = {
            action: '//jsonplaceholder.typicode.com/posts/',
            beforeUpload: (file) => {
                return false;
            }
        }
        return (
            <div className='add-seedling' style={{margin: '0 40px'}}>
                <Tabs defaultActiveKey='1' onChange={this.handlePane}>
                    <TabPane tab='填写信息' key='1'>
                        <Form layout='inline' onSubmit={this.handleSubmit}>
                            <FormItem label='苗木名称'>
                                {getFieldDecorator('userName')(
                                    <Input placeholder='请填写苗木名称' style={{width: 200}} />
                                )}
                            </FormItem>
                            <FormItem label='状态'>
                                {getFieldDecorator('userName')(
                                    <Select style={{ width: 120 }} allowClear>
                                        <Option value='lucy'>Lucy</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem label='联系人'>
                                {getFieldDecorator('userName')(
                                    <Input placeholder='请填写苗木名称' />
                                )}
                            </FormItem>
                            <FormItem label='联系电话'>
                                {getFieldDecorator('userName')(
                                    <Input placeholder='请填写苗木名称' />
                                )}
                            </FormItem>
                            <FormItem label='供应商' style={{display: 'block'}}>
                                <Tag closable>Tag 1</Tag>
                                <Button type='dashed'>+</Button>
                            </FormItem>
                            <FormItem label='规格' className='label-block'>
                                <Button type='primary' style={{position: 'absolute', left: 680, top: -40, zIndex: 100}}>新增</Button>
                                <Table columns={this.columns} dataSource={dataList} bordered style={{minWidth: 700}} />
                            </FormItem>
                            <FormItem label='上传照片' className='label-block'>
                                <Row style={{width: 520}}>
                                    <Col span={6}>
                                        <Upload {...props}>
                                            <Icon type='plus' className='upload-icon' />
                                        </Upload>
                                        <p>单株全景</p>
                                    </Col>
                                    <Col span={6}>
                                        <Upload {...props}>
                                            <Icon type='plus' className='upload-icon' />
                                        </Upload>
                                        <p>单株全景</p>
                                    </Col>
                                    <Col span={6}>
                                        <Upload {...props}>
                                            <Icon type='plus' className='upload-icon' />
                                        </Upload>
                                        <p>单株全景</p>
                                    </Col>
                                    <Col span={6}>
                                        <Upload {...props}>
                                            <Icon type='plus' className='upload-icon' />
                                        </Upload>
                                        <p>单株全景</p>
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem label='文本介绍' className='label-block'>
                                <TextArea rows={4} style={{width: 750}} />
                            </FormItem>
                            <FormItem style={{width: 800, textAlign: 'center'}}>
                                <Button style={{marginRight: 20}}>暂存</Button>
                                <Button type='primary'>发布</Button>
                            </FormItem>
                        </Form>

                    </TabPane>
                </Tabs>
            </div>
        );
    }
    toBack () {
        window.location.href = '/market/seedlingpurchase';
    }
}

export default Form.create()(DataList);
