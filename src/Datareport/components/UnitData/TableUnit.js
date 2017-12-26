import React, {Component} from 'react';
import {Table,Button,Popconfirm,message,Input,Icon} from 'antd';
import style from './TableUnit.css'
const Search = Input.Search;
export default class TableUnit extends Component{
	constructor(props){
		super(props);
		this.state = {}
	}
	async componentDidMount(){
		let {getProjectAcD3,getDocByCodeList,getDocByCodeSearcher} = this.props.actions
		let projTree = await getProjectAcD3();
		console.log(projTree);
		let units = projTree.children.reduce((previewArr,currentProj)=>{
			return previewArr.concat(currentProj.children);
		},[]);
		let docSet = {};
		let docs = await getDocByCodeSearcher({code:'REL_DOC_DW_A'});
		docs.result.forEach(doc=>{
			docSet[doc.code] = doc;
		});
		units = units.map(unit=>{
			unit.children = null;
			if(docSet[unit.code+'REL_DOC_DW_A']){
				return{...unit,...unit.extra_params,...docSet[unit.code+'REL_DOC_DW_A'].extra_params,...docSet[unit.code+'REL_DOC_DW_A'].basic_params}
			}
			return {...unit,...unit.extra_params};
		});
		console.log(units);
		this.setState({units:units})
	}
    render(){
        return (
            <div>
                <div>
                <Button style={{ marginRight: "10px" }}  className = {style.button}>模板下载</Button>
                    <Button  className = {style.button} onClick = {this.send.bind(this)}>发送填报</Button>
                    <Button className = {style.button}>申请变更</Button>
                    <Button className = {style.button}>申请删除</Button>
                    <Button className = {style.button}>导出表格</Button>
                    <Search className = {style.button} style={{width:"200px"}} placeholder="请输入内容" />
                </div>
                <Table
                    columns = {this.columns}
                    bordered = {true}
                    rowSelection={this.rowSelection}
                    dataSource = {this.state.units||[]}
                >
                </Table>
            </div>
        )
    }
    send(){
      const {actions:{ModalVisibleUnit,postWorkpackages,postWorkpackagesOK},postWorkpackagesOKp} = this.props;
      console.log(postWorkpackagesOKp)
      ModalVisibleUnit(true);
     
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

    columns = [{
        title: '单位工程编码',
        dataIndex:'code',
        key: 'Code',
      }, {
        title: '单位工程名称',
        dataIndex:'name',
        key: 'Name',
      }, 
      {
         title: '项目类型',
         dataIndex:'projType',
         key: 'Type',
      },{
        title: '项目阶段',
        dataIndex:'stage',
         key: 'Stage',
      },{
        title: '单位红线坐标',
        dataIndex :'coordinate',
        key:'coordinate'
      },{
        title: '计划开工日期',
        dataIndex :'stime',
        key:'Stime'
      },{
        title: '计划竣工日期',
        dataIndex :'etime',
        key:'Etime'
      },{
        title: '单位工程简介',
        dataIndex :'intro',
        key:'Intro'
      },{
        title: '建设单位',
		dataIndex:'relOrg',
        key:'Org'
      },{
          title:'附件',
          key:'file',
          render:(record) => (
                <a> {record.files?record.files[0].name:'暂无'}</a>
          )
      }]
}