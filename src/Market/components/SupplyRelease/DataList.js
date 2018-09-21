
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Input, Select, Tabs } from 'antd';
import Menu from './Menu';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class DataList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            a: 1
        };
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='supply-release' style={{padding: '0 20px'}}>
                <Form layout='inline' onSubmit={this.handleSubmit}>
                    <FormItem
                        label='苗木名称'
                    >
                        {getFieldDecorator('email')(
                            <Input style={{width: '200px'}} />
                        )}
                    </FormItem>
                    <FormItem
                        label='状态'
                    >
                        {getFieldDecorator('email')(
                            <Select allowClear style={{ width: 150 }}>
                                <Option value='jack'>Jack</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem style={{marginLeft: '200px'}}
                    >
                        <Button type='primary'>查询</Button>
                    </FormItem>
                </Form>
                <Link to='/market/addseedling'>
                    <Button type='primary'
                        style={{position: 'absolute', right: 60, zIndex: 100}}>新增苗木</Button>
                </Link>
                <Tabs defaultActiveKey='1' onChange={this.handlePane}>
                    <TabPane tab='全 部' key='1'>
                        <Menu />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default Form.create()(DataList);
