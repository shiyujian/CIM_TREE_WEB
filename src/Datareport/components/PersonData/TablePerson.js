import React, {Component} from 'react';
import {Table,Button,Popconfirm,message,Input,Icon} from 'antd';
import style from './TableOrg.css'
const Search = Input.Search;
export default class TablePerson extends Component{
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
      const {actions:{ModalVisible}} = this.props;
      ModalVisible(true);
    }
    componentDidMount(){
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
        title: '人员编码',
        dataIndex: 'code',
        key: 'Code',
      }, {
        title: '姓名',
        dataIndex: 'name',
        key: 'Name',
      },{
        title: '所在组织机构单位',
        dataIndex: 'unit',
        key: 'Unit',
      },{
         title: '所属部门',
         dataIndex :'depart',
         key: 'Depart',
      },{
        title: '职务',
        dataIndex :'job',
        key: 'Job',
      },{
        title: '性别',
        dataIndex :'sex',
        key:'Sex'
      },{
        title: '手机号码',
        dataIndex :'tel',
        key:'Tel'
      },{
        title: '邮箱',
        dataIndex :'email',
        key:'Email'
      },{
        title: '二维码',
        dataIndex :'signature',
        key:'Signature'
      },{
        title:'编辑',
        dataIndex:'edit',
        render:(record) => (
          <span>
              <Icon type="edit" />
              <span style={{"padding":"5px"}}>|</span>
              <Icon type="delete" />
          </span>
        )
      }]
}