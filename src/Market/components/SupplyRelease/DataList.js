
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Input, Select, Tabs } from 'antd';
import Menu from './Menu';
import { Repeat } from 'immutable';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class DataList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataList: [],
            a: 1
        };
        this.toSearch = this.toSearch.bind(this);
        this.onClear = this.onClear.bind(this);
    }
    componentDidMount () {
        this.toSearch();
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        const { dataList } = this.state;
        return (
            <div className='supply-release' style={{padding: '0 20px'}}>
                <Form layout='inline'>
                    <FormItem
                        label='苗木名称'
                    >
                        {getFieldDecorator('treetypename')(
                            <Input style={{width: '200px'}} placeholder='请输入苗木名称' />
                        )}
                    </FormItem>
                    <FormItem
                        label='状态'
                    >
                        {getFieldDecorator('status')(
                            <Select allowClear style={{ width: 150 }} placeholder='请选择状态'>
                                <Option value={0}>未上架</Option>
                                <Option value={1}>上架中</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem style={{marginLeft: '200px'}}
                    >
                        <Button type='primary' onClick={this.toSearch}>查询</Button>
                        <Button style={{marginLeft: 20}} onClick={this.onClear}>清除</Button>
                    </FormItem>
                </Form>
                <Link to='/market/addseedling'>
                    <Button type='primary'
                        style={{position: 'absolute', right: 60, zIndex: 100}}>新增苗木</Button>
                </Link>
                <Tabs defaultActiveKey='1' onChange={this.handlePane}>
                    <TabPane tab='全 部' key='1'>
                        {
                            dataList.length > 0 ? dataList.map((item, index) => {
                                return <Menu record={item} {...this.props} toSearch={this.toSearch} key={index}/>;
                            }) : []
                        }
                    </TabPane>
                </Tabs>
            </div>
        );
    }
    toSearch () {
        const formVal = this.props.form.getFieldsValue();
        const { getProductList } = this.props.actions;
        getProductList({}, {
            treetypename: formVal.treetypename || '',
            status: formVal.status || 1
        }).then((rep) => {
            if (rep.code === 200) {
                this.setState({
                    dataList: rep.content,
                    page: rep.pageinfo.page,
                    total: rep.pageinfo.total
                });
            }
        });
    }
    onClear () {
        this.props.form.resetFields();
    }
}

export default Form.create()(DataList);
