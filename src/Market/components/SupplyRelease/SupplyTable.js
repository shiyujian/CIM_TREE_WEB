
import React, {Component} from 'react';
import { Form, Button, Input, Select, Tabs } from 'antd';
import Menu from './Menu';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class SupplyTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataList: [],
            treetypename: '',
            status: 1
        };
        this.toSearch = this.toSearch.bind(this);
        this.onClear = this.onClear.bind(this);
        this.handleTreeType = this.handleTreeType.bind(this);
        this.handleStatus = this.handleStatus.bind(this);
    }
    componentDidMount () {
        this.toSearch();
    }
    render () {
        const { dataList, status } = this.state;
        let display = this.props.addSeedlingVisible ? 'none' : 'block';
        return (
            <div className='supply-release' style={{display: display, padding: '0 20px'}}>
                <Form layout='inline'>
                    <FormItem
                        label='苗木名称'
                    >
                        <Input style={{width: '200px'}} placeholder='请输入苗木名称' onChange={this.handleTreeType} />
                    </FormItem>
                    <FormItem
                        label='状态'
                    >
                        <Select allowClear defaultValue={status} style={{ width: 150 }} placeholder='请选择状态' onChange={this.handleStatus}>
                            <Option value={0}>未上架</Option>
                            <Option value={1}>上架中</Option>
                        </Select>
                    </FormItem>
                    <FormItem style={{marginLeft: '200px'}}
                    >
                        <Button type='primary' onClick={this.toSearch}>查询</Button>
                        <Button style={{marginLeft: 20}} onClick={this.onClear}>清除</Button>
                    </FormItem>
                </Form>
                <Button type='primary' onClick={this.toAddSeedling.bind(this)}
                    style={{position: 'absolute', right: 60, zIndex: 100}}>新增供应</Button>
                <Tabs defaultActiveKey='1' onChange={this.handlePane}>
                    <TabPane tab='全 部' key='1'>
                        {
                            dataList.length > 0 ? dataList.map((item, index) => {
                                return <Menu record={item} {...this.props} toSearch={this.toSearch} key={index} toAddSeedling={this.toAddSeedling} />;
                            }) : []
                        }
                    </TabPane>
                </Tabs>
            </div>
        );
    }
    toSearch () {
        const { treetypename, status } = this.state;
        const { getProductList } = this.props.actions;
        getProductList({}, {
            treetypename,
            status: status === undefined ? '' : status
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
        this.setState({
            treetypename: '',
            status: ''
        });
    }
    toAddSeedling = (key) => {
        const { changeAddSeedlingVisible, changeAddSeedlingKey } = this.props.actions;
        changeAddSeedlingVisible(true);
        changeAddSeedlingKey(key);
    }
    handleTreeType (e) {
        this.setState({
            treetypename: e.target.value
        });
    }
    handleStatus (value) {
        this.setState({
            status: value
        });
    }
}

export default SupplyTable;
