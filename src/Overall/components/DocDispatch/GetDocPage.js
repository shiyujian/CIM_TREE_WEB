import React, {Component} from 'react';
import {Button, Modal, Row, Col, Table,} from 'antd';
import moment from 'moment';

export default class GetDocPage extends Component{
    constructor(props) {
		super(props);
		this.state = {
			visible: false,
			container: null,
		}
    }
    
    render(){
        return (
            <Row >
                <Col span={22} offset={1}>
                    {/* TODO:此处是已经接受到的文档列表 */}
                    <Table columns={this.getdoc_columns}
                    rowKey='id'/>
                </Col>
            </Row>);

    }

    getdoc_columns = [
        {title:'事项标题',dataIndex:'doc_title',key:'doc_title'},
        {title:'发送单位',dataIndex:'doc_maker',key:'doc_maker'},
        {title:'接受单位',dataIndex:'doc_taker',key:'doc_taker'},
        {title:'抄送单位',dataIndex:'doc_copy_taker',key:'doc_copy_taker'},
        {title:'发送时间',dataIndex:'doc_make_at_time',key:'doc_make_at_time',
            render: (doc_make_at_time)=>{
                moment(doc_make_at_time).utc().format('YYYY-MM-DD HH:mm:ss');
            }
        },
        {title:'操作',render:record=>{return(<span><a>查看</a></span>)}}
    ];
}