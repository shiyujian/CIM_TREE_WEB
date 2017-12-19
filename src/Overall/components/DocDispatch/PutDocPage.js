import React, {Component} from 'react';
import {Button, Modal, Row, Col, Table,} from 'antd';
import PutDocModal from './PutDocModal';
import moment from 'moment';

export default class PutDocPage extends Component{
    constructor(props) {
		super(props);
		this.state = {
			visible: false,
			container: null,
		}
    }


    publishDocClick(){
		const {actions: {setPutDocModalVaild}} = this.props;
		setPutDocModalVaild({
			type: 'DOCS',
			status: 'ADD',
            visible: true,
            editData: null,
		})
	}

    render(){
        const {
            putDocModalVaild:putDocModalVaild={
                type: 'DOCS',
                visible: false,
            },
        }=this.props;
        return (
            <Row>
                <Col span={22} offset={1}>
                    <div style={{marginBottom: '10px'}}>
                        <Button type="primary" onClick={this.publishDocClick.bind(this)}>发送文件</Button>
                        {
                            (putDocModalVaild.visible && putDocModalVaild.type === 'DOCS')?
                                (<PutDocModal {...this.props}/>) : null
                        }
                    </div>
                    
                    {/* TODO:此处是已发送的文档列表 */}
                    <Table 
                        columns={this.putdoc_columns}
                    />
                </Col>
                <Modal
                title="文件预览"
                width="800px"
				visible={this.state.visible}
                ></Modal>
            </Row>

        );
        
    }

    handleDoc(record,type){
        if(type==='TAKEBACK'){
        }
    }
        
    putdoc_columns = [
        {title:'事项标题',dataIndex:'doc_title',key:'doc_title'},
        {title:'发送单位',dataIndex:'doc_maker',key:'doc_maker'},
        {title:'接受单位',dataIndex:'doc_taker',key:'doc_taker'},
        {title:'抄送单位',dataIndex:'doc_copy_taker',key:'doc_copy_taker'},
        {title:'发送时间',dataIndex:'doc_make_at_time',key:'doc_make_at_time',
            render: (doc_make_at_time)=>{
                moment(doc_make_at_time).utc().format('YYYY-MM-DD HH:mm:ss');
            }
        },
        {title:'操作',render:record=>{return(
            <span><a onClick={this.handleDoc.bind(this,record,'TAKEBACK')}>
                撤回
            </a></span>)}}
    ];

}