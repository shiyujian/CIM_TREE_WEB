
import React, {Component} from 'react';
import { Form, Button, Input, Select, Tabs } from 'antd';
import Menu from './Menu';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class DemandTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataList: [],
            projectList: [],
            a: 1
        };
        this.toSearch = this.toSearch.bind(this);
        this.onClear = this.onClear.bind(this);
    }
    componentDidMount () {
        // 获取所有项目和标段
        const { getWpunittree } = this.props.actions;
        getWpunittree().then(rep => {
            this.setState({
                projectList: rep
            });
        });
        this.toSearch();
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        const { dataList, projectList } = this.state;
        const {
            addDemandVisible
        } = this.props;
        let display = 'block';
        if (addDemandVisible) {
            display = 'none';
        }
        return (
            <div className='demandTable' style={{display: display, padding: '0 20px'}}>
                <Form layout='inline'>
                    <FormItem
                        label='采购编号'
                    >
                        {getFieldDecorator('purchaseno')(
                            <Input style={{width: '200px'}} placeholder='请输入采购编号' />
                        )}
                    </FormItem>
                    <FormItem
                        label='采购名称'
                    >
                        {getFieldDecorator('projectname')(
                            <Input style={{width: '200px'}} placeholder='请输入采购名称' />
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
                <Button type='primary' onClick={this.toAddDemand.bind(this)}
                    style={{position: 'absolute', right: 60, zIndex: 100}}>新增需求</Button>
                <Tabs defaultActiveKey='1' onChange={this.handlePane}>
                    <TabPane tab='全 部' key='1'>
                        {
                            dataList.length > 0 ? dataList.map((item, index) => {
                                return <Menu record={item} key={index} projectList={projectList} {...this.props} toSearch={this.toSearch} toAddDemand={this.toAddDemand} />;
                            }) : []
                        }
                    </TabPane>
                </Tabs>
            </div>
        );
    }
    toAddDemand = (key) => {
        const { changeAddDemandVisible, changeAddDemandKey } = this.props.actions;
        changeAddDemandVisible(true);
        changeAddDemandKey(key);
    }
    toSearch () {
        const formVal = this.props.form.getFieldsValue();
        const { getPurchaseList } = this.props.actions;
        getPurchaseList({}, {
            purchaseno: '',
            projectname: formVal.projectname || '',
            status: formVal.status || ''
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

export default Form.create()(DemandTable);
