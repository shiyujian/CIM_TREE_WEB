import React, { Component } from 'react';
import { Table, message, Popconfirm, Divider } from 'antd';
import Button from 'antd/es/button/button';
import Card from '_platform/components/panels/Card';
import '../index.less';
export const Acccode = window.DeathCode.SYSTEM_ACC;
export default class Tablelevel extends Component {
    render () {
        const rowSelection = {
            // selectedRowKeys,
            onChange: this.onSelectChange
        };
        const { newdocumentlist = [] } = this.props;

        return (
            <Table
                className='foresttablel'
                rowSelection={rowSelection}
                dataSource={newdocumentlist}
                columns={this.columns}
                bordered
                rowKey='code'
            />
        );
    }

    columns = [
        {
            title: '序号',
            dataIndex: 'on'
        },
        {
            title: '类型名称',
            dataIndex: 'name'
        },
        {
            title: '类型编码',
            dataIndex: 'code'
        },
        {
            title: '操作',
            render: record => {
                let nodes = [];
                nodes.push(
                    <div>
                        <a onClick={this.eidte.bind(this, record)}>编辑</a>
                        <Divider type='vertical' />
                        <Popconfirm
                            title='确认删除该文件吗?'
                            onConfirm={this.confirm.bind(this)}
                            onCancel={this.cancel.bind(this)}
                            okText='Yes'
                            cancelText='No'
                        >
                            <a onClick={this.del.bind(this, record)}>删除</a>
                        </Popconfirm>
                    </div>
                );
                return nodes;
            }
        }
    ];

    Add () {
        const {
            actions: { Adding }
        } = this.props;
        Adding(true);
    }

    eidte (file) {
        const {
            actions: { edite, seteditefile }
        } = this.props;
        edite(true);
        seteditefile(file);
    }

    del (file) {
        const {
            actions: { setedelfile }
        } = this.props;
        setedelfile(file);
    }

    confirm () {
        const { delfile } = this.props;
        let dexx = delfile.on - 1;
        const {
            actions: { deletedocument, getdocuemntlist }
        } = this.props;
        deletedocument({ code: 'Documentlist', dex: dexx }).then(rst => {
            message.success('删除文件成功！');
            getdocuemntlist({ code: 'Documentlist' }).then(rst => {
                let newdocumentlists = rst.metalist;
                rst.metalist.map((wx, index) => {
                    newdocumentlists[index].on = index + 1;
                });
                const {
                    actions: { setnewdocumentlist }
                } = this.props;
                setnewdocumentlist(newdocumentlists);
            });
        });
    }

    cancel () {}
}
