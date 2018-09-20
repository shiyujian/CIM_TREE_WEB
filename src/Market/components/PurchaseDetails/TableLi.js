
import React, {Component} from 'react';
import { Input, Table, Button } from 'antd';

class TableLi extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataList: []
        };
        this.uploadFile = this.uploadFile.bind(this); // 上传附件
    }
    columns = [
        {
            title: '到货单价',
            key: '1',
            dataIndex: '可供数量',
            render: text => <Input />
        }, {
            title: '可供数量',
            key: '2',
            dataIndex: '可供数量',
            render: text => <Input />
        }, {
            title: '苗源地',
            key: '3',
            dataIndex: '可供数量',
            render: text => <Input />
        }, {
            title: '报价说明',
            key: '4',
            dataIndex: '可供数量',
            render: text => <Input />
        }, {
            title: '附件',
            key: '5',
            dataIndex: '可供数量',
            render: text => <a onClick={this.uploadFile.bind(this)}>上传附件</a>
        }, {
            title: '操作',
            key: '6',
            dataIndex: 'action',
            render: (text, record) => <Button>提交</Button>
        }
    ];
    render () {
        const { dataList } = this.state;
        return (
            <div className='table-li'>
                <header>
                    <h4>柏树</h4>
                    <span className='table-span'>胸径10cm;地经20cm</span>
                    <p className='table-right'>
                        <span>已有5人报价</span>
                        <Button type='primary'>我要报价</Button>
                    </p>
                </header>
                <Table columns={this.columns} dataSource={dataList} />
            </div>
        );
    }
    uploadFile () {

    }
}

export default TableLi;
