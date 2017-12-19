import React, {Component} from 'react';
import {
    Form, Input, Select, Button, Row, Col,Table,Collapse
} from 'antd';
import moment from 'moment';
import {Link} from 'react-router-dom';

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;

export default class CellTable extends Component {

    static propTypes = {};

    render() {
        const {part = [], formdocument = []} = this.props;

        return (
            <div>
                <Collapse onChange={this.callback.bind(this)} accordion>
                    {
                        part.map((parts) => {
                            const extra = (
                                <Row>
                                    <Col span={8}>{parts.name}</Col>
                                    <Col span={8}>{this.selectnames(parts)}</Col>
                                    <Col span={8}>{this.selectstatus(parts)}</Col>
                                </Row>
                            );
                            return <Panel header={extra} key={parts.name}>
                                <Table dataSource={formdocument} columns={this.columns}/>
                            </Panel>
                        })
                    }
                </Collapse>
            </div>
        );
    }

    columns = [{
        title: '检验批内容',
        dataIndex: 'subject[0].workContent',
    }, {
        title: '当前状态',
        sorter: (a, b) => a.status - b.status,
        render:record => {
            return this.getStatusName(record.status)
        }
    }, {
        title: '提交时间',
        sorter: (a, b) => moment(a.real_start_time).unix() - moment(b.real_start_time).unix(),
        render: (record) => {
            return moment(record.real_start_time).utc().zone(-8).format('YYYY-MM-DD');
        },
    }, {
        title: '审核时间',
        dataIndex: 'deadline',
        sorter: (a, b) => moment(a.deadline).unix() - moment(b.deadline).unix(),
    }, {
        title: '操作',
        render:(record) => {
            const {router} = this.props;
            const {id, name} = record;
            return <Link title={`${name}详情`} to={`/Quality/cells/${id}`} router={router}>详情</Link>;
        }
    }];

    getStatusName(type) {
        let name;
        switch (type) {
            case 2:
                name = '审核中';
                break;
            case 3:
                name = '已审核';
                break;
            default:
                name = '';
        }
        return name;
    }

    callback(key) {
        console.log(key);
        const {actions: {getFormdocument}} = this.props;
        let querylist = {
            "code": "TEMPLATE_007",
            "order_by": "-real_start_time",
            "subject_qilocation": key
        };
        getFormdocument({}, querylist);
    }

    selectnames(parts){
        if(parts.names !==undefined){
            return `...${parts.names[0]}${parts.names[1]}...`
        }else{
            return `无数据`
        }
    }

    selectstatus(parts){
        console.log(parts.status);
        if(parts.status == true){
            return `审核中`
        }if(parts.status == 'A'){
            return `无数据`
        }else{
            return `已审核`
        }
    }
}