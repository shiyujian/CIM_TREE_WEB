import React, { Component } from 'react';
import { Table, message, Popconfirm, Divider } from 'antd';
import Button from 'antd/es/button/button';
import Card from '_platform/components/panels/Card';
export const Acclevelcode = window.DeathCode.SYSTEM_ACCLEVEL;
export default class Tablelevel extends Component {
    render () {
        const { newaccidentlevellistlist = [] } = this.props;

        return (
            <Card
                title='安全事故等级'
                extra={
                    <Button
                        type='primary'
                        ghost
                        onClick={this.levelAdd.bind(this, true)}
                    >
                        添加安全事故等级
                    </Button>
                }
            >
                <Table
                    dataSource={newaccidentlevellistlist}
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
            title: '安全事故等级名称',
            dataIndex: 'name'
        },
        {
            title: '安全事故等级编码',
            dataIndex: 'code'
        },
        {
            title: '图标',
            dataIndex: 'extra_params.time'
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

    levelAdd () {
        const {
            actions: { levelAdding }
        } = this.props;
        levelAdding(true);
    }

    eidte (file) {
        const {
            actions: { leveledite, seteditefile }
        } = this.props;
        leveledite(true);
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
            actions: { deletedocument, getaccidentlevellist }
        } = this.props;
        deletedocument({ code: Acclevelcode, dex: dexx }).then(rst => {
            message.success('删除文件成功！');
            getaccidentlevellist({ code: Acclevelcode }).then(rst => {
                let newaccidentlevellists = rst.metalist;
                rst.metalist.map((wx, index) => {
                    newaccidentlevellists[index].on = index + 1;
                });
                const {
                    actions: { setnewaccidentlevellist }
                } = this.props;
                setnewaccidentlevellist(newaccidentlevellists);
            });
        });
    }

    cancel () {}
}
