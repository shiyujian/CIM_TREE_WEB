import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import reducer, {actions} from '../store/index';
import {actions as platformActions} from '_platform/store/global';
import {Tabmenu,Contenttop,Contentmiddle,Contentbottom,CreateDataModal} from '../components';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import moment from 'moment';
import allData from './data';
import {Modal} from 'antd';
@connect(
	state => {
		const {platform} = state || {};
		return { platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)
export default class Regulation extends Component {
	constructor(props) {
        super(props)
        this.state = {
        	SelectedRow:{},
        	selected:'',
        	contentdata:[],
        	tabindex: '0',
        	creatvisible:false,
        	contentfield:{},
        	ischange:false,
        	iscreat:true,
        	pageindex:1,
        	pageSize:7,
        	currentcontentdata:[],
        	tabdata:[],
        	isdetail:false
        }
    }
	componentDidMount() {
		let {tabdata} = allData.Regulation
		this.setState({tabdata},()=>{
			this.onTblRowClick(tabdata[0].children[0])
		});
	}
	render() {
        const { } = this.props;
        const {SelectedRow,selected, contentfield, contentdata, ischange, iscreat, pageindex, pageSize, currentcontentdata, tabdata } = this.state;
        let timekey = Date.parse(new Date());
		return (
			<Body>
				<Main>
					<DynamicTitle title="规章制度" {...this.props}/>
					<Sidebar>
						<Tabmenu 
							data={tabdata}
							SelectedRow={SelectedRow}
							onTblRowClick={this.onTblRowClick}
							onTabChange={this.onTabChange}
						/>
					</Sidebar>
					<Content>
						<Contenttop 
							data={SelectedRow} 
							selected={selected}
							Onselect={this.Onselect}
							Oncreat={this.Oncreat}
							ischange={ischange}
							Onchange={this.Onchange}
							datalength={contentdata.length}
						/>
						<hr style={{marginTop:'10px',height:'5px',border:'none',borderTop:'1px solid #F2F2F2'}} />
						<Contentmiddle
							data={currentcontentdata} 
							ischange={ischange}
							pageindex={pageindex}
							pageSize={pageSize}
							onEdit={this.onEdit}
							onDelete={this.onDelete}
						/>
						<Contentbottom 
						  onPageChange={this.onPageChange} 
						  pageSize={pageSize} 
						  total={contentdata.length} 
						  current={pageindex}
						/>
					</Content>
					<Modal
					  key={String(timekey)}
					  width={900}
					  title="新建数据"
					  visible={this.state.creatvisible}
					  onCancel={this.handleCancel}
					  footer={null}
					>
						<CreateDataModal onOk={this.onOk} contentfield={contentfield} iscreat={iscreat} />
					</Modal>
				</Main>
			</Body>
		);
	}
	onTblRowClick = (record) => {
        const {tabindex} = this.state;
		let contentdata = [];
        try {
	         contentdata = allData.Regulation.contentdata[parseInt(tabindex)][parseInt(record.index)];
    	} catch(e){
	    	console.log(e) 
	    }
        this.setState({SelectedRow:record,isdetail:false,contentdata},() => {
        	this.setCurrentContentData()
        })
    }
    onTabChange =(index) => {
    	const {tabdata} = this.state;
    	let SelectedRow = tabdata[index].children[0];
    	this.setState({
    		SelectedRow:SelectedRow,
    		tabindex: index,
    		isdetail:false
    	},()=> {
    		this.onTblRowClick(SelectedRow)
    	})
    }
    Onselect = (num) => {
    	this.setState({selected:num})
    }

    //分页
    setCurrentContentData = () =>{
    	const {pageindex,contentdata,pageSize} = this.state;
    	let currentcontentdata = contentdata.slice(pageSize*(pageindex-1),pageSize*pageindex);
    	if(currentcontentdata.length == 0){
    		if(pageindex == 1){
    			this.setState({currentcontentdata});
    		}else{
    			this.setState({pageindex:pageindex-1},()=>{
    				this.setCurrentContentData()
    			})
    		}
    	}
    	this.setState({currentcontentdata});

    }
    onPageChange = (index) => {
    	this.setState({pageindex: index},()=>{
				this.setCurrentContentData()
			})
    }

    //新建数据
    Oncreat = () =>{
    	this.setState({creatvisible:true,iscreat:true});
    }
    handleCancel = () =>{
    	this.setState({creatvisible:false});
    }
    onOk = (fieldValues) =>{
    	let {iscreat,contentdata,editindex=null} = this.state;
    	let newData = {
    		downnum:"4",
    		gov:"政府机构",
    		looknum:"34",
    		looknum:"34",
			score:"",
			source:"权力清单和责任清单",
			title:fieldValues.name,
			updatetime:"2017-10-09"
    	}

    	if(iscreat){
    		contentdata.unshift(newData);
    	} else{
    		contentdata[editindex] = newData;
    	}
    	this.setState({contentdata,creatvisible:false},()=>{
			this.setCurrentContentData()
		});
    }
    //修改数据
    Onchange = () =>{
    	this.setState({ischange:!this.state.ischange});
    }
    onEdit = (index) =>{
    	const {contentdata} = this.state;
    	let contentfield = {};
    	try {
    		contentfield = contentdata[index];
    	}catch(e){
    		console.log(e)
    	}
    	this.setState({creatvisible:true,iscreat:false,editindex:index,contentfield})
    }
    //删除数据
    onDelete = (index) =>{
    	let {contentdata} = this.state;
    	contentdata.splice(index,1);
    	this.setState({contentdata},()=>{
			this.setCurrentContentData()
		})
    }
}
