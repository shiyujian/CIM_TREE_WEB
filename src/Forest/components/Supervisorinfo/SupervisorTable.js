import React, {Component} from 'react';
import {Icon, Table, Spin,Tabs,Modal,Row,Col,Select,DatePicker,Button,Input,InputNumber,Progress,message} from 'antd';
import moment from 'moment';
import { FOREST_API,PROJECT_UNITS} from '../../../_platform/api';
import {getUser} from '_platform/auth'
import '../index.less';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const {RangePicker} = DatePicker;

export default class SupervisorTable extends Component {
	constructor(props) {
        super(props)
        this.state = {
        	imgvisible:false,
        	tblData: [],
        	pagination: {},
        	loading: false,
        	size:10,
			exportsize:100,
			treetypename: '',
        	leftkeycode: '',
        	stime: moment().format('YYYY-MM-DD 00:00:00'),
			etime: moment().format('YYYY-MM-DD 23:59:59'),
			sxm: '',
    		section: '',
    		smallclass: '',
    		thinclass: '',
    		status: '',
    		SupervisorCheck: '',
    		role: '',
    		rolename: '',
			percent:0,
			totalNum:''
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
    	// if(nextProps.leftkeycode != this.state.leftkeycode) {
		// 	this.setState({
		// 		leftkeycode: nextProps.leftkeycode,
    	// 	},()=> {
    	// 		this.qury(1);
    	// 	})
    	// } 
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
		console.log('details', details)
		const {
			sectionoption,
			smallclassoption,
			treetypeoption,
			thinclassoption,
			leftkeycode,
			keycode,
			statusoption,
			users,
			typeoption
		} = this.props;
		const {
			sxm, 
			rolename,
			section,
			smallclass,
			thinclass,
			status,
			bigType,
			treetypename,
		} = this.state;
		const suffix1 = sxm ? <Icon type="close-circle" onClick={this.emitEmpty1} /> : null;
		const suffix2 = rolename ? <Icon type="close-circle" onClick={this.emitEmpty2} /> : null;
		let columns = [];
		let header = '';
		columns = [{
				title:"序号",
				dataIndex: 'order',
			},{
				title:"顺序码",
				dataIndex: 'ZZBM',
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
				title:"状态",
				dataIndex: 'statusname',
			},{
				title:"监理人",
				dataIndex: 'Supervisor',
				render: (text,record) => {
					if(text === 0){
						return <p> / </p>
					}
					return <span>{users&&users[text] ? users[text].Full_Name+"("+users[text].User_Name+")": ''}</span>
				}
			},
			{
				title:"定位",
				dataIndex: 'locationstatus',
			},
			// {
			// 	title:"状态信息",
			// 	dataIndex: 'SupervisorInfo',
			// },
			{
				title:"验收时间",
				render: (text,record) => {
					const {yssj1 = '',yssj2 = '' } = record;
					return <div><div>{yssj1}</div><div>{yssj2}</div></div>
				}
		}];
		header = <div >
					<Row>
						<Col  xl={3} lg={4} md={5} className='mrg10'>
							<span>顺序码：</span>
							<Input suffix={suffix1} value={sxm}  className='forestcalcw2 mxw100' onChange={this.sxmchange.bind(this)}/>
						</Col>
						<Col s xl={3} lg={4} md={5} className='mrg10'>
							<span>标段：</span>
							<Select  allowClear className='forestcalcw2 mxw100' defaultValue='全部' value={section} onChange={this.onsectionchange.bind(this)}>
								{sectionoption}
							</Select>
						</Col>
						<Col  xl={3} lg={4} md={5} className='mrg10'>
							<span>小班：</span>
							<Select allowClear className='forestcalcw2 mxw100' defaultValue='全部' value={smallclass} onChange={this.onsmallclasschange.bind(this)}>
								{smallclassoption}
							</Select>
						</Col>
						<Col  xl={3} lg={4} md={5} className='mrg10'>
							<span>细班：</span>
							<Select allowClear className='forestcalcw2 mxw100' defaultValue='全部' value={thinclass} onChange={this.onthinclasschange.bind(this)}>
								{thinclassoption}
							</Select>
						</Col>
						<Col xl={3} lg={4} md={5} className='mrg10'>
							<span>类型：</span>
							<Select allowClear className='forestcalcw2 mxw100' defaultValue='全部' value={bigType} onChange={this.ontypechange.bind(this)}>
								{typeoption}
							</Select>
						</Col>
						<Col xl={3} lg={4} md={5} className='mrg10'>
							<span>树种：</span>
							<Select allowClear showSearch className='forestcalcw2 mxw100' defaultValue='全部' value={treetypename} onChange={this.ontreetypechange.bind(this)}>
								{treetypeoption}
							</Select>
						</Col>
						<Col  xl={3} lg={4} md={5} className='mrg10'>
							<span>状态：</span>
							<Select allowClear className='forestcalcw2 mxw150' defaultValue='全部' value={status} onChange={this.onstatuschange.bind(this)}>
								{statusoption}
							</Select>
						</Col>
						<Col  xl={4} lg={5} md={6} className='mrg10'>
							<span>监理人：</span>
							<Input suffix={suffix2} value={rolename} className='forestcalcw3 mxw100' onChange={this.onrolenamechange.bind(this)}/>
						</Col>
						<Col xl={10} lg={12} md={14} className='mrg10'>
							<span>验收时间：</span>
							<RangePicker 
							 style={{verticalAlign:"middle"}} 
							 defaultValue={[moment(this.state.stime, 'YYYY-MM-DD HH:mm:ss'),moment(this.state.etime, 'YYYY-MM-DD HH:mm:ss')]} 
							 showTime={{ format: 'HH:mm:ss' }}
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
							<span >此次查询共有苗木：{this.state.totalNum}棵</span>
						</Col>
						<Col span={2} className='mrg10'>
							<Button type='primary' style={{display:'none'}} onClick={this.exportexcel.bind(this)}>
								导出
							</Button>
						</Col>
						<Col span={2} className='mrg10'>
							<Button type='primary' onClick={this.resetinput.bind(this)}>
								重置
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
						 locale={{emptyText:'当天无监理验收信息'}}
						 dataSource={details}
						 onChange={this.handleTableChange.bind(this)}
						 pagination={this.state.pagination}
						/>
					</Row>
				</div>
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

	emitEmpty1 = () => {
	    this.setState({sxm: ''});
  	}

  	emitEmpty2 = () => {
	    this.setState({rolename: ''});
  	}

	sxmchange(value) {
		this.setState({sxm:value.target.value})
	}

	onsectionchange(value) {
		const {sectionselect} = this.props;
		sectionselect(value || '')
		this.setState({section:value || '', smallclass:'', thinclass:''})
	}

	onsmallclasschange(value) {
		const {smallclassselect} = this.props;
		const {section,leftkeycode} = this.state;
		smallclassselect(value || leftkeycode,section);
		this.setState({smallclass:value || '',thinclass:''})
	}

	onthinclasschange(value) {
		const {thinclassselect} = this.props;
		const {section,smallclass} = this.state;
		thinclassselect(value || smallclass,section);
		this.setState({thinclass:value || ''})
	}
	ontypechange(value) {
		const {typeselect} = this.props;
		typeselect(value || '')
		this.setState({bigType: value || '' , treetype: '', treetypename:''})
	}

	ontreetypechange(value) {
		// const {treetypelist} = this.props;
		// let treetype = treetypelist.find(rst => rst.TreeTypeName == value)
		// this.setState({treetype:treetype?treetype.ID:'',treetypename:value || ''})
		this.setState({treetype:value,treetypename:value})
    }

	onstatuschange(value) {
		let SupervisorCheck = '';
		switch(value){
			case "1": 
				SupervisorCheck = -1;
				break;
			case "2": 
				SupervisorCheck = 0;
				break;
			case "3": 
				SupervisorCheck = 1;
				break;
			default:
				break;
		}
		this.setState({SupervisorCheck,status:value || ''})

    }

	onrolenamechange(value) {
		this.setState({rolename:value.target.value})
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
		src = src.replaceAll('//','/')
		src =  `${FOREST_API}/${src}`
		this.setState({src},() => {
			this.setState({imgvisible:true})
		})
	}

	handleCancel(){
    	this.setState({imgvisible:false})
    }

    resetinput(){
    	const {resetinput,leftkeycode} = this.props;
		resetinput(leftkeycode)
    }

    qury(page) {
    	const {
    		sxm = '',
    		section = '',
    		SupervisorCheck = '',
    		smallclass = '',
    		thinclass = '',
    		role = '',
    		rolename = '',
    		stime = '',
    		etime = '',
    		status = '',
			size,
			bigType = '',
    		treetype = '',
		} = this.state;
		// if(this.sections.length !== 0){  //不是admin，要做查询判断了
		// 	if(section === ''){
		// 		message.info('请选择标段信息');
		// 		return;
		// 	}
		// }
		if(thinclass === '' && sxm === ''){
			message.info('请选择项目，标段，小班及细班信息或输入顺序码');
			return;
		}
    	const {actions: {getqueryTree},keycode = ''} = this.props;
    	let postdata = {
    		no:keycode,
    		sxm,
    		section,
    		smallclass,
    		thinclass,
    		status,
    		SupervisorCheck,
    		stime:stime&&moment(stime).format('YYYY-MM-DD HH:mm:ss'),
    		etime:etime&&moment(etime).format('YYYY-MM-DD HH:mm:ss'),
    		page,
			size,
			bigType,
    		treetype,
    	}
    	if(!!role)
    		postdata[role] = rolename;
    	this.setState({loading:true,percent:0})
    	getqueryTree({},postdata)
    	.then(rst => {
    		console.log('rst',rst)
    		this.setState({loading:false,percent:100})
    		if(!rst)
				return
    		let tblData = rst.content;
    		if(tblData instanceof Array) {
	    		tblData.forEach((plan, i) => {
	    			// const {attrs = {}} = plan;
	    			tblData[i].order = ((page - 1) * size) + i + 1;
					let place = ''
					if(plan.Section.indexOf('P010') !== -1){
						place = this.getThinClassName(plan.No,plan.Section);
					}else{
						place = `${plan.SmallClass}号小班${plan.ThinClass}号细班`
					}	    			
					tblData[i].place = place;
					let statusname = '';
					
					if(plan.SupervisorCheck == -1 && plan.CheckStatus == -1)
						statusname = "未抽查"
					else if(plan.SupervisorCheck == 0) 
						statusname = "监理抽查退回"
					else if(plan.SupervisorCheck === 1){
						statusname = "监理抽查通过"
					}

					tblData[i].statusname = statusname;
					let locationstatus = !!plan.locationtime ? '已定位' : '未定位';
					tblData[i].locationstatus = locationstatus;
					let yssj1 = !!plan.YSSJ ? moment(plan.YSSJ).format('YYYY-MM-DD') : '/';
					let yssj2 = !!plan.YSSJ ? moment(plan.YSSJ).format('HH:mm:ss') : '/';
					tblData[i].yssj1 = yssj1;
					tblData[i].yssj2 = yssj2;
				})
				let totalNum = rst.total
		    	const pagination = { ...this.state.pagination };
				pagination.total = rst.pageinfo.total;
				pagination.pageSize = size;
				this.setState({ tblData,pagination:pagination,totalNum:totalNum });	
	    	}
    	})
    }

	exportexcel() {
		const {
    		sxm = '',
    		section = '',
    		// SupervisorCheck = '',
    		role = '',
    		rolename = '',
    		stime = '',
    		etime = '',
			exportsize,
			bigType = '',
    		treetype = '',
		} = this.state;
		if(this.sections.length !== 0){  //不是admin，要做查询判断了
			if(section === ''){
				message.info('请选择标段信息');
				return;
			}
		}
    	const {actions: {getqueryTree,getexportTree4Supervisor},keycode = ''} = this.props;
    	let postdata = {
    		no:keycode,
    		sxm,
    		section,
    		// SupervisorCheck,
    		stime:stime&&moment(stime).format('YYYY-MM-DD HH:mm:ss'),
    		etime:etime&&moment(etime).format('YYYY-MM-DD HH:mm:ss'),
    		page:1,
			size:exportsize,
			bigType,
    		treetype,
    	}
    	if(!!role)
    		postdata[role] = rolename;
    	this.setState({loading:true,percent:0})
    	getexportTree4Supervisor({},postdata)
		.then(rst3 => {
			this.setState({loading:false})
			this.createLink(this,`${FOREST_API}/${rst3}`)
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