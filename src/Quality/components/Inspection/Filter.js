/**
 * Created by du on 2017/5/26.
 */
import React, {Component} from 'react';
import {
    Form, Input, Select, Button, Row, Col,Table
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
export default class Evaluatefilter extends Component {

    static propTypes = {};

    static layout = {
        labelCol: {span: 10},
        wrapperCol: {span: 14},
    };

    render(){
        const {
            checkdocument = [],
            filter =[],
            platform: {
                wp:{
                    sections = [],
                    subsections = [],
                    items = [],
                } = {}
            } = {}
        } = this.props;

        return (
            <div>
            <Form>
                <Row gutter={24}>
                    <Col span={20}>
                        <Row gutter={24}>
                            <Col span={6}>
                                <FormItem {...Evaluatefilter.layout}
                                          label="分部">
                                    <Select placeholder="请选择分部" allowClear
                                            value={filter.section}
                                            onChange={this.changeSectionWorkPackage.bind(
                                                this)}>
                                        {
                                            sections.map(pkg => {
                                                return <Option key={pkg.code}
                                                               value={pkg.code}>{pkg.name}</Option>;
                                            })
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem {...Evaluatefilter.layout}
                                          label="子分部">
                                    <Select placeholder="请选择子分部" allowClear
                                            value={filter.subSection}
                                            onChange={this.changeSubSectionWorkPackage.bind(
                                                this)}>
                                        {
                                            subsections.map(pkg => {
                                                return <Option key={pkg.code}
                                                               value={pkg.code}>{pkg.name}</Option>;
                                            })
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem {...Evaluatefilter.layout}
                                          label="分项">
                                    <Select placeholder="请选择分项" allowClear labelInValue
                                            value={filter.item}
                                            onChange={this.changeItemWorkPackage.bind(this)}>
                                        {
                                            items.map(pkg => {
                                                return <Option key={pkg.code}
                                                               value={pkg.code}>{pkg.name}</Option>;
                                            })
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem {...Evaluatefilter.layout}
                                          label="部位">
                                    <Select placeholder="请选择部位"/>
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
                <Row gutter={24}>
                    <Col span={8}>
                        <h3>已选表单</h3>
                    </Col>
                    <Col span={8} offset={8}>
                        <Button onClick={this.save.bind(this)}>保存分项模板</Button>
                    </Col>
                </Row>
                <Table rowSelection={this.rowSelection}
                       dataSource={checkdocument}
                       columns={this.columns}
                       rowKey="code"/>
            </div>
        );
    }

    rowSelection = {
        onChange: (selectedRowKeys,selectedRows) => {
            const {actions: {selectfiles}} = this.props;
            selectfiles(selectedRows);
        },
    };
//保存过了之后，不能继续保存
    save(){
        const {selectfiles,Itemcode,issdoucment} = this.props;
        const {actions:{postdocument,putdocument,getCheckDocument}} = this.props;
        if(issdoucment == undefined){
            postdocument({},{
                metalist: selectfiles,
                code:`qtemplist_${Itemcode.code.key}`,
            })
        }else{
            putdocument({code:`qtemplist_${Itemcode.code.key}`},{
                metalist: selectfiles,
            })
        }
          getCheckDocument({code:`qtemplist_${Itemcode.code.key}`})
    }

    columns = [{
        title: '序号',
        dataIndex: 'code',
    }, {
        title: '表单名称',
        dataIndex: 'name',
    }, {
        title: '表单状态',
        dataIndex: '',
    }, {
        title: '查看表单',
        dataIndex: '',
    }, {
        title: '操作',
        render: record => {
            return (
                <span>
					 <a onClick={this.delete1.bind(this,record)}>删除</a>
				</span>
            )
        },
    }];

    changeSectionWorkPackage(key) {
        const {
            actions: {changeFilterField,getSubsections, setSubsection, setItem},
        } = this.props;
        changeFilterField('section', key);
        if (key !== undefined) {
            getSubsections({code: key}).then(({children_wp}) => {
                setSubsection(children_wp);
            });
        } else {
            setSubsection([]);
        }
        setItem([]);
        changeFilterField('subSection', undefined);
        changeFilterField('item', undefined);
    }

    changeSubSectionWorkPackage(key) {
        const {
            actions: {changeFilterField,getItems, setItem},
        } = this.props;
        changeFilterField('subSection', key);
        if (key !== undefined) {
            getItems({code: key}).then(({children_wp}) => {
                setItem(children_wp);
            });
        } else {
            setItem([]);
        }
        changeFilterField('item', undefined);
    }

    changeItemWorkPackage(key){
        const {actions:{changeFilterField,setItemcode,getCheckDocument}} = this.props;
        changeFilterField('item', key);
        setItemcode(key);
        getCheckDocument({code:`qtemplist_${key.key}`})
    }

    delete1(record) {
        const {checkdocument} =this.props;
        for(var i=0;i<checkdocument.length;i++){
            if(checkdocument[i] == record){
                checkdocument.splice(i,1);
            }
        }
        this.setState({checkdocument})
    }
}
