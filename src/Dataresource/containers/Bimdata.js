import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import reducer, {actions} from '../store/index';
import {actions as platformActions} from '_platform/store/global';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {Row, Col, Input, Icon, Modal, Button} from 'antd';
import {Tabmenu,Imgcard,Contentbottom,BimdataModal} from '../components';
import moment from 'moment';
import allData from './data';
const Search = Input.Search;
@connect(
	state => {
		const {platform} = state || {};
		return { platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)
export default class Bimdata extends Component {
	constructor(props) {
        super(props)
        this.state = {
        	SelectedRow:{
        		name:'xx区块',
        		number: '6'
        	},
        	pageSize:8,
        	keyword: '',
        	contentdata:[],
        	currentcontentdata: [],
        	detailcontent:{},
        	tabindex: '0',
        	iscreat: true,
        	ischange: false,
        	creatvisible: false,
        	contentfield: {},
        	tabdata: [],
        	pageindex: 1,
        }
    }
	componentDidMount() {
		let tabdata = allData.Bimdata.tabdata;
		this.setState({tabdata}, () => {
			this.onTblRowClick(tabdata[0].children[0])
		})
	}
	render() {
        const {
        } = this.props;
 		const {
 			SelectedRow,
 			pageSize,
 			tabindex, 
 			keyword,
 			ischange, 
 			iscreat,
 			contentdata = [],
 			currentcontentdata =[],
 			tabdata,
 			pageindex,
 			contentfield
 		} = this.state;
 		
    	const prefix = keyword ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
		var timekey = Date.parse( new Date());
		return (
			<Body>
				<Main>
					<DynamicTitle title="BIM 数据" {...this.props}/>
					<Sidebar>
						<Tabmenu 
							data={tabdata}
							SelectedRow={SelectedRow}
							onTblRowClick={this.onTblRowClick}
							onTabChange={this.onTabChange}
						/>
					</Sidebar>
					<Content>
						<Row>
							<Col span={4}>
								<span className={'f18'}>{`共计 ${contentdata.length} 套模型`}</span>
							</Col>
							<Col span={4} >
								<Button onClick={this.Oncreat}>新建</Button>
								{
									ischange 
									? <Button onClick={this.Onchange}>保存</Button>
									: <Button onClick={this.Onchange}>修改</Button>
								}
							</Col>
							<Col span={8} offset={8}>
								<Search
									placeholder="关键字搜索"
									prefix={prefix}
									value={keyword}
									onChange={this.onChangeUserName}
								/>
							</Col>
						</Row>
						<hr style={{marginTop:'10px',height:'5px',border:'none',borderTop:'1px solid #F2F2F2'}} />
						<Row style={{height:'660px'}}>
							{
								currentcontentdata.map((item,index) => {
									return <Imgcard 
												ischange={ischange} 
												key={String(index)} 
												index={(pageindex - 1 ) * pageSize + index} 
												item={item}
												onEdit={this.onEdit}
												onDelete={this.onDelete}
											/>
								})
							}
						</Row>
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
			        	<BimdataModal  onOk={this.onOk} iscreat={iscreat} contentfield={contentfield}/>
					</Modal>
				</Main>
			</Body>
		);
	}
	onTblRowClick = (record) => {
		const {tabindex} = this.state;
		let contentdata = [];
        try {
	         contentdata = allData.Bimdata.contentdata[parseInt(tabindex)][parseInt(record.index)];
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
	onChangeUserName = (e) => {
    	this.setState({ keyword: e.target.value });
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
	emitEmpty = () => {
	    this.setState({keyword: ''});
  	}
  	Oncreat =() => {
  		this.setState({iscreat:true,creatvisible:true})
  	}
  	Onchange =() => {
		this.setState({ischange:!this.state.ischange})
  	}
  	handleCancel =() => {
  		this.setState({creatvisible:false})
  	}
  	onOk =(fieldValues) => {
  		const {iscreat,contentdata,editindex} = this.state;
    	let newdata = {
			title:fieldValues.title,
			src:"./ImageIcon/imgarea.png",
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
