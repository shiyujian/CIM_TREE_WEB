import React, {Component} from 'react';
import {Table,Button,Popconfirm,message,Input,Icon} from 'antd';
import style from './TableUnit.css'
const Search = Input.Search;
export default class TableUnit extends Component{
    render(){
        return (
            <div>
                <div>
                    <Button  onClick = {this.send.bind(this)} style={{marginRight:"20px"}}>发送填报</Button>
                    <Button className = {style.button}>申请变更</Button>
                    <Button className = {style.button}>申请删除</Button>
                    <Button className = {style.button}>导出表格</Button>
                    <Search className = {style.button} style={{width:"200px"}} placeholder="请输入内容" />
                </div>
                <Table
                   
                    columns = {this.columns}
                    bordered = {true}
                    rowSelection={this.rowSelection}
                    dataSource = {this.dataSource}
                >
                </Table>
            </div>
        )
    }
    send(){
      const {actions:{ModalVisibleUnit}} = this.props;
      ModalVisibleUnit(true);
    }
    componentDidMount(){
      // let dataSource = [];
      // const { actions: { getOrgTree } }= this.props;
      // getOrgTree({}, { depth: 7 }).then(rst => {
      //   dataSource = rst.children;
      // });
    }
    rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
      },
    };
    dataSource = [{
      index:1,
      code:"自动编码",
      name:'何睿',
      unit:'',
      depart:'大数据与科技中心',
      role:"暂无",
      job:'主任',
      tel:'1377777777',
      email:'13475754@qq.com',
      signature:'暂无',
      portrait:'暂无',
      unit:'华东院',
      sex:'男'
    },{
      index:1,
      code:"自动编码",
      name:'何睿',
      depart:'大数据与科技中心',
      role:"暂无",
      job:'主任',
      tel:'1377777777',
      email:'13475754@qq.com',
      signature:'暂无',
      portrait:'暂无',
      unit:'华东院',
      sex:'男'
    }]
    columns = [ {
        title: '序号',
        dataIndex: 'code',
        key: 'Code',
      }, {
        title: '单位工程名称',
        dataIndex: 'name',
        key: 'Name',
      },{
        title: '所属项目/子项目名称',
        dataIndex: 'unit',
        key: 'Unit',
      },{
         title: '项目类型',
         dataIndex :'depart',
         key: 'Depart',
      },{
        title: '项目阶段',
        dataIndex :'job',
        key: 'Job',
      },{
        title: '项目红线坐标',
        dataIndex :'sex',
        key:'Sex'
      },{
        title: '计划开工日期',
        dataIndex :'tel',
        key:'Tel'
      },{
        title: '计划竣工日期',
        dataIndex :'email',
        key:'Email'
      },{
        title: '建设单位',
        dataIndex :'signature',
        key:'Signature'
      },{
        title: '单位工程简介',
        dataIndex :'intro',
        key:'Intro'
      },{
        title:'附件',
        dataIndex:'edit',
        render:(record) => (
          <span>
              附件上传
          </span>
        )
      }]
}