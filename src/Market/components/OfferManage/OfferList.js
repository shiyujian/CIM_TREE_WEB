import React, {Component} from 'react';
import { Form, Input, Button, Tabs, Select, Spin } from 'antd';
import Menu from './Menu';
import { getUser } from '_platform/auth';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class OfferList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: true,
            dataList: [], // 报价单列表
            projectList: [] // 项目标段列表
        };
        this.org_code = ''; // 组织机构code
        this.grouptype = ''; // 组织机构类型
        this.onSearch = this.onSearch.bind(this); // 查询
        this.onClear = this.onClear.bind(this); // 清除
    }
    componentDidMount () {
        // 获取该用户所在机构类型和code
        const userData = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        if (userData && userData.account && userData.groups.length > 0) {
            userData.groups.map(item => {
                if (item.grouptype === 0 || item.grouptype === 6) {
                    this.grouptype = item.grouptype;
                }
            });
            this.org_code = userData.account.org_code;
        }
        // 获取所有项目和标段
        const { getWpunittree } = this.props.actions;
        getWpunittree().then(rep => {
            // 获取所在单位pk
            const { org_code } = getUser();
            this.org = org_code;
            this.setState({
                projectList: rep
            }, () => {
                this.onSearch();
            });
        });
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        const { loading, dataList, projectList } = this.state;
        return (
            <div className='offer-list'>
                <Form layout='inline'>
                    <FormItem
                        label='苗木名称'
                    >
                        {getFieldDecorator('purchaseno')(
                            <Input className='search-input' placeholder='请输入苗木名称' />
                        )}
                    </FormItem>
                    <FormItem
                        label='状态'
                    >
                        {getFieldDecorator('status', {
                            initialValue: ''
                        })(
                            <Select allowClear style={{ width: 150 }} placeholder='请选择状态'>
                                <Option value={''}>全部</Option>
                                <Option value={0}>未发布</Option>
                                <Option value={1}>报价中</Option>
                                <Option value={2}>选标中</Option>
                                <Option value={3}>已结束</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem className='search-left'>
                        <Button type='primary' onClick={this.onSearch}>查询</Button>
                        <Button style={{marginLeft: 20}} onClick={this.onClear}>清除</Button>
                    </FormItem>
                </Form>
                <Tabs defaultActiveKey='1'>
                    <TabPane tab='全 部' key='1' style={{background: '#ECECEC', padding: '20px', minHeight: 500}}>
                        <Spin spinning={loading}>
                            {
                                dataList.length > 0 ? dataList.map((item, index) => {
                                    return (
                                        <Menu record={item} key={index} {...this.props} projectList={projectList} />
                                    );
                                }) : '没有更多了'
                            }
                        </Spin>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
    onClear () {
        this.props.form.resetFields();
    }
    onSearch () {
        const { getPurchaseList } = this.props.actions;
        this.setState({
            loading: true
        });
        const { treetypename, status } = this.props.form.getFieldsValue();
        getPurchaseList({}, {
            nurserybase: this.grouptype === 0 ? this.org_code : '',
            supplier: this.grouptype === 6 ? this.org_code : '',
            treetypename: treetypename || '',
            status: status === undefined ? '' : status
        }).then(rep => {
            if (rep.code === 200) {
                this.setState({
                    loading: false,
                    dataList: rep.content
                });
            }
        });
    }
}

export default Form.create()(OfferList);
