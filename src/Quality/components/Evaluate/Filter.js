/**
 * Created by du on 2017/6/7.
 */
import React, {Component} from 'react';
import {
    Form, Input, Select, Button, Row, Col,Table
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
export default class Filter extends Component {

    static propTypes = {};

    static layout = {
        labelCol: {span: 10},
        wrapperCol: {span: 14},
    };

    render(){
        const {
            checkdocument =[],
            workPackage: {
                sectionWorkPackages = [],
                subSectionWorkPackages = [],
                itemWorkPackages = [],
            } = {}} = this.props;

        return (
            <div>
                <Form>
                    <Row gutter={24}>
                        <Col span={20}>
                            <Row gutter={24}>
                                <Col span={6}>
                                    <FormItem {...Filter.layout}
                                              label="分部">
                                        <Select placeholder="请选择分部" allowClear
                                                onChange={this.changeSectionWorkPackage.bind(
                                                     this)}>
                                            {
                                                sectionWorkPackages.map(pkg => {
                                                    return <Option key={pkg.code}
                                                                   value={pkg.code}>{pkg.name}</Option>;
                                                })
                                            }
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem {...Filter.layout}
                                              label="子分部">
                                        <Select placeholder="请选择子分部" allowClear
                                                 onChange={this.changeSubSectionWorkPackage.bind(
                                                     this)}>
                                            {
                                                subSectionWorkPackages.map(pkg => {
                                                    return <Option key={pkg.code}
                                                                   value={pkg.code}>{pkg.name}</Option>;
                                                })
                                            }
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem {...Filter.layout}
                                              label="分项">
                                        <Select placeholder="请选择分项" allowClear labelInValue
                                                 onChange={this.changeItemWorkPackage.bind(this)}>
                                            {
                                                itemWorkPackages.map(pkg => {
                                                    return <Option key={pkg.code}
                                                                   value={pkg.code}>{pkg.name}</Option>;
                                                })
                                            }
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem {...Filter.layout}
                                              label="部位">
                                        <Select placeholder="请选择部位"/>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
                <Table rowSelection={this.rowSelection}
                       dataSource={checkdocument}
                       columns={this.columns}
                       rowKey="code"/>
            </div>
        );
    }

    rowSelection = {
        // onChange: (selectedRowKeys,selectedRows) => {
        //     console.log('已选框表单',selectedRows);
        //     const {actions: {selectfiles}} = this.props;
        //     selectfiles(selectedRows);
        // },
    };
//保存过了之后，不能继续保存
//     save(){
//         const {selectfiles,currentcode,issdoucment} = this.props;
//         const {actions:{postdocument,putdocument,getCheckDocument}} = this.props;
//         console.log(issdoucment)
//         if(issdoucment == undefined){
//             postdocument({},{
//                 metalist: selectfiles,
//                 code:`qtemplist_${currentcode.code.key}`,
//             })
//         }else{
//             putdocument({code:`qtemplist_${currentcode.code.key}`},{
//                 metalist: selectfiles,
//             })
//         }
//         getCheckDocument({code:`qtemplist_${currentcode.code.key}`})
//     }

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
    }];

    changeSectionWorkPackage(key) {
        const {
            actions: { getChildrenWorkPackages, setSubSectionWorkPackages, setItemWorkPackages},
        } = this.props;
        if (key !== undefined) {
            getChildrenWorkPackages({code: key}).then(({children_wp}) => {
                setSubSectionWorkPackages(children_wp);
            });
        } else {
            setSubSectionWorkPackages([]);
        }
        setItemWorkPackages([]);

    }

    changeSubSectionWorkPackage(key) {
        const {
            actions: {getChildrenWorkPackages, setItemWorkPackages},
        } = this.props;
        if (key !== undefined) {
            getChildrenWorkPackages({code: key}).then(({children_wp}) => {
                setItemWorkPackages(children_wp);
            });
        } else {
            setItemWorkPackages([]);
        }
    }

    changeItemWorkPackage(key){
        // const {actions:{setcurrentcode,getCheckDocument}} = this.props;
        // setcurrentcode(key);
        // getCheckDocument({code:`qtemplist_${key.key}`})
    }

}
