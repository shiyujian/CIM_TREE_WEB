
import React, {Component} from 'react';
import { Form, Button, Input, Select, Tabs, Spin } from 'antd';
import Menu from './Menu';
import { getUser } from '_platform/auth';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class SupplyTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: true,
            dataList: [],
            treetypename: '',
            status: 1
        };
        this.nurserybase = ''; // 苗圃基地id
        this.toSearch = this.toSearch.bind(this);
        this.onClear = this.onClear.bind(this);
        this.handleTreeType = this.handleTreeType.bind(this);
        this.handleStatus = this.handleStatus.bind(this);
    }
    componentDidMount () {
        // 获取该用户所在苗圃基地的id
        const { org_code } = getUser();
        const { getNurseryByPk } = this.props.actions;
        getNurseryByPk({}, {
            pk: org_code
        }).then(rep => {
            if (rep.code === 200 && rep.content.length > 0) {
                this.nurserybase = rep.content[0].ID;
            }
            this.toSearch();
        });
    }
    render () {
        const { dataList, loading, status } = this.state;
        return (
            <div className='supply-release content-padding'>
                <Form layout='inline'>
                    <FormItem
                        label='苗木名称'
                    >
                        <Input className='search-input' placeholder='请输入苗木名称' onChange={this.handleTreeType} />
                    </FormItem>
                    <FormItem
                        label='状态'
                    >
                        <Select allowClear defaultValue={status} style={{ width: 150 }} placeholder='请选择状态' onChange={this.handleStatus}>
                            <Option value={0}>未上架</Option>
                            <Option value={1}>上架中</Option>
                        </Select>
                    </FormItem>
                    <FormItem className='search-left'
                    >
                        <Button type='primary' onClick={this.toSearch}>查询</Button>
                        <Button style={{marginLeft: 20}} onClick={this.onClear}>清除</Button>
                    </FormItem>
                </Form>
                <Button type='primary' onClick={this.toAddSeedling.bind(this)}
                    style={{position: 'absolute', right: 60, zIndex: 100}}>新增供应</Button>
                <Tabs defaultActiveKey='1' onChange={this.handlePane}>
                    <TabPane tab='全 部' key='1' style={{minHeight: 500}}>
                        <Spin spinning={loading}>
                            {
                                dataList.length > 0 ? dataList.map((item, index) => {
                                    return <Menu record={item} {...this.props} toSearch={this.toSearch} key={index} toAddSeedling={this.toAddSeedling} />;
                                }) : []
                            }
                        </Spin>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
    toSearch () {
        const { treetypename, status } = this.state;
        const { getProductList } = this.props.actions;
        this.setState({
            loading: true
        });
        getProductList({}, {
            treetypename,
            nurserybase: status === 0 || status === 1 ? this.nurserybase : '',
            status: status === undefined ? '' : status
        }).then((rep) => {
            if (rep.code === 200) {
                this.setState({
                    loading: false,
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
