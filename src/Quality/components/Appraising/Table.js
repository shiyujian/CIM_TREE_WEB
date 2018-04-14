import React, {Component} from 'react';
import {
    Form, Input, Select, Button, Row, Col,Table,Collapse
} from 'antd';
import moment from 'moment';
import {Link} from 'react-router-dom';

const Option = Select.Option;

export default class CellTable extends Component {

    constructor(props) {
        super(props)
        this.state = {
            sectionList:[]
        }
    }

    componentWillReceiveProps(props){
        if(props.sectionList){
            this.setState({sectionList:props.sectionList})
        }
    }

    render() {
        const {part = [], formdocument = []} = this.props;

        return (
            <div>
                <Select style={{width:150}}>
                    {
                        this.state.sectionList
                    }
                </Select>
                <Table bordered
                columns = {this.columns}/>
            </div>
        );
    }

    columns = [{
        title: '排名',
        dataIndex: 'subject[0].workContent',
    }, {
        title: '标段',
        sorter: (a, b) => a.status - b.status,
        render:record => {
            return this.getStatusName(record.status)
        }
    }, {
        title: '总分',
        sorter: (a, b) => moment(a.real_start_time).unix() - moment(b.real_start_time).unix(),
        render: (record) => {
            return moment(record.real_start_time).utc().zone(-8).format('YYYY-MM-DD');
        },
    }, {
        title: '环比',
        dataIndex: 'deadline',
        sorter: (a, b) => moment(a.deadline).unix() - moment(b.deadline).unix(),
    }, {
        title: '详情',
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