
import React, {Component} from 'react';
import { Form, Input, Button, Tabs, Select } from 'antd';
import Menu from './Menu';
import './DataList.less';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

class DataList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            page: 1,
            total: 0,
            dataList: [],
            projectList: [], // 项目标段
            a: 1
        };
        this.onSearch = this.onSearch.bind(this);
        this.handlePane = this.handlePane.bind(this); // 切换标签页
        this.onClear = this.onClear.bind(this);
    }
    componentDidMount () {
        const { getWpunittree } = this.props.actions;
        getWpunittree().then(rep => {
            this.setState({
                projectList: rep
            });
        });
        this.onSearch();
    }
    render () {
        const { dataList, projectList } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='seedling-purchase' style={{padding: '0 20px'}}>
                <Form layout='inline'>
                    <FormItem
                        label='采购编号'
                    >
                        {getFieldDecorator('purchaseno')(
                            <Input style={{width: 150}} placeholder='请输入采购编号' />
                        )}
                    </FormItem>
                    <FormItem
                        label='采购名称'
                    >
                        {getFieldDecorator('projectname')(
                            <Input style={{width: 150}} placeholder='请输入采购名称' />
                        )}
                    </FormItem>
                    <FormItem
                        label='状态'
                    >
                        {getFieldDecorator('status')(
                            <Select allowClear style={{ width: 150 }} placeholder='请选择状态'>
                                <Option value={0}>未发布</Option>
                                <Option value={1}>报价中</Option>
                                <Option value={2}>选标中</Option>
                                <Option value={3}>已结束</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem style={{marginLeft: 134}}>
                        <Button type='primary' onClick={this.onSearch}>查询</Button>
                        <Button style={{marginLeft: 20}} onClick={this.onClear}>清除</Button>
                    </FormItem>
                </Form>
                <Tabs defaultActiveKey='1' onChange={this.handlePane}>
                    <TabPane tab='全 部' key='1'>
                        {
                            dataList.map((item, index) => {
                                return <Menu {...this.props} record={item} key={index} projectList={projectList} />;
                            })
                        }
                    </TabPane>
                </Tabs>
            </div>
        );
    }
    onSearch () {
        const { getPurchaseList } = this.props.actions;
        const formVal = this.props.form.getFieldsValue();
        const { page } = this.state;
        getPurchaseList({}, {
            purchaseno: formVal.purchaseno || '',
            projectname: formVal.projectname || '',
            status: formVal.status || 0,
            page
        }).then(rep => {
            if (rep.code === 200) {
                this.setState({
                    page: rep.pageinfo.page,
                    total: rep.pageinfo.total,
                    dataList: rep.content
                });
            }
        });
    }
    handlePane () {

    }
    onClear () {
        this.props.form.resetFields();
    }
}

export default Form.create()(DataList);
