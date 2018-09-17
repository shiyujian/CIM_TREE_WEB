
import React, {Component} from 'react';
import { Form, Input, Button, Tabs } from 'antd';
import Menu from './Menu';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class DataList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            a: 1
        };
        this.handlePane = this.handlePane.bind(this); // 切换标签页
        this.handleSubmit = this.handleSubmit.bind(this); // 提交查询
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='data-list' style={{margin: '0 40px'}}>
                <Form onSubmit={this.handleSubmit} layout='inline'>
                    <FormItem
                        label='采购编号'
                    >
                        {getFieldDecorator('email')(
                            <Input style={{width: 150}} />
                        )}
                    </FormItem>
                    <FormItem
                        label='采购名称'
                    >
                        {getFieldDecorator('email')(
                            <Input style={{width: 150}} />
                        )}
                    </FormItem>
                    <FormItem
                        label='状态'
                    >
                        {getFieldDecorator('email')(
                            <Input style={{width: 150}} />
                        )}
                    </FormItem>
                    <FormItem style={{marginLeft: 134}}>
                        <Button
                            type='primary'
                            htmlType='submit'
                        >
                            查询
                        </Button>
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
    handlePane () {

    }
    handleSubmit () {

    }
}

export default Form.create()(DataList);
