import React, {Component} from 'react';
import {Table, message} from 'antd';
import Button from "antd/es/button/button";
import Card from '_platform/components/panels/Card';

export default class Tablelevel extends Component {

    render() {
        const {newtypelist = []} = this.props;
        return (
            <Card title="危险源级别" extra={<Button type="primary" ghost onClick={this.levelAdd.bind(this, true)}>添加危险源级别</Button>}>
                <Table dataSource={newtypelist}
                       columns={this.columns}
                       bordered rowKey="code"/>
            </Card>
        );
    }

    columns=[
        {
            title:'序号',
            dataIndex:'on',
        },{
            title:'危险源名称',
            dataIndex:'name',
        },{
            title:'危险源编码',
            dataIndex:'code',
        },{
            title:'发生事故可能造成的后果',
            dataIndex:'C(发生事故可能造成的后果)',
        },{
            title:'总计',
            dataIndex:'D(总计)',
        },{
            title:'人员暴露于危险环境中的频繁程度',
            dataIndex:'E(人员暴露于危险环境中的频繁程度)',
        },{
            title:'事故发生的可能性',
            dataIndex:'L(事故发生的可能性)',
        },{
            title:'风险控制措施',
            dataIndex:'风险控制措施',
        },{
            title:'风险级别',
            dataIndex:'风险级别',
        },{
            title:'图标',
            dataIndex:'extra_params.time',
        },{
            title:'操作',
            render:(record) =>{
                let nodes = [];
                nodes.push(
                    <div>
                        <a onClick={this.eidte.bind(this,record)}>编辑</a>
                        <span className="ant-divider" />
                        <a onClick={this.del.bind(this,record)}>删除</a>
                    </div>
                );
                return nodes;
            }
        },
    ];

    levelAdd(){
        const {actions:{levelAdding}} = this.props;
        levelAdding(true);
    }

    eidte(file) {
        const {actions:{levelEditVisible,levelfile}} = this.props;
        levelEditVisible(true);
        levelfile(file);
    }

    del(file){
        let dexx = file.on-1;
        const {actions:{deletedocument,getwxtype},typecode={}} = this.props;
        deletedocument({code:typecode,dex:dexx}).then(rst =>{
            message.success('删除文件成功！');
            getwxtype({code:typecode}).then(rst =>{
                let newtypelists = rst.metalist;
                rst.metalist.map((type,index) => {
                    newtypelists[index].on = index+1;
                });
                const {actions:{newtypelist}} = this.props;
                newtypelist(newtypelists);
            })
        });
    }
}
