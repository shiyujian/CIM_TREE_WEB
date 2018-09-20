
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Input, Select, Tabs } from 'antd';
import Menu from './Menu';
import './DataList.less';

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
            <div className='seedling-supply' style={{padding: '20px 40px'}}>
                <Form layout='inline' onSubmit={this.handleSubmit}>
                    <FormItem
                        label='苗木名称'
                    >
                        {getFieldDecorator('email')(
                            <Input style={{width: '200px'}} />
                        )}
                    </FormItem>
                    <FormItem style={{marginLeft: '200px'}}
                    >
                        <Button type='primary'>查询</Button>
                    </FormItem>
                </Form>
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
