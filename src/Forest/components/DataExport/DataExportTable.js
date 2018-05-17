import React, {Component} from 'react';
import {Icon, Table, Spin,Tabs,Modal,Row,Col,Select,DatePicker,Button,Input,InputNumber,Progress,message} from 'antd';
import moment from 'moment';
import { FOREST_API,PROJECT_UNITS} from '../../../_platform/api';
import {getUser} from '_platform/auth'
import '../index.less';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const {RangePicker} = DatePicker;

export default class LocmeasureTable extends Component {
	constructor(props) {
        super(props)
        this.state = {
        	imgvisible:false,
        	tblData: [],
        	pagination: {},
        	loading: false,
        	size:10,
        	exportsize:100,
        	leftkeycode: '',
        	stime: moment().format('YYYY-MM-DD 00:00:00'),
			etime: moment().format('YYYY-MM-DD 23:59:59'),
			lstime:'',
			letime:'',
			sxm: '',
    		section: '',
    		bigType: '',
    		treetype: '',
    		smallclass: '',
        	thinclass: '',
			treetypename: '',
			positiontypename:'',
        	status: '',
    		SupervisorCheck: '',
    		CheckStatus: '',
    		islocation: '',
    		role: 'inputer',
    		rolename: '',
			percent:0,
			positiontype:4326,   //默认地理坐标系
		}
	}
	getBiao(code){
		let str = '';
		PROJECT_UNITS.map(item => {
			item.units.map(single => {
				if(single.code === code){
					str = single.value;
				}
			})
		})
		return str;
	}
    componentDidMount() {
    	let user = getUser()
		this.sections = JSON.parse(user.sections)
    }
    componentWillReceiveProps(nextProps){
    	if(nextProps.leftkeycode != this.state.leftkeycode) {
			this.setState({
				leftkeycode: nextProps.leftkeycode,
			}
			// ,()=> {
    		// 	this.qury(1);
			// }
			)
    	} 
    }
	render() {
		const {tblData} = this.state;
		return (
			<div>
				{this.treeTable(tblData)}
				<Modal
					width={522}
					title='详细信息'
					style={{textAlign:'center'}}
					visible={this.state.imgvisible}
					onOk={this.handleCancel.bind(this)}
					onCancel={this.handleCancel.bind(this)}
				>
					<img style={{width:"490px"}} src={this.state.src} alt="图片"/>
				</Modal>
			</div>
		);
	}
	treeTable(details) {
		const {
			treetypeoption,
			sectionoption,
			smallclassoption,
			thinclassoption,
			typeoption,
			leftkeycode,
			keycode,
			statusoption,
			positionoption,
			locationoption,
			users
		} = this.props;
		const {
			sxm, 
			rolename,
			section,
			smallclass,
			thinclass,
			bigType,
			treetypename,
			positiontypename,
			status,
			islocation,
		} = this.state;
		let columns = [];
		let header = '';
		columns = [
			{
				title:"序号",
				dataIndex: 'order',
			},{
				title:"顺序码",
				dataIndex: 'SXM',
			},{
				title:"项目",
				dataIndex: 'Project',
			},{
				title:"标段",
				dataIndex: 'Section',
				render:(text,record) => {
					return <p>{this.getBiao(text)}</p>
				}
			},{
				title:"位置",
				dataIndex: 'place',
			},{
				title:"树种",
				dataIndex: 'TreeTypeObj.TreeTypeName',
			},{
				title:"定位时间",
				render: (text,record) => {
					const {createtime1 = '',createtime2 = '' } = record;
					return <div><div>{createtime1}</div><div>{createtime2}</div></div>
				}
			},{
				title:'X',
				dataIndex:'X'
			},{
				title:'Y',
				dataIndex:'Y'
			},{
				title:'H',
				dataIndex:'H'
			}
		];

		const suffix1 = sxm ? <Icon type="close-circle" onClick={this.emitEmpty1} /> : null;
		header = <div >
					<Row >
						<Col  xl={3} className='mrg10'>
							<span>顺序码：</span>
							<Input suffix={suffix1} value={sxm}  className='forestcalcw2 mxw50' onChange={this.sxmchange.bind(this)}/>
						</Col>
						<Col xl={3} className='mrg10'>
							<span>标段：</span>
							<Select allowClear className='forestcalcw2 mxw100' defaultValue='全部' value={section} onChange={this.onsectionchange.bind(this)}>
								{sectionoption}
							</Select>
						</Col>
						<Col xl={3} className='mrg10'>
							<span>小班：</span>
							<Select allowClear className='forestcalcw2 mxw100' defaultValue='全部' value={smallclass} onChange={this.onsmallclasschange.bind(this)}>
								{smallclassoption}
							</Select>
						</Col>
						<Col xl={4} className='mrg10'>
							<span>细班：</span>
							<Select allowClear className='forestcalcw2 mxw170' defaultValue='全部' value={thinclass} onChange={this.onthinclasschange.bind(this)}>
								{thinclassoption}
							</Select>
						</Col>
						<Col xl={3} className='mrg10'>
							<span>类型：</span>
							<Select allowClear className='forestcalcw2 mxw100' defaultValue='全部' value={bigType} onChange={this.ontypechange.bind(this)}>
								{typeoption}
							</Select>
						</Col>
						<Col xl={3} className='mrg10'>
							<span>树种：</span>
							<Select allowClear showSearch className='forestcalcw2 mxw100' defaultValue='全部' value={treetypename} onChange={this.ontreetypechange.bind(this)}>
								{treetypeoption}
							</Select>
						</Col>
						<Col xl={3} className='mrg10'>
							<span>坐标系：</span>
							<Select allowClear showSearch className='forestcalcw2 mxw100' defaultValue={'地理坐标系'} onChange={this.onpositionchange.bind(this)}>
								{positionoption}
							</Select>
						</Col>
						<Col xl={7} className='mrg10'>
							<span>定位时间：</span>
							<RangePicker 
							 style={{verticalAlign:"middle"}} 
							 showTime={{ format: 'HH:mm:ss',defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')]}}
							 format={'YYYY/MM/DD HH:mm:ss'}
							 
							 onChange={this.datepick.bind(this)}
							 onOk={this.datepick.bind(this)}
							>
							</RangePicker>
						</Col>
					</Row>
					<Row >
						<Col span={2} className='mrg10'>
							<Button type='primary' onClick={this.handleTableChange.bind(this,{current:1})}>
								查询
							</Button>
						</Col>
						<Col span={18} className='quryrstcnt mrg10'>
							<span >此次查询共有苗木：{this.state.pagination.total}棵</span>
						</Col>
						<Col span={2} className='mrg10'>
							<Button type='primary' onClick={this.resetinput.bind(this)}>
								重置
							</Button>
						</Col>
						<Col span={2} className='mrg10'>
							<Button type='primary' onClick={this.exportexcel.bind(this)}>
								导出
							</Button>
						</Col>
					</Row>
				</div> 
		return <div>
					<Row>
						{header}
					</Row>
					<Row>
						<Table bordered
							className='foresttable'
							columns={columns}
							rowKey='order'
							loading={{tip:<Progress style={{width:200}} percent={this.state.percent} status="active" strokeWidth={5}/>,spinning:this.state.loading}}
							locale={{emptyText:'无定位数据导出信息'}}
							dataSource={details}
							onChange={this.handleTableChange.bind(this)}
							pagination={this.state.pagination}
							/>
					</Row>
				</div>
	}
	
	emitEmpty1 = () => {
	    this.setState({sxm: ''});
  	}

	sxmchange(value) {
		this.setState({sxm:value.target.value})
	}

	onsectionchange(value) {
		const {sectionselect} = this.props;
		sectionselect(value || '')
		this.setState({section:value || '', smallclass:'', thinclass:'', bigType:'', treetype:'', treetypename:''})
	}

	onsmallclasschange(value) {
		const {smallclassselect} = this.props;
		const {section,leftkeycode} = this.state;
		smallclassselect(value || leftkeycode,section);
		this.setState({smallclass:value || '', thinclass:'', bigType:'', treetype:'', treetypename:''})
	}

	onthinclasschange(value) {
		const {thinclassselect} = this.props;
		const {section,smallclass} = this.state;
		thinclassselect(value || smallclass,section);
		this.setState({thinclass:value || '', bigType:'', treetype:'', treetypename:''})
	}

	ontypechange(value) {
		const {typeselect} = this.props;
		typeselect(value || '')
		this.setState({bigType:value || '', treetype:'', treetypename:''})
	}

	ontreetypechange(value) {
		this.setState({treetype:value,treetypename:value})
	}
	onpositionchange(value){
		this.setState({positiontype:value,positiontypename:value})
	}

	onstatuschange(value) {
		let SupervisorCheck = '';
		let CheckStatus  = '';
		switch(value){
			case "1": 
				SupervisorCheck = -1;
				break;
			case "2": 
				SupervisorCheck = 1;
				CheckStatus = -1;
				break;
			case "3": 
				SupervisorCheck = 0;
				break;
			case "4": 
				SupervisorCheck = 1;
				CheckStatus = 0;
				break;
			case "5": 
				SupervisorCheck = 1;
				CheckStatus = 1;
				break;
			// case "6": 
			// 	SupervisorCheck = 1;
			// 	CheckStatus = 2;
			// 	break;
			default:
				break;
		}
		this.setState({SupervisorCheck,CheckStatus,status:value || ''})

    }

	datepick(value){
		this.setState({stime:value[0]?moment(value[0]).format('YYYY-MM-DD HH:mm:ss'):''})
		this.setState({etime:value[1]?moment(value[1]).format('YYYY-MM-DD HH:mm:ss'):''})
	}

	handleTableChange(pagination){
        const pager = { ...this.state.pagination};
        pager.current = pagination.current;
    	this.setState({
        	pagination: pager,
        });
        this.qury(pagination.current)
    }

	onImgClick(src) {
		src = src.replace(/\/\//g,'/')
		src =  `${FOREST_API}/${src}`
		this.setState({src},() => {
			this.setState({imgvisible:true,})
		})
	}

	handleCancel(){
    	this.setState({imgvisible:false})
	}
	getThinClassName(no,section){
		const {littleBanAll} = this.props;
		let nob = no.substring(0,15);
		let sectionn = section.substring(8,10);
		let result = '/'
		
		if(littleBanAll){
			littleBanAll.map(item => {
				if(item.No.substring(0,15) === nob && item.No.substring(16,18) === sectionn){
					result = item.ThinClassName;
					return;
				}
			})
		}else{
			return <p> / </p>
		}
		return result;
	}

    resetinput(){
    	const {resetinput,leftkeycode} = this.props;
		resetinput(leftkeycode)
    }

    qury(page) {
    	const {
    		sxm = '',
    		section = '',
    		bigType = '',
    		treetype = '',
    		supervisorcheck = '',
    		checkstatus = '',
    		islocation = '',
    		role = '',
    		rolename = '',
    		stime = '',
			etime = '',
			lstime = '',
			letime = '',
    		status = '',
			size,
			thinclass = '',
			smallclass = '',
			positiontype
		} = this.state;
		const{
			keycode
		}=this.props
		if(thinclass === '' && sxm === ''){
			message.info('请选择项目，标段，小班及细班信息或输入顺序码');
			return;
		}
		console.log('keycode',keycode)
		const {actions: {getTreeLocations}} = this.props;
    	let postdata = {
			sxm,
    		// no:keycode,
    		section,
    		// bigType,
    		treetype,
    		// supervisorcheck,
    		// checkstatus,
    		// islocation,
    		stime:stime&&moment(stime).format('YYYY-MM-DD HH:mm:ss'),
    		etime:etime&&moment(etime).format('YYYY-MM-DD HH:mm:ss'),
    		page,
			size:size,
			crs:positiontype
			// thinclass,
			// smallclass
		}
		if(postdata.stime === moment().format('YYYY-MM-DD 00:00:00') && postdata.etime === moment().format('YYYY-MM-DD 23:59:59')){
			postdata.stime = ''
			postdata.etime = ''
		}
		if(smallclass === ''){
			postdata.no = ''
		}else if(thinclass === ''){
			postdata.no = section.substring(0,8)+smallclass
		}else{
			postdata.no = section.substring(0,8)+smallclass+'-'+thinclass
		}
    	this.setState({loading:true,percent:0})
    	getTreeLocations({},postdata)
    	.then(rst => {
    		this.setState({loading:false,percent:100})
    		if(!rst)
    			return
    		let tblData = rst.content;
    		if(tblData instanceof Array) {
	    		tblData.forEach((plan, i) => {
					tblData[i].order = ((page - 1) * size) + i + 1;
					tblData[i].SXM = plan.SXM;
					let place = ''
					if(plan.No.indexOf('P010') !== -1){
						place = this.getThinClassName(plan.No,plan.Section);
					}else{
						place = `${plan.No.substring(8,11)}号小班${plan.No.substring(12,15)}号细班`
					}
					tblData[i].place = place;
					tblData[i].H = plan.H;
					tblData[i].X = plan.X;
					tblData[i].Y = plan.Y;
					let createtime1 = plan.CreateTime ? moment(plan.CreateTime).format('YYYY-MM-DD') : '/';
					let createtime2 = plan.CreateTime ? moment(plan.CreateTime).format('HH:mm:ss') : '/';
					tblData[i].createtime1 = createtime1;
					tblData[i].createtime2 = createtime2;
					tblData[i].Project = this.getProject(tblData[i].Section)
	    		})
		    	const pagination = { ...this.state.pagination };
				pagination.total = rst.pageinfo.total;
				pagination.pageSize = size;
				this.setState({ tblData,pagination:pagination });	
	    	}
    	})
	}
	
	getProject(section){
		let projectName = ''
		//获取当前标段所在的项目
		PROJECT_UNITS.map((item)=>{
			if(section.indexOf(item.code) != -1){
				projectName = item.value
			}
		})
		return projectName
	}

	exportexcel() {
		const {
    		sxm = '',
    		section = '',
    		bigType = '',
    		treetype = '',
    		supervisorcheck = '',
    		checkstatus = '',
    		locationstatus = '',
    		role = '',
    		rolename = '',
    		stime = '',
    		lstime = '',
    		etime = '',
    		letime = '',
			exportsize,
			thinclass = '',
			smallclass = '',
			status = '',
			positiontype
		} = this.state;
		if( section === ''){
			message.info('请选择标段信息');
			return;
		}
    	const {actions: {getExportTreeLocations},keycode = ''} = this.props;
    	let postdata = {
    		// no:keycode,
    		// sxm,
    		section,
			treetype,
			// status,
    		// supervisorcheck,
    		// checkstatus,
    		// locationstatus,
    		stime:stime&&moment(stime).format('YYYY-MM-DD HH:mm:ss'),
    		// lstime:lstime&&moment(lstime).format('YYYY-MM-DD HH:mm:ss'),
    		etime:etime&&moment(etime).format('YYYY-MM-DD HH:mm:ss'),
    		// letime:letime&&moment(letime).format('YYYY-MM-DD HH:mm:ss'),
			crs:positiontype
			// thinclass,
			// smallclass
		}
		if(postdata.stime === moment().format('YYYY-MM-DD 00:00:00') && postdata.etime === moment().format('YYYY-MM-DD 23:59:59')){
			postdata.stime = ''
			postdata.etime = ''
		}
		if(smallclass === ''){
			postdata.no = ''
		}else if(thinclass === ''){
			postdata.no = section.substring(0,8)+smallclass
		}else{
			postdata.no = section.substring(0,8)+smallclass+'-'+thinclass
		}
    	this.setState({loading:true,percent:0})
    	getExportTreeLocations({},postdata)
		.then(rst3 => {
			if(rst3 === ''){
				message.info('没有符合条件的信息');
			}else if(rst3 === '定位导出不能超过20000条记录'){
				message.info('定位导出不能超过20000条记录')
			}else{
				this.createLink(this,`${FOREST_API}/${rst3}`)
			}
			this.setState({loading:false})
		})
	}

	createLink(name,url) {
        let link = document.createElement("a");
        // link.download = name;
        link.href = url;
        link.setAttribute('download', name);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}