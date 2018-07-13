import React, { Component } from 'react';
import { Table, message, Popconfirm, Divider } from 'antd';
import Button from 'antd/es/button/button';
import Card from '_platform/components/panels/Card';
export const Acccode = window.DeathCode.SYSTEM_ACC;
export default class Tablelevel extends Component {
    render () {
        const { newaccidentlist = [] } = this.props;

        return (
            <Card
                title='安全事故类别'
                extra={
                    <Button
                        type='primary'
                        ghost
                        onClick={this.Add.bind(this, true)}
                    >
                        添加安全事故类别
                    </Button>
                }
            >
                <Table
                    dataSource={newaccidentlist}
                    columns={this.columns}
                    bordered
                    rowKey='code'
                />
            </Card>
        );
    }

    columns = [
        {
            title: '序号',
            dataIndex: 'on'
        },
        {
            title: '安全事故类别名称',
            dataIndex: 'name'
        },
        {
            title: '安全事故类别编码',
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
            actions: { deletedocument, getaccidentlist }
        } = this.props;
        deletedocument({ code: Acccode, dex: dexx }).then(rst => {
            message.success('删除文件成功！');
            getaccidentlist({ code: Acccode }).then(rst => {
                let newaccidentlists = rst.metalist;
                rst.metalist.map((wx, index) => {
                    newaccidentlists[index].on = index + 1;
                });
                const {
                    actions: { setnewaccidentlist }
                } = this.props;
                setnewaccidentlist(newaccidentlists);
            });
        });
    }

    cancel () {}
}
