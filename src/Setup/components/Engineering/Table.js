import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Table, message,Popconfirm,Spin} from 'antd';
import moment from 'moment';
import Button from "antd/es/button/button";
import Card from '_platform/components/panels/Card';

export default class GeneralTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading:false
        }
       
    }
    render() {
        const {newshuzu= []} = this.props;
        return (
            <Spin  spinning={this.state.loading}>
                <Card title="工程文档目录" extra={<Button type="primary" ghost onClick={this.Adddir.bind(this)}>新增根目录</Button>}>
                    {/*<Button onClick={this.del.bind(this)}>删除</Button>*/}
                    <Table dataSource={newshuzu}
                        columns={this.columns}
                        bordered rowKey="code"/>
                </Card>
            </Spin>
        );
    }

    del() {
        const { actions: { deletdir }, savepa = {} } = this.props;
        deletdir({ code: savepa.code }, {}).then(rst => {
            message.success('删除目录成功！');
        });
    }

    columns=[
        {
            title:'文件类型',
            dataIndex:'name',
        },{
            title:'操作',
            render:(record) =>{
                return(
                    <div>
                       
                        {
                            record.on === "three"?null:
                                <a style= {{margin:'10px'}} onClick={this.Add.bind(this, record)}>添加目录</a>
                        }
                        <a onClick={this.delet.bind(this,record)}>删除目录</a>
                    </div>
                )
            }
        },
    ];

    Add(record){
        const {actions:{setAddabel,setAddfile,judgeParent}} = this.props;
        setAddabel(true);
        setAddfile(record);
        judgeParent({
            pk:record.pk,
            code:record.code
        });
    }
    Adddir(){
        const {actions:{setAdddir}} = this.props;
        setAdddir(true);
    }

    delet(record){
        const {actions:{deletdir,getdirtree},savecode={}} =this.props;
        this.setState({
            loading:true
        })
        deletdir({code:record.code},{}).then(rst =>{
            this.setState({
                loading:false
            })
            message.success('删除目录成功！');
            getdirtree({code: savecode}, {depth: 4}).then(({children}) => {
            });
        });
    }

}
