
import React, {Component} from 'react';
import { Form, Button, Input, Tabs, Row, Col } from 'antd';
import Menu from './Menu';
import './SupplyList.less';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class DataList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataList: [],
            page: 1,
            total: 0,
            treetypename: ''
        };
        this.onSearch = this.onSearch.bind(this);
        this.onClear = this.onClear.bind(this);
        this.handleTreeTypeName = this.handleTreeTypeName.bind(this);
    }
    componentDidMount () {
        this.onSearch();
    }
    render () {
        const { dataList, treetypename } = this.state;
        return (
            <div className='seedling-supply content-padding'>
                <Form layout='inline'>
                    <FormItem
                        label='苗木名称'
                    >
                        <Input value={treetypename} onChange={this.handleTreeTypeName} className='search-input'
                            placeholder='请输入苗木名称' />
                    </FormItem>
                    <FormItem className='search-left'
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
                                        <Col span='6' key={index} onClick={this.toSupplyDetails.bind(this, item.ID)} style={{marginBottom: 10}}>
                                            <Menu record={item} />
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
    toSupplyDetails (key) {
        this.props.actions.changeSupplyDetailsVisible(true);
        this.props.actions.changeSupplyDetailsKey(key);
    }
    onSearch () {
        const { getProductList } = this.props.actions;
        getProductList({}, {
            treetypename: this.state.treetypename || '',
            status: 1
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
        this.setState({
            treetypename: ''
        });
    }
    handleTreeTypeName (e) {
        this.setState({
            treetypename: e.target.value
        });
    }
}

export default Form.create()(DataList);
