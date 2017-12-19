import React, {Component} from 'react';
import {Table, Pagination,message} from 'antd';
import Button from "antd/es/button/button";
import Card from '_platform/components/panels/Card';
export const WXcode = window.DeathCode.SYSTEM_WX;
export default class Tablecate extends Component {

    render() {
        const {newwxlist = [],actions: {toggleAddition}} = this.props;

        return (
            <Card title="危险源类别" extra={<Button type="primary" ghost onClick={toggleAddition.bind(this, true)}>添加危险源类别</Button>}>
                <Table dataSource={newwxlist}
                       columns={this.columns}
                       bordered rowKey="code"
                       onRowDoubleClick={this.rowclick}/>
            </Card>
        );
    }

    rowclick = (record, index) => {
         const {actions:{getwxtype,savetypecode}} = this.props;
            savetypecode(record.code);
            getwxtype({code:record.code}).then(rst =>{
            if(rst.metalist == undefined){
	            let newtypelists = [];
	            const {actions:{newtypelist}} = this.props;
	            newtypelist(newtypelists);
            }else{
	            let newtypelists = rst.metalist;
	            rst.metalist.map((type,index) => {
	                newtypelists[index].on = index+1;
	            });
	            const {actions:{newtypelist}} = this.props;
	            newtypelist(newtypelists);
            }
        })
    };

    columns=[
        {
            title:'序号',
            dataIndex:'on',
            width: '10%',
        },{
            title:'危险源类别名称',
            dataIndex:'name',
            width: '30%',
        },{
            title:'危险源类别编码',
            dataIndex:'code',
            width: '30%',
        },{
            title:'操作',
            width: '30%',
            render:(record) =>{
                return(
                    <div>
                        <a onClick={this.edite.bind(this,record)}>编辑</a>
                        <span className="ant-divider" />
                        <a onClick={this.delet.bind(this,record)}>删除</a>
                    </div>
                )
            }
        },
    ];

    edite(file) {
        const {actions:{setfile,addvisible}} = this.props;
        console.log(file);
        setfile(file);
        addvisible(true);
    }

    delet(file){
        let dexx = file.on-1;
        const {actions:{deletedocument,getWxlist}} = this.props;
        deletedocument({code:WXcode,dex:dexx}).then(rst =>{
            message.success('删除文件成功！');
            getWxlist({code:WXcode}).then(rst =>{
                let newwxlists = rst.metalist;
                rst.metalist.map((wx,index) => {
                    newwxlists[index].on = index+1;
                });
                const {actions:{newwxlist}} = this.props;
                newwxlist(newwxlists);
            })
        });
    }
}
