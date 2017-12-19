/**
 * Created by du on 2017/5/26.
 */
import React, {Component} from 'react';
import {
    Form, Input, Select, Button, Row, Col,Table,Cascader,Checkbox,message,
} from 'antd';
import {getUser} from '../../../_platform/auth';
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
export default class EvaluatefilterAtt extends Component {

    static propTypes = {};

    static layout = {
        labelCol: {span: 10},
        wrapperCol: {span: 14},
    };

    render(){
        const {
            qictypelist = [],
            document = [],
        } = this.props;

        return (
            <div>
                <Row gutter={24}>
                    <Col span={20}>
                        <Row gutter={24}>
                            <Col span={8}>
                                <Select style={{width:120}}
                                        placeholder="请选择工程类别"
                                        onChange={this.changetype.bind(this)}>
                                    {
                                        qictypelist.map((data, index) => {
                                            return <Option key={index}
                                                           value={data.code}>{data.name}</Option>;
                                        })
                                    }
                                </Select>
                            </Col>
                            <Col span={12}>
                                <Search placeholder="请输入需要搜索的信息" onSearch={this.query.bind(this)} style={{width: 200}}/>
                            </Col>
                            <Col span={4}>
                                <Button onClick={this.add.bind(this)}>添加</Button>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <h3>备选表单</h3>
                        </Row>
                    </Col>
                </Row>
                <Table  rowSelection={this.rowSelection}
                        dataSource={document}
                        columns={this.columns}
                        rowKey="name"/>

            </div>
        );
    }

    rowSelection = {
        onChange: (selectedRowKeys,selectedRows) => {
            const {actions: {selectDocuments}} = this.props;
            selectDocuments(selectedRows);
        },
    };


    add() {
        const {selectedDocs} = this.props;
        console.log('selectedDocs',selectedDocs);
        const {actions: {pushdocument}} = this.props;
        pushdocument(selectedDocs);
    }

    changetype(key) {
        const {actions:{getDocumented,setcurrentcode}} = this.props;
        setcurrentcode(key);
        getDocumented({code:key});
    }

    columns = [{
        title: '表单编码',
        dataIndex: 'code',
    }, {
        title: '表单名称',
        dataIndex: 'name',
    }, {
        title: '份数',
        dataIndex: '',
    }];

    query(value){
        const {actions:{getDocument},currentcode} = this.props;
        let condition = {
            codelist:'qictype_1,qictype_2,qictype_3,qictype_3.1,qictype_3.2,qictype_3.3,qictype_3.4,qictype_3.5,qictype_4,qictype_5,qictype_6',
            search: value,
        };
        getDocument({},condition);
        // if(currentcode !== undefined){
        //     let condition = {
        //         //codelist:'qictype_1,qictype_2,qictype_3,qictype_3.1,qictype_3.2,qictype_3.3,qictype_3.4,qictype_3.5,qictype_4,qictype_5,qictype_6',
        //         search: value,
        //     };
        //      getDocument({},condition);
        // }
    }
}