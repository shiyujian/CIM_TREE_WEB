
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
        this.onSearch = this.onSearch.bind(this);
    }
    componentDidMount () {
        this.onSearch();
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='seedling-supply' style={{padding: '0 20px'}}>
                <Form layout='inline'>
                    <FormItem
                        label='苗木名称'
                    >
                        {getFieldDecorator('treetypename')(
                            <Input style={{width: '200px'}} />
                        )}
                    </FormItem>
                    <FormItem style={{marginLeft: 150}}
                    >
                        <Button type='primary' onClick={this.onSearch}>查询</Button>
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
    onSearch () {
        const { getSeedlingSupplyList } = this.props.actions;
        const formVal = this.props.form.getFieldsValue();
        getSeedlingSupplyList({}, {
            treetypename: formVal.treetypename || ''
        }).then((rep) => {
            if (rep.code === 200) {
                this.setState({
                    page: rep.pageinfo.page,
                    total: rep.pageinfo.total,
                    dataList: rep.content
                });
            }
        });
    }
}

export default Form.create()(DataList);
