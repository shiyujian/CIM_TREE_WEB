
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Input, Select, Tabs, Row, Col } from 'antd';
import Menu from './Menu';
import './DataList.less';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class DataList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataList: [],
            page: 1,
            total: 0,
            a: 1
        };
        this.onSearch = this.onSearch.bind(this);
        this.onClear = this.onClear.bind(this);
    }
    componentDidMount () {
        this.onSearch();
    }
    render () {
        const { page, total, dataList } = this.state;
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
                        <Button style={{marginLeft: 20}} onClick={this.onClear}>清除</Button>
                    </FormItem>
                </Form>
                <Tabs defaultActiveKey='1' onChange={this.handlePane}>
                    <TabPane tab='全 部' key='1' style={{ background: '#ECECEC', padding: '20px' }}>
                        <Row gutter={16}>
                            {
                                dataList.length > 0 ? dataList.map((item, index) => {
                                    return (
                                        <Col span='6'>
                                            <Menu key={index} record={item} />
                                        </Col>
                                    );
                                }) : <Col span='6'>没有更多了</Col>
                            }
                        </Row>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
    onSearch () {
        const { getProductList } = this.props.actions;
        const formVal = this.props.form.getFieldsValue();
        getProductList({}, {
            treetypename: formVal.treetypename || '',
            status: ''
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
    onClear () {

    }
}

export default Form.create()(DataList);
