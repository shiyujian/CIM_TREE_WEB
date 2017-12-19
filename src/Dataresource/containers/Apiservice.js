import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import reducer, {actions} from '../store/index';
import {actions as platformActions} from '_platform/store/global';
import {Tabmenu,Contenttop,Contentmiddle,Contentbottom,ApiserviceModal} from '../components';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {Modal} from 'antd';
import moment from 'moment';
import allData from './data';
@connect(
	state => {
		const {platform} = state || {};
		return { platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)
export default class Apiservice extends Component {
	constructor(props) {
        super(props)
        this.state = {
        	SelectedRow:{
        		name:'API 信息',
        		number: '18'
        	},
        	selected:'',
        	pageSize:7,
        	contentdata:[],
        	currentcontentdata:[],
        	detailcontent:{},
        	tabindex: '0',
        	isdetail: false,
        	iscreat: true,
        	ischange: false,
        	creatvisible: false,
        	contentfield: {},
        	tabdata: [],
        	pageindex: 1,
        }
    }
	componentDidMount() {
		let tabdata = allData.Apiservice.tabdata;
		this.setState({tabdata}, () => {
			this.onTblRowClick(tabdata[0].children[0])
		})
	}
	render() {
        const { } = this.props;
        const {
        	SelectedRow,
        	selected, 
        	tabindex,
        	isdetail,
        	iscreat,
        	ischange,
        	contentdata,
        	currentcontentdata,
        	detailcontent,
        	contentfield,
        	editindex,
        	tabdata,
        	pageSize,
        	pageindex 
        } = this.state;
        var timekey = Date.parse( new Date());
		return (
			<Body>
				<Main>
					<DynamicTitle title="API 服务" {...this.props}/>
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
							ischange={ischange}
							Onselect={this.Onselect}
							Oncreat={this.Oncreat}
							Onchange={this.Onchange}
							datalength={contentdata.length}
						/>
						<hr style={{marginTop:'10px',height:'5px',border:'none',borderTop:'1px solid #F2F2F2'}} />
						<Contentmiddle
							data={currentcontentdata} 
							ischange={ischange}
							pageindex={pageindex}
							pageSize={pageSize}
							onDetailClick={this.onDetailClick}
							onEdit={this.onEdit}
							onDelete={this.onDelete}
						/>
						<Contentbottom onPageChange={this.onPageChange} pageSize={pageSize} total={contentdata.length} current={pageindex}/>
					</Content>
					<Modal
						key={String(timekey)}
				 		width={900}
						title='新建数据'
			        	visible={this.state.creatvisible}
			        	onCancel={this.handleCancel}
			        	footer={null}
			        >
			        	<ApiserviceModal  onOk={this.onOk} iscreat={iscreat} contentfield={contentfield}/>
					</Modal>
				</Main>
			</Body>
		);
	}
	onTblRowClick = (record) => {
		const {tabindex} = this.state;
		let contentdata = [];
        try {
	         contentdata = allData.Apiservice.contentdata[parseInt(tabindex)][parseInt(record.index)];
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
    onPageChange = (index) => {
    	this.setState({pageindex:index}, () => {
    		this.setCurrentContentData()
    	})
    }
    setCurrentContentData =() => {
    	const {pageindex,contentdata,pageSize} = this.state;
    	let currentcontentdata = contentdata.slice(pageSize*(pageindex-1),pageSize*pageindex)
    	if(currentcontentdata.length == 0) {
    		if(pageindex == 1) {
    			this.setState({currentcontentdata})
    		} else {
    			this.setState({pageindex:pageindex - 1},() => {
    				this.setCurrentContentData()
    			})
    		}
    	} else {
    		this.setState({currentcontentdata})
    	}
    }
    onDetailClick = (index) => {
    	const {contentdata} = this.state;
    	let detailcontent ={};
    	try {
	         detailcontent = contentdata[index].detail;
    	} catch(e){
	    	console.log(e) 
	    }
    	this.setState({isdetail:true,detailcontent})
    }
    onEdit = (index) => {
    	const {contentdata} = this.state;
    	let contentfield = {};
    	try {
	         contentfield = contentdata[index];
    	} catch(e){
	    	console.log(e) 
	    }
    	this.setState({iscreat:false,creatvisible:true,editindex:index,contentfield})
    }
    onDelete =(index) => {
    	let { contentdata } =this.state;
		contentdata.splice(index,1);
		this.setState({contentdata},() => {
			this.setCurrentContentData()
		})
    }
    onReturnClick = () => {
    	this.setState({isdetail:false})
    }
    Onselect = (num) => {
    	this.setState({selected:num})
    } 
    handleCancel = () => {
    	this.setState({creatvisible:false})
    }
    Oncreat = () => {
    	this.setState({iscreat:true,creatvisible:true})
    }
    Onchange = () => {
    	this.setState({ischange:!this.state.ischange})
    }
    onOk =(fieldValues) => {
    	const {iscreat,contentdata,editindex} = this.state;
    	let newdata ={
    			title:fieldValues.title,
				updatetime: "2017-08-09",
				looknum: 20,
				downnum: 30,
				gov: "政府机构",
				source: "权力清单和责任清单",
    	}
    	if(iscreat) {
    		contentdata.unshift(newdata)
    	} else {
    		contentdata[editindex] = newdata;	
    	}
    	this.setState({contentdata,creatvisible:false},() => {
    		this.setCurrentContentData()
    	})
    }
}
